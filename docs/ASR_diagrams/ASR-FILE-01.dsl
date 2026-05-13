workspace "ASR-FILE-01: Concurrent Material Downloads" "C1-C3 Model for 500 Concurrent Downloads with 24/7 Availability" {

    model {
        students = person "Students" "Download course materials concurrently" "External"
        
        lmsSystem = softwareSystem "LMS System" "Supports 500 concurrent downloads 24/7" {
            cdnGlobal = container "Global CDN" "Cloudflare / CloudFront" "Edge nodes worldwide for geographic distribution" "Service" {
                edgeCache = component "Edge Cache" "Caches materials at edge locations" "Service"
                geoRouter = component "Geo Router" "Routes to nearest edge server" "Service"
                
                geoRouter -> edgeCache "Serve from edge"
            }
            
            loadBalancer = container "Load Balancer" "Caddy / HAProxy" "Distributes concurrent downloads across servers" "Service" {
                connectionDistributor = component "Connection Distributor" "Distributes TCP connections round-robin" "Service"
                healthMonitor = component "Health Monitor" "Checks backend server health" "Service"
                connectionRateLimiter = component "Connection Rate Limiter" "Limits per-IP concurrent connections (10-20 per user)" "Service"
                
                healthMonitor -> connectionDistributor "Route to healthy"
                connectionDistributor -> connectionRateLimiter "Rate limit"
            }
            
            apiServers = container "API Server Cluster" "Node.js + Express" "Multiple servers handling concurrent stream requests" "Service" {
                streamHandler1 = component "Stream Handler 1" "Handles 100 concurrent streams" "Service"
                streamHandler2 = component "Stream Handler 2" "Handles 100 concurrent streams" "Service"
                streamHandler3 = component "Stream Handler 3" "Handles 100 concurrent streams" "Service"
                streamHandler4 = component "Stream Handler 4" "Handles 100 concurrent streams" "Service"
                streamHandler5 = component "Stream Handler 5" "Handles 100 concurrent streams" "Service"
                
                streamHandler1 -> streamHandler2 "Distribute load"
            }
            
            fileStorageOptimized = container "File Storage (Optimized)" "S3 / Local NFS" "Stores materials with optimization for streaming" "Service" {
                storageCluster = component "Storage Cluster" "Multiple storage nodes (NFS or S3)" "Service"
                compressionCache = component "Compression Cache" "Pre-compressed versions of materials (gzip, brotli)" "Service"
                partialContentSupport = component "Partial Content Support" "Supports HTTP 206 Range requests for resume" "Service"
                
                compressionCache -> storageCluster "Store versions"
                partialContentSupport -> storageCluster "Support resume"
            }
            
            cacheLayer = container "Cache Layer" "Redis + Memcached" "Caches file metadata and hot materials" "Service" {
                metadataCache = component "Metadata Cache" "Caches file size, MIME type, checksum (1-day TTL)" "Service"
                hotMaterialCache = component "Hot Material Cache" "Caches frequently accessed materials in memory" "Service"
                compressionInfoCache = component "Compression Info Cache" "Caches which compression is best for each file" "Service"
                
                metadataCache -> hotMaterialCache "Manage cache"
            }
            
            streamingOptimization = container "Streaming Optimization" "Compression + Delivery" "Optimizes files for fast delivery" "Service" {
                onDemandCompressor = component "On-Demand Compressor" "Compresses files in real-time if requested" "Service"
                bandwidthThrottler = component "Bandwidth Throttler" "Throttles per-user bandwidth to fair-share (1-10 Mbps)" "Service"
                adaptiveBitrate = component "Adaptive Bitrate" "Adjusts quality based on client bandwidth" "Service"
                
                onDemandCompressor -> bandwidthThrottler "Optimize delivery"
                bandwidthThrottler -> adaptiveBitrate "Adaptive rate"
            }
            
            database = container "Database" "PostgreSQL" "Stores material metadata and download logs" "Database"
            
            connectionPool = container "Connection Pool" "Database Connection Management" "Manages limited DB connections (prevent exhaustion)" "Service" {
                dbConnectionPool = component "DB Connection Pool" "Max 50-100 connections per server" "Service"
                idleConnectionReaper = component "Idle Connection Reaper" "Closes idle connections after 5 min" "Service"
                
                idleConnectionReaper -> dbConnectionPool "Manage connections"
            }
            
            monitoringService = container "Monitoring Service" "Prometheus + Grafana" "Monitors download performance and availability" "Service" {
                concurrencyMonitor = component "Concurrency Monitor" "Tracks current concurrent downloads" "Service"
                latencyMonitor = component "Latency Monitor" "Tracks download time (p50, p95, p99)" "Service"
                bandwidthMonitor = component "Bandwidth Monitor" "Tracks total bandwidth usage" "Service"
                availabilityMonitor = component "Availability Monitor" "Ensures 24/7 uptime (99.9%+)" "Service"
                
                concurrencyMonitor -> latencyMonitor "Monitor performance"
                latencyMonitor -> bandwidthMonitor "Track usage"
                bandwidthMonitor -> availabilityMonitor "Availability"
            }
            
            auditLog = container "Audit Log" "Database" "Logs download events for analytics" "Database" {
                downloadLog = component "Download Log" "user_id, file_id, timestamp, bytes_transferred, duration" "Service"
                perfLog = component "Performance Log" "Tracks download latency and completion rates" "Service"
                
                perfLog -> downloadLog "Log downloads"
            }
            
            students -> cdnGlobal "Request material download"
            cdnGlobal -> loadBalancer "Route to load balancer if not cached"
            loadBalancer -> apiServers "Distribute concurrent requests (500 total)"
            apiServers -> cacheLayer "Check metadata cache"
            cacheLayer -> fileStorageOptimized "If not cached, fetch from storage"
            fileStorageOptimized -> streamingOptimization "Optimize for streaming (compress, throttle)"
            streamingOptimization -> apiServers "Stream to client"
            apiServers -> students "HTTP stream with 206 Range support"
            apiServers -> database "Fetch material info"
            apiServers -> auditLog "Log download event"
            monitoringService -> apiServers "Monitor concurrent connections"
            monitoringService -> loadBalancer "Monitor load balancer"
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
        
        component cdnGlobal {
            include *
            autolayout lr
        }
        
        component loadBalancer {
            include *
            autolayout lr
        }
        
        component apiServers {
            include *
            autolayout lr
        }
        
        component fileStorageOptimized {
            include *
            autolayout lr
        }
        
        component cacheLayer {
            include *
            autolayout lr
        }
        
        component streamingOptimization {
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
