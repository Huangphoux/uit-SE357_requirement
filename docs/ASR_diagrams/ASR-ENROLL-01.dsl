workspace "ASR-ENROLL-01: Concurrent Enrollment Processing" "C1-C3 Model for Handling 500 Concurrent Enrollment Requests in < 2 Seconds" {

    model {
        students = person "500 Students" "Enroll in courses simultaneously" "External"
        
        lmsSystem = softwareSystem "LMS System" "Handles 500 concurrent enrollments in < 2 seconds" {
            clientApp = container "Client Application" "React + TypeScript" "Course enrollment form" "WebBrowser"
            
            loadBalancer = container "Load Balancer" "Caddy / HAProxy" "Distributes 500 concurrent enrollment requests" "Service" {
                requestDistributor = component "Request Distributor" "Balances across 5 API servers" "Service"
                connectionThrottler = component "Connection Throttler" "Throttles connections per IP (max 10 per user)" "Service"
                
                requestDistributor -> connectionThrottler "Throttle if needed"
            }
            
            apiServers = container "API Server Cluster" "Node.js + Express" "Handles 100 concurrent enrollments per server" "Service" {
                enrollmentHandler1 = component "Enrollment Handler 1" "Processes enrollment requests" "Service"
                enrollmentHandler2 = component "Enrollment Handler 2" "Processes enrollment requests" "Service"
                enrollmentHandler3 = component "Enrollment Handler 3" "Processes enrollment requests" "Service"
                enrollmentHandler4 = component "Enrollment Handler 4" "Processes enrollment requests" "Service"
                enrollmentHandler5 = component "Enrollment Handler 5" "Processes enrollment requests" "Service"
                
                enrollmentHandler1 -> enrollmentHandler2 "Parallel processing"
            }
            
            enrollmentLogic = container "Enrollment Processing Logic" "Core Business Logic" "Validates and processes enrollments" "Service" {
                courseValidator = component "Course Validator" "Verifies course exists and is open for enrollment" "Service"
                prerequisiteChecker = component "Prerequisite Checker" "Checks student completed prerequisites" "Service"
                quotaChecker = component "Quota Checker" "Verifies course has available seats" "Service"
                conflictDetector = component "Conflict Detector" "Detects schedule conflicts with existing enrollments" "Service"
                enrollmentCreator = component "Enrollment Creator" "Creates enrollment record in database" "Service"
                
                courseValidator -> prerequisiteChecker "Validate course"
                prerequisiteChecker -> quotaChecker "Check prerequisites"
                quotaChecker -> conflictDetector "Check quota"
                conflictDetector -> enrollmentCreator "Create if valid"
            }
            
            cache = container "Cache Layer" "Redis" "Caches course info and student enrollments for fast lookups" "Service" {
                courseInfoCache = component "Course Info Cache" "course_id, name, quota, capacity (TTL: 5 min)" "Service"
                enrollmentCache = component "Enrollment Cache" "Caches student's current enrollments by user_id (TTL: 2 min)" "Service"
                quotaCache = component "Quota Cache" "Caches remaining seats per course (TTL: 1 sec)" "Service"
                
                courseInfoCache -> enrollmentCache "Share cache"
                enrollmentCache -> quotaCache "Update quotas"
            }
            
            database = container "Database" "PostgreSQL with Transactions" "Stores enrollments with ACID guarantees" "Database" {
                enrollmentsTable = component "Enrollments Table" "student_id, course_id, enrollment_date (unique constraint)" "Service"
                coursesTable = component "Courses Table" "course_id, name, capacity, current_enrollment" "Service"
                transactionManager = component "Transaction Manager" "Uses transactions to prevent double-enrollment" "Service"
                lockManager = component "Lock Manager" "Optimistic locking to prevent quota race conditions" "Service"
                
                transactionManager -> enrollmentsTable "Atomic insert"
                lockManager -> coursesTable "Prevent oversell"
            }
            
            deadlockPrevention = container "Deadlock Prevention" "Concurrency Control" "Prevents database deadlocks under high load" "Service" {
                lockOrdering = component "Lock Ordering" "Orders locks by course_id to prevent circular waits" "Service"
                deadlockRetry = component "Deadlock Retry Handler" "Retries enrollment if deadlock detected (3 retries with exponential backoff)" "Service"
                lockTimeout = component "Lock Timeout" "Sets short timeout (500ms) to fail fast on conflicts" "Service"
                
                lockOrdering -> deadlockRetry "Handle deadlocks"
                deadlockRetry -> lockTimeout "Timeout management"
            }
            
            queueFallback = container "Queue Fallback" "RabbitMQ / Redis" "Queues enrollments if database is overloaded" "Service" {
                overloadDetector = component "Overload Detector" "Monitors database response time (target: < 100ms)" "Service"
                enqueuingService = component "Enqueueing Service" "Queues enrollment for async processing" "Service"
                backgroundWorker = component "Background Worker" "Processes queued enrollments asynchronously" "Service"
                
                overloadDetector -> enqueuingService "Queue if overloaded"
                enqueuingService -> backgroundWorker "Process async"
            }
            
            responseHandler = container "Response Handler" "HTTP Responses" "Returns enrollment results" "Service" {
                successResponse = component "Success Response" "Returns 200 with enrollment confirmation" "Service"
                errorResponse = component "Error Response" "Returns 409 (conflict), 400 (validation error), 500 (retry)" "Service"
                
                errorResponse -> successResponse "Send response"
            }
            
            monitoringService = container "Monitoring Service" "Prometheus + Grafana" "Monitors enrollment throughput and latency" "Service" {
                concurrencyMonitor = component "Concurrency Monitor" "Tracks concurrent enrollment requests (target: 500)" "Service"
                latencyMonitor = component "Latency Monitor" "Tracks response time p50/p95/p99 (target: < 2 sec)" "Service"
                successRateMonitor = component "Success Rate Monitor" "Tracks successful vs failed enrollments" "Service"
                databaseMonitor = component "Database Monitor" "Tracks DB query latency, locks, deadlocks" "Service"
                
                concurrencyMonitor -> latencyMonitor "Monitor latency"
                latencyMonitor -> successRateMonitor "Track success"
                successRateMonitor -> databaseMonitor "Monitor DB"
            }
            
            auditLog = container "Audit Log" "Database" "Logs all enrollment attempts" "Database" {
                enrollmentLog = component "Enrollment Log" "student_id, course_id, status (success/failed), reason, timestamp" "Service"
                performanceLog = component "Performance Log" "Tracks response time for each enrollment request" "Service"
                
                performanceLog -> enrollmentLog "Log enrollments"
            }
            
            students -> clientApp "Request to enroll in course"
            clientApp -> loadBalancer "POST /enroll {student_id, course_id}"
            loadBalancer -> apiServers "Distribute across 5 servers (100 each)"
            apiServers -> cache "Check course info + student enrollments"
            apiServers -> enrollmentLogic "Validate and process"
            enrollmentLogic -> deadlockPrevention "Apply optimistic locking"
            deadlockPrevention -> database "Insert enrollment (transaction)"
            database -> cache "Update quota cache (if room available)"
            apiServers -> responseHandler "Prepare response"
            responseHandler -> clientApp "Return result (< 2 sec)"
            apiServers -> auditLog "Log enrollment attempt"
            apiServers -> monitoringService "Track performance"
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
        
        component loadBalancer {
            include *
            autolayout lr
        }
        
        component apiServers {
            include *
            autolayout lr
        }
        
        component enrollmentLogic {
            include *
            autolayout lr
        }
        
        component cache {
            include *
            autolayout lr
        }
        
        component database {
            include *
            autolayout lr
        }
        
        component deadlockPrevention {
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
