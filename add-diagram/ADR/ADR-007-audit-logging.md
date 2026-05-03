# ADR-007: Canonical Audit Logging with 1-Year Retention

**Status:** Accepted  
**Date:** 2026-05-02  
**ASR:** ASR-SEC-10, ASR-SEC-11  

---

## Context

Regulatory and security requirements mandate that the LMS keep an immutable record of security-sensitive actions:

- **100 % of key actions** must be logged with a timestamp and the acting user's ID (ASR-SEC-10).  
  Key actions include: user authentication events, file access, and admin operations.  
- **Audit logs must be retained for a minimum of 1 year** (ASR-SEC-11) and be queryable by authorised auditors.  

The two-instance deployment means log entries could originate from either `backend-primary` or `backend-secondary`. A centralised, durable log sink is needed.

---

## Decision

**Write structured audit log entries to the PostgreSQL database via the Audit Module, using the Canonical Log Line (Wide Event) pattern. Admin-only read access is provided via `GET /api/audit/logs`. Retention is governed by `AUDIT_RETENTION_DAYS=365`.**

### Log Entry Structure (Canonical Log Line)

Each audit event is a single structured record containing:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `cuid` | Unique event identifier |
| `timestamp` | `DateTime` | UTC timestamp of the event |
| `userId` | `String` | Acting user's ID (or `"system"` for automated events) |
| `action` | `String` | Verb describing the action (e.g. `LOGIN_SUCCESS`, `FILE_UPLOAD`, `USER_DELETE`) |
| `resource` | `String?` | Target resource type and ID (e.g. `material:abc123`) |
| `ip` | `String?` | Client IP address |
| `outcome` | `String` | `SUCCESS` or `FAILURE` |
| `metadata` | `JSON?` | Additional context (role, file name, error message) |

This "wide event" format allows a single log record to answer most forensic questions without joining additional tables.

### Instrumentation Points

Audit events are emitted by the API components for the following action categories:

| Category | Example Actions |
|----------|----------------|
| Authentication | `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`, `TOKEN_REFRESH`, `ACCOUNT_LOCKED` |
| User management | `USER_CREATE`, `USER_UPDATE_ROLE`, `USER_DELETE` |
| File operations | `MATERIAL_UPLOAD`, `MATERIAL_DOWNLOAD`, `SUBMISSION_UPLOAD`, `SUBMISSION_DOWNLOAD` |
| Admin operations | `ADMIN_LOGIN`, `AUDIT_LOG_VIEW`, `STATS_VIEW` |
| Enrolment | `ENROLL_SUCCESS`, `ENROLL_FAILURE` |

### Retention & Clean-up

- `AUDIT_RETENTION_DAYS=365` (configurable via `.env`).  
- A scheduled clean-up job (cron or Prisma script) deletes records older than `retention_days` at a low-traffic time (e.g. during the maintenance window, ASR-AVAIL-02).  
- Log files from the `server-logs` Docker volume (`AUDIT_LOG_DIR=/app/logs/audit`) mirror the database records for backup purposes.

### Access Control

- `GET /api/audit/logs` requires `ADMIN` role (enforced by `AuthMiddleware.requireAdmin`).  
- Log write operations are internal-only (no public endpoint); the Audit Module is called directly by other modules via a service function.  
- Logs are append-only: no `UPDATE` or `DELETE` is exposed through the API.  

---

## Consequences

### Positive

- PostgreSQL provides ACID guarantees: audit records are durable even if the API process crashes mid-request.  
- Centralised DB storage means both API instances write to the same log sink—no log-merge problem.  
- SQL queries over structured fields (`userId`, `action`, `timestamp`) make forensic investigation efficient.  
- Admin-only read endpoint satisfies auditor access requirement.  
- Configurable retention with automated clean-up satisfies the ≥ 1 year policy (ASR-SEC-11).  

### Negative / Trade-offs

- Writing an audit record on every key action adds a DB write per event; under high load (e.g. 500 concurrent enrolments) this could become a bottleneck. Mitigation: use an async queue (e.g. Redis-backed background job) for non-blocking audit writes if needed.  
- PostgreSQL-stored logs are as durable as the database backup strategy; without off-site backup, disk failure could compromise log integrity. Recommend periodic export to append-only storage (S3, tape).  
- "Wide event" metadata field is a `JSON` column; complex queries on nested metadata require PostgreSQL JSON operators (`@>`, `->>`), which are less optimised than typed columns.  

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| **File-based logs only (e.g. Winston to disk)** | Files are per-instance; merging logs from two containers is complex; file systems can be accidentally truncated; harder to query. |
| **Dedicated log aggregator (ELK / Loki)** | Adds significant infrastructure complexity out of scope for Docker Compose; can be adopted as a future enhancement. |
| **Separate audit database** | Adds another data store to operate; single PostgreSQL instance is sufficient for the current scale. |
| **Immutable DB (append-only table)** | PostgreSQL does not natively enforce immutability; operational discipline + role-restricted endpoint provides sufficient protection for the current threat model. |
