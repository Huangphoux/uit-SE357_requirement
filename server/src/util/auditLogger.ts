import fs from "fs/promises";
import path from "path";
import { Request } from "express";
import auditConfig from "config/audit.config";
import { logger } from "util/logger";

export type AuditCategory = "AUTH" | "ADMIN" | "FILE_ACCESS" | "SYSTEM";

export interface AuditLogEntry {
  timestamp: string;
  category: AuditCategory;
  action: string;
  success: boolean;
  userId?: string;
  ip?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  resourceType?: string;
  resourceId?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogQuery {
  from?: string;
  to?: string;
  category?: string;
  action?: string;
  userId?: string;
  limit?: number;
}

let lastCleanupDate = "";

const toDateString = (date: Date) => date.toISOString().slice(0, 10);

const parseDateInput = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
};

const ensureAuditDir = async () => {
  await fs.mkdir(auditConfig.logDir, { recursive: true });
};

const cleanupOldFiles = async () => {
  const today = toDateString(new Date());
  if (lastCleanupDate === today) {
    return;
  }

  lastCleanupDate = today;

  try {
    const files = await fs.readdir(auditConfig.logDir);
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - auditConfig.retentionDays);

    await Promise.all(
      files
        .filter((file) => /^\d{4}-\d{2}-\d{2}\.log$/.test(file))
        .map(async (file) => {
          const datePart = file.replace(".log", "");
          const fileDate = new Date(`${datePart}T00:00:00.000Z`);
          if (Number.isNaN(fileDate.getTime())) {
            return;
          }

          if (fileDate < cutoff) {
            await fs.unlink(path.join(auditConfig.logDir, file));
          }
        })
    );
  } catch (error) {
    logger.error({ error }, "Failed to cleanup old audit logs");
  }
};

const getFilePathForDate = (date: Date) => path.join(auditConfig.logDir, `${toDateString(date)}.log`);

export const getRequestIp = (req: Request): string => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }

  return req.ip || req.socket.remoteAddress || "unknown";
};

export const getRequestUserId = (req: Request): string | undefined => {
  const rawUserId = (req as any).userId ?? (req as any).user?.userId;
  return rawUserId ? String(rawUserId) : undefined;
};

export const writeAuditLog = async (
  payload: Omit<AuditLogEntry, "timestamp"> & { timestamp?: string }
) => {
  const entry: AuditLogEntry = {
    timestamp: payload.timestamp || new Date().toISOString(),
    category: payload.category,
    action: payload.action,
    success: payload.success,
    userId: payload.userId,
    ip: payload.ip,
    method: payload.method,
    path: payload.path,
    statusCode: payload.statusCode,
    resourceType: payload.resourceType,
    resourceId: payload.resourceId,
    message: payload.message,
    metadata: payload.metadata,
  };

  try {
    await ensureAuditDir();
    await cleanupOldFiles();
    const filePath = getFilePathForDate(new Date(entry.timestamp));
    await fs.appendFile(filePath, `${JSON.stringify(entry)}\n`, "utf8");
  } catch (error) {
    logger.error({ error }, "Failed to write audit log entry");
  }
};

const eachDay = (from: Date, to: Date) => {
  const days: Date[] = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const end = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
};

export const queryAuditLogs = async (query: AuditLogQuery) => {
  const now = new Date();
  const to = parseDateInput(query.to) || now;
  const from = parseDateInput(query.from) || new Date(to.getTime() - 24 * 60 * 60 * 1000);

  const safeLimit = Math.min(Math.max(Number(query.limit || 200), 1), 5000);

  await ensureAuditDir();

  const files = eachDay(from, to).map((day) => getFilePathForDate(day));
  const rows = await Promise.all(
    files.map(async (filePath) => {
      try {
        const content = await fs.readFile(filePath, "utf8");
        return content.split("\n").filter(Boolean);
      } catch {
        return [] as string[];
      }
    })
  );

  const parsed = rows
    .flat()
    .map((line) => {
      try {
        return JSON.parse(line) as AuditLogEntry;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is AuditLogEntry => entry !== null)
    .filter((entry) => {
      const ts = new Date(entry.timestamp).getTime();
      if (Number.isNaN(ts)) return false;
      if (ts < from.getTime() || ts > to.getTime()) return false;
      if (query.category && entry.category !== query.category) return false;
      if (query.action && entry.action !== query.action) return false;
      if (query.userId && entry.userId !== query.userId) return false;
      return true;
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, safeLimit);

  return {
    logs: parsed,
    total: parsed.length,
    from: from.toISOString(),
    to: to.toISOString(),
    limit: safeLimit,
    logDirectory: auditConfig.logDir,
    retentionDays: auditConfig.retentionDays,
  };
};