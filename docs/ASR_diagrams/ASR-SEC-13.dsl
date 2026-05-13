workspace "ASR-SEC-13: Secure File Storage Outside Web Root" "C1-C3 Model for Preventing Directory Traversal via Secure File Storage" {

    model {
        user = person "User" "Downloads stored files" "External"
        attacker = person "Attacker" "Attempts directory traversal" "External"
        
        lmsSystem = softwareSystem "LMS System" "Stores 100% of files outside web root" {
            clientApp = container "Client Application" "React + TypeScript" "File download requests" "WebBrowser"
            
            webServer = container "Web Server" "Caddy / Nginx" "Serves only public static content (CSS, JS, images)" "Service" {
                publicFileHandler = component "Public File Handler" "Serves /public directory only" "Service"
                requestRouter = component "Request Router" "Routes requests appropriately" "Service"
                
                requestRouter -> publicFileHandler "Route to public files"
            }
            
            apiServer = container "API Server" "Express.js + Node.js" "Handles file download requests" "Service" {
                downloadHandler = component "Download Handler" "Processes file download requests" "Service"
                pathValidator = component "Path Validator" "Validates requested file path for traversal attempts" "Service"
                accessControl = component "Access Control" "Verifies user has permission to download file" "Service"
                fileMetadataLookup = component "File Metadata Lookup" "Looks up file info by ID, not path" "Service"
                
                downloadHandler -> pathValidator "Validate path"
                pathValidator -> fileMetadataLookup "Check if valid"
            }
            
            secureFileStorage = container "Secure File Storage" "OS Filesystem (/uploads outside /var/www)" "Files stored outside web root at /opt/lms/uploads/" "Service" {
                directoryStructure = component "Directory Structure" "Organized as: /opt/lms/uploads/{user_id}/{file_id}/" "Service"
                filePermissions = component "File Permissions" "Files: 0640 (rw-r-----), Dirs: 0750 (rwxr-x---)" "Service"
                symlinkPrevention = component "Symlink Prevention" "Detects and blocks symbolic links (blocks /../../etc/passwd)" "Service"
                pathNormalization = component "Path Normalization" "Normalizes paths to prevent ../ traversal (realpath())" "Service"
                
                directoryStructure -> filePermissions "Set permissions"
                filePermissions -> symlinkPrevention "Prevent symlinks"
                symlinkPrevention -> pathNormalization "Normalize paths"
            }
            
            fileServer = container "File Serving Middleware" "Express Middleware" "Securely serves files from storage without exposing paths" "Service" {
                idBasedLookup = component "ID-Based Lookup" "Maps file_id to actual file path internally (not exposed)" "Service"
                streamingHandler = component "Streaming Handler" "Streams file to user without buffering full file in memory" "Service"
                headerValidator = component "Header Validator" "Validates HTTP headers to prevent directory traversal via headers" "Service"
                
                idBasedLookup -> streamingHandler "Stream file"
                streamingHandler -> headerValidator "Validate headers"
            }
            
            auditLog = container "Audit Log" "Database" "Logs all file access and traversal attempts" "Database" {
                fileAccessLog = component "File Access Log" "user_id, file_id, download_time, ip, success/failure" "Service"
                traversalAttemptLog = component "Traversal Attempt Log" "Logs attempted directory traversal (../, ..\\, encoded variants)" "Service"
                
                traversalAttemptLog -> fileAccessLog "Log attempts"
            }
            
            alertingService = container "Alerting Service" "Monitoring" "Alerts on directory traversal attempts" "Service"
            
            user -> clientApp "Request to download material"
            clientApp -> apiServer "GET /api/files/{file_id}/download [jwt]"
            apiServer -> secureFileStorage "Request file by ID (path not exposed)"
            secureFileStorage -> fileServer "Retrieve file"
            fileServer -> clientApp "Stream file bytes (not path)"
            apiServer -> auditLog "Log successful download"
            
            attacker -> clientApp "Request: GET /api/files/../../../../../../etc/passwd"
            clientApp -> apiServer "GET /api/files/../../../../../../etc/passwd"
            apiServer -> auditLog "Log traversal attempt (blocked internally)"
            auditLog -> alertingService "Alert: directory traversal attempt"
            
            attacker -> clientApp "Request with symlink: GET /api/files/{file_id pointing to symlink}"
            clientApp -> apiServer "GET /api/files/{file_id}"
            secureFileStorage -> apiServer "Blocked: symlink detected"
            apiServer -> auditLog "Log symlink traversal attempt"
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
        
        component webServer {
            include *
            autolayout lr
        }
        
        component apiServer {
            include *
            autolayout lr
        }
        
        component secureFileStorage {
            include *
            autolayout lr
        }
        
        component fileServer {
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
