workspace "ASR-SEC-06: HTTPS/TLS Data Encryption in Transit" "C1-C3 Model for 100% Encrypted Traffic with HTTPS/TLS" {

    model {
        users = person "Users" "Access system securely" "External"
        
        lmsSystem = softwareSystem "LMS System" "Encrypts 100% of traffic with HTTPS/TLS" {
            clientApp = container "Client Application" "React + TypeScript" "Web application running in browser" "WebBrowser"
            
            caddy = container "Caddy Reverse Proxy" "Caddy Web Server" "Handles TLS termination, certificate management, and HTTPS enforcement" "Service" {
                certificateManager = component "Certificate Manager" "Manages SSL/TLS certificates (auto-renewal with Let's Encrypt)" "Service"
                tlsTerminator = component "TLS Terminator" "Performs TLS handshake, decrypts incoming HTTPS traffic" "Service"
                hstsEnforcer = component "HSTS Enforcer" "Sends Strict-Transport-Security headers to enforce HTTPS" "Service"
                httpRedirector = component "HTTP Redirector" "Redirects all HTTP requests to HTTPS (301 redirect)" "Service"
                
                certificateManager -> tlsTerminator "Provide certificates"
                tlsTerminator -> hstsEnforcer "Add HSTS headers"
                httpRedirector -> hstsEnforcer "Enforce HTTPS"
            }
            
            apiServer = container "API Server" "Express.js + Node.js" "Backend API (receives decrypted traffic from Caddy)" "Service" {
                requestHandler = component "Request Handler" "Processes decrypted requests" "Service"
                responseEncryptor = component "Response Preparer" "Prepares responses for Caddy to encrypt" "Service"
                
                requestHandler -> responseEncryptor "Prepare response"
            }
            
            database = container "Database" "PostgreSQL" "Persistent data store" "Database"
            
            certificateAuthority = container "Certificate Authority" "Let's Encrypt" "Issues and renews SSL/TLS certificates" "Service"
            
            cipherSuite = container "Cipher Suite Configuration" "TLS 1.2+ with Strong Ciphers" "Enforces modern encryption standards" "Service" {
                tlsVersionEnforcer = component "TLS Version Enforcer" "Enforces TLS 1.2 minimum (TLS 1.3 preferred)" "Service"
                cipherSelector = component "Cipher Selector" "Uses only modern, strong ciphers (ECDHE, ChaCha20, AES-GCM)" "Service"
                weakCipherBlocker = component "Weak Cipher Blocker" "Blocks deprecated/weak ciphers (3DES, RC4, MD5)" "Service"
                
                tlsVersionEnforcer -> cipherSelector "Select strong ciphers"
                cipherSelector -> weakCipherBlocker "Block weak ciphers"
            }
            
            securityHeaders = container "Security Headers" "HTTP Headers" "Additional security measures for transport" "Service" {
                hstsHeader = component "HSTS Header" "Strict-Transport-Security: max-age=31536000" "Service"
                contentSecurityPolicy = component "CSP Header" "Content-Security-Policy for client-side protection" "Service"
                xFrameOptions = component "X-Frame-Options" "Prevents clickjacking" "Service"
                
                hstsHeader -> contentSecurityPolicy "Apply headers"
                contentSecurityPolicy -> xFrameOptions "Layer protection"
            }
            
            monitoringService = container "Monitoring Service" "Prometheus + Grafana" "Monitors TLS health and certificate expiry" "Service" {
                certificateExpiryMonitor = component "Certificate Expiry Monitor" "Alerts when cert expires in <30 days" "Service"
                tlsVersionMonitor = component "TLS Version Monitor" "Ensures only TLS 1.2+ connections accepted" "Service"
                cipherMonitor = component "Cipher Monitor" "Tracks ciphers used, blocks non-compliant clients" "Service"
                
                certificateExpiryMonitor -> tlsVersionMonitor "Monitor TLS health"
                tlsVersionMonitor -> cipherMonitor "Track cipher usage"
            }
            
            users -> clientApp "User initiates HTTPS request"
            clientApp -> caddy "HTTPS encrypted request"
            caddy -> cipherSuite "Negotiate cipher suite with TLS 1.2+"
            caddy -> apiServer "Decrypted request (internal network)"
            apiServer -> database "Query database"
            database -> apiServer "Return data"
            apiServer -> caddy "Response"
            caddy -> clientApp "HTTPS encrypted response"
            monitoringService -> caddy "Monitor certificate and TLS"
            certificateAuthority -> caddy "Issue/renew SSL certificate"
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
        
        component caddy {
            include *
            autolayout lr
        }
        
        component cipherSuite {
            include *
            autolayout lr
        }
        
        component securityHeaders {
            include *
            autolayout lr
        }
        
        component monitoringService {
            include *
            autolayout lr
        }
        
        theme default
    }

}
