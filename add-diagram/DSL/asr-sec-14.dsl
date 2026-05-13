workspace "ASR-SEC-14 - Upload Size Limits" "C4 views for 50MB material and 20MB submission upload constraints." {
    !identifiers hierarchical

    model {
        !include model.dsl
    }

    views {
        container lms "ASR_SEC_14_Containers" "ASR-SEC-14: Upload requests flow from React SPA to API routes protected by explicit size-limit middleware." {
            include student
            include teacher
            include caddy
            include spa
            include backendPrimary
            autoLayout lr
        }

        component backendPrimary "ASR_SEC_14_Upload_Component" "ASR-SEC-14: Materials routes enforce 50MB and submissions routes enforce 20MB through shared middleware." {
            include spa.fileUploadUi
            include caddy
            include backendPrimary.materialsRoutes
            include backendPrimary.submissionsRoutes
            include backendPrimary.uploadLimitMiddleware
            autoLayout lr
        }

        !include styles.dsl
        theme default
    }
}
