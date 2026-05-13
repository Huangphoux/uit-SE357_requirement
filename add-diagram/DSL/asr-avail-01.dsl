workspace "ASR-AVAIL-01 - High Availability" "C4 views for active/passive API failover and health checks." {
    !identifiers hierarchical

    model {
        !include model.dsl
    }

    views {
        systemContext lms "ASR_AVAIL_01_SystemContext" "Level 1 - ASR-AVAIL-01 context for LMS availability expectations." {
            include student
            include teacher
            include admin
            include lms
            include emailService
            autoLayout lr
        }

        container lms "ASR_AVAIL_01_Containers" "ASR-AVAIL-01: Caddy routes traffic to backend-primary and fails over to backend-secondary based on health checks." {
            include student
            include teacher
            include admin
            include caddy
            include backendPrimary
            include backendSecondary
            include spa
            include postgres
            include redis
            autoLayout lr
        }

        component backendPrimary "ASR_AVAIL_01_Failover_Health" "ASR-AVAIL-01: both API instances expose /api/health checks against PostgreSQL and Redis to support failover decisions." {
            include backendPrimary.healthRouterPrimary
            include backendSecondary.healthRouterSecondary
            include postgres
            include redis
            include caddy
            autoLayout tb
        }

        dynamic lms "ASR_AVAIL_01_Code_Dynamic" "Level 4 - ASR-AVAIL-01 runtime flow for health-probe-driven failover." {
            caddy -> backendPrimary.healthRouterPrimary "GET /api/health (primary)"
            backendPrimary.healthRouterPrimary -> postgres "SELECT 1"
            backendPrimary.healthRouterPrimary -> redis "PING"
            caddy -> backendSecondary.healthRouterSecondary "Failover probe /api/health (secondary)"
            backendSecondary.healthRouterSecondary -> postgres "SELECT 1"
            backendSecondary.healthRouterSecondary -> redis "PING"
            autoLayout lr
        }

        !include styles.dsl
        theme default
    }
}
