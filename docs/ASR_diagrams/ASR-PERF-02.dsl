workspace "ASR-PERF-02: Large Dataset Queries with Pagination" "C1-C3 Model for Querying 10000+ Records with Pagination and Indexing" {

    model {
        user = person "User" "Requests lists of courses, students, or assignments" "External"
        
        lmsSystem = softwareSystem "LMS System" "Efficiently queries large datasets with pagination and indexing" {
            clientApp = container "Client Application" "React + TypeScript" "Displays paginated results to users" "WebBrowser"
            apiServer = container "API Server" "Express.js + Node.js" "Handles list queries with pagination logic" "Service" {
                paginationHandler = component "Pagination Handler" "Calculates offset/limit and validates page parameters" "Service"
                queryOptimizer = component "Query Optimizer" "Builds optimized queries with proper filters and sorting" "Service"
                resultSerializer = component "Result Serializer" "Converts database results to JSON response with metadata (total, page, hasNext)" "Service"
                
                paginationHandler -> queryOptimizer "Page size and offset"
                queryOptimizer -> resultSerializer "Query results"
            }
            database = container "Database" "PostgreSQL with Indexes" "Stores 10000+ records with optimized indexes for fast queries" "Database" {
                indexManager = component "Index Manager" "Maintains indexes on course_id, student_id, assignment_id, created_at" "Service"
                queryExecutor = component "Query Executor" "Executes queries using indexes for fast retrieval" "Service"
                resultFetcher = component "Result Fetcher" "Fetches paginated rows from database" "Service"
                
                indexManager -> queryExecutor "Use index for lookup"
                queryExecutor -> resultFetcher "Fetch paginated results"
            }
            cache = container "Query Cache" "Redis" "Caches frequently accessed paginated results" "Service"
            
            clientApp -> apiServer "Request: GET /courses?page=1&limit=20"
            apiServer -> database "SELECT * FROM courses LIMIT 20 OFFSET 0"
            apiServer -> cache "Check cached results"
            database -> apiServer "Return paginated rows"
            apiServer -> clientApp "Response: [{...}, {...}] + metadata"
        }
        
        user -> clientApp "Browse courses/students/assignments"
        
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
        
        component database {
            include *
            autolayout lr
        }
        
        theme default
    }

}
