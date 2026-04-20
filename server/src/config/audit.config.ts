import path from "path";

const retentionDays = Number(process.env.AUDIT_RETENTION_DAYS ?? "365");

const auditConfig = {
  logDir: process.env.AUDIT_LOG_DIR || path.resolve(process.cwd(), "logs", "audit"),
  retentionDays: Number.isFinite(retentionDays) && retentionDays > 0 ? retentionDays : 365,
};

export default auditConfig;