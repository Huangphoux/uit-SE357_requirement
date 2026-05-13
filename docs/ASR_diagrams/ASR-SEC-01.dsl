workspace "ASR-SEC-01: Secure Password Registration" "C1-C3 Model for Secure User Registration with Password Validation and Bcrypt Hashing" {

    model {
        newUser = person "New User" "Registers account with password" "External"
        
        lmsSystem = softwareSystem "LMS System" "Securely handles user registration with strong password requirements" {
            clientApp = container "Client Application" "React + TypeScript" "Registration form UI" "WebBrowser" {
                passwordInput = component "Password Input" "Captures password from user" "Service"
                clientValidator = component "Client Validator" "Real-time password strength feedback (≥8 chars, uppercase, lowercase, numbers)" "Service"
                
                passwordInput -> clientValidator "Validate on input"
            }
            apiServer = container "API Server" "Express.js + Node.js" "Handles registration logic and validation" "Service" {
                registrationHandler = component "Registration Handler" "Receives registration request and orchestrates validation/storage" "Service"
                passwordValidator = component "Password Validator" "Server-side validation: ≥8 chars, uppercase, lowercase, digits, special chars" "Service"
                bcryptHasher = component "Bcrypt Hasher" "Hashes password with bcrypt (salt rounds ≥10)" "Service"
                userCreator = component "User Creator" "Creates user record with hashed password" "Service"
                auditLogger = component "Audit Logger" "Logs registration event for security audit" "Service"
                
                registrationHandler -> passwordValidator "Validate password"
                passwordValidator -> bcryptHasher "Hash password (if valid)"
                bcryptHasher -> userCreator "Store hashed password"
                userCreator -> auditLogger "Log successful registration"
            }
            database = container "Database" "PostgreSQL" "Stores user accounts with hashed passwords" "Database" {
                userTable = component "User Table" "Stores user_id, email, password_hash, created_at" "Service"
                passwordHashStorage = component "Password Hash Storage" "Securely stores bcrypt hashes (never plain text)" "Service"
                
                passwordHashStorage -> userTable "Link password to user"
            }
            notificationService = container "Notification Service" "Email Service" "Sends registration confirmation email" "Service" {
                emailComposer = component "Email Composer" "Generates registration confirmation email" "Service"
                emailSender = component "Email Sender" "Sends email via SMTP/SendGrid" "Service"
                
                emailComposer -> emailSender "Send email"
            }
            
            newUser -> clientApp "Register with email + password"
            clientApp -> apiServer "POST /auth/register {email, password}"
            apiServer -> database "Store user with hashed password"
            apiServer -> notificationService "Send confirmation email"
            apiServer -> clientApp "Response: success/error"
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
        
        component database {
            include *
            autolayout lr
        }
        
        component notificationService {
            include *
            autolayout lr
        }
        
        theme default
    }

}
