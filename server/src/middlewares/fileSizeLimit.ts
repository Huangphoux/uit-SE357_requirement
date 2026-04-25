import { NextFunction, Request, Response } from "express";

const MB = 1024 * 1024;

export const MATERIAL_MAX_UPLOAD_BYTES = 50 * MB;
export const SUBMISSION_MAX_UPLOAD_BYTES = 20 * MB;

/**
 * Enforce a request payload size limit using Content-Length for upload endpoints.
 * This provides an early rejection before expensive processing.
 */
export function enforceMaxUploadSize(maxBytes: number, resourceName: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLengthHeader = req.headers["content-length"];

    if (!contentLengthHeader) {
      return next();
    }

    const contentLength = Number(contentLengthHeader);

    if (!Number.isFinite(contentLength) || contentLength < 0) {
      return res.status(400).json({
        ok: false,
        message: "Invalid Content-Length header",
      });
    }

    if (contentLength > maxBytes) {
      return res.status(413).json({
        ok: false,
        message: `${resourceName} upload exceeds limit of ${Math.floor(maxBytes / MB)}MB`,
      });
    }

    return next();
  };
}
