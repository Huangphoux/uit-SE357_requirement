workspace "ASR-SEC-04: Multi-Factor Authentication for Admin" "C1-C3 Model for Mandatory MFA on Admin Dashboard Access" {

    model {
        admin = person "Admin User" "Accesses admin dashboard with MFA" "External"
        attacker = person "Attacker" "Attempts unauthorized admin access" "External"
        
        lmsSystem = softwareSystem "LMS System" "Enforces MFA for all admin account access" {
            clientApp = container "Client Application" "React + TypeScript" "Admin login portal" "WebBrowser" {
                adminLoginForm = component "Admin Login Form" "Captures admin email and password" "Service"
                mfaPrompt = component "MFA Prompt" "Displays MFA challenge (TOTP/SMS/Email)" "Service"
                
                adminLoginForm -> mfaPrompt "Trigger MFA after credential validation"
            }
            
            apiServer = container "API Server" "Express.js + Node.js" "Handles admin authentication and MFA verification" "Service" {
                adminAuthHandler = component "Admin Auth Handler" "Processes admin credentials and orchestrates MFA" "Service"
                credentialValidator = component "Credential Validator" "Validates admin email and password against secure store" "Service"
                mfaOrchestrator = component "MFA Orchestrator" "Coordinates MFA challenge based on user preference" "Service"
                mfaCodeGenerator = component "MFA Code Generator" "Generates time-based or one-time codes" "Service"
                sessionManager = component "Session Manager" "Creates secure admin session after MFA success" "Service"
                
                adminAuthHandler -> credentialValidator "Validate credentials"
                credentialValidator -> mfaOrchestrator "Trigger MFA challenge"
                mfaOrchestrator -> mfaCodeGenerator "Generate MFA code"
                mfaCodeGenerator -> sessionManager "Create session (after MFA verification)"
            }
            
            auditLog = container "Audit Log Service" "Database" "Records all admin access attempts, MFA challenges, and results" "Service"
            
            database = container "Database" "PostgreSQL" "Stores admin credentials and MFA settings" "Database" {
                adminAccountStore = component "Admin Account Store" "admin_id, email, password_hash, role, mfa_enabled" "Service"
                mfaSettingsStore = component "MFA Settings Store" "Stores: totp_secret, phone_number, backup_codes, mfa_method" "Service"
                
                mfaSettingsStore -> adminAccountStore "Link MFA settings to admin"
            }
            
            mfaProviders = container "MFA Providers" "Multi-Channel" "Delivers MFA codes via TOTP, SMS, Email" "Service" {
                totpGenerator = component "TOTP Generator" "Generates time-based one-time password (RFC 6238)" "Service"
                smsGateway = component "SMS Gateway" "Sends OTP via SMS" "Service"
                emailService = component "Email Service" "Sends OTP via Email" "Service"
                hardwareKeyValidator = component "Hardware Key Validator" "Validates FIDO2/WebAuthn hardware keys" "Service"
                
                totpGenerator -> smsGateway "Deliver via SMS"
                totpGenerator -> emailService "Deliver via Email"
                totpGenerator -> hardwareKeyValidator "Support hardware keys"
            }
            
            mfaVerifier = container "MFA Verification Engine" "Express Middleware" "Validates MFA codes within time window" "Service" {
                codeValidator = component "Code Validator" "Validates TOTP against current time window (30-sec)" "Service"
                timingValidator = component "Timing Validator" "Checks code expiry and prevents replay attacks" "Service"
                rateLimiter = component "MFA Rate Limiter" "Limits MFA attempts (3 tries per challenge)" "Service"
                
                codeValidator -> timingValidator "Verify within window"
                timingValidator -> rateLimiter "Check attempt count"
            }
            
            adminDashboard = container "Admin Dashboard" "Admin Portal" "Protected admin interface (requires MFA)" "Service" {
                accessControl = component "Access Control" "Enforces RBAC and resource permissions for admin" "Service"
                dashboardContent = component "Dashboard Content" "Admin functions: user management, system config, audit logs" "Service"
                
                accessControl -> dashboardContent "Grant access if authorized"
            }
            
            backupCodes = container "Backup Codes Storage" "Encrypted Database" "Stores one-time backup codes for account recovery" "Database" {
                codeStore = component "Backup Code Store" "10 single-use recovery codes per admin" "Service"
                usageTracker = component "Usage Tracker" "Tracks which backup codes have been used" "Service"
                
                usageTracker -> codeStore "Mark codes as used"
            }
            
            notificationService = container "Notification Service" "Email + SMS" "Alerts admin of suspicious activity" "Service" {
                mfaFailureNotifier = component "MFA Failure Notifier" "Sends alert after 3 failed MFA attempts" "Service"
                newDeviceNotifier = component "New Device Notifier" "Alerts when admin logs in from new IP/device" "Service"
                
                mfaFailureNotifier -> newDeviceNotifier "Track login patterns"
            }
            
            admin -> clientApp "Login to admin dashboard"
            clientApp -> apiServer "POST /admin/login {email, password}"
            apiServer -> database "Verify admin credentials and MFA settings"
            apiServer -> mfaProviders "Send MFA code via preferred method"
            mfaProviders -> clientApp "Display MFA prompt"
            clientApp -> mfaVerifier "Submit MFA code"
            mfaVerifier -> database "Verify code"
            mfaVerifier -> apiServer "MFA verification result"
            apiServer -> adminDashboard "Grant access"
            apiServer -> auditLog "Log admin access attempts"
            apiServer -> notificationService "Alert on anomalies"
            attacker -> clientApp "Attempt unauthorized admin access"
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
        
        component mfaProviders {
            include *
            autolayout lr
        }
        
        component mfaVerifier {
            include *
            autolayout lr
        }
        
        component database {
            include *
            autolayout lr
        }
        
        theme default
    }

}
