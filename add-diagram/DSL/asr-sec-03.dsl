workspace "ASR-SEC-03 - Brute-force Protection" "C4 views for login lockout and API rate limiting." {
    !identifiers hierarchical

    model {
        !include model.dsl
    }

    views {
        container lms "ASR_SEC_03_Containers" "ASR-SEC-03: API traffic is rate-limited with Redis and login attempts are locked out using PostgreSQL records." {
            include student
            include teacher
            include admin
            include caddy
            include backendPrimary
            include redis
            include postgres
            autoLayout lr
        }

        component backendPrimary "ASR_SEC_03_AuthRate_Component" "ASR-SEC-03: Auth Controller + Auth Service enforce per-IP lockout, while middleware enforces global /api rate limiting." {
            include backendPrimary.authController
            include backendPrimary.authService
            include backendPrimary.rateLimitMiddleware
            include postgres.loginAttemptTable
            include redis
            include caddy
            autoLayout lr
        }

        !include styles.dsl
        theme default
    }
}
