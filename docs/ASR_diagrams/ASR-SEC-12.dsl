workspace "ASR-SEC-12: Secure File Upload with Malware Scanning" "C1-C3 Model for 100% Malware Scanning and Whitelist File Type Validation" {

    model {
        teacher = person "Teacher" "Uploads course materials" "External"
        student = person "Student" "Submits assignment files" "External"
        attacker = person "Attacker" "Attempts to upload malware" "External"
        
        lmsSystem = softwareSystem "LMS System" "Securely handles file uploads with malware scanning" {
            clientApp = container "Client Application" "React + TypeScript" "File upload form UI" "WebBrowser"
            
            apiServer = container "API Server" "Express.js + Node.js" "Orchestrates upload process" "Service" {
                fileReceiver = component "File Receiver" "Receives file from client via HTTP POST" "Service"
                uploadOrchestrator = component "Upload Orchestrator" "Coordinates validation, scanning, and storage" "Service"
                fileMetadataExtractor = component "File Metadata Extractor" "Extracts filename, size, MIME type" "Service"
                
                fileReceiver -> uploadOrchestrator "Received file"
                uploadOrchestrator -> fileMetadataExtractor "Extract metadata"
            }
            
            fileTypeValidator = container "File Type Validator" "Validation Service" "Validates file type against whitelist" "Service" {
                extensionChecker = component "Extension Checker" "Validates file extension (e.g., .pdf, .docx, .jpg)" "Service"
                mimeTypeValidator = component "MIME Type Validator" "Validates Content-Type header matches extension" "Service"
                magicNumberDetector = component "Magic Number Detector" "Reads file magic bytes to detect actual file type" "Service"
                whitelist = component "Whitelist" "Allowed types: pdf, doc, docx, xls, xlsx, jpg, png, zip" "Service"
                
                extensionChecker -> mimeTypeValidator "Check extension"
                mimeTypeValidator -> magicNumberDetector "Validate MIME"
                magicNumberDetector -> whitelist "Check against whitelist"
            }
            
            fileSizeValidator = container "File Size Validator" "Size Checking" "Validates file size within limits" "Service" {
                sizeLimiter = component "Size Limiter" "Materials: max 50MB, Submissions: max 20MB" "Service"
            }
            
            malwareScanner = container "Malware Scanner" "ClamAV / Third-Party Service" "Scans files for malware and viruses" "Service" {
                scanEngine = component "Scan Engine" "Scans file for known malware signatures" "Service"
                threatDatabase = component "Threat Database" "Updated virus definitions (daily updates)" "Service"
                behavioralAnalyzer = component "Behavioral Analyzer" "Detects suspicious file behavior patterns" "Service"
                quarantineHandler = component "Quarantine Handler" "Quarantines infected files separately" "Service"
                
                scanEngine -> threatDatabase "Check signatures"
                scanEngine -> behavioralAnalyzer "Analyze behavior"
                behavioralAnalyzer -> quarantineHandler "Quarantine if infected"
            }
            
            fileStorage = container "File Storage" "Secure File Storage" "Stores validated files outside web root" "Service" {
                safeStorageLocation = component "Safe Storage Location" "Files stored in /uploads/ outside /public/" "Service"
                accessController = component "Access Controller" "Restricts direct file access via web server" "Service"
                filePermissions = component "File Permissions" "Files readable by app server, not world-readable" "Service"
                
                safeStorageLocation -> accessController "Control access"
                accessController -> filePermissions "Set permissions"
            }
            
            auditLog = container "Audit Log" "Database" "Logs all file uploads and validation results" "Database" {
                uploadLog = component "Upload Log" "user_id, filename, file_size, file_type, timestamp, ip" "Service"
                malwareScanLog = component "Malware Scan Log" "Logs scan results, threats detected, quarantine actions" "Service"
                rejectionLog = component "Rejection Log" "Logs rejected files (invalid type, size, infected)" "Service"
                
                malwareScanLog -> uploadLog "Log all uploads"
                rejectionLog -> uploadLog "Log rejections"
            }
            
            alertingService = container "Alerting Service" "Monitoring" "Alerts on malware detection or suspicious uploads" "Service"
            
            teacher -> clientApp "Upload course material (PDF, DOCX)"
            clientApp -> apiServer "POST /upload {file}"
            apiServer -> fileTypeValidator "Validate file type"
            fileTypeValidator -> fileSizeValidator "Check size (if type valid)"
            fileSizeValidator -> malwareScanner "Scan for malware (if size valid)"
            malwareScanner -> fileStorage "Store if clean"
            fileStorage -> auditLog "Log successful upload"
            fileStorage -> clientApp "Return upload success"
            
            student -> clientApp "Submit assignment (ZIP with code)"
            clientApp -> apiServer "POST /submit {file}"
            apiServer -> fileSizeValidator "Check size"
            fileSizeValidator -> malwareScanner "Scan for malware"
            auditLog -> clientApp "Log submission"
            
            attacker -> clientApp "Upload malware-infected EXE"
            clientApp -> apiServer "POST /upload {malware.exe}"
            apiServer -> fileTypeValidator "Validate: .exe not in whitelist"
            fileTypeValidator -> clientApp "403 Forbidden - Invalid file type"
            apiServer -> auditLog "Log rejection (invalid type)"
            
            attacker -> clientApp "Upload disguised malware (.pdf with hidden exe)"
            clientApp -> apiServer "POST /upload {invoice.pdf}"
            apiServer -> fileTypeValidator "Validate: .pdf, MIME type correct"
            fileTypeValidator -> fileSizeValidator "Size OK"
            fileSizeValidator -> malwareScanner "Scan: detects malware"
            malwareScanner -> auditLog "Log quarantine: malware detected"
            malwareScanner -> alertingService "Alert: malware detected"
            auditLog -> clientApp "403 Forbidden - File infected"
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
        
        component fileTypeValidator {
            include *
            autolayout lr
        }
        
        component malwareScanner {
            include *
            autolayout lr
        }
        
        component fileStorage {
            include *
            autolayout lr
        }
        
        component auditLog {
            include *
            autolayout lr
        }
        
        theme default
    }

}
