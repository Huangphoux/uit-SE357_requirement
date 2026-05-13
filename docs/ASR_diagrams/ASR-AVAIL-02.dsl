workspace "ASR-AVAIL-02: Scheduled Maintenance with Read-Only Mode" "C1-C3 Model for Quarterly Maintenance with Minimal Downtime" {

    model {
        admin = person "System Admin" "Performs quarterly system maintenance" "External"
        users = person "Users" "Access system during maintenance window" "External"
        
        lmsSystem = softwareSystem "LMS System" "Switches to read-only mode during maintenance" {
            maintenancePortal = container "Maintenance Portal" "Admin Dashboard" "Admin interface to schedule and execute maintenance" "Service" {
                maintenanceScheduler = component "Maintenance Scheduler" "Schedules maintenance windows (2AM-4AM EST, last weekend of quarter)" "Service"
                modeToggle = component "Mode Toggle Controller" "Switches system between read-write and read-only modes" "Service"
                maintenanceStatus = component "Maintenance Status" "Shows current system status (normal/read-only/maintenance)" "Service"
                
                maintenanceScheduler -> modeToggle "Trigger mode switch"
                modeToggle -> maintenanceStatus "Update status"
            }
            loadBalancer = container "Load Balancer" "Caddy" "Routes requests; enforces read-only restrictions" "Service" {
                modeEnforcer = component "Mode Enforcer" "Blocks write operations during read-only mode" "Service"
                requestFilter = component "Request Filter" "Allows only GET/HEAD during read-only" "Service"
                
                modeEnforcer -> requestFilter "Apply restrictions"
            }
            apiServers = container "API Servers" "Express.js + Node.js" "Operate in read-only mode during maintenance" "Service" {
                readOnlyValidator = component "Read-Only Validator" "Validates requests respect read-only restrictions" "Service"
                cacheWarmer = component "Cache Warmer" "Pre-loads cache before maintenance begins" "Service"
                
                readOnlyValidator -> cacheWarmer "Prepare for maintenance"
            }
            databaseMaintenance = container "Database (Maintenance Mode)" "PostgreSQL" "Handles database maintenance tasks" "Database" {
                backupManager = component "Backup Manager" "Creates full backup before maintenance" "Service"
                vacuumOptimizer = component "Vacuum Optimizer" "Runs VACUUM ANALYZE on tables" "Service"
                migrationRunner = component "Migration Runner" "Executes pending schema migrations" "Service"
                indexRebuild = component "Index Rebuild" "Rebuilds fragmented indexes" "Service"
                
                backupManager -> migrationRunner "After backup, run migrations"
                migrationRunner -> vacuumOptimizer "After migrations, optimize"
                vacuumOptimizer -> indexRebuild "After vacuum, rebuild indexes"
            }
            databasePrimary = container "Database (Primary - Read-Only)" "PostgreSQL" "Primary database in read-only mode" "Database" {
                replicationPause = component "Replication Pause" "Pauses replication during maintenance" "Service"
                consistencyCheck = component "Consistency Check" "Verifies data consistency" "Service"
                
                replicationPause -> consistencyCheck "Check data integrity"
            }
            databaseSecondary = container "Database (Secondary - Hot Standby)" "PostgreSQL" "Continues accepting replicated data in read-only state" "Database"
            
            notificationService = container "Notification Service" "Email + SMS" "Notifies users of maintenance schedule" "Service" {
                maintenanceNotifier = component "Maintenance Notifier" "Sends advance notice to users (24-48 hours)" "Service"
                statusUpdater = component "Status Updater" "Sends real-time status updates during maintenance" "Service"
                completionNotifier = component "Completion Notifier" "Notifies when maintenance completes and system is back online" "Service"
                
                maintenanceNotifier -> statusUpdater "Start notifications"
                statusUpdater -> completionNotifier "Maintenance complete"
            }
            backupStorage = container "Backup Storage" "S3 / Cloud Storage" "Stores database backups" "Service"
            
            admin -> maintenancePortal "Initiate maintenance"
            maintenancePortal -> loadBalancer "Switch to read-only"
            maintenancePortal -> databaseMaintenance "Execute maintenance tasks"
            loadBalancer -> apiServers "Route with read-only enforcement"
            databaseMaintenance -> databasePrimary "Maintenance operations"
            databasePrimary -> databaseSecondary "Replicate to standby"
            databasePrimary -> backupStorage "Backup database"
            notificationService -> users "Notify of maintenance"
            maintenancePortal -> notificationService "Send notifications"
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
        
        component maintenancePortal {
            include *
            autolayout lr
        }
        
        component databaseMaintenance {
            include *
            autolayout lr
        }
        
        component notificationService {
            include *
            autolayout lr
        }
        
        theme default
    }

}
