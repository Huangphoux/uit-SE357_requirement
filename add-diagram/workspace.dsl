/*
 * C4 Model – UIT SE357 Learning Management System
 * Structurizr DSL
 *
 * ASR coverage (Status = Done):
 *   ASR-PERF-01, ASR-PERF-02, ASR-PERF-03
 *   ASR-AVAIL-01, ASR-AVAIL-02
 *   ASR-SEC-01 … ASR-SEC-15
 *   ASR-NOTIF-01, ASR-FILE-01, ASR-AGGR-01, ASR-ENROLL-01
 */

workspace "UIT SE357 – Learning Management System" "C4 architecture model for the LMS platform" {

    model {

        /* ─────────────────────────────────────────────
           External Actors
        ───────────────────────────────────────────── */
        student = person "Student" "Enrolled student who views course materials, submits assignments, and receives feedback."
        teacher = person "Teacher" "Instructor who creates courses/classes, uploads materials, creates assignments, and grades submissions."
        admin   = person "Admin"   "Platform administrator who manages users, views audit logs, and monitors system health. Requires MFA (ASR-SEC-04)."

        emailService = softwareSystem "Email Service (SMTP)" "External SMTP relay used to deliver notification e-mails (e.g. Gmail SMTP). Used by ASR-NOTIF-01." "External"

        /* ─────────────────────────────────────────────
           Software System
        ───────────────────────────────────────────── */
        lms = softwareSystem "Learning Management System" "Web-based LMS that enables course management, material sharing, assignment submission, grading, and auditing." {

            /* ── Layer 2 : Containers ── */

            caddy = container "Caddy Reverse Proxy" "Handles HTTPS/TLS termination (ASR-SEC-06), gzip/zstd compression (ASR-PERF-01), static-file serving for the SPA, and active/passive load balancing across two backend instances (ASR-PERF-01, ASR-AVAIL-01). Health-checks /api/health every 10 s." "Caddy 2" "Infrastructure"

            spa = container "React SPA" "Browser-based single-page application. Provides role-specific dashboards for Students, Teachers, and Admins. Built with React 18 + TypeScript + Vite." "React / TypeScript / Vite" {
                /* ── Layer 3 : Frontend Components ── */
                authCtx      = component "Auth Context"        "Manages JWT access-token storage (httpOnly cookie), refresh-token flow, and authentication state across the app."
                loginPage    = component "Login Page"          "Validates input (ASR-SEC-08), submits credentials, and handles lock-out messaging (ASR-SEC-03)."
                studentDash  = component "Student Dashboard"   "Lists enrolled classes, upcoming assignments, and recent materials."
                teacherDash  = component "Teacher Dashboard"   "Manages classes, uploads materials, creates and grades assignments."
                adminDash    = component "Admin Dashboard"     "Views platform statistics with 5-min cached aggregations (ASR-AGGR-01), manages users, browses audit logs."
                coursePage   = component "Course / Class Pages" "Enrolment UI for students; class management for teachers."
                assignPage   = component "Assignment Pages"    "Assignment creation (teacher) and submission (student) with file-upload support (ASR-FILE-01)."
                materialPage = component "Material Pages"      "Upload and view learning materials (PDF, VIDEO, LINK, DOC). Enforces 50 MB size limit client-side (ASR-SEC-14)."
                notifHub     = component "Notification Hub"    "Displays real-time in-app notifications delivered by the backend notification queue (ASR-NOTIF-01)."
                fileUpload   = component "File Upload Component" "Validates file type and size before upload; shows progress indicator."
            }

            api = container "Node.js API" "Stateless RESTful API that implements all business logic. Two identical instances run behind Caddy for HA (ASR-AVAIL-01). Exposes /docs (Swagger UI)." "Node.js 20 / Express / TypeScript" {
                /* ── Layer 3 : Backend Components ── */
                authMod      = component "Auth Module"         "Registration with bcrypt (salt ≥ 10, ASR-SEC-01), JWT access+refresh tokens (1 h / configurable, ASR-SEC-02), logout, token refresh."
                authMiddle   = component "Auth Middleware"     "Verifies JWT on every protected route. Extracts userId + role for downstream RBAC checks (ASR-SEC-05)."
                rateMid      = component "Rate-Limit Middleware" "Redis-backed sliding-window counter. Blocks IP after configurable threshold on all /api/* routes (ASR-SEC-15, ASR-SEC-03)."
                lockoutMod   = component "Login-Lockout Module" "Tracks failed login attempts per IP in PostgreSQL (LoginAttempt model). Blocks after 5 failures in 15 min (ASR-SEC-03)."
                userMod      = component "User Module"         "CRUD for user accounts. Enforces RBAC roles: STUDENT / TEACHER / ADMIN (ASR-SEC-05)."
                courseMod    = component "Courses Module"      "Course CRUD with pagination and indexed queries (ASR-PERF-02)."
                classMod     = component "Classes Module"      "Class management; teacher assignment; enrollment check."
                materialMod  = component "Materials Module"    "Upload, store (outside web root, ASR-SEC-13), validate file type whitelist (ASR-SEC-12), enforce 50 MB limit (ASR-SEC-14), serve materials."
                assignMod    = component "Assignments Module"  "Assignment CRUD. Handles 500 concurrent enrollment-period submissions (ASR-ENROLL-01)."
                submitMod    = component "Submissions Module"  "Student submission storage with 20 MB file limit (ASR-SEC-14). Supports 500 concurrent downloads (ASR-FILE-01)."
                feedbackMod  = component "Feedback Module"     "Teacher feedback and score on submissions."
                auditMod     = component "Audit Module"        "Writes canonical audit events for auth, file access, and admin actions (ASR-SEC-10). Admin-only read endpoint. Log retention ≥ 1 year (ASR-SEC-11)."
                notifMod     = component "Notification Module" "Queues and delivers notifications to up to 500 recipients in < 1 min via Email Service (ASR-NOTIF-01)."
                aggrMod      = component "Aggregation / Stats Module" "Computes platform statistics. Results cached in Redis for 5 min (ASR-AGGR-01). Response < 5 s for 10 000+ records."
                inputValid   = component "Input Validation (Zod)" "Zod schemas sanitise and validate all incoming request bodies (ASR-SEC-08). Applied as middleware before each controller."
            }

            db      = container "PostgreSQL 16"  "Primary relational database. Stores users, courses, classes, enrolments, assignments, submissions, feedback, materials, login attempts. Uses parameterized queries via Prisma ORM (ASR-SEC-09). Indexed for performance (ASR-PERF-02)." "PostgreSQL 16 / Prisma ORM" "Database"
            redis   = container "Redis 7"         "In-memory store for: (1) rate-limit counters (ASR-SEC-15, ASR-SEC-03), (2) aggregation caches with 5-min TTL (ASR-AGGR-01), (3) session-level data. Provides sub-ms latency." "Redis 7" "Cache"
            storage = container "File Storage"    "Server filesystem volume mounted at /app/uploads, located outside the web root to prevent direct HTTP access (ASR-SEC-13). Stores materials (≤ 50 MB) and submissions (≤ 20 MB). Supports 500 concurrent downloads via Caddy (ASR-FILE-01)." "Docker Volume / Server FS" "Storage"
        }

        /* ─────────────────────────────────────────────
           Relationships – Level 1 (System Context)
        ───────────────────────────────────────────── */
        student -> lms "Views courses, downloads materials, submits assignments" "HTTPS"
        teacher -> lms "Manages courses, uploads materials, grades submissions" "HTTPS"
        admin   -> lms "Administers users, views audit logs, monitors health" "HTTPS"
        lms     -> emailService "Sends notification e-mails" "SMTP/TLS"

        /* ─────────────────────────────────────────────
           Relationships – Level 2 (Container)
        ───────────────────────────────────────────── */
        student -> caddy "HTTPS requests" "HTTPS/TLS"
        teacher -> caddy "HTTPS requests" "HTTPS/TLS"
        admin   -> caddy "HTTPS requests" "HTTPS/TLS"

        caddy -> spa "Serves static assets (index.html, JS, CSS)" "HTTP"
        caddy -> api "Reverse-proxies /api/* with active/passive LB (backend-primary → backend-secondary)" "HTTP (internal)"

        spa   -> caddy "API calls via fetch/axios" "HTTPS"
        api   -> db      "Reads & writes via Prisma ORM (parameterized queries, ASR-SEC-09)" "TCP/5432"
        api   -> redis   "Rate-limit counters, aggregation cache, session data" "TCP/6379"
        api   -> storage "Stores and retrieves uploaded files (outside web root, ASR-SEC-13)" "File I/O"
        api   -> emailService "Sends SMTP notifications (ASR-NOTIF-01)" "SMTP/587"

        /* ─────────────────────────────────────────────
           Relationships – Level 3 (SPA Components)
        ───────────────────────────────────────────── */
        loginPage    -> authCtx     "Updates auth state after login/logout"
        studentDash  -> coursePage  "Navigates to class detail"
        studentDash  -> assignPage  "Views and submits assignments"
        studentDash  -> materialPage "Views materials"
        teacherDash  -> coursePage  "Manages classes"
        teacherDash  -> assignPage  "Creates / grades assignments"
        teacherDash  -> materialPage "Uploads materials"
        adminDash    -> coursePage  "Views all courses/classes"
        assignPage   -> fileUpload  "Delegates file attachment"
        materialPage -> fileUpload  "Delegates file upload"
        notifHub     -> authCtx     "Reads userId for notification polling"

        authCtx      -> api "POST /api/auth/login, /refresh, /logout" "HTTPS"
        loginPage    -> api "POST /api/auth/login" "HTTPS"
        studentDash  -> api "GET /api/courses, /classes, /enrollments" "HTTPS"
        teacherDash  -> api "GET/POST/PUT /api/courses, /classes, /assignments" "HTTPS"
        adminDash    -> api "GET /api/audit/logs, /api/users" "HTTPS"
        coursePage   -> api "GET/POST /api/courses, /classes, /enrollments" "HTTPS"
        assignPage   -> api "GET/POST/PUT /api/assignments, /submissions" "HTTPS"
        materialPage -> api "GET/POST /api/materials" "HTTPS"
        notifHub     -> api "GET /api/notifications (polling)" "HTTPS"

        /* ─────────────────────────────────────────────
           Relationships – Level 3 (API Components)
        ───────────────────────────────────────────── */
        authMiddle  -> authMod     "Verifies JWT; delegates token logic"
        rateMid     -> redis       "INCR / EXPIRE rate-limit keys"
        lockoutMod  -> db          "R/W LoginAttempt records"
        authMod     -> db          "R/W User (credentials, refreshToken)"
        authMod     -> lockoutMod  "Checks / resets login-attempt counter"
        userMod     -> db          "CRUD User records"
        courseMod   -> db          "CRUD Course records (paginated, indexed)"
        classMod    -> db          "CRUD Class + Enrollment records"
        materialMod -> db          "CRUD Material records"
        materialMod -> storage     "Write/read uploaded files"
        assignMod   -> db          "CRUD Assignment records"
        submitMod   -> db          "CRUD Submission records"
        submitMod   -> storage     "Write/read submission files"
        feedbackMod -> db          "CRUD Feedback records"
        auditMod    -> db          "INSERT audit-log records (ASR-SEC-10)"
        notifMod    -> emailService "SMTP send via Nodemailer"
        aggrMod     -> db          "Aggregate queries"
        aggrMod     -> redis       "Cache aggregation results (5-min TTL)"
        inputValid  -> authMod     "Validates auth request bodies"
        inputValid  -> userMod     "Validates user request bodies"
        inputValid  -> courseMod   "Validates course request bodies"
        inputValid  -> materialMod "Validates material request bodies"
        inputValid  -> assignMod   "Validates assignment request bodies"
        inputValid  -> submitMod   "Validates submission request bodies"
    }

    /* ─────────────────────────────────────────────
       Views
    ───────────────────────────────────────────── */
    views {

        systemContext lms "SystemContext" "Level 1 – System Context: who uses the LMS and which external systems it integrates with." {
            include *
            autoLayout lr
        }

        container lms "Containers" "Level 2 – Container diagram: major deployable units and data stores." {
            include *
            autoLayout lr
        }

        component spa "SPA_Components" "Level 3 – React SPA components and their interactions with the API." {
            include *
            autoLayout tb
        }

        component api "API_Components" "Level 3 – Node.js API components, their responsibilities, and ASR coverage." {
            include *
            autoLayout tb
        }

        /* ── Styles ── */
        styles {
            element "Person" {
                shape Person
                background #08427b
                color #ffffff
            }
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "External" {
                background #999999
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Component" {
                background #85bbf0
                color #000000
            }
            element "Database" {
                shape Cylinder
                background #438dd5
                color #ffffff
            }
            element "Cache" {
                shape Cylinder
                background #e67e22
                color #ffffff
            }
            element "Storage" {
                shape Folder
                background #27ae60
                color #ffffff
            }
            element "Infrastructure" {
                background #6c757d
                color #ffffff
            }
            relationship "Relationship" {
                dashed false
            }
        }

        /* ── Themes ── */
        theme default
    }
}
