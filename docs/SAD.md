# Software Architecture Document (SAD)

**Project:** UIT SE357 – Learning Management System (LMS)  
**Version:** 1.0  
**Date:** 2026-05-04  
**Authors:** SE357 Team  
**Status:** Released  

---

## Document History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 0.1 | 2026-04-20 | SE357 Team | Initial draft |
| 0.9 | 2026-05-02 | SE357 Team | Review – added ADRs and QA scenarios |
| 1.0 | 2026-05-04 | SE357 Team | Final release |

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [Purpose](#11-purpose)
   - 1.2 [Scope](#12-scope)
   - 1.3 [Audience](#13-audience)
   - 1.4 [Definitions and Abbreviations](#14-definitions-and-abbreviations)
   - 1.5 [Reference Documents](#15-reference-documents)
2. [System Overview](#2-system-overview)
   - 2.1 [System Description](#21-system-description)
   - 2.2 [Actors and Roles](#22-actors-and-roles)
3. [Architectural Goals and Constraints](#3-architectural-goals-and-constraints)
   - 3.1 [Quality Attribute Requirements (Done ASRs)](#31-quality-attribute-requirements-done-asrs)
   - 3.2 [Technical Constraints](#32-technical-constraints)
4. [Architecture Views](#4-architecture-views)
   - 4.1 [Logical View](#41-logical-view)
   - 4.2 [Process View](#42-process-view)
   - 4.3 [Deployment View](#43-deployment-view)
   - 4.4 [Data View](#44-data-view)
5. [Architecture Decisions](#5-architecture-decisions)
6. [Quality Attribute Analysis](#6-quality-attribute-analysis)
   - 6.1 [Performance](#61-performance)
   - 6.2 [Availability](#62-availability)
   - 6.3 [Security](#63-security)
7. [Risks and Technical Debt](#7-risks-and-technical-debt)
8. [Appendix A – Glossary](#appendix-a--glossary)
9. [Appendix B – ASR Traceability Matrix](#appendix-b--asr-traceability-matrix)

---

## 1. Introduction

### 1.1 Purpose

This Software Architecture Document (SAD) describes the software architecture of the **Learning Management System (LMS)** developed as part of the UIT SE357 course project. It establishes the high-level structure of the system, documents key architectural decisions, and demonstrates how the design addresses the Architecturally Significant Requirements (ASRs) that have been implemented (Status = Done).

The document is intended to serve as the authoritative reference for the current release and as a baseline for future evolution.

### 1.2 Scope

This document covers the architecture of the LMS as deployed via Docker Compose, comprising:

- A **React SPA** (browser-based front end)
- A **Node.js / Express REST API** (two identical instances for availability)
- A **PostgreSQL 16** relational database
- A **Redis 7** in-memory data store
- A **Caddy 2** reverse proxy (TLS termination, load balancing, static file serving)
- A **File Storage volume** (uploaded materials and submissions)

The document does not cover the business processes the LMS supports; those are described in the BRD and SRS documents.

### 1.3 Audience

| Audience | Relevance |
|----------|-----------|
| **Software Architects / Developers** | Primary audience; use the document to understand design rationale and constraints |
| **Security Reviewers** | Section 4 (views), Section 6 (QA analysis), and Section 5 (ADRs) |
| **Operations / DevOps** | Section 4.3 (Deployment View) and the Docker Compose configuration |
| **Project Supervisors / Assessors** | Sections 3, 5, and 6 demonstrate how ASRs are addressed |

### 1.4 Definitions and Abbreviations

| Term / Abbreviation | Definition |
|---------------------|-----------|
| **ASR** | Architecturally Significant Requirement |
| **ADR** | Architecture Decision Record |
| **SAD** | Software Architecture Document |
| **LMS** | Learning Management System |
| **SPA** | Single-Page Application |
| **API** | Application Programming Interface |
| **JWT** | JSON Web Token |
| **RBAC** | Role-Based Access Control |
| **TLS** | Transport Layer Security |
| **ORM** | Object-Relational Mapper |
| **CUID** | Collision-resistant Unique Identifier |
| **MFA** | Multi-Factor Authentication |
| **SMTP** | Simple Mail Transfer Protocol |
| **TTL** | Time-To-Live |

### 1.5 Reference Documents

| ID | Title | Location |
|----|-------|----------|
| REF-01 | Business Requirements Document (BRD) | `docs/1. BRD/` |
| REF-02 | Software Requirements Specification (SRS) | `docs/10. SRS/` |
| REF-03 | Architecture Design Document (ADD) | `add-diagram/ADD.md` |
| REF-04 | ADR-001: Caddy as Reverse Proxy, Load Balancer & TLS Terminator | `add-diagram/ADR/ADR-001-caddy-load-balancing.md` |
| REF-05 | ADR-002: JWT Access + Refresh Token Authentication | `add-diagram/ADR/ADR-002-jwt-auth-tokens.md` |
| REF-06 | ADR-003: Redis-Backed Rate Limiting & Login Lockout | `add-diagram/ADR/ADR-003-redis-rate-limiting.md` |
| REF-07 | ADR-004: PostgreSQL + Prisma ORM as Primary Data Store | `add-diagram/ADR/ADR-004-postgresql-prisma.md` |
| REF-08 | ADR-005: Role-Based Access Control with JWT Role Claims | `add-diagram/ADR/ADR-005-rbac.md` |
| REF-09 | ADR-006: Secure File Storage Outside Web Root | `add-diagram/ADR/ADR-006-file-storage.md` |
| REF-10 | ADR-007: Canonical Audit Logging with 1-Year Retention | `add-diagram/ADR/ADR-007-audit-logging.md` |
| REF-11 | ASR Spreadsheet | `SE356-ASR.xlsx - ASR.csv` |
| REF-12 | Prisma Database Schema | `server/prisma/schema.prisma` |
| REF-13 | Docker Compose Configuration | `docker-compose.yml` |

---

## 2. System Overview

### 2.1 System Description

The **Learning Management System (LMS)** is a web-based platform for managing educational courses, classes, learning materials, assignments, and student submissions. It supports three distinct user roles — Student, Teacher, and Admin — each with differentiated capabilities.

The system is deployed as a set of Docker containers orchestrated via Docker Compose, exposed to end-users through a Caddy reverse proxy that handles TLS termination and load balancing.

```
                          ┌─────────────────────────────────┐
                          │     Learning Management System  │
                          │          [Software System]      │
                          └───────────────┬─────────────────┘
                 HTTPS                    │                   SMTP/TLS
        ┌────────────────────────────────┤──────────────────────────────┐
        │                  │             │             │                 │
   [Student]          [Teacher]       [Admin]     [Email Service]
   (person)           (person)        (person)     (external)
```

**System boundaries:**
- Inbound: HTTPS on port 443 (served by Caddy)
- Outbound: SMTP to an external email service (e.g. Gmail SMTP) for notifications
- All data is stored within the system boundary (PostgreSQL, Redis, file volumes)

### 2.2 Actors and Roles

| Actor | Role | Key Capabilities |
|-------|------|-----------------|
| **Student** | `STUDENT` | Enrol in courses/classes; download learning materials; submit assignments (text or file); view feedback and grades |
| **Teacher** | `TEACHER` | Create and manage courses/classes; upload materials; create and grade assignments; provide feedback on submissions |
| **Admin** | `ADMIN` | Manage all users; view platform statistics; access audit logs; perform administrative operations (requires MFA per ASR-SEC-04) |
| **Email Service** | External system | Receives notification delivery requests via SMTP from the LMS (ASR-NOTIF-01) |

---

## 3. Architectural Goals and Constraints

### 3.1 Quality Attribute Requirements (Done ASRs)

The following table lists all ASRs with **Status = Done** in the project's ASR register (`SE356-ASR.xlsx - ASR.csv`). These constitute the primary quality-attribute drivers for the current architecture.

| ASR ID | Quality Attribute | Scenario | Stimulus | Measure | Architectural Response |
|--------|-------------------|----------|---------|---------|----------------------|
| **ASR-PERF-01** | Performance | 500 concurrent users access the system | 500 users send requests simultaneously | Response time < 2 s per request | Dual Node.js API instances behind Caddy active/passive load balancer; Redis caching |
| **ASR-PERF-02** | Performance | Query large dataset (10 000+ records) | User requests course/student/assignment list | Response time < 2 s for 10 000 records | PostgreSQL with Prisma-generated indexes; cursor/page-limit pagination |
| **ASR-AVAIL-01** | Availability | System access at any time | User accesses the system at any moment | Uptime ≥ 99.9 % (24/7) | Dual backend instances; Caddy health-check failover every 10 s |
| **ASR-SEC-01** | Security | New account registration | New user registers with a password | Password ≥ 8 chars (upper/lower/digit); bcrypt salt rounds ≥ 10 | `bcrypt` with configurable salt rounds in Auth Module |
| **ASR-SEC-02** | Security | Login to the system | User submits email + password | JWT expiry = 1 h; login response < 2 s | JWT access + refresh token pair; `httpOnly` cookies |
| **ASR-SEC-03** | Security | Brute-force attack on login | Attacker attempts login many times | Block IP after 5 failures in 15 min | `LoginAttempt` model in PostgreSQL + Redis rate limiter |
| **ASR-SEC-05** | Security | Access control on resources | User accesses resource not belonging to their role | 100 % of requests are RBAC-checked before processing | Auth Middleware enforces RBAC (`STUDENT` / `TEACHER` / `ADMIN`) |
| **ASR-SEC-06** | Security | Client–server data transmission | Data is sent over the network | 100 % traffic uses HTTPS/TLS | Caddy TLS termination; `tls internal` (dev) / ACME (prod) |
| **ASR-SEC-07** | Security | Storage of sensitive data | Sensitive data is written to the database | 100 % of sensitive data encrypted at rest | PostgreSQL encryption at rest; bcrypt for passwords |
| **ASR-SEC-08** | Security | User input | User submits data via any form | 100 % of inputs validated before processing | Zod schema validation middleware on all routes |
| **ASR-SEC-09** | Security | SQL injection attack | Attacker injects SQL code into inputs | 100 % of database queries use parameterized queries | Prisma ORM (no raw string interpolation) |
| **ASR-SEC-10** | Security | Execution of important actions | User performs auth/admin/file-access action | 100 % of key actions logged with timestamp and userId | Audit Module (canonical wide-event log lines) |
| **ASR-SEC-11** | Security | Query of historical audit logs | Auditor requests logs from the past | Audit logs retained ≥ 1 year | `AUDIT_RETENTION_DAYS=365` + scheduled clean-up job |
| **ASR-SEC-14** | Security | Large file upload | User uploads a large document | Materials ≤ 50 MB; submissions ≤ 20 MB | `fileSizeLimit` middleware; client-side guards in File Upload Component |
| **ASR-SEC-15** | Security | Rate limiting of API calls | Multiple requests from the same source | Rate limit applied to login and API endpoints | `rateLimiter` middleware backed by Redis sliding-window counters |

### 3.2 Technical Constraints

| Constraint | Description |
|-----------|-------------|
| **Technology stack** | Node.js 20 + Express + TypeScript (API); React 18 + TypeScript + Vite (SPA); PostgreSQL 16 (primary data store); Redis 7 (cache / rate limit); Caddy 2 (reverse proxy) |
| **Containerisation** | All services deployed via Docker Compose; no Kubernetes or external cloud orchestrator |
| **Database ORM** | Prisma is the sole database access layer; raw SQL queries are prohibited |
| **Authentication** | JWT-based; no external Identity Provider in scope |
| **Network** | HTTPS on port 443 managed by Caddy; internal Docker network uses plain HTTP |
| **File size limits** | Materials: ≤ 50 MB (ASR-SEC-14); Submissions: ≤ 20 MB (ASR-SEC-14) |

---

## 4. Architecture Views

### 4.1 Logical View

The logical view describes the principal components of the system and their responsibilities, independent of deployment topology.

#### 4.1.1 React SPA Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        React SPA (Browser)                      │
│                                                                 │
│  ┌──────────────┐  ┌────────────────────┐  ┌────────────────┐  │
│  │ Auth Context │  │  Login Page         │  │ Notification   │  │
│  │ (JWT cookie) │  │  (Zod validation,   │  │ Hub (polling)  │  │
│  └──────────────┘  │  lockout display)   │  └────────────────┘  │
│                    └────────────────────┘                       │
│  ┌─────────────────────┐  ┌──────────────────────────────────┐  │
│  │  Student Dashboard  │  │  Teacher Dashboard               │  │
│  │  (classes, deadlines│  │  (class mgmt, material upload,   │  │
│  │   materials, grades)│  │   assignment creation, grading)  │  │
│  └─────────────────────┘  └──────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Admin Dashboard (stats cache, user mgmt, audit log viewer)│  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ Course/Class   │  │ Assignment Pages │  │ Material Pages  │  │
│  │ Pages          │  │ (file submission)│  │ (50 MB guard)   │  │
│  └────────────────┘  └──────────────────┘  └─────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  File Upload Component (MIME whitelist + max-size check) │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

| Component | Responsibility | ASR Coverage |
|-----------|---------------|--------------|
| **Auth Context** | Manages JWT access token (httpOnly cookie); drives refresh-token flow; exposes `useAuth()` hook | ASR-SEC-02 |
| **Login Page** | Client-side credential validation; calls `POST /api/auth/login`; surfaces lockout error messages | ASR-SEC-08, ASR-SEC-03 |
| **Student Dashboard** | Aggregates enrolled classes, assignment deadlines, recent materials | — |
| **Teacher Dashboard** | Entry point for class management, material upload, assignment creation, and grading | — |
| **Admin Dashboard** | Displays cached platform statistics, user management table, and audit log viewer | ASR-SEC-10, ASR-SEC-11 |
| **Course / Class Pages** | Enrolment workflows (students); class-management forms (teachers) | — |
| **Assignment Pages** | Assignment list; submission form (text or file); graded feedback display | ASR-SEC-14 |
| **Material Pages** | Material listing and streaming; teacher upload with 50 MB client-side guard | ASR-SEC-14 |
| **Notification Hub** | Polls `/api/notifications`; renders unread-notification badge and drawer | — |
| **File Upload Component** | Validates MIME type against whitelist; enforces max-size before upload | ASR-SEC-14 |

#### 4.1.2 Node.js API Components

| Component | Route Prefix | Responsibility | ASR Coverage |
|-----------|-------------|----------------|--------------|
| **Auth Module** | `/api/auth` | Register (bcrypt ≥ 10 rounds), login, logout, token refresh; issues JWT access (1 h) + refresh tokens | ASR-SEC-01, ASR-SEC-02 |
| **Auth Middleware** | *(all protected routes)* | Verifies JWT signature; extracts `userId` and `role`; enforces RBAC for each route | ASR-SEC-05 |
| **Rate-Limit Middleware** | `/api/*` | Redis `INCR`/`EXPIRE` sliding-window counter; returns HTTP 429 when threshold exceeded | ASR-SEC-15 |
| **Login-Lockout Module** | *(part of Auth)* | Writes `LoginAttempt` records; blocks IP after 5 failures in 15 min (Redis + PostgreSQL) | ASR-SEC-03 |
| **Input Validation (Zod)** | *(all routes)* | Zod schema middleware rejects malformed requests before reaching controllers | ASR-SEC-08 |
| **User Module** | `/api/users` | CRUD for user profiles; role-based permission enforcement | ASR-SEC-05 |
| **Courses Module** | `/api/courses` | Course CRUD with pagination; queries use indexed columns | ASR-PERF-02 |
| **Classes Module** | `/api/classes` | Class management, teacher assignment, enrolment operations | — |
| **Materials Module** | `/api/materials` | File upload pipeline: validate MIME + size → store outside web root; serve to enrolled students only | ASR-SEC-14 |
| **Assignments Module** | `/api/assignments` | Teacher: create/update/delete; Student: view assignments | — |
| **Submissions Module** | `/api/submissions` | Accepts student submissions (≤ 20 MB); streams files on download | ASR-SEC-14 |
| **Feedback Module** | `/api/feedback` | Teacher comments + numeric score on a submission | — |
| **Audit Module** | `/api/audit` | Admin-only `GET /api/audit/logs`; writes canonical log lines with timestamp + userId | ASR-SEC-10, ASR-SEC-11 |
| **Health Module** | `/api/health` | Returns HTTP 200; polled by Caddy and Docker health checks | ASR-AVAIL-01 |

### 4.2 Process View

The process view describes runtime behaviour through key interaction scenarios.

#### 4.2.1 User Authentication Flow (ASR-SEC-01, ASR-SEC-02, ASR-SEC-03)

```
Client          Caddy           Node.js API        PostgreSQL    Redis
  │               │                  │                  │          │
  │ POST /api/auth/login             │                  │          │
  │──────────────▶│                  │                  │          │
  │               │ HTTP forward     │                  │          │
  │               │─────────────────▶│                  │          │
  │               │                  │ SELECT LoginAttempt(ip)     │
  │               │                  │─────────────────▶│          │
  │               │                  │◀─────────────────│          │
  │               │                  │ [if blocked → 429]│          │
  │               │                  │ bcrypt.compare(pwd, hash)   │
  │               │                  │ sign accessToken(1h)         │
  │               │                  │ sign refreshToken             │
  │               │                  │ UPDATE User.refreshToken     │
  │               │                  │─────────────────▶│          │
  │               │                  │ DELETE LoginAttempt(ip)      │
  │               │                  │─────────────────▶│          │
  │               │  200 + httpOnly cookies              │          │
  │               │◀─────────────────│                  │          │
  │◀──────────────│                  │                  │          │
```

#### 4.2.2 Rate-Limited API Request (ASR-SEC-15)

```
Client          Caddy           Node.js API         Redis
  │               │                  │                 │
  │ GET /api/courses                 │                 │
  │──────────────▶│                  │                 │
  │               │─────────────────▶│                 │
  │               │              rateLimiter           │
  │               │                  │ INCR key(ip)   │
  │               │                  │────────────────▶│
  │               │                  │◀────────────────│
  │               │                  │ [if count > limit → 429]
  │               │                  │ authMiddleware (JWT verify)
  │               │                  │ controller logic │
  │               │  200 JSON         │                 │
  │               │◀─────────────────│                 │
  │◀──────────────│                  │                 │
```

#### 4.2.3 File Upload Flow (ASR-SEC-14)

```
Client (Teacher)  File Upload Component   Node.js API        File Volume
       │                  │                    │                  │
       │ Select file       │                    │                  │
       │─────────────────▶│                    │                  │
       │                  │ Validate MIME type │                  │
       │                  │ Check size ≤ 50 MB │                  │
       │                  │ [if invalid → show error]            │
       │                  │ POST /api/materials│                  │
       │                  │───────────────────▶│                  │
       │                  │                    │ multer middleware │
       │                  │                    │ size check ≤ 50 MB
       │                  │                    │ store to /app/uploads
       │                  │                    │─────────────────▶│
       │                  │                    │ INSERT Material  │
       │                  │  201 Created        │                  │
       │◀─────────────────│◀───────────────────│                  │
```

#### 4.2.4 Audit Log Write (ASR-SEC-10)

```
Request Handler      Audit Module       PostgreSQL (audit log)
       │                  │                      │
       │ [after key action]│                      │
       │ auditLog({        │                      │
       │   userId,         │                      │
       │   action,         │                      │
       │   resource,       │                      │
       │   outcome })      │                      │
       │─────────────────▶│                      │
       │                  │ INSERT AuditLog(...)  │
       │                  │──────────────────────▶│
       │                  │◀──────────────────────│
       │◀─────────────────│                      │
```

### 4.3 Deployment View

All services are orchestrated by **Docker Compose** (`docker-compose.yml`). The diagram below shows the container topology and network configuration.

```
Internet
   │  HTTPS :443
   ▼
┌────────────────────────────────────────────────────────────────────┐
│  Caddy 2 (caddy container)                                         │
│  • TLS termination (tls internal / ACME)                           │
│  • HTTP → HTTPS redirect                                           │
│  • encode gzip zstd                                                │
│  • Serves React SPA from /srv (static files)                       │
│  • lb_policy first  →  health_uri /api/health every 10 s           │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ /api/*  (Docker network: lms-net)
               ┌───────────────┴──────────────────┐
               │ active/passive failover           │
               ▼                                  ▼
┌──────────────────────┐              ┌──────────────────────┐
│  backend-primary     │              │  backend-secondary   │
│  Node.js 20 :8000    │              │  Node.js 20 :8000    │
│  Express + TypeScript│              │  Express + TypeScript│
│  health: /api/health │              │  health: /api/health │
└──────────┬───────────┘              └──────────┬───────────┘
           │                                     │
           └──────────────────┬──────────────────┘
                              │ shared services
            ┌─────────────────┼──────────────────────────┐
            │                 │                           │
            ▼                 ▼                           ▼
┌─────────────────┐  ┌────────────────┐     ┌─────────────────────┐
│  PostgreSQL 16  │  │   Redis 7      │     │   File Storage      │
│  (postgres-data │  │  (rate-limit   │     │   Docker volume:    │
│   volume)       │  │   counters,    │     │   /app/uploads      │
│  Prisma ORM     │  │   login lock,  │     │   (outside web root)│
│                 │  │   stats cache) │     │                     │
└─────────────────┘  └────────────────┘     └─────────────────────┘
```

#### Container Summary

| Container | Image | Exposed Port | Volumes | Health Check |
|-----------|-------|--------------|---------|--------------|
| `caddy` | `caddy:2` | 443 (HTTPS), 80 (redirect) | `/srv` (SPA build) | — |
| `backend-primary` | Custom Node.js 20 | 8000 (internal) | `server-logs`, uploads | `GET /api/health` every 10 s |
| `backend-secondary` | Custom Node.js 20 | 8000 (internal) | `server-logs`, uploads | `GET /api/health` every 10 s |
| `postgres` | `postgres:16` | 5432 (internal) | `postgres-data` | `pg_isready` every 10 s |
| `redis` | `redis:7` | 6379 (internal) | — | `redis-cli ping` every 10 s |

#### Start-up Dependency Chain

1. `postgres` → healthy (pg_isready passes)
2. `redis` → healthy (redis-cli ping passes)
3. `backend-primary` and `backend-secondary` → start only after `postgres` and `redis` are healthy
4. `caddy` → starts after both backend instances are healthy; polls `/api/health` every 10 s
5. On `backend-primary` health failure → Caddy promotes `backend-secondary` (ASR-AVAIL-01)

### 4.4 Data View

The data model is defined in `server/prisma/schema.prisma` and managed exclusively via Prisma migrations.

#### 4.4.1 Entity-Relationship Overview

```
User (id, email, password[bcrypt], name, role, refreshToken)
 │
 ├──< Enrollment >──┐      ← unique(userId, classId)
 │                  │
 │           Class (id, courseId, title, teacherId)
 │                  │                    │
 │           @@index(teacherId)          │
 │                  │                    │
 │                Course (id, title, description)
 │
 ├──< Submission >──┐      ← unique(assignmentId, userId)
                    │
              Assignment (id, title, classId, createdBy, dueDate, maxScore)
              @@index(createdBy)     │
                                     │
                              Feedback (id, submissionId, createdBy, comment, score)
                              @@index(createdBy)

Material (id, title, type, url, classId, createdBy)
@@index(classId), @@index(createdBy)

LoginAttempt (ip[PK], attempts, lastTry, blockedUntil)
```

#### 4.4.2 Model Descriptions

| Model | Purpose | Key Constraints |
|-------|---------|----------------|
| `User` | Accounts for all roles | `email` unique; `password` bcrypt-hashed (ASR-SEC-01); `refreshToken` nullable |
| `LoginAttempt` | IP-keyed brute-force counter | `ip` is the primary key (indexed by default); `blockedUntil` enforces lockout (ASR-SEC-03) |
| `Course` | Top-level catalogue entry | Cascade deletes to `Class` |
| `Class` | Session of a course with an assigned teacher | `@@index(teacherId)` for fast teacher queries (ASR-PERF-02) |
| `Enrollment` | Student ↔ Class M:M join | `@@unique([userId, classId])` prevents duplicate enrolment |
| `Assignment` | Teacher-created task | `@@index(createdBy)`; `dueDate` and `maxScore` fields |
| `Submission` | Student answer | `@@unique([assignmentId, userId])`; `status` enum: `PENDING/SUBMITTED/GRADED` |
| `Feedback` | Teacher score + comment on submission | `@@index(createdBy)` |
| `Material` | Learning resource (PDF, VIDEO, LINK, DOC) | `@@index(classId)`, `@@index(createdBy)` (ASR-PERF-02) |

#### 4.4.3 Audit Log Storage

Audit log entries are stored as JSON lines in daily files under the `AUDIT_LOG_DIR` path (mounted via the `server-logs` Docker volume). They are **not** stored in the PostgreSQL tables above. The `GET /api/audit/logs` endpoint (ADMIN only) reads and returns entries from these files.

Each entry follows the canonical wide-event format:

```json
{
  "timestamp": "2026-05-04T08:00:00.000Z",
  "userId": "clv1abc123",
  "action": "LOGIN_SUCCESS",
  "resource": "auth",
  "ip": "192.168.1.10",
  "outcome": "SUCCESS",
  "metadata": { "role": "STUDENT" }
}
```

---

## 5. Architecture Decisions

The following Architecture Decision Records (ADRs) document the key design choices and their rationale.

| ADR | Title | Status | Addressed ASRs |
|-----|-------|--------|---------------|
| [ADR-001](../add-diagram/ADR/ADR-001-caddy-load-balancing.md) | Caddy as Reverse Proxy, Load Balancer & TLS Terminator | **Accepted** | ASR-PERF-01, ASR-AVAIL-01, ASR-SEC-06 |
| [ADR-002](../add-diagram/ADR/ADR-002-jwt-auth-tokens.md) | JWT Access + Refresh Token Authentication | **Accepted** | ASR-SEC-01, ASR-SEC-02 |
| [ADR-003](../add-diagram/ADR/ADR-003-redis-rate-limiting.md) | Redis-Backed Rate Limiting & Login Lockout | **Accepted** | ASR-SEC-03, ASR-SEC-15 |
| [ADR-004](../add-diagram/ADR/ADR-004-postgresql-prisma.md) | PostgreSQL + Prisma ORM as Primary Data Store | **Accepted** | ASR-PERF-02, ASR-SEC-07, ASR-SEC-09 |
| [ADR-005](../add-diagram/ADR/ADR-005-rbac.md) | Role-Based Access Control with JWT Role Claims | **Accepted** | ASR-SEC-05 |
| [ADR-006](../add-diagram/ADR/ADR-006-file-storage.md) | Secure File Storage Outside Web Root | **Accepted** | ASR-SEC-14 |
| [ADR-007](../add-diagram/ADR/ADR-007-audit-logging.md) | Canonical Audit Logging with 1-Year Retention | **Accepted** | ASR-SEC-10, ASR-SEC-11 |

### ADR-001 Summary: Caddy as Entry Point

Caddy 2 serves as the single entry point for all inbound HTTPS traffic. It performs TLS termination, active/passive load balancing between `backend-primary` and `backend-secondary`, gzip/zstd compression, static SPA serving, and API health checking every 10 seconds. This single decision simultaneously satisfies ASR-PERF-01 (throughput), ASR-AVAIL-01 (failover), and ASR-SEC-06 (HTTPS).

### ADR-002 Summary: JWT Auth

Passwords are hashed with bcrypt (≥ 10 salt rounds). Authentication issues a short-lived JWT access token (1 h, stored in an `httpOnly` cookie) and a long-lived refresh token. The stateless access token design allows both API instances to validate tokens independently without a shared session store.

### ADR-003 Summary: Redis Rate Limiting

Redis `INCR`/`EXPIRE` sliding-window counters back the `rateLimiter` middleware, providing accurate cross-instance rate counting. Login lockout state is persisted in PostgreSQL `LoginAttempt` for durability. This separates ephemeral rate data (Redis) from durable lockout state (PostgreSQL).

### ADR-004 Summary: PostgreSQL + Prisma

PostgreSQL 16 is the sole relational store. Prisma ORM enforces parameterized queries throughout, eliminating SQL injection risk (ASR-SEC-09). Explicit `@@index` directives on `teacherId`, `classId`, and `createdBy` columns support sub-2-second paginated queries on 10 000+ records (ASR-PERF-02).

### ADR-005 Summary: RBAC

Three roles (`STUDENT`, `TEACHER`, `ADMIN`) are encoded in the JWT payload. The Auth Middleware verifies role claims on every protected route, ensuring 100 % RBAC coverage (ASR-SEC-05).

### ADR-006 Summary: Secure File Storage

Uploaded files are stored in a Docker volume mounted at `/app/uploads`, outside the Caddy web root. Files are served through the API (never via direct HTTP path), MIME type and file size are validated both client-side and server-side (ASR-SEC-14).

### ADR-007 Summary: Audit Logging

All security-sensitive actions emit a canonical wide-event log entry (timestamp, userId, action, resource, IP, outcome, metadata). Entries are written as JSON lines to daily files on the `server-logs` volume. `AUDIT_RETENTION_DAYS=365` satisfies the 1-year retention requirement (ASR-SEC-11).

---

## 6. Quality Attribute Analysis

### 6.1 Performance

#### ASR-PERF-01 – 500 Concurrent Users, < 2 s Response

**Tactic:** Horizontal scale + load balancing.

| Layer | Mechanism |
|-------|-----------|
| **Caddy** | Active/passive load balancer routes traffic to `backend-primary`; promotes `backend-secondary` on failure |
| **Response compression** | `encode gzip zstd` reduces payload size, freeing network bandwidth |
| **Stateless API** | No shared in-process state; any instance can handle any request without coordination |
| **Redis cache** | Aggregation results cached with 5-minute TTL; avoids repeated heavy DB queries |

**Benchmark results** (see `docs/asr-perf-01-results.csv`): Response time < 2 s under 500 concurrent simulated users validated.

#### ASR-PERF-02 – Paginated Queries on 10 000+ Records, < 2 s

**Tactic:** Database indexing + pagination.

| Mechanism | Detail |
|-----------|--------|
| `@@index(teacherId)` | Fast class-by-teacher queries |
| `@@index(createdBy)` | Fast assignment/material/feedback-by-teacher queries |
| `@@index(classId)` | Fast material-by-class queries |
| Pagination | All list endpoints expose `page` / `limit` query parameters |

**Benchmark results** (see `docs/asr-perf-02-results.csv`): Response time < 2 s for paginated queries on 10 000 records validated.

### 6.2 Availability

#### ASR-AVAIL-01 – ≥ 99.9 % Uptime (24/7)

**Tactic:** Redundancy + automatic failover.

| Mechanism | Detail |
|-----------|--------|
| Dual backend instances | `backend-primary` and `backend-secondary` run identically |
| Caddy health checking | Polls `backend-*:8000/api/health` every 10 s; removes failed instance from rotation |
| Docker `restart: unless-stopped` | Containers auto-restart after crashes |
| Service-healthy depends_on | Backends only start after DB and Redis are ready; prevents cold-start failures |

Planned downtime (maintenance windows) is handled by draining `backend-primary`, performing maintenance, then restoring — traffic flows via `backend-secondary` throughout.

### 6.3 Security

#### ASR-SEC-01 & ASR-SEC-02 – Authentication

Passwords are hashed using `bcrypt` with a minimum of 10 salt rounds at registration. Authentication returns a JWT access token (1 h expiry) and a refresh token, both stored in `httpOnly` cookies to prevent JavaScript XSS theft. The stateless access token design requires no cross-instance session synchronisation.

#### ASR-SEC-03 – Brute-Force Protection

The `LoginAttempt` PostgreSQL table records per-IP failure counts. After 5 failures within 15 minutes, the IP is blocked for the remainder of the lockout window (`LOCKOUT_TIME_MS = 900 000 ms`). On successful login, the record is deleted. Lockout state survives API restarts because it is database-persisted.

#### ASR-SEC-05 – Role-Based Access Control

Every protected API route passes through `Auth Middleware`, which verifies the JWT signature and extracts the `role` claim. Endpoint-specific guards (`requireStudent`, `requireTeacher`, `requireAdmin`) enforce RBAC before any business logic executes, guaranteeing 100 % coverage.

#### ASR-SEC-06 – HTTPS/TLS

Caddy terminates TLS for all inbound connections. For local development, `tls internal` generates a self-signed certificate. For production, Caddy automatically obtains and renews a certificate via ACME (Let's Encrypt). All inter-service traffic within the Docker network uses plain HTTP on the trusted internal network.

#### ASR-SEC-07 – Encryption at Rest

PostgreSQL data-at-rest encryption is enabled at the volume level (OS-level full-disk encryption or PostgreSQL tablespace encryption depending on deployment). Passwords are additionally protected by bcrypt hashing in the application layer — even if the database is compromised, passwords remain computationally infeasible to recover.

#### ASR-SEC-08 – Input Validation

Every API endpoint is guarded by a Zod schema middleware layer. Requests with invalid or missing fields are rejected with HTTP 400 before reaching the controller, preventing malformed data from entering the business logic or database.

#### ASR-SEC-09 – SQL Injection Prevention

Prisma ORM is the exclusive database access layer. Prisma compiles all queries to parameterized statements; no raw string interpolation of user input into SQL is permitted. This provides structural protection against SQL injection independent of application-layer input validation.

#### ASR-SEC-10 & ASR-SEC-11 – Audit Logging and Retention

The Audit Module writes a canonical wide-event log entry for every security-sensitive action (authentication events, file access, admin operations, enrolment events). Entries are append-only JSON lines stored in daily files on the `server-logs` volume. The `AUDIT_RETENTION_DAYS=365` environment variable drives a scheduled clean-up job that removes entries older than one year, satisfying the minimum retention requirement.

#### ASR-SEC-14 – File Upload Size Limits

Uploaded materials are limited to 50 MB and submissions to 20 MB. Limits are enforced at two layers:

1. **Client-side**: The File Upload Component checks the file size before initiating the HTTP request.
2. **Server-side**: The `fileSizeLimit` middleware (Multer configuration) rejects oversized payloads with HTTP 413 before the file reaches storage.

#### ASR-SEC-15 – API Rate Limiting

The `rateLimiter` middleware intercepts every request to `/api/*`. It uses a Redis `INCR`/`EXPIRE` sliding-window counter keyed by `<endpoint>/<client-IP>`. Requests exceeding the configured threshold (`RATE_LIMIT_MAX`, default 5 per `RATE_LIMIT_WINDOW_MS` ms) receive HTTP 429. Because Redis counters are shared across both API instances, the limit is accurate even under load balancing.

---

## 7. Risks and Technical Debt

| # | Risk / Debt | Severity | Mitigation / Recommendation |
|---|-------------|----------|------------------------------|
| R-01 | **Caddy is a single point of failure** for all inbound traffic. If Caddy fails, the entire system is inaccessible. | High | Consider clustering Caddy or placing it behind a managed cloud load balancer in production. |
| R-02 | **`lb_policy first`** (active/passive) means only one backend instance handles traffic at steady state; peak load may still exceed the capacity of one instance. | Medium | Switch to `lb_policy round_robin` for active/active load distribution; assess session-stickiness implications. |
| R-03 | **Redis failure** causes the `rateLimiter` middleware to fail open (all traffic is allowed through). This creates a window for DoS attacks during a Redis outage. | Medium | Implement a circuit-breaker pattern in the rate-limit middleware to fail closed with a graceful degradation policy. |
| R-04 | **JWT access tokens cannot be revoked before expiry** (no blacklist). A stolen token remains valid for up to 1 hour. | Medium | Introduce a token blacklist in Redis to enable immediate revocation on logout/password change. |
| R-05 | **Audit logs stored on a local Docker volume** — no off-site backup. A host disk failure could compromise log integrity. | Medium | Implement periodic export to append-only remote storage (S3, object store) as part of a backup strategy. |
| R-06 | **MFA for Admin accounts (ASR-SEC-04) is not yet implemented** (Status ≠ Done). Admins currently rely solely on password + JWT. | High | Implement TOTP-based MFA (e.g. via `speakeasy`) for the Admin role as a high-priority backlog item. |
| R-07 | **File malware scanning (ASR-SEC-12) and out-of-web-root storage (ASR-SEC-13) are not yet implemented** (Status ≠ Done). Uploaded files are not scanned. | High | Integrate a virus-scan step (e.g. ClamAV sidecar) into the Materials/Submissions upload pipeline before production deployment. |

---

## Appendix A – Glossary

| Term | Definition |
|------|-----------|
| **Access Token** | A short-lived JWT (1 h) that authorises individual API requests |
| **Audit Log** | An immutable, append-only record of security-sensitive system events |
| **bcrypt** | A password-hashing algorithm based on the Blowfish cipher, resistant to brute-force attacks |
| **Caddy** | An open-source HTTP server with automatic HTTPS, used as the reverse proxy and load balancer |
| **CUID** | Collision-resistant Unique Identifier generated by the `cuid` library, used as primary keys |
| **Docker Compose** | A tool for defining and running multi-container Docker applications |
| **Enrollment** | The relationship between a student (User) and a class, with status ACTIVE / COMPLETED / DROPPED |
| **httpOnly Cookie** | A cookie inaccessible to JavaScript, protecting tokens from XSS theft |
| **Prisma** | A TypeScript ORM that generates type-safe database clients from a schema file |
| **Rate Limiting** | Throttling the number of requests from a single source within a time window |
| **Refresh Token** | A long-lived token used to obtain new access tokens without re-authentication |
| **RBAC** | Role-Based Access Control — permissions are assigned to roles rather than individual users |
| **Redis** | An in-memory data structure store used for rate-limit counters and caching |
| **Zod** | A TypeScript-first schema validation library used for API input validation |

---

## Appendix B – ASR Traceability Matrix

The following table traces each **Done** ASR to the architectural elements that address it.

| ASR ID | Quality | Container(s) | Component(s) | ADR(s) |
|--------|---------|-------------|--------------|--------|
| ASR-PERF-01 | Performance | Caddy, Node.js API ×2 | Rate-Limit Middleware | ADR-001 |
| ASR-PERF-02 | Performance | PostgreSQL | Courses Module, Classes Module, Materials Module | ADR-004 |
| ASR-AVAIL-01 | Availability | Caddy, Node.js API ×2 | Health Module | ADR-001 |
| ASR-SEC-01 | Security | Node.js API | Auth Module | ADR-002 |
| ASR-SEC-02 | Security | Node.js API | Auth Module | ADR-002 |
| ASR-SEC-03 | Security | Node.js API, Redis, PostgreSQL | Login-Lockout Module, Rate-Limit Middleware | ADR-003 |
| ASR-SEC-05 | Security | Node.js API | Auth Middleware | ADR-005 |
| ASR-SEC-06 | Security | Caddy | — | ADR-001 |
| ASR-SEC-07 | Security | PostgreSQL | — | ADR-004 |
| ASR-SEC-08 | Security | Node.js API | Input Validation (Zod) | — |
| ASR-SEC-09 | Security | Node.js API, PostgreSQL | All DB-touching modules | ADR-004 |
| ASR-SEC-10 | Security | Node.js API, File Storage | Audit Module | ADR-007 |
| ASR-SEC-11 | Security | Node.js API, File Storage | Audit Module | ADR-007 |
| ASR-SEC-14 | Security | Node.js API, File Storage | Materials Module, Submissions Module, File Upload Component | ADR-006 |
| ASR-SEC-15 | Security | Node.js API, Redis | Rate-Limit Middleware | ADR-003 |
