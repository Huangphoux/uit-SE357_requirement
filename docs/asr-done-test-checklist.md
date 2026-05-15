# ASR Done Test Checklist

Source of truth for Done rows:
- [SE356-ASR.xlsx - ASR.csv](SE356-ASR.xlsx%20-%20ASR.csv)

Done ASRs:
- ASR-PERF-01
- ASR-PERF-02
- ASR-AVAIL-01
- ASR-SEC-01
- ASR-SEC-02
- ASR-SEC-03
- ASR-SEC-05
- ASR-SEC-06
- ASR-SEC-07
- ASR-SEC-08
- ASR-SEC-09
- ASR-SEC-10
- ASR-SEC-11
- ASR-SEC-14
- ASR-SEC-15

## 0) Test Environment Setup

1. Start stack
   - docker compose up -d --build
2. Verify containers
   - docker compose ps
3. Base URLs
   - API: http://localhost:8000
   - Swagger: http://localhost:8000/docs

## 1) ASR-PERF-01 (500 concurrent users, response < 2s)

Use existing benchmark:
- [benchmark-asr-perf-01.js](benchmark-asr-perf-01.js)

Command:
- node benchmark-asr-perf-01.js

Evidence:
- Generated CSV: [docs/asr-perf-01-results.csv](docs/asr-perf-01-results.csv)
- Console JSON summary

Pass criteria:
- Success rate close to 100%
- Average and P95 response time under 2000ms

## 2) ASR-PERF-02 (10k records, response < 2s)

Use existing benchmark:
- [benchmark-asr-perf-02.js](benchmark-asr-perf-02.js)

Command:
- node benchmark-asr-perf-02.js

Evidence:
- Generated CSV: [docs/asr-perf-02-results.csv](docs/asr-perf-02-results.csv)

Pass criteria:
- Query samples for paginated list operations are under 2000ms

## 3) ASR-AVAIL-01 (99.9% + failover)

Reference:
- [k8s/base/backend.yaml](k8s/base/backend.yaml)
- [k8s/base/primary-service.yaml](k8s/base/primary-service.yaml)
- [server/leader-elector.js](server/leader-elector.js)
- [k8s/scripts/asr-avail-01.ps1](k8s/scripts/asr-avail-01.ps1)

Procedure:
1. Deploy Kubernetes baseline and verify backend has exactly 2 ready pods
   - kubectl get deploy backend -n uit-se357
   - kubectl get pods -n uit-se357 -l app=backend -o wide
2. Identify current primary via `primary-backend` endpoints
   - kubectl get endpoints primary-backend -n uit-se357 -o wide
3. Run the automated failover check script
   - powershell -ExecutionPolicy Bypass -File .\k8s\scripts\asr-avail-01.ps1
4. (Optional manual validation) continuously hit `/api/health` through ingress while failover runs
   - for /L %i in (1,1,60) do @curl -s -o nul -w "%{http_code}\n" http://uit-se357.local/api/health

Pass criteria:
- Always 2 backend pods are maintained by Kubernetes (steady state and after failover)
- Exactly one pod is selected as current primary (via `primary-backend` endpoints)
- When the primary pod stops, the standby pod is promoted to primary
- Kubernetes automatically creates a new standby pod to return to 2 ready pods

## 4) ASR-SEC-01 (password policy + bcrypt rounds >= 10)

Reference:
- [server/src/auth/auth.route.ts](server/src/auth/auth.route.ts)

Procedure:
1. Register user with weak password (expect reject)
2. Register user with valid strong password (expect success)
3. Query DB user record and verify password is hashed
   - docker compose exec db psql -U postgres -d uit_se357 -c "select email, password from \"User\" where email='test_asr1@example.com';"

Pass criteria:
- Weak password blocked
- Stored password is not plaintext and appears bcrypt format

## 5) ASR-SEC-02 (JWT auth, 1h expiry, login < 2s)

Reference:
- [server/src/auth/auth.route.ts](server/src/auth/auth.route.ts)

