student = person "Student" "Uses LMS features through HTTPS via the SPA and API."
teacher = person "Teacher" "Creates learning content and grades submissions via the LMS."
admin = person "Admin" "Monitors system health and reads audit logs through protected admin endpoints."

lms = softwareSystem "Learning Management System" "Node.js + React LMS deployed with Caddy, PostgreSQL, Redis, and audit log files." {
    caddy = container "Caddy Reverse Proxy" "Terminates TLS and reverse-proxies /api requests to backend-primary then backend-secondary using health checks." "Caddy"

    spa = container "React SPA" "Frontend served by Caddy." "React 18 + TypeScript + Vite" {
        fileUploadUi = component "File Upload UI" "Client-side upload form used for materials and submissions."
    }

    backendPrimary = container "Node.js API (backend-primary)" "Primary API instance." "Node.js 20 + Express + TypeScript" {
        healthRouter = component "Health Router" "GET /api/health checks PostgreSQL (SELECT 1) and Redis (PING)."
        rateLimitMiddleware = component "Rate-Limit Middleware" "Global /api limiter. Uses Redis INCR + EXPIRE and returns HTTP 429 when threshold is exceeded."
        authController = component "Auth Controller" "Handles login/register/refresh/logout endpoints."
        authService = component "Auth Service" "Tracks failed login attempts per IP and blocks after configured threshold/time window."
        uploadLimitMiddleware = component "Upload Size Limit Middleware" "Rejects oversized requests by Content-Length (materials 50MB, submissions 20MB)."
        materialsRoutes = component "Materials Routes" "Applies teacher/auth guards and 50MB upload limit middleware on create/update routes."
        submissionsRoutes = component "Submissions Routes" "Applies student/auth guards and 20MB upload limit middleware on create/update routes."
        auditRoute = component "Audit Route" "Admin-only GET /api/audit/logs endpoint."
        auditLogger = component "Audit Logger" "Writes JSONL audit entries to daily files and removes files older than configured retention days."
    }

    backendSecondary = container "Node.js API (backend-secondary)" "Secondary API instance. Same image and configuration as backend-primary for failover." "Node.js 20 + Express + TypeScript"

    postgres = container "PostgreSQL 16" "Primary relational database." "PostgreSQL" {
        loginAttemptTable = component "LoginAttempt table" "Stores attempts, blockedUntil, and lastTry by source IP for lockout enforcement."
    }

    redis = container "Redis 7" "Stores rate-limit counters and supports health checks." "Redis"

    auditLogStorage = container "Audit Log Files" "Daily JSONL log files stored under AUDIT_LOG_DIR (for example /app/logs/audit)." "Docker volume / filesystem"
}

student -> caddy "Uses LMS" "HTTPS"
teacher -> caddy "Uses LMS" "HTTPS"
admin -> caddy "Uses LMS" "HTTPS"

caddy -> spa "Serves frontend assets"
caddy -> backendPrimary "Reverse proxy /api (primary first)"
caddy -> backendSecondary "Failover target for /api when primary is unhealthy"
caddy -> backendPrimary.healthRouter "Health probe /api/health every 10s"
caddy -> backendSecondary "Health probe /api/health every 10s"

spa.fileUploadUi -> caddy "Calls /api/materials and /api/submissions" "HTTPS"

backendPrimary.healthRouter -> postgres "Prisma SELECT 1"
backendPrimary.healthRouter -> redis "PING"
backendPrimary.rateLimitMiddleware -> redis "INCR + EXPIRE per endpoint/IP"
backendPrimary.authController -> backendPrimary.authService "Delegates login flow"
backendPrimary.authService -> postgres.loginAttemptTable "R/W failed login attempts"
backendPrimary.materialsRoutes -> backendPrimary.uploadLimitMiddleware "Enforces 50MB material limit"
backendPrimary.submissionsRoutes -> backendPrimary.uploadLimitMiddleware "Enforces 20MB submission limit"
backendPrimary.auditRoute -> backendPrimary.auditLogger "Reads audit logs for admin response"
backendPrimary.auditLogger -> auditLogStorage "Append JSONL + cleanup by retention"
