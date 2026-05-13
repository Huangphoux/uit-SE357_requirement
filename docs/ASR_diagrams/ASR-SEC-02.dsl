workspace "ASR-SEC-02: Secure Login with JWT Token" "C1-C3 Model for JWT-based Authentication with 1-Hour Token Expiry" {

    model {
        user = person "User" "Logs in with email and password" "External"
        
        lmsSystem = softwareSystem "LMS System" "Authenticates users and issues JWT tokens" {
            clientApp = container "Client Application" "React + TypeScript" "Login form UI" "WebBrowser" {
                loginForm = component "Login Form" "Captures email and password" "Service"
                tokenStorage = component "Token Storage" "Stores JWT tokens (localStorage/sessionStorage)" "Service"
                
                loginForm -> tokenStorage "Store tokens after login"
            }
            apiServer = container "API Server" "Express.js + Node.js" "Handles authentication and token generation" "Service" {
                loginHandler = component "Login Handler" "Receives login request and coordinates verification" "Service"
                emailValidator = component "Email Validator" "Validates email format and existence" "Service"
                passwordVerifier = component "Password Verifier" "Compares provided password hash with stored bcrypt hash" "Service"
                tokenGenerator = component "Token Generator" "Generates access token (1-hour) and refresh token (7-day)" "Service"
                rateLimiter = component "Rate Limiter" "Enforces login attempt limits (5 attempts / 15 min)" "Service"
                auditLogger = component "Audit Logger" "Logs login attempts (success/failure)" "Service"
                
                loginHandler -> rateLimiter "Check rate limit"
                rateLimiter -> emailValidator "Validate email"
                emailValidator -> passwordVerifier "Verify password hash"
                passwordVerifier -> tokenGenerator "Generate tokens (if valid)"
                tokenGenerator -> auditLogger "Log successful login"
            }
            database = container "Database" "PostgreSQL" "Stores user credentials and login audit logs" "Database" {
                userTable = component "User Table" "user_id, email, password_hash, created_at" "Service"
                loginAuditLog = component "Login Audit Log" "Logs all login attempts with timestamp, ip, status" "Service"
                
                userTable -> loginAuditLog "Log login event"
            }
            tokenValidator = container "Token Middleware" "Express Middleware" "Validates JWT tokens on protected routes" "Service" {
                tokenVerifier = component "Token Verifier" "Verifies JWT signature and expiry" "Service"
                payloadDecoder = component "Payload Decoder" "Decodes token to extract user_id" "Service"
                expiryChecker = component "Expiry Checker" "Checks if token is within 1-hour window" "Service"
                
                tokenVerifier -> expiryChecker "Check expiration"
                expiryChecker -> payloadDecoder "Extract user ID"
            }
            refreshTokenService = container "Refresh Token Service" "Express Endpoint" "Handles token refresh for expired access tokens" "Service" {
                refreshValidator = component "Refresh Validator" "Validates refresh token (7-day expiry)" "Service"
                newAccessTokenIssuer = component "New Access Token Issuer" "Issues new 1-hour access token" "Service"
                
                refreshValidator -> newAccessTokenIssuer "Issue new access token"
            }
            cache = container "Token Blacklist Cache" "Redis" "Stores blacklisted tokens (for logout)" "Service"
            
            user -> clientApp "Enter email + password"
            clientApp -> apiServer "POST /auth/login {email, password}"
            apiServer -> database "Query user and verify password"
            apiServer -> clientApp "Response: {accessToken, refreshToken} < 2 sec"
            clientApp -> tokenValidator "Include token in Authorization header"
            tokenValidator -> apiServer "Token valid, process request"
            clientApp -> refreshTokenService "POST /auth/refresh {refreshToken}"
            refreshTokenService -> apiServer "New access token issued"
            apiServer -> cache "Blacklist token on logout"
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
        
        component tokenValidator {
            include *
            autolayout lr
        }
        
        component refreshTokenService {
            include *
            autolayout lr
        }
        
        theme default
    }

}
