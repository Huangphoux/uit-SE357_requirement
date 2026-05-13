workspace "ASR-AGGR-01: Platform Statistics Dashboard" "C1-C3 Model for Admin Dashboard with 5-Second Aggregation Response Time" {

    model {
        admin = person "Admin" "Views platform statistics and metrics" "External"
        
        lmsSystem = softwareSystem "LMS System" "Displays aggregated platform statistics with < 5 sec response" {
            clientApp = container "Admin Dashboard" "React + TypeScript" "Statistics dashboard UI with charts" "WebBrowser"
            
            apiServer = container "API Server" "Express.js + Node.js" "Handles statistics requests" "Service" {
                statsRequestHandler = component "Stats Request Handler" "Receives requests for aggregated data" "Service"
                cacheValidator = component "Cache Validator" "Checks if cached data is fresh (< 5 min old)" "Service"
                queryCoordinator = component "Query Coordinator" "Orchestrates aggregation queries" "Service"
                
                statsRequestHandler -> cacheValidator "Check cache"
                cacheValidator -> queryCoordinator "Coordinate query"
            }
            
            cacheLayer = container "Cache Layer" "Redis" "Caches aggregated statistics (5-minute TTL)" "Service" {
                aggregationCache = component "Aggregation Cache" "Stores: user_count, course_count, enrollment_stats, grades" "Service"
                cacheTTL = component "Cache TTL Manager" "Expires cache after 5 minutes, forces refresh" "Service"
                cacheKeyGenerator = component "Cache Key Generator" "Generates cache keys by aggregation type and filter" "Service"
                
                cacheTTL -> aggregationCache "Manage expiry"
                cacheKeyGenerator -> aggregationCache "Key management"
            }
            
            aggregationEngine = container "Aggregation Engine" "Data Processing" "Computes aggregations from large dataset" "Service" {
                dataFetcher = component "Data Fetcher" "Queries 10000+ records efficiently from database" "Service"
                aggregator = component "Aggregator" "Groups, counts, sums, averages (GROUP BY, COUNT, SUM, AVG)" "Service"
                filterEngine = component "Filter Engine" "Applies date range, course, user filters" "Service"
                resultProcessor = component "Result Processor" "Formats results for chart consumption" "Service"
                performanceOptimizer = component "Performance Optimizer" "Uses database indexes to stay < 5 sec" "Service"
                
                dataFetcher -> aggregator "Fetch data"
                aggregator -> filterEngine "Apply filters"
                filterEngine -> performanceOptimizer "Optimize query"
                performanceOptimizer -> resultProcessor "Process result"
            }
            
            database = container "Database" "PostgreSQL with Indexes" "Stores 10000+ enrollment, grade, and activity records" "Database" {
                enrollmentsTable = component "Enrollments Table" "student_id, course_id, enrollment_date" "Service"
                gradesTable = component "Grades Table" "student_id, course_id, assignment_id, score" "Service"
                activityTable = component "Activity Table" "user_id, action, timestamp, resource_type" "Service"
                indexManager = component "Index Manager" "Indexes on: course_id, enrollment_date, created_at" "Service"
                
                indexManager -> enrollmentsTable "Index enrollments"
                indexManager -> gradesTable "Index grades"
                indexManager -> activityTable "Index activity"
            }
            
            chartGenerator = container "Chart Generator" "Chart Library" "Generates charts from aggregated data" "Service" {
                barChartBuilder = component "Bar Chart Builder" "Builds bar charts (courses vs enrollments)" "Service"
                lineChartBuilder = component "Line Chart Builder" "Builds line charts (trends over time)" "Service"
                pieChartBuilder = component "Pie Chart Builder" "Builds pie charts (distribution by role)" "Service"
                dataFormatter = component "Data Formatter" "Formats aggregated data for D3/Chart.js" "Service"
                
                barChartBuilder -> dataFormatter "Format data"
                lineChartBuilder -> dataFormatter "Format data"
                pieChartBuilder -> dataFormatter "Format data"
            }
            
            monitoringService = container "Monitoring Service" "Prometheus + Grafana" "Monitors aggregation performance" "Service" {
                responseTimeMonitor = component "Response Time Monitor" "Tracks p50, p95, p99 response times" "Service"
                queryPerformanceMonitor = component "Query Performance Monitor" "Tracks database query execution time" "Service"
                cacheHitRateMonitor = component "Cache Hit Rate Monitor" "Tracks cache effectiveness (target: 80%+ hit rate)" "Service"
                alerting = component "Alerting" "Alerts if response time exceeds 5 seconds" "Service"
                
                responseTimeMonitor -> queryPerformanceMonitor "Monitor queries"
                queryPerformanceMonitor -> cacheHitRateMonitor "Track cache"
                cacheHitRateMonitor -> alerting "Alert on SLA breach"
            }
            
            auditLog = container "Audit Log" "Database" "Logs all statistics queries for security audit" "Database" {
                statsQueryLog = component "Stats Query Log" "admin_id, query_type, filters, timestamp, response_time" "Service"
                
                statsQueryLog -> statsQueryLog "Self-reference"
            }
            
            admin -> clientApp "View admin dashboard"
            clientApp -> apiServer "GET /api/stats/dashboard"
            apiServer -> cacheLayer "Check cache (key: dashboard_stats)"
            cacheLayer -> apiServer "Cache HIT or MISS"
            apiServer -> aggregationEngine "Query if cache expired"
            aggregationEngine -> database "Query 10000+ records"
            database -> aggregationEngine "Return raw data"
            aggregationEngine -> chartGenerator "Format for charts"
            chartGenerator -> cacheLayer "Store in cache (5-min TTL)"
            cacheLayer -> apiServer "Return aggregated data"
            apiServer -> clientApp "Return stats + charts (< 5 sec)"
            apiServer -> monitoringService "Track response time"
            apiServer -> auditLog "Log stats query"
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
        
        component apiServer {
            include *
            autolayout lr
        }
        
        component cacheLayer {
            include *
            autolayout lr
        }
        
        component aggregationEngine {
            include *
            autolayout lr
        }
        
        component database {
            include *
            autolayout lr
        }
        
        component chartGenerator {
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
