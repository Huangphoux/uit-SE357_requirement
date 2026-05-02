# ADR-002: JWT Access + Refresh Token Authentication

**Status:** Accepted  
**Date:** 2026-05-02  
**ASR:** ASR-SEC-01, ASR-SEC-02  

---

## Context

The LMS requires a stateless, scalable authentication mechanism across two identical API instances.  
Key constraints:

- **Password storage** must be secure: minimum 8 characters, upper/lower/digit mix, `bcrypt` salt rounds ≥ 10 (ASR-SEC-01).  
- **Session tokens** must expire within 1 hour to limit exposure from token theft; the login response itself must complete within 2 seconds (ASR-SEC-02).  
- The architecture uses **two stateless API instances** — any token issued by one instance must be verifiable by the other without shared in-memory state.  

---

## Decision

**Use a JWT Access + Refresh Token pair.**

| Token | Storage | Expiry | Purpose |
|-------|---------|--------|---------|
| **Access Token** | `httpOnly` cookie (`accessToken`) | 1 hour (configurable via `AUTH_SECRET_EXPIRES_IN`) | Authorises each API request |
| **Refresh Token** | `httpOnly` cookie + stored in `User.refreshToken` (hashed reference) | Configurable (default: `AUTH_REFRESH_SECRET_EXPIRES_IN`) | Obtains a new access token without re-login |

**Password hashing:** `bcrypt` with a minimum of **10 salt rounds** is applied at registration (`AuthService.register`).

**Login flow:**

1. Client sends `POST /api/auth/login` with email + password.  
2. Server checks `LoginAttempt` table for IP lockout (ASR-SEC-03).  
3. `bcrypt.compare` validates the password.  
4. On success: issue access token + refresh token; set both as `httpOnly` cookies; store refresh token reference in `User.refreshToken`.  
5. On failure: increment `LoginAttempt` counter.  

**Refresh flow:** `POST /api/auth/refresh` — verify refresh token, issue new access token.  
**Logout:** `POST /api/auth/logout` — nullify `User.refreshToken`; clear cookies.

---

## Consequences

### Positive

- Stateless access tokens allow both API instances to independently validate requests using the shared `AUTH_SECRET`—no shared session store needed.  
- Short (1 h) access token TTL minimises the blast radius of token leakage.  
- Refresh token stored server-side (DB reference) enables token revocation on logout.  
- `httpOnly` cookies prevent JavaScript XSS token theft.  

### Negative / Trade-offs

- Revocation of access tokens before expiry is not instant (requires blacklist or very short TTL); current design accepts this trade-off given the 1 h expiry.  
- Storing the refresh token in the database creates a write on every login—acceptable given low login frequency.  
- `AUTH_SECRET` is a shared secret across both instances; it must be rotated carefully and never committed to source control (stored in `.env`).  

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| **Session-based auth (server-side)** | Requires shared session store (e.g. Redis) across instances; adds latency; contradicts stateless design. |
| **OAuth 2.0 / OIDC (external IdP)** | Over-engineered for the current scope; no third-party identity provider requirement. |
| **Opaque tokens** | Cannot be validated without a token-introspection endpoint—adds latency and a centralised dependency. |