Procedure:
1. Measure login latency (PowerShell)
   - Measure-Command { Invoke-WebRequest -Method Post -Uri http://localhost:8000/api/auth/login -ContentType "application/json" -Body '{"email":"test_asr1@example.com","password":"Password123!"}' -SessionVariable s }
2. Inspect Set-Cookie and/or token expiry fields from response headers/body

Pass criteria:
- Login response under 2s
- JWT expiry configured to 1 hour (or config value matching project policy)

## 6) ASR-SEC-03 (block after 5 failed logins in 15 min)

Procedure:
1. Send 6 failed login attempts from same client IP
2. Record status codes/messages

Example:
- 1..6 | % { try { Invoke-WebRequest -Method Post -Uri http://localhost:8000/api/auth/login -ContentType "application/json" -Body '{"email":"test_asr1@example.com","password":"WrongPass123!"}' } catch { $_.Exception.Response.StatusCode.value__ } }

Pass criteria:
- After threshold, responses show lockout behavior
- Lockout duration aligns with 15 minutes policy

## 7) ASR-SEC-05 (RBAC checks)

Reference:
- [add-diagram/ADR/ADR-005-rbac.md](add-diagram/ADR/ADR-005-rbac.md)

Procedure:
1. Login as STUDENT and call admin-only endpoint (for example audit logs)
2. Login as ADMIN and call same endpoint

Pass criteria:
- STUDENT gets forbidden/unauthorized
- ADMIN gets success

## 8) ASR-SEC-06 (HTTPS/TLS everywhere)

Reference:
- [Caddyfile](Caddyfile)

Procedure:
1. Run stack with TLS reverse proxy on host 443
2. Verify http redirects to https and API/docs accessible via https

Pass criteria:
- 100% client traffic through https endpoints

Note:
- Current compose setup in this workspace exposes HTTP on host (80/8000/8001). If strict HTTPS validation is required, enable root Caddy TLS entrypoint on host 443 first.

## 9) ASR-SEC-07 (sensitive data encrypted at rest)

Procedure:
1. Verify app-level sensitive data protection (password hashing already covered in SEC-01)
2. Verify infrastructure-level at-rest encryption policy for database storage

Pass criteria:
- Sensitive app data (passwords) not stored plaintext
- Storage encryption policy documented/enforced in deployment platform

## 10) ASR-SEC-08 (input validation)

Reference:
- [server/src/auth/auth.route.ts](server/src/auth/auth.route.ts)

Procedure:
1. Send malformed payloads (missing required fields, wrong types)
2. Observe validation errors

Pass criteria:
- Invalid requests rejected with 4xx
- Controllers are not executed for invalid payloads

## 11) ASR-SEC-09 (parameterized queries)

Reference:
- [docs/SAD.md](docs/SAD.md#L177)

Procedure:
1. Attempt SQL injection strings in login/search fields
2. Verify no SQL execution side effects and normal safe error behavior
3. Review data access layer uses Prisma methods instead of raw string SQL

Pass criteria:
- Injection payloads do not alter query semantics
- No leaked SQL errors or unauthorized data access

## 12) ASR-SEC-10 (audit logging for key actions)

Reference:
- [docs/SAD.md](docs/SAD.md#L214)

Procedure:
1. Perform key actions: login/logout/admin access/file action
2. Query audit logs endpoint as ADMIN

Pass criteria:
- Entries contain timestamp, actor/user id, action, outcome

## 13) ASR-SEC-11 (audit retention >= 1 year)

Procedure:
1. Verify retention config
   - check AUDIT_RETENTION_DAYS in env
2. Verify logs endpoint can return historical data within retention window

Pass criteria:
- Retention set to >= 365 days
- Historical logs accessible for retained period

## 14) ASR-SEC-14 (upload limits 50MB materials, 20MB submissions)

Procedure:
1. Try upload just below and just above each threshold
2. Validate status code and error message

Pass criteria:
- Materials > 50MB rejected
- Submissions > 20MB rejected

## 15) ASR-SEC-15 (rate limiting on login + API)

Reference:
- [server/src/middlewares/rateLimit.ts](server/src/middlewares/rateLimit.ts)

Procedure:
1. Send burst requests to API/login endpoint from same source
2. Observe transition to 429 after configured threshold

Pass criteria:
- Rate limiting consistently enforced on targeted endpoints
- Resets according to configured window

## Test Record Template

For each ASR, record:
- Date/time
- Environment (local docker, branch, commit)
- Command(s)
- Actual output/status
- Pass/Fail
- Evidence file or screenshot path
