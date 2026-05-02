# ADR-005: Role-Based Access Control with JWT Role Claims

**Status:** Accepted  
**Date:** 2026-05-02  
**ASR:** ASR-SEC-04, ASR-SEC-05  

---

## Context

The LMS serves three distinct user roles with fundamentally different permissions:

| Role | Permissions |
|------|------------|
| `STUDENT` | Enrol in classes, view materials, submit assignments, view own feedback. |
| `TEACHER` | Create/manage classes, upload materials, create/grade assignments. |
| `ADMIN` | All of the above, plus: manage users, view audit logs, access statistics. **Requires MFA** (ASR-SEC-04). |

**Requirements:**

- **100 % of requests** must be checked for authorisation before any business logic executes (ASR-SEC-05).  
- Admin accounts must require **multi-factor authentication** before accessing admin-only functionality (ASR-SEC-04).  
- Authorisation must work across **two stateless API instances** without shared session state.  

---

## Decision

**Embed the user's role in the JWT access token payload, and enforce role checks in dedicated Auth Middleware applied per-route.**

### Role Storage

```prisma
enum UserRole {
    STUDENT
    TEACHER
    ADMIN
}

model User {
    role UserRole @default(STUDENT)
    ...
}
```

### JWT Payload

```json
{
  "userId": "<cuid>",
  "role": "STUDENT | TEACHER | ADMIN",
  "iat": <timestamp>,
  "exp": <timestamp>
}
```

### Middleware Chain

Every protected route applies at least `AuthMiddleware.authenticateUser`, which:

1. Reads `accessToken` from the `httpOnly` cookie.  
2. Verifies the JWT signature using `AUTH_SECRET`.  
3. Decodes `userId` and `role`; attaches them to `req`.  
4. Calls `next()` on success; returns HTTP 401 on failure.  

Role-specific gates are composed on top:

| Middleware | Allowed Roles |
|-----------|--------------|
| `AuthMiddleware.requireAdmin` | `ADMIN` |
| `AuthMiddleware.requireTeacher` | `TEACHER`, `ADMIN` |
| `authGuard` (generic) | Any authenticated user |
| `roleGuard(["ADMIN", "TEACHER"])` | Configurable list |

### MFA for Admins (ASR-SEC-04)

Admin-sensitive routes (e.g. `GET /api/audit/logs`) require both `authenticateUser` **and** `requireAdmin`. The MFA challenge is initiated at login time for `ADMIN` role users: a one-time code is sent to the registered e-mail; the admin must submit the code before receiving the JWT pair. This is enforced in `AuthService.login` when `user.role === 'ADMIN'`.

---

## Consequences

### Positive

- Stateless role claims allow both API instances to enforce RBAC independently—no centralised authorisation service needed.  
- Middleware composition makes it trivial to add or remove role requirements per route without touching business logic.  
- `@@index([teacherId])`, `@@index([createdBy])` in the schema allow fast per-teacher queries without denormalisation.  
- Role is stored in the database; changing a user's role takes effect on their next login (token re-issue).  

### Negative / Trade-offs

- Role changes do not take effect immediately (access token must expire or be refreshed). Mitigation: short (1 h) access token TTL.  
- JWT role claims are not encrypted (only signed); the role value is visible in the base64-decoded payload. The `httpOnly` cookie prevents JavaScript access, reducing exposure.  
- MFA implementation requires the Email Service to be operational; failure to deliver the OTP blocks admin login.  

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| **ACL (Access Control List) per resource** | Overly granular for the three-role model; significant performance overhead for 100 % request checks. |
| **Centralised policy service (OPA / Casbin)** | Over-engineered for a three-role model; introduces a network hop per request, conflicting with < 2 s latency target (ASR-PERF-01). |
| **Database-lookup per request for role** | Extra DB query on every request; latency and load concern under 500 concurrent users (ASR-PERF-01). |
