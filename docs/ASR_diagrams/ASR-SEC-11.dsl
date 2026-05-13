workspace "ASR-SEC-11: Audit Log Retention and Retrieval" "C1-C3 Model for 1-Year Minimum Audit Log Retention with Tiered Storage" {

    model {
        auditor = person "Auditor" "Queries audit logs from past periods" "External"
        admin = person "Admin" "Manages log retention and archival" "External"
        
        lmsSystem = softwareSystem "LMS System" "Retains audit logs for minimum 1 year with tiered storage" {
            auditLogCollection = container "Audit Log Collection" "Event Streaming" "Collects audit events continuously" "Service"
            
            hotstorageDatabase = container "Hotstore Database" "PostgreSQL" "Recent logs (< 3 months) for fast access" "Database" {
                recentLogsTable = component "Recent Logs Table" "Stores: event_id, user_id, action, timestamp, ip (last 90 days)" "Service"
                hotstorageIndex = component "Hotstore Index" "Indexes on timestamp, user_id, action for quick queries" "Service"
                
                hotstorageIndex -> recentLogsTable "Index recent logs"
            }
            
            coldstorageLongTerm = container "Coldstore Long-Term Archive" "S3 Glacier / Archive Storage" "Old logs (> 3 months, < 1 year) stored economically" "Service" {
                archiveStorage = component "Archive Storage" "S3 Glacier for logs older than 3 months" "Service"
                compressionService = component "Compression Service" "Compresses logs to reduce storage cost" "Service"
                archiveIndex = component "Archive Index" "Metadata index: date range, log count, storage location" "Service"
                
                compressionService -> archiveStorage "Store compressed"
                archiveIndex -> archiveStorage "Track location"
            }
            
            logRotationScheduler = container "Log Rotation Scheduler" "Cron + Workflow" "Manages tiered storage transitions and retention policy" "Service" {
                rotationPolicy = component "Rotation Policy" "Rules: move logs > 3 months to coldstore, delete > 1 year" "Service"
                rotationExecutor = component "Rotation Executor" "Executes scheduled transitions between storage tiers" "Service"
                retentionEnforcer = component "Retention Enforcer" "Enforces minimum 1-year retention, deletes beyond policy" "Service"
                
                rotationPolicy -> rotationExecutor "Execute rotation"
                rotationExecutor -> retentionEnforcer "Enforce retention"
            }
            
            auditLogRetrieval = container "Audit Log Retrieval Service" "Query Interface" "Retrieves logs from both hot and cold storage" "Service" {
                queryRouter = component "Query Router" "Routes query to hotstore (fast) or coldstore (slow)" "Service"
                hotstoreQuery = component "Hotstore Query" "SQL queries for recent logs in PostgreSQL" "Service"
                coldstoreQuery = component "Coldstore Query" "Initiates retrieval from Glacier (may take 1-5 hours)" "Service"
                resultCombiner = component "Result Combiner" "Combines results from multiple storage tiers" "Service"
                
                queryRouter -> hotstoreQuery "Query recent"
                queryRouter -> coldstoreQuery "Retrieve archived"
                hotstoreQuery -> resultCombiner "Combine results"
                coldstoreQuery -> resultCombiner "Combine results"
            }
            
            auditSearchUI = container "Audit Log Search UI" "Admin Portal / Web Interface" "Interface for auditors to search and export logs" "Service" {
                searchForm = component "Search Form" "Filter by user, date range, action, outcome" "Service"
                resultDisplay = component "Result Display" "Shows matching logs with pagination" "Service"
                exportFunction = component "Export Function" "Exports logs to CSV/JSON for compliance reports" "Service"
                
                searchForm -> resultDisplay "Display results"
                resultDisplay -> exportFunction "Export data"
            }
            
            complianceReporting = container "Compliance Reporting" "Report Generator" "Generates compliance reports (SOC2, ISO 27001, GDPR)" "Service" {
                reportTemplate = component "Report Template" "Pre-built templates for compliance frameworks" "Service"
                dataAggregator = component "Data Aggregator" "Aggregates audit data into reportable metrics" "Service"
                signatureManager = component "Signature Manager" "Digitally signs reports for audit trail" "Service"
                
                reportTemplate -> dataAggregator "Aggregate data"
                dataAggregator -> signatureManager "Sign report"
            }
            
            retentionPolicyManager = container "Retention Policy Manager" "Admin Tool" "Defines and manages log retention policies" "Service" {
                policyEditor = component "Policy Editor" "Edit retention periods (minimum enforced: 1 year)" "Service"
                policyValidator = component "Policy Validator" "Validates policies meet compliance requirements" "Service"
                complianceChecker = component "Compliance Checker" "Ensures policy aligns with regulations" "Service"
                
                policyEditor -> policyValidator "Validate policy"
                policyValidator -> complianceChecker "Check compliance"
            }
            
            integrityVerification = container "Integrity Verification" "Audit Trail" "Verifies logs haven't been tampered with" "Service" {
                hashValidator = component "Hash Validator" "Computes and verifies SHA-256 hashes of logs" "Service"
                tamperDetector = component "Tamper Detector" "Detects if logs have been modified post-creation" "Service"
                
                hashValidator -> tamperDetector "Detect tampering"
            }
            
            auditor -> auditSearchUI "Search audit logs from 6 months ago"
            auditSearchUI -> auditLogRetrieval "Query logs"
            auditLogRetrieval -> hotstorageDatabase "Query if recent"
            auditLogRetrieval -> coldstorageLongTerm "Retrieve if archived"
            auditSearchUI -> complianceReporting "Generate compliance report"
            complianceReporting -> auditLogRetrieval "Aggregate logs"
            admin -> logRotationScheduler "Configure retention policy"
            logRotationScheduler -> hotstorageDatabase "Move old logs"
            logRotationScheduler -> coldstorageLongTerm "Archive to coldstore"
            logRotationScheduler -> integrityVerification "Verify before archival"
            admin -> retentionPolicyManager "Define 1-year retention"
            retentionPolicyManager -> logRotationScheduler "Enforce policy"
            auditLogCollection -> hotstorageDatabase "Store recent logs"
            auditLogCollection -> logRotationScheduler "Route for archival"
        }
        
    }

    views {
        systemContext lmsSystem {
            include *
            autolayout lr
        }
        
        container lmsSystem {
            include *
            autolayout lr
        }
        
        component hotstorageDatabase {
            include *
            autolayout lr
        }
        
        component coldstorageLongTerm {
            include *
            autolayout lr
        }
        
        component auditLogRetrieval {
            include *
            autolayout lr
        }
        
        component complianceReporting {
            include *
            autolayout lr
        }
        
        component retentionPolicyManager {
            include *
            autolayout lr
        }
        
        theme default
    }

}
