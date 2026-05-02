# ADR-004: PostgreSQL + Prisma ORM as Primary Data Store

**Status:** Accepted  
**Date:** 2026-05-02  
**ASR:** ASR-PERF-02, ASR-PERF-03, ASR-SEC-07, ASR-SEC-09, ASR-ENROLL-01  

---

## Context

The LMS requires a durable, transactional data store that can:

- Handle **10 000 + records** with query response times **< 2 seconds** (ASR-PERF-02).  
- Scale gracefully with **20 % annual data growth** (ASR-PERF-03).  
- **Protect against SQL injection** (ASR-SEC-09).  
- **Encrypt sensitive data at rest** (ASR-SEC-07).  
- Enforce **uniqueness constraints** to prevent duplicate enrolments under 500 concurrent requests (ASR-ENROLL-01).  

The application also requires a reliable ORM for schema migration management and type-safe query building.

---

## Decision

**Use PostgreSQL 16 as the primary relational database, accessed exclusively through Prisma ORM.**

### Schema Design Highlights

| Model | Key Indexes / Constraints |
|-------|--------------------------|
| `User` | `email UNIQUE`; `refreshToken` nullable |
| `LoginAttempt` | `ip` as PRIMARY KEY *(see trade-off note below)* |
| `Class` | `@@index([teacherId])` |
| `Enrollment` | `@@unique([userId, classId])` — prevents duplicate enrolment (ASR-ENROLL-01) |
| `Assignment` | `@@index([createdBy])` |
| `Submission` | `@@unique([assignmentId, userId])` |
| `Feedback` | `@@index([createdBy])` |
| `Material` | `@@index([classId])`, `@@index([createdBy])` |

### Query Safety

All database interactions go through Prisma's query builder or typed `$queryRaw` with bound parameters. **No raw string interpolation** is used in database queries, preventing SQL injection (ASR-SEC-09).

### Encryption at Rest (ASR-SEC-07)

- User passwords are stored as bcrypt hashes (never plaintext).  
- PostgreSQL data-at-rest encryption is handled at the infrastructure level (volume encryption on the host or via Docker storage driver).  
- Sensitive config values (database password, JWT secrets) are injected via environment variables, never committed to source control.

### Pagination

All list endpoints (`GET /api/courses`, `/api/classes`, etc.) support `page` + `limit` query parameters. Prisma's `skip`/`take` is used to avoid full-table scans (ASR-PERF-02).

---

## Consequences

### Positive

- ACID transactions guarantee enrolment uniqueness even under 500 concurrent requests (PostgreSQL row-level locking + `@@unique` constraint, ASR-ENROLL-01).  
- Prisma-generated parameterized SQL eliminates entire classes of injection vulnerabilities (ASR-SEC-09).  
- Prisma migrations provide version-controlled, repeatable schema changes.  
- PostgreSQL's `EXPLAIN ANALYZE` tooling makes it easy to verify index effectiveness.  
- Type-safe query results reduce runtime errors in TypeScript code.  

> **Known limitation – `LoginAttempt.ip` as PRIMARY KEY:** Using the client IP as a primary key can cause correctness issues for users behind NAT or shared proxies (multiple users share one IP) and may create storage / index bloat with IPv6 addresses (up to 39 characters). A safer design would use a surrogate `id CUID` as the primary key and add a `UNIQUE` constraint on `ip`. This is an existing schema decision; a future migration should consider this change.

### Negative / Trade-offs

- PostgreSQL is a single-node deployment in Docker Compose; for truly distributed deployments a replica or read-only secondary would be needed.  
- Schema migrations require a brief write-lock on the migrated tables; schedule during maintenance windows (ASR-AVAIL-02).  
- Prisma adds a compile step (`prisma generate`) that must run before the first server start.  

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| **MongoDB (document store)** | Lacks ACID transactions for concurrent enrolment uniqueness (ASR-ENROLL-01); no native parameterized query protection equivalent to Prisma (ASR-SEC-09). |
| **SQLite** | Not suitable for concurrent writes from two API instances; ASR-AVAIL-01 notes SQLite as unsuitable for production 24/7 load. |
| **Knex / raw SQL** | Requires manual parameterization discipline; higher risk of SQL injection (ASR-SEC-09). |
| **TypeORM** | Heavier decorator-based API; less mature migration tooling compared to Prisma at the time of decision. |
