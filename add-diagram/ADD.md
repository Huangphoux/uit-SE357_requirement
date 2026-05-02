# Architecture Design Document (ADD)

**Project:** UIT SE357 – Learning Management System (LMS)  
**Version:** 1.0  
**Date:** 2026-05-02  
**Authors:** SE357 Team  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architectural Goals & Constraints](#2-architectural-goals--constraints)
3. [Architecture Drivers (ASR Summary)](#3-architecture-drivers-asr-summary)
4. [System Context (C4 Level 1)](#4-system-context-c4-level-1)
5. [Container Architecture (C4 Level 2)](#5-container-architecture-c4-level-2)
6. [Component Architecture (C4 Level 3)](#6-component-architecture-c4-level-3)
   - 6.1 [React SPA Components](#61-react-spa-components)
   - 6.2 [Node.js API Components](#62-nodejs-api-components)
7. [Data Architecture](#7-data-architecture)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Quality Attribute Scenarios & Design Decisions](#9-quality-attribute-scenarios--design-decisions)
10. [Architecture Decision Records (Index)](#10-architecture-decision-records-index)
11. [Traceability Matrix](#11-traceability-matrix)

---

## 1. Overview

The **Learning Management System (LMS)** is a web-based platform that supports:

- **Students** enrolling in courses, downloading learning materials, submitting assignments, and reading teacher feedback.  
- **Teachers** managing courses/classes, uploading materials, creating assignments, and grading student submissions.  
- **Admins** administering users, monitoring platform health and statistics, and auditing security-relevant events.

The C4 model diagrams are defined in [`workspace.dsl`](workspace.dsl) using the Structurizr DSL. They can be rendered at [https://structurizr.com/dsl](https://structurizr.com/dsl) (paste the DSL) or with the Structurizr CLI.

---

## 2. Architectural Goals & Constraints

| Goal | Description |
|------|-------------|
| **High availability** | ≥ 99.9 % uptime (ASR-AVAIL-01); planned maintenance windows ≤ 1 day downtime (ASR-AVAIL-02). |
| **Performance** | < 2 s response for all interactive requests under 500 concurrent users (ASR-PERF-01); < 2 s for paginated queries on 10 000 + records (ASR-PERF-02). |
| **Scalability** | Architecture must sustain ≥ 20 % annual data growth without performance degradation (ASR-PERF-03). |
| **Security** | Defense-in-depth covering authentication (ASR-SEC-01/02), brute-force protection (ASR-SEC-03), MFA for admins (ASR-SEC-04), RBAC (ASR-SEC-05), HTTPS (ASR-SEC-06), encryption at rest (ASR-SEC-07), input validation (ASR-SEC-08), SQL-injection prevention (ASR-SEC-09), audit logging (ASR-SEC-10/11), file security (ASR-SEC-12/13/14), and rate limiting (ASR-SEC-15). |
| **Constraints** | Stack: Node.js + React + PostgreSQL + Redis; containerised with Docker Compose; HTTPS managed by Caddy. |

---

## 3. Architecture Drivers (ASR Summary)

All rows below have **Status = Done**.

| ASR ID | Quality | Key Measure | Architectural Impact |
|--------|---------|-------------|----------------------|
| ASR-PERF-01 | Performance | 500 concurrent users, < 2 s | Dual backend + Caddy load balancing; Redis caching |
| ASR-PERF-02 | Performance | 10 000 + docs, < 2 s | PostgreSQL with Prisma-generated indexes; pagination |
| ASR-PERF-03 | Performance | 20 % annual growth | Containerised, horizontally scalable architecture |
| ASR-AVAIL-01 | Availability | 99.9 % uptime 24/7 | Dual backend; health-check failover via Caddy |
| ASR-AVAIL-02 | Availability | Maintenance ≤ 1 day read-only | Caddy upstream switching; DB read-only mode |
| ASR-SEC-01 | Security | Bcrypt salt ≥ 10 | `bcrypt` in Auth Module |
| ASR-SEC-02 | Security | JWT 1 h expiry, login < 2 s | JWT access + refresh token pair |
| ASR-SEC-03 | Security | Block IP after 5 failures/15 min | LoginAttempt model (PostgreSQL) + Redis rate limiter |
| ASR-SEC-04 | Security | MFA mandatory for admins | Auth Module MFA flow; Admin Guard middleware |
| ASR-SEC-05 | Security | 100 % requests RBAC-checked | Auth Middleware + RBAC (STUDENT/TEACHER/ADMIN) |
| ASR-SEC-06 | Security | 100 % HTTPS/TLS | Caddy TLS termination (auto cert or internal) |
| ASR-SEC-07 | Security | 100 % sensitive data encrypted at rest | PostgreSQL encryption at rest; bcrypt for passwords |
| ASR-SEC-08 | Security | 100 % inputs validated | Zod schema validation middleware |
| ASR-SEC-09 | Security | 100 % parameterized queries | Prisma ORM (no raw query interpolation) |
| ASR-SEC-10 | Security | 100 % key actions logged | Audit Module (canonical log lines) |
| ASR-SEC-11 | Security | Audit logs retained ≥ 1 year | `AUDIT_RETENTION_DAYS=365` + file/DB storage |
| ASR-SEC-12 | Security | Malware scan + type whitelist | File Upload Component + Materials Module validation |
| ASR-SEC-13 | Security | Files outside web root | Docker volume `/app/uploads`; served via API, not statically |
| ASR-SEC-14 | Security | Materials ≤ 50 MB; Submissions ≤ 20 MB | `fileSizeLimit` middleware; client-side guards |
| ASR-SEC-15 | Security | Rate limit on login + API | `rateLimiter` middleware backed by Redis |
| ASR-NOTIF-01 | Performance | 500 recipients < 1 min | Notification Module + async SMTP queue |
| ASR-FILE-01 | Performance | 500 concurrent downloads | Caddy serves static volume; API streams files |
| ASR-AGGR-01 | Performance | Stats < 5 s, 5-min cache | Aggregation Module + Redis 5-min TTL cache |
| ASR-ENROLL-01 | Performance | 500 concurrent enrollments < 2 s | Stateless API + PostgreSQL unique constraint on enrollments |

---

## 4. System Context (C4 Level 1)

```
┌──────────────────────────────────────────────────────────────────┐
│                  Learning Management System                      │
│                       [Software System]                          │
└──────────────────┬────────────────────────────────┬─────────────┘
         HTTPS     │                                │ SMTP/TLS
   ┌───────────────┤                                ├──────────────┐
   │               │                                │              │
[Student]     [Teacher]    [Admin]         [Email Service]
(person)      (person)     (person)         (external)
```

**Actors**

| Actor | Description |
|-------|-------------|
| Student | Enrolls in courses, downloads materials, submits assignments. |
| Teacher | Creates courses/classes, uploads materials, sets and grades assignments. |
| Admin | Manages platform: users, audit logs, health dashboard. Requires MFA (ASR-SEC-04). |
| Email Service | External SMTP gateway (e.g. Gmail SMTP). Receives notification send requests from the LMS. |

---

## 5. Container Architecture (C4 Level 2)

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                   Learning Management System                                │
  │                                                                             │
  │  ┌──────────────────┐     ┌──────────────────────────────────────────────┐ │
  │  │  Caddy Reverse   │     │           Node.js API (×2)                   │ │
  │  │  Proxy           │────▶│  Express · TypeScript · Prisma               │ │
  │  │  (HTTPS, LB,     │     │  backend-primary / backend-secondary         │ │
  │  │   static files)  │     └──────┬──────────┬──────────────┬────────────┘ │
  │  └────────┬─────────┘            │          │              │              │
  │           │                      │          │              │              │
  │           ▼                      ▼          ▼              ▼              │
  │  ┌─────────────────┐   ┌──────────────┐ ┌──────────┐ ┌──────────────┐    │
  │  │   React SPA     │   │ PostgreSQL 16 │ │  Redis 7 │ │ File Storage │    │
  │  │  (TypeScript)   │   │  (Prisma ORM)│ │  (Cache) │ │  (Volume)    │    │
  │  └─────────────────┘   └──────────────┘ └──────────┘ └──────────────┘    │
  └─────────────────────────────────────────────────────────────────────────────┘
```

### Container Descriptions

| Container | Technology | Responsibility |
|-----------|-----------|----------------|
| **Caddy Reverse Proxy** | Caddy 2 | HTTPS/TLS termination (ASR-SEC-06); gzip/zstd response compression (ASR-PERF-01); active/passive load balancing across two API instances with `/api/health` health-check every 10 s (ASR-AVAIL-01); serves the compiled React SPA from `/srv` (ASR-FILE-01). |
| **React SPA** | React 18 + TypeScript + Vite | Browser-side SPA providing role-aware UI for Student, Teacher, and Admin personas. Communicates with the API exclusively over HTTPS via Axios. |
| **Node.js API** | Node.js 20 + Express + TypeScript | Stateless RESTful backend. Two identical instances (`backend-primary`, `backend-secondary`) run in Docker containers. Implements all business logic; integrates with PostgreSQL, Redis, File Storage, and SMTP. |
| **PostgreSQL 16** | PostgreSQL + Prisma | ACID-compliant relational store. Schema managed by Prisma migrations. Indexes on `teacherId`, `createdBy`, `classId` for fast queries (ASR-PERF-02). Parameterized queries via Prisma prevent SQL injection (ASR-SEC-09). |
| **Redis 7** | Redis | Rate-limit sliding-window counters (ASR-SEC-15); login-lockout complementary store; aggregation result cache with 5-min TTL (ASR-AGGR-01). |
| **File Storage** | Docker Volume (`server-logs`, upload volume) | Stores uploaded materials (≤ 50 MB) and submissions (≤ 20 MB). Volume mounted at `/app/uploads`, **outside the web root**, to prevent direct HTTP access (ASR-SEC-13). |

---

## 6. Component Architecture (C4 Level 3)

### 6.1 React SPA Components

| Component | Responsibility |
|-----------|---------------|
| **Auth Context** | Stores JWT access token (httpOnly cookie), manages refresh-token flow, and exposes `useAuth()` hook across the app. |
| **Login Page** | Collects and validates credentials (client-side, ASR-SEC-08), sends `POST /api/auth/login`, and surfaces lockout messages (ASR-SEC-03). |
| **Student Dashboard** | Aggregates enrolled classes, assignment deadlines, and recent materials for the student. |
| **Teacher Dashboard** | Entry point for class management, material upload, assignment creation, and grading. |
| **Admin Dashboard** | Displays cached platform statistics (ASR-AGGR-01), user management table, and audit log viewer. |
| **Course / Class Pages** | Enrolment workflows (students) and class-management forms (teachers). |
| **Assignment Pages** | Renders assignment list, submission form (with file upload), and graded feedback. |
| **Material Pages** | Lists and streams course materials; teacher upload form with 50 MB client-side guard (ASR-SEC-14). |
| **Notification Hub** | Polls `/api/notifications` and renders unread notification badge and drawer (ASR-NOTIF-01). |
| **File Upload Component** | Validates file type against whitelist and enforces max-size before upload (ASR-SEC-12, ASR-SEC-14). |

### 6.2 Node.js API Components

| Component | Route Prefix | Responsibility | ASR Coverage |
|-----------|-------------|----------------|--------------|
| **Auth Module** | `/api/auth` | Register (bcrypt, salt ≥ 10), login, logout, refresh token. Issues JWT access (1 h) + refresh tokens. | ASR-SEC-01, ASR-SEC-02 |
| **Auth Middleware** | *(all protected routes)* | Verifies JWT signature, extracts `userId`/`role`, enforces RBAC for each route. | ASR-SEC-05 |
| **Rate-Limit Middleware** | `/api/*` | Redis `INCR`/`EXPIRE` sliding window. Returns HTTP 429 when threshold exceeded. | ASR-SEC-15 |
| **Login-Lockout Module** | *(part of Auth)* | Writes `LoginAttempt` records. Blocks IP after 5 failures in 15 min (Redis + PostgreSQL). | ASR-SEC-03 |
| **User Module** | `/api/user` | CRUD for user profiles; enforces role-based permissions. | ASR-SEC-05 |
| **Courses Module** | `/api/courses` | Course CRUD with pagination; queries use indexed columns. | ASR-PERF-02 |
| **Classes Module** | `/api/classes` | Class management, teacher assignment, enrolment operations. | ASR-ENROLL-01 |
| **Materials Module** | `/api/materials` | File upload pipeline: validate MIME type + size → scan (ASR-SEC-12) → store outside web root (ASR-SEC-13); serve files to enrolled students only. | ASR-SEC-12–14, ASR-FILE-01 |
| **Assignments Module** | `/api/assignments` | Teacher: create/update/delete. Student: view assignments; concurrent-safe enrolment inserts (ASR-ENROLL-01). | ASR-ENROLL-01 |
| **Submissions Module** | `/api/submissions` | Accepts student file/text submissions (≤ 20 MB); streams files on download; supports 500 concurrent downloads. | ASR-SEC-14, ASR-FILE-01 |
| **Feedback Module** | `/api/feedback` | Teacher comments + numeric score on a submission. | — |
| **Audit Module** | `/api/audit` | Admin-only `GET /api/audit/logs`; API-level logging hook writes canonical log lines with timestamp + userId (ASR-SEC-10). Retention configured via `AUDIT_RETENTION_DAYS`. | ASR-SEC-10, ASR-SEC-11 |
| **Notification Module** | *(internal)* | Enqueues and batch-delivers notification e-mails via SMTP; delivers to 500 recipients < 1 min. | ASR-NOTIF-01 |
| **Aggregation / Stats Module** | `/api/stats` | Runs aggregate DB queries; caches results in Redis (5-min TTL); guarantees < 5 s response on 10 000 + records. | ASR-AGGR-01 |
| **Input Validation (Zod)** | *(all routes)* | Zod schema middleware rejects malformed requests before they reach controllers. | ASR-SEC-08 |

---

## 7. Data Architecture

The schema is defined in `server/prisma/schema.prisma`. Key models:

| Model | Purpose |
|-------|---------|
| `User` | Accounts with roles: `STUDENT` / `TEACHER` / `ADMIN`. Stores bcrypt-hashed password and refresh token. |
| `LoginAttempt` | IP-keyed counter for brute-force tracking (ASR-SEC-03). |
| `Course` | Top-level course catalogue entry. |
| `Class` | Session of a course with an assigned teacher. |
| `Enrollment` | Student ↔ Class many-to-many with `ACTIVE/COMPLETED/DROPPED` status. Unique constraint prevents duplicate enrolments (ASR-ENROLL-01). |
| `Assignment` | Task created by a teacher with `dueDate` and `maxScore`. |
| `Submission` | Student answer (text or file). Unique constraint per `(assignmentId, userId)`. |
| `Feedback` | Teacher comment + score on a submission. |
| `Material` | Learning resource (PDF, VIDEO, LINK, DOC) stored with file URL. |

Indexes added by Prisma (`@@index`):
- `Class.teacherId` – fast class-by-teacher queries
- `Assignment.createdBy` – fast assignment-by-teacher queries
- `Feedback.createdBy` – fast feedback-by-teacher queries
- `Material.classId`, `Material.createdBy` – fast material listing

---

## 8. Deployment Architecture

All services are orchestrated with **Docker Compose** (`docker-compose.yml`):

```
Internet
   │  HTTPS :443
   ▼
┌──────────────┐
│   Caddy      │  ← TLS termination, load balancing, static SPA
└──────┬───────┘
       │ /api/*          (active/passive failover)
       ├──────────────────────────────────────┐
       ▼                                      ▼
┌─────────────────┐                ┌─────────────────┐
│ backend-primary │                │backend-secondary│
│  (Node.js API)  │                │  (Node.js API)  │
└────────┬────────┘                └────────┬────────┘
         │                                  │
         └──────────┬───────────────────────┘
                    │ shared services
          ┌─────────┴──────────┐ ┌──────────────┐ ┌─────────────┐
          │   PostgreSQL 16    │ │   Redis 7    │ │File Storage │
          │   (postgres-data   │ │              │ │(server-logs │
          │    volume)         │ │              │ │ volume)     │
          └────────────────────┘ └──────────────┘ └─────────────┘
```

**Health-check chain:**

1. `db` → `pg_isready` every 10 s; both backend instances wait (`depends_on: condition: service_healthy`).  
2. `redis` → `redis-cli ping` every 10 s; both backends wait.  
3. `backend-*` → `fetch /api/health` every 10 s, 3 retries, 20 s start period.  
4. Caddy polls `backend-*:8000/api/health` every 10 s; on failure it routes all traffic to the surviving instance.

---

## 9. Quality Attribute Scenarios & Design Decisions

### Performance (ASR-PERF-01, ASR-PERF-03, ASR-ENROLL-01)

- **Decision:** Two stateless API instances behind Caddy active/passive load balancer.  
- **Rationale:** Stateless design allows horizontal scaling without shared mutable state. The second instance handles failover and can absorb additional load during traffic spikes (500 concurrent users, 500 concurrent enrolments).  
- **ADR:** [ADR-001](ADR/ADR-001-caddy-load-balancing.md)

### Performance – Query Optimisation (ASR-PERF-02)

- **Decision:** PostgreSQL with Prisma ORM; explicit `@@index` directives on frequently-filtered columns; API endpoints expose `page`/`limit` pagination parameters.  
- **ADR:** [ADR-004](ADR/ADR-004-postgresql-prisma.md)

### Availability (ASR-AVAIL-01)

- **Decision:** Active/passive failover via Caddy health checks; Docker `restart: unless-stopped` policies.  
- **ADR:** [ADR-001](ADR/ADR-001-caddy-load-balancing.md)

### Security – Authentication (ASR-SEC-01, ASR-SEC-02)

- **Decision:** Passwords hashed with bcrypt (salt rounds ≥ 10); authentication returns a short-lived JWT access token (1 h) and a long-lived refresh token stored in an httpOnly cookie.  
- **ADR:** [ADR-002](ADR/ADR-002-jwt-auth-tokens.md)

### Security – Brute-Force & Rate Limiting (ASR-SEC-03, ASR-SEC-15)

- **Decision:** Redis-backed sliding-window rate limiter on all `/api/*` routes; IP-level login-lockout counter persisted in PostgreSQL (`LoginAttempt`).  
- **ADR:** [ADR-003](ADR/ADR-003-redis-rate-limiting.md)

### Security – RBAC & MFA (ASR-SEC-04, ASR-SEC-05)

- **Decision:** Three roles (`STUDENT`, `TEACHER`, `ADMIN`) stored in the `User` model; JWT payload carries the role; all protected routes verified by Auth Middleware before any business logic runs; admin routes require MFA confirmation.  
- **ADR:** [ADR-005](ADR/ADR-005-rbac.md)

### Security – HTTPS (ASR-SEC-06)

- **Decision:** Caddy handles TLS (self-signed `tls internal` for local; ACME for production); all inter-service traffic on the Docker network is HTTP-only (trusted network).  
- **ADR:** [ADR-001](ADR/ADR-001-caddy-load-balancing.md)

### Security – File Upload (ASR-SEC-12, ASR-SEC-13, ASR-SEC-14)

- **Decision:** Uploaded files stored in a Docker volume mounted outside the Caddy web root; MIME-type whitelist + size limits enforced in middleware; files served through the API (never directly via the file server).  
- **ADR:** [ADR-006](ADR/ADR-006-file-storage.md)

### Security – SQL Injection (ASR-SEC-09)

- **Decision:** Prisma ORM exclusively; no raw string interpolation in queries.  
- **ADR:** [ADR-004](ADR/ADR-004-postgresql-prisma.md)

### Security – Audit Logging (ASR-SEC-10, ASR-SEC-11)

- **Decision:** Canonical log-line pattern (wide events) with `userId`, `action`, and `timestamp` persisted to the database. `AUDIT_RETENTION_DAYS=365` governs clean-up.  
- **ADR:** [ADR-007](ADR/ADR-007-audit-logging.md)

---

## 10. Architecture Decision Records (Index)

| ADR | Title | Status | ASR |
|-----|-------|--------|-----|
| [ADR-001](ADR/ADR-001-caddy-load-balancing.md) | Caddy as Reverse Proxy, Load Balancer & TLS Terminator | Accepted | PERF-01, AVAIL-01, SEC-06, FILE-01 |
| [ADR-002](ADR/ADR-002-jwt-auth-tokens.md) | JWT Access + Refresh Token Authentication | Accepted | SEC-01, SEC-02 |
| [ADR-003](ADR/ADR-003-redis-rate-limiting.md) | Redis-Backed Rate Limiting & Login Lockout | Accepted | SEC-03, SEC-15 |
| [ADR-004](ADR/ADR-004-postgresql-prisma.md) | PostgreSQL + Prisma ORM as Primary Data Store | Accepted | PERF-02, SEC-07, SEC-09 |
| [ADR-005](ADR/ADR-005-rbac.md) | Role-Based Access Control with JWT Role Claims | Accepted | SEC-04, SEC-05 |
| [ADR-006](ADR/ADR-006-file-storage.md) | Secure File Storage Outside Web Root | Accepted | SEC-12, SEC-13, SEC-14, FILE-01 |
| [ADR-007](ADR/ADR-007-audit-logging.md) | Canonical Audit Logging with 1-Year Retention | Accepted | SEC-10, SEC-11 |

---

## 11. Traceability Matrix

| ASR ID | Container(s) | Component(s) | ADR |
|--------|-------------|--------------|-----|
| ASR-PERF-01 | Caddy, Node.js API ×2 | Rate-Limit Middleware | ADR-001 |
| ASR-PERF-02 | PostgreSQL | Courses Module, Classes Module | ADR-004 |
| ASR-PERF-03 | All containers | — (horizontal scale by design) | ADR-001 |
| ASR-AVAIL-01 | Caddy, Node.js API ×2 | Health route | ADR-001 |
| ASR-AVAIL-02 | Caddy, PostgreSQL | — | ADR-001 |
| ASR-SEC-01 | Node.js API | Auth Module | ADR-002 |
| ASR-SEC-02 | Node.js API | Auth Module | ADR-002 |
| ASR-SEC-03 | Node.js API, Redis, PostgreSQL | Login-Lockout Module, Rate-Limit Middleware | ADR-003 |
| ASR-SEC-04 | Node.js API | Auth Module, Auth Middleware | ADR-005 |
| ASR-SEC-05 | Node.js API | Auth Middleware | ADR-005 |
| ASR-SEC-06 | Caddy | — | ADR-001 |
| ASR-SEC-07 | PostgreSQL | — | ADR-004 |
| ASR-SEC-08 | Node.js API | Input Validation (Zod) | — |
| ASR-SEC-09 | Node.js API, PostgreSQL | All DB-touching modules | ADR-004 |
| ASR-SEC-10 | Node.js API, PostgreSQL | Audit Module | ADR-007 |
| ASR-SEC-11 | Node.js API, PostgreSQL | Audit Module | ADR-007 |
| ASR-SEC-12 | Node.js API, File Storage | Materials Module, Submissions Module | ADR-006 |
| ASR-SEC-13 | File Storage | Materials Module, Submissions Module | ADR-006 |
| ASR-SEC-14 | Node.js API | Materials Module, Submissions Module, File Upload Component | ADR-006 |
| ASR-SEC-15 | Node.js API, Redis | Rate-Limit Middleware | ADR-003 |
| ASR-NOTIF-01 | Node.js API | Notification Module | — |
| ASR-FILE-01 | Caddy, Node.js API, File Storage | Materials Module, Submissions Module | ADR-006 |
| ASR-AGGR-01 | Node.js API, Redis | Aggregation / Stats Module | — |
| ASR-ENROLL-01 | Node.js API, PostgreSQL | Classes Module, Assignments Module | ADR-004 |
