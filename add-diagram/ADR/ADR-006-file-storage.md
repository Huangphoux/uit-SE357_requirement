# ADR-006: Secure File Storage Outside Web Root

**Status:** Accepted  
**Date:** 2026-05-02  
**ASR:** ASR-SEC-12, ASR-SEC-13, ASR-SEC-14, ASR-FILE-01  

---

## Context

The LMS allows:

- **Teachers** to upload learning materials (PDF, VIDEO, LINK, DOC).  
- **Students** to upload assignment submissions.

Uploaded files pose several security risks that must be mitigated:

| Risk | ASR |
|------|-----|
| Malicious file types (web shells, executables) served by the web server | ASR-SEC-12 |
| Direct HTTP access to uploaded files bypassing access controls | ASR-SEC-13 |
| Resource exhaustion via excessively large uploads | ASR-SEC-14 |
| Server overload when 500 students download simultaneously | ASR-FILE-01 |

---

## Decision

**Store all uploaded files in a Docker volume mounted at `/app/uploads`, outside the Caddy web root (`/srv`). Serve files exclusively through the API with authentication/authorisation checks.**

### Upload Pipeline

```
Client → Caddy → API /api/materials (or /api/submissions)
           │
           ├─ 1. Auth Middleware: verify JWT + role
           ├─ 2. fileSizeLimit middleware: reject if > 50 MB (materials) or > 20 MB (submissions)
           ├─ 3. MIME-type validation: reject non-whitelisted types
           ├─ 4. Malware scan hook (ASR-SEC-12)
           └─ 5. Write file to /app/uploads/<uuid>.<ext>
                  (Docker volume, outside /srv web root)
```

### File Size Limits (ASR-SEC-14)

| Context | Limit | Middleware |
|---------|-------|-----------|
| Learning materials | 50 MB | `fileSizeLimit` middleware |
| Assignment submissions | 20 MB | `fileSizeLimit` middleware |

Configuration is enforced **both** in the API middleware and **client-side** in the File Upload Component (UX feedback before network transfer).

### File Type Whitelist (ASR-SEC-12)

Allowed MIME types:

| Category | Types |
|----------|-------|
| Documents | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| Images | `image/jpeg`, `image/png`, `image/gif` |
| Video | `video/mp4`, `video/webm` |
| Text | `text/plain` |

Any other MIME type is rejected with HTTP 415 Unsupported Media Type.

### Preventing Direct Access (ASR-SEC-13)

- The Caddy `handle` block serves files only from `/srv` (the SPA).  
- The `/app/uploads` Docker volume is **not** mounted inside `/srv`.  
- Download requests go to `GET /api/materials/:id/download` or `GET /api/submissions/:id/file`, which verify the requester is enrolled (for materials) or is the submitter/teacher (for submissions) before streaming the file.  
- Directory traversal is prevented by using UUID-based filenames generated server-side; the original filename is stored in the database only as metadata.

### Concurrent Downloads (ASR-FILE-01)

Node.js streams the file using `fs.createReadStream` piped to the HTTP response, avoiding buffering the entire file in memory. Caddy's response buffering is disabled for file endpoints. The Docker volume is on a fast local disk, supporting 500 concurrent read streams within the 24/7 availability SLA.

---

## Consequences

### Positive

- Files outside the web root are inaccessible via direct URL (ASR-SEC-13).  
- Authentication/authorisation is enforced on every download.  
- UUID filenames prevent path traversal and information leakage.  
- Streaming downloads avoid API memory exhaustion under 500 concurrent downloads (ASR-FILE-01).  
- File size limits prevent resource exhaustion (ASR-SEC-14).  

### Negative / Trade-offs

- All downloads are proxied through Node.js, adding CPU/memory overhead vs. direct file-server serving.  
- The Docker volume is local; for multi-host deployments, a network-attached or object-store solution (e.g. MinIO, S3) would be required.  
- Malware scanning must be integrated as a synchronous step, which can add latency to the upload path. A lightweight ClamAV integration or async scan-and-quarantine pattern should be evaluated.  

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| **Store files inside the Caddy web root** | Direct HTTP access bypasses RBAC; violates ASR-SEC-13. |
| **External object storage (S3/MinIO)** | Adds cloud/infrastructure dependency out of scope for current Docker Compose deployment; can be adopted in a future iteration. |
| **Base64-encode files in the database** | Excessive database size growth; incompatible with streaming for large files (ASR-FILE-01). |
