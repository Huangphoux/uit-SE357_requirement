workspace "ASR-SEC-08: Input Validation and Sanitization" "C1-C3 Model for 100% Input Validation Before Processing" {

    model {
        user = person "User" "Submits form data" "External"
        attacker = person "Attacker" "Attempts malicious input (XSS, injection)" "External"
        
        lmsSystem = softwareSystem "LMS System" "Validates and sanitizes 100% of user input" {
            clientApp = container "Client Application" "React + TypeScript" "User forms and UI" "WebBrowser" {
                textInputField = component "Text Input Field" "Captures user text input" "Service"
                emailInputField = component "Email Input Field" "Captures email addresses" "Service"
                numberInputField = component "Number Input Field" "Captures numeric values" "Service"
                fileInputField = component "File Input Field" "Captures file uploads" "Service"
                clientValidator = component "Client Validator" "Real-time validation (format, length, type)" "Service"
                
                textInputField -> clientValidator "Validate on input"
                emailInputField -> clientValidator "Validate format"
                numberInputField -> clientValidator "Validate range"
                fileInputField -> clientValidator "Validate file type/size"
            }
            
            apiServer = container "API Server" "Express.js + Node.js" "Receives and validates all input server-side" "Service" {
                inputReceiver = component "Input Receiver" "Receives form data, file uploads, JSON payloads" "Service"
                schemaValidator = component "Schema Validator" "Validates input against JSON schema (joi, zod)" "Service"
                typeValidator = component "Type Validator" "Ensures correct data types (string, number, boolean)" "Service"
                formatValidator = component "Format Validator" "Validates specific formats (email, URL, phone, date)" "Service"
                lengthValidator = component "Length Validator" "Validates min/max length for strings" "Service"
                rangeValidator = component "Range Validator" "Validates min/max values for numbers" "Service"
                fileValidator = component "File Validator" "Validates file type, size, extension whitelist" "Service"
                sanitizer = component "Sanitizer" "Removes/escapes potentially harmful content" "Service"
                requestLogger = component "Request Logger" "Logs all input validation results" "Service"
                
                inputReceiver -> schemaValidator "Validate schema"
                schemaValidator -> typeValidator "Check types"
                typeValidator -> formatValidator "Validate formats"
                formatValidator -> lengthValidator "Check length"
                lengthValidator -> rangeValidator "Check range"
                rangeValidator -> fileValidator "Validate files"
                fileValidator -> sanitizer "Sanitize input"
                sanitizer -> requestLogger "Log validation result"
            }
            
            database = container "Database" "PostgreSQL" "Only stores validated/sanitized data" "Database"
            
            validationErrorHandler = container "Validation Error Handler" "Error Response Service" "Returns validation errors to client" "Service" {
                errorFormatter = component "Error Formatter" "Formats validation error messages" "Service"
                errorLogger = component "Error Logger" "Logs validation failures for security analysis" "Service"
                
                errorFormatter -> errorLogger "Log error"
            }
            
            securityAuditLog = container "Security Audit Log" "Database" "Tracks all validation failures and suspicious input" "Database" {
                validationFailureLog = component "Validation Failure Log" "user_id, input, validation_rule_failed, timestamp" "Service"
                sqlInjectionAttempts = component "SQL Injection Attempts" "Logs attempts to inject SQL code" "Service"
                xssAttempts = component "XSS Attempts" "Logs attempts to inject scripts" "Service"
                pathTraversalAttempts = component "Path Traversal Attempts" "Logs attempts to access unauthorized files" "Service"
                
                sqlInjectionAttempts -> validationFailureLog "Log SQL injection"
                xssAttempts -> validationFailureLog "Log XSS"
                pathTraversalAttempts -> validationFailureLog "Log path traversal"
            }
            
            alertingService = container "Alerting Service" "Monitoring" "Alerts on repeated validation failures (possible attacks)" "Service"
            
            user -> clientApp "Enter form data"
            clientApp -> apiServer "POST /api/submit {data}"
            apiServer -> database "Only INSERT validated data"
            attacker -> clientApp "Attempt malicious input (XSS, SQL injection, etc.)"
            clientApp -> apiServer "POST /api/submit {malicious_data}"
            apiServer -> validationErrorHandler "Input validation failed"
            validationErrorHandler -> clientApp "400 Bad Request + error message"
            apiServer -> securityAuditLog "Log validation failure"
            securityAuditLog -> alertingService "Alert on repeated attacks from same IP/user"
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
        
        component validationErrorHandler {
            include *
            autolayout lr
        }
        
        component securityAuditLog {
            include *
            autolayout lr
        }
        
        theme default
    }

}
