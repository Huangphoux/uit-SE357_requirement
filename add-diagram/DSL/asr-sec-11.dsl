workspace "ASR-SEC-11 - Audit Log Retention" "C4 views for audit log retention and admin retrieval." {
    !identifiers hierarchical

    model {
        !include model.dsl
    }

    views {
        container lms "ASR_SEC_11_Containers" "ASR-SEC-11: Audit logs are retained as daily files in AUDIT_LOG_DIR and accessed via admin-only API route." {
            include admin
            include caddy
            include backendPrimary
            include auditLogStorage
            autoLayout lr
        }

        component backendPrimary "ASR_SEC_11_Audit_Component" "ASR-SEC-11: Audit Route queries Audit Logger, which stores JSONL files and removes entries older than AUDIT_RETENTION_DAYS." {
            include backendPrimary.auditRoute
            include backendPrimary.auditLogger
            include auditLogStorage
            include admin
            include caddy
            autoLayout tb
        }

        !include styles.dsl
        theme default
    }
}
