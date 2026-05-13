workspace "ASR-PERF-03: Annual Data Growth Scalability" "C1-C3 Model for Handling 20% Yearly Data Growth with Flexible Architecture" {

    model {
        admin = person "Platform Admin" "Monitors data growth and scales resources" "External"
        user = person "User" "Uses the system as data grows" "External"
        
        lmsSystem = softwareSystem "LMS System" "Scales architecture to handle 20% yearly data growth" {
            loadBalancer = container "Load Balancer" "Caddy + Auto-scaling" "Distributes load and scales API servers horizontally" "Service" {
                scalingController = component "Scaling Controller" "Monitors CPU/memory usage and triggers auto-scaling" "Service"
                requestDistributor = component "Request Distributor" "Distributes requests to available API instances" "Service"
                
                scalingController -> requestDistributor "Scale decision"
            }
            apiServerPool = container "API Server Pool" "Express.js (Horizontal)" "Multiple API server instances that scale automatically" "Service" {
                apiInstanceManager = component "Instance Manager" "Manages lifecycle of API server instances" "Service"
                healthMonitor = component "Health Monitor" "Tracks instance health and removes failing instances" "Service"
                
                apiInstanceManager -> healthMonitor "Monitor instances"
            }
            cacheCluster = container "Cache Cluster" "Redis (Distributed)" "Distributed cache cluster that scales with data" "Service" {
                cacheNodeCoordinator = component "Cache Node Coordinator" "Manages cache nodes and data distribution" "Service"
                dataPartitioner = component "Data Partitioner" "Partitions cache entries across nodes (sharding)" "Service"
                
                cacheNodeCoordinator -> dataPartitioner "Partition cache data"
            }
            databaseCluster = container "Database Cluster" "PostgreSQL (Replication + Sharding)" "Replicated and sharded database to handle growth" "Database" {
                primaryReplica = component "Primary Replica" "Master database for writes" "Service"
                secondaryReplicas = component "Secondary Replicas" "Read-only replicas for scaling reads" "Service"
                shardManager = component "Shard Manager" "Routes queries to appropriate shards by data key" "Service"
                archiveStorage = component "Archive Storage" "Cold storage for historical/inactive data" "Service"
                
                shardManager -> primaryReplica "Write queries"
                shardManager -> secondaryReplicas "Read queries"
                primaryReplica -> secondaryReplicas "Replication"
                archiveStorage -> primaryReplica "Archive old data"
            }
            monitoringSystem = container "Monitoring System" "Prometheus + Grafana" "Tracks system metrics and predicts scaling needs" "Service" {
                metricsCollector = component "Metrics Collector" "Collects CPU, memory, query latency metrics" "Service"
                predictiveAnalyzer = component "Predictive Analyzer" "Analyzes growth trends and predicts future scaling" "Service"
                alerting = component "Alerting" "Alerts admins when thresholds approached" "Service"
                
                metricsCollector -> predictiveAnalyzer "Growth metrics"
                predictiveAnalyzer -> alerting "Scaling predictions"
            }
            
            loadBalancer -> apiServerPool "Route requests to scalable pool"
            apiServerPool -> cacheCluster "Query distributed cache"
            apiServerPool -> databaseCluster "Query database cluster"
            monitoringSystem -> loadBalancer "Monitor and auto-scale"
            monitoringSystem -> apiServerPool "Monitor instances"
            monitoringSystem -> databaseCluster "Monitor database growth"
        }
        
        user -> lmsSystem "Use system over time"
        admin -> monitoringSystem "Monitor growth trends"
        
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
        
        component databaseCluster {
            include *
            autolayout lr
        }
        
        component monitoringSystem {
            include *
            autolayout lr
        }
        
        theme default
    }

}
