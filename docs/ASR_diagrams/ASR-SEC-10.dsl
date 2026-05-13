workspace "ASR-SEC-10: Comprehensive Audit Logging" "C1-C3 Model for 100% Audit Logging of Critical Actions" {

    model {
        user = person "User" "Performs actions (login, file access)" "External"
        admin = person "Admin" "Performs admin actions" "External"
        auditor = person "Auditor/Compliance Officer" "Reviews audit logs" "External"
        
        lmsSystem = softwareSystem "LMS System" "Logs 100% of critical actions with timestamps and user IDs" {
            clientApp = container "Client Application" "React + TypeScript" "User interface" "WebBrowser"
            
            apiServer = container "API Server" "Express.js + Node.js" "Processes requests and triggers audit events" "Service" {
                authenticationHandler = component "Authentication Handler" "Logs: login attempts, logouts, token generation" "Service"
                adminActionHandler = component "Admin Action Handler" "Logs: user creation, role changes, system config updates" "Service"
                fileAccessHandler = component "File Access Handler" "Logs: file downloads, uploads, deletions, access attempts" "Service"
                dataModificationHandler = component "Data Modification Handler" "Logs: course creation, grade changes, enrollment updates" "Service"
                
                authenticationHandler -> authenticationHandler "Trigger audit event"
            }
            
            auditEventCollector = container "Audit Event Collector" "Event Streaming Service" "Collects audit events from all API handlers" "Service" {
                eventReceiver = component "Event Receiver" "Receives audit events from application" "Service"
                eventEnricher = component "Event Enricher" "Adds context: IP address, user agent, request ID" "Service"
                eventFormatter = component "Event Formatter" "Formats to canonical log line format (JSON or structured)" "Service"
                eventRouter = component "Event Router" "Routes events to storage and real-time monitoring" "Service"
                
                eventReceiver -> eventEnricher "Add context"
                eventEnricher -> eventFormatter "Format event"
                eventFormatter -> eventRouter "Route to destinations"
            }
            
            auditLogStorage = container "Audit Log Storage" "Database + Archive" "Persistent storage of audit logs (≥1 year retention)" "Database" {
                hotstoreDatabase = component "Hotstore Database" "Recent logs (< 3 months) in PostgreSQL for quick queries" "Service"
                coldstoreLongTerm = component "Coldstore Long-Term" "Archived logs (> 3 months) in S3 Glacier for compliance" "Service"
                logIndexing = component "Log Indexing" "Indexes on user_id, timestamp, action_type for fast search" "Service"
                
                logIndexing -> hotstoreDatabase "Index recent logs"
                logIndexing -> coldstoreLongTerm "Archive old logs"
            }
            
            auditLogQuery = container "Audit Log Query Service" "Query Interface" "Allows authorized users to search and analyze audit logs" "Service" {
                auditSearchEngine = component "Audit Search Engine" "Full-text and structured search on logs" "Service"
                auditReportGenerator = component "Audit Report Generator" "Generates compliance reports (ISO 27001, SOC2)" "Service"
                logViewer = component "Log Viewer" "UI for viewing audit logs" "Service"
                
                auditSearchEngine -> auditReportGenerator "Generate reports"
                auditSearchEngine -> logViewer "Display results"
            }
            
            realTimeMonitoring = container "Real-Time Monitoring" "Streaming + Alerting" "Monitors critical events in real-time" "Service" {
                eventStream = component "Event Stream" "Kafka/Redis stream of audit events" "Service"
                anomalyDetector = component "Anomaly Detector" "Detects suspicious patterns (brute force, mass deletion)" "Service"
                alerting = component "Alerting" "Sends alerts to security team on critical events" "Service"
                
                eventStream -> anomalyDetector "Analyze events"
                anomalyDetector -> alerting "Alert on anomalies"
            }
            
            canonicalLogFormat = container "Canonical Log Format" "Structured Logging" "Standardized log format for consistency" "Service" {
                jsonSchema = component "JSON Schema" "timestamp, user_id, action, resource, result, ip, user_agent, request_id" "Service"
                logValidator = component "Log Validator" "Validates logs conform to schema" "Service"
                
                jsonSchema -> logValidator "Validate format"
            }
            
            adminAuditInterface = container "Admin Audit Interface" "Admin Portal" "Interface for reviewing audit logs" "Service" {
                logSearch = component "Log Search" "Search logs by user, action, date range" "Service"
                userActivityTrail = component "User Activity Trail" "View all actions by specific user" "Service"
                complianceReport = component "Compliance Report" "Generate compliance reports" "Service"
                exportTool = component "Export Tool" "Export logs to CSV/JSON for external audit" "Service"
                
                logSearch -> userActivityTrail "Track user"
                userActivityTrail -> complianceReport "Generate report"
                complianceReport -> exportTool "Export data"
            }
            
            user -> clientApp "Perform action (login, access file)"
            clientApp -> apiServer "Request"
            apiServer -> auditEventCollector "Send audit event"
            auditEventCollector -> auditLogStorage "Store log"
            auditEventCollector -> realTimeMonitoring "Stream event"
            admin -> clientApp "Perform admin action"
            clientApp -> apiServer "Admin request"
            auditor -> adminAuditInterface "Search and review logs"
            adminAuditInterface -> auditLogQuery "Query logs"
            auditLogQuery -> auditLogStorage "Retrieve logs"
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
        
        component apiServer {
            include *
            autolayout lr
        }
        
        component auditEventCollector {
            include *
            autolayout lr
        }
        
        component auditLogStorage {
            include *
            autolayout lr
        }
        
        component auditLogQuery {
            include *
            autolayout lr
        }
        
        component realTimeMonitoring {
            include *
            autolayout lr
        }
        
        component adminAuditInterface {
            include *
            autolayout lr
        }
        
        theme default
    }

}
