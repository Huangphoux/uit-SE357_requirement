workspace "ASR-SEC-03: Brute Force Attack Prevention" "C1-C3 Model for IP-Based Rate Limiting and Account Lockout" {

    model {
        attacker = person "Attacker" "Attempts multiple failed logins" "External"
        legitimateUser = person "Legitimate User" "Normal login" "External"
        admin = person "Admin" "Monitors and manages blocked IPs" "External"
        
        lmsSystem = softwareSystem "LMS System" "Prevents brute force attacks by blocking IPs after failed attempts" {
            clientApp = container "Client Application" "React + TypeScript" "Login form UI" "WebBrowser"
            
            loginGateway = container "Login Gateway" "Express Middleware" "Receives login requests and tracks failed attempts per IP" "Service" {
                ipExtractor = component "IP Extractor" "Extracts client IP from request headers" "Service"
                failureTracker = component "Failure Tracker" "Counts failed login attempts per IP" "Service"
                ipBlocker = component "IP Blocker" "Checks if IP is in blacklist" "Service"
                
                ipExtractor -> failureTracker "Track by IP"
                failureTracker -> ipBlocker "Check if blocked"
            }
            
            failureCache = container "Failure Attempt Cache" "Redis" "Stores failed login attempt counts with 15-minute TTL" "Service" {
                attemptCounter = component "Attempt Counter" "Stores: IP -> attempt_count (resets after 15 min)" "Service"
                ttlManager = component "TTL Manager" "Manages 15-minute expiry window for each IP" "Service"
                
                ttlManager -> attemptCounter "Track attempts"
            }
            
            ipBlocklist = container "IP Blocklist" "Database + Redis" "Stores permanently or temporarily blocked IPs" "Service" {
                blocklistStore = component "Blocklist Store" "Persistent list of blocked IPs with reason" "Service"
                blocklistCache = component "Blocklist Cache" "Redis cache for fast lookup" "Service"
                blocklistPruner = component "Blocklist Pruner" "Removes temporary blocks after cooldown period (1-24 hours)" "Service"
                
                blocklistStore -> blocklistCache "Sync blocklist"
                blocklistPruner -> blocklistStore "Clean expired blocks"
            }
            
            apiServer = container "API Server" "Express.js + Node.js" "Handles authentication" "Service" {
                authHandler = component "Auth Handler" "Processes login request if IP is not blocked" "Service"
                loginValidator = component "Login Validator" "Validates credentials" "Service"
                failureRecorder = component "Failure Recorder" "Increments failure count on auth failure" "Service"
                lockoutDetector = component "Lockout Detector" "Detects when 5 failures reached in 15 min" "Service"
                
                authHandler -> loginValidator "Validate credentials"
                loginValidator -> failureRecorder "Record if failed"
                failureRecorder -> lockoutDetector "Check if locked"
            }
            
            notificationService = container "Notification Service" "Email + SMS" "Sends alerts when IP is blocked" "Service" {
                blockNotifier = component "Block Notifier" "Sends email to account owner when IP is blocked" "Service"
                alertComposer = component "Alert Composer" "Composes alert message with blocked IP, time, failed attempts" "Service"
                emailSender = component "Email Sender" "Sends email via SMTP" "Service"
                
                blockNotifier -> alertComposer "Compose alert"
                alertComposer -> emailSender "Send email"
            }
            
            adminDashboard = container "Admin Dashboard" "Admin Portal" "Monitors blocked IPs and manages whitelist/blacklist" "Service" {
                blockedIpViewer = component "Blocked IP Viewer" "Lists all currently blocked IPs with attempt history" "Service"
                whitelistManager = component "Whitelist Manager" "Adds trusted IPs to permanent whitelist (bypass rate limiting)" "Service"
                blocklistManager = component "Blocklist Manager" "Manually blocks/unblocks IPs" "Service"
                ipAnalytics = component "IP Analytics" "Shows attack patterns, geographic distribution, timing" "Service"
                
                blockedIpViewer -> ipAnalytics "View attack analytics"
                whitelistManager -> blocklistStore "Update whitelist"
                blocklistManager -> blocklistStore "Manage blocks"
            }
            
            auditLog = container "Audit Log" "Database" "Records all login attempts, blocks, and admin actions" "Database" {
                attemptLog = component "Attempt Log" "Stores: ip, email, timestamp, success/failure, reason" "Service"
                blockLog = component "Block Log" "Stores: ip, block_time, reason, unblock_time" "Service"
                
                attemptLog -> blockLog "Log blocking events"
            }
            
            attacker -> clientApp "Attempt login (multiple times from same IP)"
            clientApp -> loginGateway "POST /auth/login {email, password}"
            loginGateway -> failureCache "Check attempt count"
            loginGateway -> ipBlocklist "Check if IP is blocked"
            loginGateway -> apiServer "If not blocked, attempt auth"
            apiServer -> auditLog "Log all attempts"
            apiServer -> failureCache "Track failures"
            lockoutDetector -> ipBlocklist "Add IP to blocklist (5 failures in 15 min)"
            ipBlocklist -> notificationService "Notify user: IP blocked"
            notificationService -> auditLog "Log notification"
            admin -> adminDashboard "Monitor and manage blocked IPs"
            adminDashboard -> blocklistStore "Update blocklist"
            legitimateUser -> clientApp "Normal login attempt"
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
        
        component loginGateway {
            include *
            autolayout lr
        }
        
        component failureCache {
            include *
            autolayout lr
        }
        
        component ipBlocklist {
            include *
            autolayout lr
        }
        
        component apiServer {
            include *
            autolayout lr
        }
        
        component adminDashboard {
            include *
            autolayout lr
        }
        
        theme default
    }

}
