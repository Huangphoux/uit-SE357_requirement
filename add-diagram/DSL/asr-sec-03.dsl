workspace "ASR-SEC-03 - Brute-force Protection" "C4 views for login lockout and related brute-force mitigation controls." {
    !identifiers hierarchical

    model {
        !include model.dsl
    }

    views {
        systemContext lms "ASR_SEC_03_SystemContext" "Level 1 - ASR-SEC-03 context for login and access security." {
            include student
            include teacher
            include admin
            include lms
            autoLayout lr
        }

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

        component backendPrimary "ASR_SEC_03_AuthLockout_Component" "ASR-SEC-03: Auth Controller + Auth Service enforce per-IP login lockout using LoginAttempt records." {
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
