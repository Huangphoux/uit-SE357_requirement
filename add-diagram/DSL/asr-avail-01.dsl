workspace "ASR-AVAIL-01 - High Availability" "C4 views for active/passive API failover and health checks." {
    !identifiers hierarchical

    model {
        !include model.dsl
    }

    views {
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

        !include styles.dsl
        theme default
    }
}
