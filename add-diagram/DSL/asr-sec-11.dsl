workspace "ASR-SEC-11 - Audit Log Retention" "C4 views for audit log retention and admin retrieval." {
    !identifiers hierarchical

    model {
        !include model.dsl
    }

    views {
        systemContext lms "ASR_SEC_11_SystemContext" "Level 1 - ASR-SEC-11 context for audit retention and admin access." {
            include admin
            include lms
            autoLayout lr
        }

        container lms "ASR_SEC_11_Containers" "ASR-SEC-11: Audit logs are retained as daily files in AUDIT_LOG_DIR and accessed via admin-only API route." {
            include admin
            include caddy
            include backendPrimary
            include auditLogStorage
            autoLayout lr
        }

        component backendPrimary "ASR_SEC_11_Audit_Component" "ASR-SEC-11: Audit Route queries Audit Logger, which stores JSONL files and removes files older than AUDIT_RETENTION_DAYS." {
            include backendPrimary.auditRoute
            include backendPrimary.auditLogger
            include auditLogStorage
            include admin
            include caddy
            autoLayout tb
        }

        dynamic lms "ASR_SEC_11_Code_Dynamic" "Level 4 - ASR-SEC-11 runtime flow for admin audit-log retrieval and retention cleanup." {
            admin -> caddy "Request GET /api/audit/logs"
            caddy -> backendPrimary "Forward admin audit request"
            backendPrimary.auditRoute -> backendPrimary.auditLogger "Fetch logs for response"
            backendPrimary.auditLogger -> auditLogStorage "Read JSONL files + purge expired files"
            autoLayout lr
        }

        !include styles.dsl
        theme default
    }
}
