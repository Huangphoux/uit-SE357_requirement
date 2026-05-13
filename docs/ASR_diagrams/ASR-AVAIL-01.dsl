workspace "ASR-AVAIL-01: 99.9% Uptime 24/7 Availability" "C1-C3 Model for High Availability with Redundancy and Load Balancing" {

    model {
        users = person "Users" "Access system 24/7 at any time" "External"
        
        lmsSystem = softwareSystem "LMS System" "Achieves 99.9% uptime with redundancy and load balancing" {
            cdnEdge = container "CDN Edge Servers" "Cloudflare/Global CDN" "Serves static content globally for reduced latency" "Service" {
                edgeCache = component "Edge Cache" "Caches static assets (CSS, JS, images)" "Service"
                geoRouter = component "Geo Router" "Routes users to nearest CDN edge" "Service"
                
                geoRouter -> edgeCache "Serve cached content"
            }
            loadBalancerPrimary = container "Load Balancer (Primary)" "Caddy" "Primary load balancer in main datacenter" "Service" {
                healthMonitor1 = component "Health Monitor" "Checks API server health every 5 seconds" "Service"
                requestRouter1 = component "Request Router" "Routes requests to healthy servers" "Service"
                failoverChecker1 = component "Failover Checker" "Detects primary LB failures" "Service"
                
                healthMonitor1 -> requestRouter1 "Health status"
                failoverChecker1 -> requestRouter1 "Trigger failover"
            }
            loadBalancerSecondary = container "Load Balancer (Secondary/Standby)" "Caddy" "Secondary standby load balancer for failover" "Service" {
                healthMonitor2 = component "Health Monitor" "Monitors primary LB heartbeat" "Service"
                requestRouter2 = component "Request Router (Standby)" "Routes requests if primary fails" "Service"
                
                healthMonitor2 -> requestRouter2 "Primary LB status"
            }
            apiServersPrimary = container "API Servers (Primary DC)" "Express.js + Node.js" "Multiple instances in primary datacenter for redundancy" "Service" {
                apiInstance1 = component "API Instance 1" "Handles portion of requests" "Service"
                apiInstance2 = component "API Instance 2" "Handles portion of requests" "Service"
                apiInstance3 = component "API Instance 3" "Handles portion of requests" "Service"
                
                apiInstance1 -> apiInstance2 "Share session state"
                apiInstance2 -> apiInstance3 "Share session state"
            }
            apiServersSecondary = container "API Servers (Secondary DC)" "Express.js + Node.js" "Replicated instances in secondary datacenter" "Service" {
                apiInstanceBackup1 = component "API Instance Backup 1" "Hot standby" "Service"
                apiInstanceBackup2 = component "API Instance Backup 2" "Hot standby" "Service"
                
                apiInstanceBackup1 -> apiInstanceBackup2 "Share session state"
            }
            databasePrimary = container "Database (Primary)" "PostgreSQL" "Master database in primary datacenter" "Database" {
                primaryNode = component "Primary Node" "Handles read and write operations" "Service"
                replicationBuffer = component "Replication Buffer" "Buffers changes for replication" "Service"
                
                primaryNode -> replicationBuffer "Stream replication logs"
            }
            databaseSecondary = container "Database (Secondary/Standby)" "PostgreSQL" "Replicated standby database" "Database" {
                standbyNode = component "Standby Node" "Read-only replica, promotes on primary failure" "Service"
                recoveryManager = component "Recovery Manager" "Manages failover promotion" "Service"
                
                recoveryManager -> standbyNode "Promote to primary"
            }
            monitoringAlerts = container "Monitoring & Alerting" "Prometheus + PagerDuty" "24/7 monitoring and incident alerting" "Service" {
                metricsCollector = component "Metrics Collector" "Collects uptime and availability metrics" "Service"
                incidentDetector = component "Incident Detector" "Detects failures and anomalies" "Service"
                alertingService = component "Alerting Service" "Sends alerts to on-call team" "Service"
                
                metricsCollector -> incidentDetector "System metrics"
                incidentDetector -> alertingService "Alert on failure"
            }
            backupStorage = container "Backup Storage" "S3/Cloud Storage" "Off-site backup for disaster recovery" "Service"
            
            users -> cdnEdge "Request static content"
            cdnEdge -> loadBalancerPrimary "Route API requests"
            loadBalancerPrimary -> apiServersPrimary "Load balance across instances"
            loadBalancerSecondary -> apiServersSecondary "Route if primary LB fails"
            apiServersPrimary -> databasePrimary "Read/write queries"
            apiServersSecondary -> databaseSecondary "Read from standby"
            databasePrimary -> databaseSecondary "Stream replication"
            databasePrimary -> backupStorage "Daily backups"
            monitoringAlerts -> loadBalancerPrimary "Monitor health"
            monitoringAlerts -> apiServersPrimary "Monitor instances"
            monitoringAlerts -> databasePrimary "Monitor database"
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
        
        component loadBalancerPrimary {
            include *
            autolayout lr
        }
        
        component databasePrimary {
            include *
            autolayout lr
        }
        
        theme default
    }

}
