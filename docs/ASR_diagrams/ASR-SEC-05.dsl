workspace "ASR-SEC-05: Role-Based Access Control (RBAC)" "C1-C3 Model for Enforcing 100% Permission Checks on All Requests" {

    model {
        regularUser = person "Regular User" "Accesses resources within assigned roles" "External"
        admin = person "Admin" "Manages roles and permissions" "External"
        attacker = person "Attacker" "Attempts to access unauthorized resources" "External"
        
        lmsSystem = softwareSystem "LMS System" "Enforces RBAC on all requests" {
            clientApp = container "Client Application" "React + TypeScript" "User interface" "WebBrowser"
            
            apiGateway = container "API Gateway" "Express Middleware" "Entry point for all API requests" "Service" {
                authMiddleware = component "Authentication Middleware" "Verifies JWT token and extracts user_id" "Service"
                rbacMiddleware = component "RBAC Middleware" "Intercepts all requests and enforces permissions" "Service"
                permissionEnforcer = component "Permission Enforcer" "Checks if user has required permission for resource/action" "Service"
                accessDecision = component "Access Decision Engine" "Returns allow/deny based on role permissions" "Service"
                
                authMiddleware -> rbacMiddleware "Pass authenticated user"
                rbacMiddleware -> permissionEnforcer "Check permission"
                permissionEnforcer -> accessDecision "Query permissions"
            }
            
            apiServer = container "API Server" "Express.js + Node.js" "Routes and business logic (only executes if RBAC permits)" "Service" {
                requestHandler = component "Request Handler" "Processes request after RBAC approval" "Service"
                resourceValidator = component "Resource Validator" "Ensures user's org/scope matches resource" "Service"
                businessLogic = component "Business Logic" "Executes core functionality" "Service"
                
                requestHandler -> resourceValidator "Validate resource ownership"
                resourceValidator -> businessLogic "Execute if valid"
            }
            
            permissionStore = container "Permission Store" "Database + Cache" "Stores all roles, permissions, and user-role mappings" "Service" {
                roleStore = component "Role Store" "teacher, student, admin, moderator" "Service"
                permissionCatalog = component "Permission Catalog" "read_course, create_assignment, grade_submission, etc." "Service"
                rolePermissionMapping = component "Role-Permission Mapping" "Maps roles to permissions" "Service"
                userRoleMapping = component "User-Role Mapping" "Maps users to roles" "Service"
                
                roleStore -> rolePermissionMapping "Define permissions"
                permissionCatalog -> rolePermissionMapping "Link to roles"
                userRoleMapping -> roleStore "Link to roles"
            }
            
            database = container "Database" "PostgreSQL" "Persistent storage of RBAC data" "Database" {
                usersTable = component "Users Table" "user_id, email, organization_id" "Service"
                rolesTable = component "Roles Table" "role_id, name (teacher, student, admin)" "Service"
                permissionsTable = component "Permissions Table" "permission_id, resource_type, action" "Service"
                userRolesTable = component "User-Roles Table" "Links users to roles (many-to-many)" "Service"
                rolePermissionsTable = component "Role-Permissions Table" "Links roles to permissions (many-to-many)" "Service"
                
                userRolesTable -> usersTable "Link to user"
                userRolesTable -> rolesTable "Link to role"
                rolePermissionsTable -> rolesTable "Link to role"
                rolePermissionsTable -> permissionsTable "Link to permission"
            }
            
            permissionCache = container "Permission Cache" "Redis" "Caches user permissions for fast lookup" "Service" {
                cacheKey = component "Cache Key" "user_id -> [list of permissions]" "Service"
                cacheTTL = component "Cache TTL Manager" "Invalidates cache when permissions change (5-min TTL)" "Service"
                
                cacheTTL -> cacheKey "Update cache"
            }
            
            adminInterface = container "Admin Interface" "Admin Portal" "Manage roles, permissions, and user assignments" "Service" {
                roleManager = component "Role Manager" "Create/edit/delete roles" "Service"
                permissionManager = component "Permission Manager" "Create/edit/delete permissions" "Service"
                roleAssigner = component "Role Assigner" "Assign roles to users" "Service"
                permissionTester = component "Permission Tester" "Test RBAC rules before deployment" "Service"
                
                roleManager -> roleAssigner "Assign roles"
                permissionManager -> roleAssigner "Apply permissions"
                permissionTester -> permissionEnforcer "Test rules"
            }
            
            auditLog = container "Audit Log" "Database" "Records all access attempts (allowed and denied)" "Database" {
                accessAttemptLog = component "Access Attempt Log" "user_id, resource, action, result (allow/deny), timestamp, ip" "Service"
                denialLog = component "Denial Log" "Tracks unauthorized access attempts for security analysis" "Service"
                
                denialLog -> accessAttemptLog "Log all denials"
            }
            
            alertingSystem = container "Alerting System" "Monitoring Service" "Alerts on suspicious access patterns" "Service" {
                denialDetector = component "Denial Detector" "Detects repeated access denials from same user" "Service"
                anomalyDetector = component "Anomaly Detector" "Detects unusual resource access patterns" "Service"
                adminAlert = component "Admin Alert" "Sends alerts to admins" "Service"
                
                denialDetector -> anomalyDetector "Analyze patterns"
                anomalyDetector -> adminAlert "Send alert"
            }
            
            regularUser -> clientApp "Access course materials"
            clientApp -> apiGateway "GET /courses/123/materials [JWT token]"
            apiGateway -> permissionStore "Check: user has read_course permission?"
            permissionStore -> database "Query user's roles and their permissions"
            database -> permissionStore "Return permissions"
            permissionStore -> apiGateway "Permission result"
            apiGateway -> apiServer "If allowed, process"
            apiServer -> clientApp "Return materials"
            apiGateway -> auditLog "Log access attempt"
            
            attacker -> clientApp "GET /admin/users [stolen token with student role]"
            apiGateway -> permissionStore "Check: student has manage_users permission?"
            permissionStore -> apiGateway "Denied - insufficient permissions"
            apiGateway -> auditLog "Log denial"
            auditLog -> alertingSystem "Alert on repeated denials"
            
            admin -> adminInterface "Assign teacher role to user"
            adminInterface -> database "Update user_roles mapping"
            database -> permissionCache "Invalidate cache for that user"
            permissionCache -> database "Refresh permissions on next request"
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
        
        component apiServer {
            include *
            autolayout lr
        }
        
        component database {
            include *
            autolayout lr
        }
        
        component permissionCache {
            include *
            autolayout lr
        }
        
        component adminInterface {
            include *
            autolayout lr
        }
        
        theme default
    }

}
