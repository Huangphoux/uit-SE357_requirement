# ADR-003: Redis-Backed Rate Limiting & Login Lockout

**Status:** Accepted  
**Date:** 2026-05-02  
**ASR:** ASR-SEC-03, ASR-SEC-15  

---

## Context

The LMS must defend against two related but distinct attack vectors:

1. **Brute-force login attacks** – an attacker tries many passwords against the same account (ASR-SEC-03): block the source IP after **5 failures within 15 minutes**.  
2. **API abuse / DDoS** – excessive requests from any single IP must be rate-limited across **all `/api/*` endpoints** (ASR-SEC-15).  

Because two API instances run in parallel behind Caddy, any counter stored in-process would be split between instances, underestimating actual request rates. A **shared, low-latency store** is required.

---

## Decision

**Use Redis 7 as the backing store for both rate limiting and login lockout.**

### API Rate Limiter (`rateLimiter` middleware)

Implemented in `server/src/middlewares/rateLimit.ts`:

```
For each request to /api/*:
  key  = "<endpoint>/<client-ip>"
  n    = INCR key
  if n == 1: EXPIRE key <window_seconds>
  if n >  limit: return HTTP 429
```

Configuration (via `.env`):

| Variable | Default | Meaning |
|----------|---------|---------|
| `RATE_LIMIT_WINDOW_MS` | 60 000 ms | Sliding window duration |
| `RATE_LIMIT_MAX` | 5 | Max requests per window per IP |

### Login Lockout

Implemented in `AuthService.login` using the `LoginAttempt` PostgreSQL model:

```
On login failure:
  Upsert LoginAttempt { ip } → attempts++
  if attempts >= MAX_LOGIN_ATTEMPTS:
    blockedUntil = now() + LOCKOUT_TIME_MS

On login attempt:
  if blockedUntil > now(): throw "Too many failed attempts"
  
On login success:
  Delete LoginAttempt { ip }
```

Configuration:

| Variable | Default | Meaning |
|----------|---------|---------|
| `MAX_LOGIN_ATTEMPTS` | 5 | Failures before lockout |
| `LOCKOUT_TIME_MS` | 900 000 ms (15 min) | Lockout duration |

**Redis** handles the API rate-limit counters (ephemeral, high-throughput).  
**PostgreSQL** persists the login lockout state (durable, lower frequency).

---

## Consequences

### Positive

- Redis counters are shared across both API instances → accurate request counts even under load balancing.  
- Redis `INCR` + `EXPIRE` is an atomic, O(1) operation; negligible latency overhead per request.  
- Lockout state survives API restart (persisted in PostgreSQL).  
- Decoupled configuration allows independent tuning of API rate limits vs. login lockout.  

### Negative / Trade-offs

- Redis is an additional infrastructure dependency; if Redis is unavailable, the middleware must decide whether to fail open (allow all traffic) or fail closed (block all traffic). Current implementation fails open to avoid self-DDoS.  
- IP-based blocking can inadvertently affect users behind NAT or a shared proxy.  
- Lockout stored in the database means a full table-scan risk at scale; mitigated by `LoginAttempt.ip` being the primary key (indexed).  

---

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| **In-process memory counter** | State is not shared across two API instances; Caddy restores health causing counter reset. |
| **`express-rate-limit` with in-memory store** | Same split-state problem; not suitable for multi-instance deployments. |
| **Database-only rate limiting** | Latency of a DB write per request would degrade performance (ASR-PERF-01). |
