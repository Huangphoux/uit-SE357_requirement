workspace "ASR-SEC-09: SQL Injection Prevention" "C1-C3 Model for SQL Injection Attack Prevention" {

    model {
        attacker = person "Attacker" "Malicious actor attempting SQL injection" "External"
        user = person "Legitimate User" "Regular system user"
        
        lmsSystem = softwareSystem "LMS System" "Learning Management System with SQL injection protection" {
            clientApp = container "Client Application" "React + TypeScript" "Web browser UI for form input and requests" "WebBrowser"
            apiServer = container "API Server" "Express.js + Node.js" "REST API that processes requests and coordinates business logic" "Service"
            prismaORM = container "Prisma ORM" "Node.js Library" "Object-Relational Mapper that converts queries to parameterized form" "Service" {
                inputValidator = component "Input Validator" "Validates input format and type" "Service"
                queryBuilder = component "Query Builder" "Constructs database queries with parameter placeholders" "Service"
                parameterBinder = component "Parameter Binder" "Binds user input as parameters (not SQL code)" "Service"
                queryExecutor = component "Query Executor" "Sends parameterized query to database" "Service"
                resultMapper = component "Result Mapper" "Maps database results back to JavaScript objects" "Service"
                
                inputValidator -> queryBuilder "Validated input"
                queryBuilder -> parameterBinder "Query with placeholders"
                parameterBinder -> queryExecutor "Parameterized query + parameters"
                queryExecutor -> resultMapper "Raw results"
            }
            database = container "Database" "PostgreSQL / SQLite" "Stores course data, user information, and submissions" "Database"
            
            clientApp -> apiServer "Sends API requests (with user input)"
            apiServer -> prismaORM "Calls query builders"
            prismaORM -> database "Executes parameterized queries"
        }
        
        attacker -> clientApp "Attempts SQL injection via form input"
        user -> clientApp "Submits form data normally"
        
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
        
        component prismaORM {
            include *
            autolayout lr
        }
        
        theme default
    }

}
