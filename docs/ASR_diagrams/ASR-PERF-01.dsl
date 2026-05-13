workspace "ASR-PERF-01: 500 Concurrent Users Performance" "C1-C3 Model for High Concurrency with Load Balancing and Caching" {

    model {
        users = person "500 Concurrent Users" "Users accessing the system simultaneously" "External"
        
        lmsSystem = softwareSystem "LMS System" "Handles 500 concurrent requests with load balancing and caching" {
            loadBalancer = container "Load Balancer" "Caddy" "Distributes incoming requests across multiple API server instances" "Service" {
                requestRouter = component "Request Router" "Routes incoming requests to available API servers using round-robin" "Service"
                healthChecker = component "Health Checker" "Monitors API server health and removes unhealthy instances" "Service"
                rateLimiter = component "Rate Limiter" "Prevents single user from overwhelming the system" "Service"
                
                requestRouter -> healthChecker "Check server status"
                rateLimiter -> requestRouter "Pass through if within limits"
            }
            apiServer1 = container "API Server Instance 1" "Express.js + Node.js" "Processes business logic for a portion of concurrent requests" "Service"
            apiServer2 = container "API Server Instance 2" "Express.js + Node.js" "Processes business logic for a portion of concurrent requests" "Service"
            apiServer3 = container "API Server Instance 3" "Express.js + Node.js" "Processes business logic for a portion of concurrent requests" "Service"
            cache = container "Cache Layer" "Redis" "Caches frequently accessed data (courses, users, materials) to reduce database hits" "Service" {
                cacheManager = component "Cache Manager" "Manages cache entries and expiration" "Service"
                cacheStore = component "Cache Store" "In-memory Redis data store" "Service"
                cacheEviction = component "Cache Eviction" "LRU policy to manage memory" "Service"
                
                cacheManager -> cacheStore "Store/retrieve cached data"
                cacheManager -> cacheEviction "Evict expired entries"
            }
            database = container "Database" "PostgreSQL" "Persistent data store for all application data" "Database"
            fileServer = container "File Server" "Local/Cloud Storage" "Stores and serves course materials and submissions" "Service"
            
            loadBalancer -> apiServer1 "Routes ~167 requests/sec"
            loadBalancer -> apiServer2 "Routes ~167 requests/sec"
            loadBalancer -> apiServer3 "Routes ~167 requests/sec"
            
            apiServer1 -> cache "Query cache first"
            apiServer2 -> cache "Query cache first"
            apiServer3 -> cache "Query cache first"
            
            cache -> database "Cache miss: fetch from DB"
            
            apiServer1 -> database "Direct queries for non-cached data"
            apiServer2 -> database "Direct queries for non-cached data"
            apiServer3 -> database "Direct queries for non-cached data"
            
            apiServer1 -> fileServer "Fetch materials/files"
            apiServer2 -> fileServer "Fetch materials/files"
            apiServer3 -> fileServer "Fetch materials/files"
        }
        
        users -> lmsSystem "Send 500 concurrent requests"
        
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
        
        component loadBalancer {
            include *
            autolayout lr
        }
        
        component cache {
            include *
            autolayout lr
        }
        
        theme default
    }

}
