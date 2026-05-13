workspace "ASR-SEC-15: API Rate Limiting" "C1-C3 Model for Rate Limiting on Login and API Endpoints" {

    model {
        legitimateUser = person "Legitimate User" "Makes normal API requests" "External"
        attacker = person "Attacker" "Attempts brute force or DoS attack" "External"
        
        lmsSystem = softwareSystem "LMS System" "Applies rate limiting to all API endpoints" {
            clientApp = container "Client Application" "React + TypeScript" "Makes API requests" "WebBrowser"
            
            apiGateway = container "API Gateway" "Express Middleware + Rate Limiter" "Entry point with rate limiting" "Service" {
                ipExtractor = component "IP Extractor" "Extracts client IP from request" "Service"
                endpointRouter = component "Endpoint Router" "Routes to appropriate rate limiter based on endpoint" "Service"
                rateLimiterMiddleware = component "Rate Limiter Middleware" "Applies rate limiting rules" "Service"
                requestCounter = component "Request Counter" "Counts requests per IP/user" "Service"
                
                ipExtractor -> endpointRouter "Extract IP"
                endpointRouter -> rateLimiterMiddleware "Apply limit"
                rateLimiterMiddleware -> requestCounter "Track count"
            }
            
            rateLimitConfiguration = container "Rate Limit Configuration" "Settings Service" "Defines rate limits for different endpoints" "Service" {
                loginLimit = component "Login Limit" "5 attempts per IP per 15 minutes" "Service"
                apiEndpointLimit = component "API Endpoint Limit" "100 requests per IP per 1 minute (general endpoints)" "Service"
                searchLimit = component "Search Limit" "50 requests per IP per 1 minute (expensive endpoints)" "Service"
                downloadLimit = component "Download Limit" "20 downloads per IP per 1 hour (file endpoints)" "Service"
                authenticatedUserLimit = component "Authenticated User Limit" "500 requests per user per 1 minute (higher for logged-in)" "Service"
                
                loginLimit -> apiEndpointLimit "Define limits"
            }
            
            redisStore = container "Redis Rate Limit Store" "Distributed Cache" "Stores rate limit counters for distributed systems" "Service" {
                counterStore = component "Counter Store" "ip:{ip}:endpoint -> count, ttl" "Service"
                distributedSync = component "Distributed Sync" "Syncs counts across multiple API server instances" "Service"
                ttlManager = component "TTL Manager" "Manages counter expiration (1 min, 15 min, 1 hour based on limit)" "Service"
                
                counterStore -> distributedSync "Sync across servers"
                ttlManager -> counterStore "Manage expiry"
            }
            
            apiServer = container "API Server Instances" "Express.js + Node.js" "Only processes requests within rate limits" "Service" {
                loginHandler = component "Login Handler" "Receives requests rate-limited to 5/15min" "Service"
                apiHandler = component "API Handler" "Receives requests rate-limited to 100/min" "Service"
                searchHandler = component "Search Handler" "Receives requests rate-limited to 50/min" "Service"
                
                loginHandler -> apiHandler "Route request"
            }
            
            responseHandler = container "Response Handler" "Rate Limit Responses" "Returns rate limit info to clients" "Service" {
                allowedResponse = component "Allowed Response" "Returns 200 with RateLimit headers (remaining, reset time)" "Service"
                blockedResponse = component "Blocked Response" "Returns 429 Too Many Requests with retry-after header" "Service"
                
                blockedResponse -> allowedResponse "Send response"
            }
            
            auditLog = container "Audit Log" "Database" "Logs rate limit violations and attacks" "Database" {
                rateLimitViolationLog = component "Rate Limit Violation Log" "ip, endpoint, attempts, timestamp" "Service"
                attackDetectionLog = component "Attack Detection Log" "Logs suspected attacks (10+ violations from same IP)" "Service"
                
                attackDetectionLog -> rateLimitViolationLog "Log violations"
            }
            
            alertingService = container "Alerting Service" "Monitoring + Notifications" "Alerts on rate limit abuse" "Service" {
                bruteForceDetector = component "Brute Force Detector" "Detects brute force (100+ login attempts in 15 min)" "Service"
                dosDetector = component "DoS Detector" "Detects DoS patterns (1000+ requests from single IP in 1 min)" "Service"
                adminAlert = component "Admin Alert" "Sends alerts to security team" "Service"
                clientNotification = component "Client Notification" "Notifies user when rate limited" "Service"
                
                bruteForceDetector -> dosDetector "Detect attacks"
                dosDetector -> adminAlert "Alert admins"
                adminAlert -> clientNotification "Notify client"
            }
            
            blacklist = container "IP Blacklist" "Temporary/Permanent" "Stores IPs that should be rate limited aggressively" "Service" {
                temporaryBlacklist = component "Temporary Blacklist" "IPs blocked for 1-24 hours (auto-lift)" "Service"
                permanentBlacklist = component "Permanent Blacklist" "IPs blocked until admin intervention" "Service"
                
                temporaryBlacklist -> permanentBlacklist "Escalate if repeated"
            }
            
            legitimateUser -> clientApp "Make API request (login)"
            clientApp -> apiGateway "POST /auth/login {credentials}"
            apiGateway -> rateLimitConfiguration "Check login limit"
            apiGateway -> redisStore "Get counter for IP"
            redisStore -> apiGateway "Count: 1/5"
            apiGateway -> apiServer "Pass request (within limit)"
            apiServer -> responseHandler "Return 200 + RateLimit headers"
            responseHandler -> clientApp "Response + remaining requests info"
            
            attacker -> clientApp "Attempt 100 login requests in 1 minute"
            clientApp -> apiGateway "POST /auth/login (repeated)"
            apiGateway -> redisStore "Increment counter"
            redisStore -> apiGateway "Count: 6/5 (EXCEEDED)"
            apiGateway -> responseHandler "Block request"
            responseHandler -> clientApp "429 Too Many Requests (retry after 15 min)"
            apiGateway -> auditLog "Log rate limit violation"
            auditLog -> alertingService "Detect brute force pattern"
            alertingService -> blacklist "Add IP to temporary blacklist"
            alertingService -> clientApp "Notify: account temporarily locked"
            
            clientApp -> apiGateway "GET /api/courses (normal API request)"
            apiGateway -> rateLimitConfiguration "Check general API limit (100/min)"
            apiGateway -> apiServer "Pass request"
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
        
        component apiGateway {
            include *
            autolayout lr
        }
        
        component rateLimitConfiguration {
            include *
            autolayout lr
        }
        
        component redisStore {
            include *
            autolayout lr
        }
        
        component apiServer {
            include *
            autolayout lr
        }
        
        component responseHandler {
            include *
            autolayout lr
        }
        
        component auditLog {
            include *
            autolayout lr
        }
        
        component alertingService {
            include *
            autolayout lr
        }
        
        component blacklist {
            include *
            autolayout lr
        }
        
        theme default
    }

}
