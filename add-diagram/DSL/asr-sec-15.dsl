workspace "ASR-SEC-15 - API Rate Limiting" "C4 views for Redis-backed request throttling on /api endpoints." {
    !identifiers hierarchical

    model {
        !include model.dsl
    }

    views {
        systemContext lms "ASR_SEC_15_SystemContext" "Level 1 - ASR-SEC-15 context for API abuse protection requirements." {
            include student
            include teacher
            include admin
            include lms
            autoLayout lr
        }

        container lms "ASR_SEC_15_Containers" "ASR-SEC-15: Caddy forwards API requests to backend where Redis-backed throttling protects endpoints." {
            include student
            include teacher
            include admin
            include caddy
            include backendPrimary
            include redis
            autoLayout lr
        }

        component backendPrimary "ASR_SEC_15_RateLimit_Component" "ASR-SEC-15: Rate-Limit Middleware increments endpoint/IP counters in Redis and rejects excess requests with HTTP 429." {
            include caddy
            include backendPrimary.rateLimitMiddleware
            include redis
            autoLayout tb
        }

        !include styles.dsl
        theme default
    }
}
