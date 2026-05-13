workspace "ASR-SEC-14: File Size Validation and Limits" "C1-C3 Model for Enforcing File Size Limits (50MB Materials, 20MB Submissions)" {

    model {
        teacher = person "Teacher" "Uploads course materials" "External"
        student = person "Student" "Submits assignments" "External"
        attacker = person "Attacker" "Attempts to upload oversized files" "External"
        
        lmsSystem = softwareSystem "LMS System" "Enforces file size limits" {
            clientApp = container "Client Application" "React + TypeScript" "File upload form UI" "WebBrowser" {
                sizeIndicator = component "Size Indicator" "Shows file size before upload (client-side check)" "Service"
                preUploadValidator = component "Pre-Upload Validator" "Rejects files exceeding limits before sending" "Service"
                
                sizeIndicator -> preUploadValidator "Check size"
            }
            
            apiServer = container "API Server" "Express.js + Node.js" "Receives and validates uploads" "Service" {
                uploadRouter = component "Upload Router" "Routes to materials or submissions endpoint" "Service"
                contentLengthChecker = component "Content-Length Checker" "Reads Content-Length header (first defense)" "Service"
                streamLimiter = component "Stream Limiter" "Limits bytes received to avoid memory exhaustion" "Service"
                chunkValidator = component "Chunk Validator" "Validates each uploaded chunk within limits" "Service"
                
                uploadRouter -> contentLengthChecker "Check header"
                contentLengthChecker -> streamLimiter "Limit stream"
                streamLimiter -> chunkValidator "Validate chunks"
            }
            
            sizeLimitConfiguration = container "Size Limit Configuration" "Settings" "Centralized file size limit definitions" "Service" {
                materialLimit = component "Material Limit" "50MB (52,428,800 bytes) for course materials" "Service"
                submissionLimit = component "Submission Limit" "20MB (20,971,520 bytes) for student submissions" "Service"
                totalStorageQuota = component "Total Storage Quota" "Per-user quota to prevent storage exhaustion" "Service"
                
                materialLimit -> submissionLimit "Define limits"
                submissionLimit -> totalStorageQuota "Set quotas"
            }
            
            validationLogic = container "Validation Logic" "Enforcement Engine" "Enforces size limits at multiple stages" "Service" {
                headerValidation = component "Header Validation" "Rejects request if Content-Length exceeds limit" "Service"
                streamTimeoutHandler = component "Stream Timeout Handler" "Aborts upload if exceeds limit mid-stream" "Service"
                quotaChecker = component "Quota Checker" "Checks if user storage quota would be exceeded" "Service"
                errorResponder = component "Error Responder" "Returns 413 (Payload Too Large) with limit info" "Service"
                
                headerValidation -> streamTimeoutHandler "Validate header"
                streamTimeoutHandler -> quotaChecker "Check quota"
                quotaChecker -> errorResponder "Return error"
            }
            
            fileStorage = container "File Storage" "Secure Storage" "Only stores files within limits" "Service"
            
            auditLog = container "Audit Log" "Database" "Logs all upload attempts (including rejections)" "Database" {
                uploadAttemptLog = component "Upload Attempt Log" "user_id, file_name, file_size, upload_type, timestamp" "Service"
                rejectionLog = component "Rejection Log" "Logs rejections: reason (size exceeded, quota exceeded), requested size" "Service"
                
                rejectionLog -> uploadAttemptLog "Log rejections"
            }
            
            metricsCollector = container "Metrics Collector" "Monitoring" "Tracks upload patterns" "Service" {
                sizeDistribution = component "Size Distribution" "Tracks median, p95, p99 file sizes" "Service"
                quotaUtilization = component "Quota Utilization" "Tracks per-user storage usage" "Service"
                rejectionRate = component "Rejection Rate" "Tracks percentage of uploads rejected for size" "Service"
                
                sizeDistribution -> quotaUtilization "Monitor usage"
                quotaUtilization -> rejectionRate "Track rejections"
            }
            
            teacher -> clientApp "Upload material (30MB PDF)"
            clientApp -> apiServer "POST /upload/material {file: 30MB}"
            apiServer -> sizeLimitConfiguration "Check material limit (50MB)"
            apiServer -> validationLogic "Validate: 30MB < 50MB = OK"
            validationLogic -> fileStorage "Store file"
            apiServer -> auditLog "Log successful upload"
            
            student -> clientApp "Upload assignment (15MB ZIP)"
            clientApp -> apiServer "POST /submit/assignment {file: 15MB}"
            apiServer -> sizeLimitConfiguration "Check submission limit (20MB)"
            apiServer -> validationLogic "Validate: 15MB < 20MB = OK"
            
            attacker -> clientApp "Upload oversized file (100MB)"
            clientApp -> apiServer "POST /upload/material {file: 100MB}"
            apiServer -> validationLogic "Check Content-Length: 100MB > 50MB limit"
            validationLogic -> auditLog "Log rejection: size exceeded"
            apiServer -> metricsCollector "Track rejection"
            
            attacker -> clientApp "Attempt quota exhaustion (20 x 10MB files)"
            clientApp -> apiServer "POST /submit/assignment {file: 10MB}"
            apiServer -> validationLogic "Check quota: user already at 180MB of 200MB quota"
            validationLogic -> auditLog "Log rejection: quota exceeded"
            apiServer -> metricsCollector "Track quota exhaustion attempt"
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
        
        component clientApp {
            include *
            autolayout lr
        }
        
        component apiServer {
            include *
            autolayout lr
        }
        
        component sizeLimitConfiguration {
            include *
            autolayout lr
        }
        
        component validationLogic {
            include *
            autolayout lr
        }
        
        component auditLog {
            include *
            autolayout lr
        }
        
        component metricsCollector {
            include *
            autolayout lr
        }
        
        theme default
    }

}
