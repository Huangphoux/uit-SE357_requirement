workspace "ASR-NOTIF-01: Bulk Notification Delivery" "C1-C3 Model for Delivering Notifications to 500 Recipients in < 1 Minute" {

    model {
        teacher = person "Teacher" "Sends notification to entire course" "External"
        students = person "Students" "Receive notifications" "External"
        admin = person "Admin" "Monitors notification delivery" "External"
        
        lmsSystem = softwareSystem "LMS System" "Delivers bulk notifications to 500+ recipients in < 1 minute" {
            clientApp = container "Client Application" "React + TypeScript" "Notification composer UI" "WebBrowser"
            
            apiServer = container "API Server" "Express.js + Node.js" "Receives notification request and queues for delivery" "Service" {
                notificationReceiver = component "Notification Receiver" "Receives notification content, course_id, recipients" "Service"
                recipientResolver = component "Recipient Resolver" "Fetches all enrolled students for course (500+)" "Service"
                messageBuilder = component "Message Builder" "Builds individual messages with personalization" "Service"
                
                notificationReceiver -> recipientResolver "Get recipients"
                recipientResolver -> messageBuilder "Build messages"
            }
            
            messageQueue = container "Message Queue" "RabbitMQ / Redis Queue" "Queues 500+ notification messages for async delivery" "Service" {
                queueManager = component "Queue Manager" "Manages message queue with priority" "Service"
                batchProcessor = component "Batch Processor" "Groups messages into batches of 50-100 for efficient delivery" "Service"
                
                queueManager -> batchProcessor "Process batches"
            }
            
            workerPool = container "Worker Pool" "Node.js Worker Processes" "Multiple async workers processing queue in parallel" "Service" {
                worker1 = component "Worker 1" "Processes batch of notifications" "Service"
                worker2 = component "Worker 2" "Processes batch of notifications" "Service"
                worker3 = component "Worker 3" "Processes batch of notifications" "Service"
                worker4 = component "Worker 4" "Processes batch of notifications" "Service"
                worker5 = component "Worker 5" "Processes batch of notifications" "Service"
                
                worker1 -> worker2 "Parallel processing"
            }
            
            notificationService = container "Notification Delivery Service" "Multi-Channel" "Delivers notifications via email, SMS, push" "Service" {
                emailService = component "Email Service" "Sends email notifications (bulk SMTP)" "Service"
                smsService = component "SMS Service" "Sends SMS notifications (Twilio/AWS SNS)" "Service"
                pushService = component "Push Service" "Sends push notifications (Firebase Cloud Messaging)" "Service"
                throttleController = component "Throttle Controller" "Throttles delivery to avoid rate limits (100-200/sec)" "Service"
                
                emailService -> throttleController "Rate limit"
                smsService -> throttleController "Rate limit"
                pushService -> throttleController "Rate limit"
            }
            
            database = container "Database" "PostgreSQL" "Stores notification records and delivery status" "Database" {
                notificationRecord = component "Notification Record" "Stores: notification_id, course_id, content, created_at" "Service"
                deliveryStatus = component "Delivery Status" "Stores per-recipient status (pending, sent, failed)" "Service"
                
                deliveryStatus -> notificationRecord "Link to notification"
            }
            
            cache = container "Cache Layer" "Redis" "Caches recipient lists and delivery stats for fast queries" "Service" {
                recipientCache = component "Recipient Cache" "Cached student lists by course_id (TTL: 5 min)" "Service"
                deliveryStatsCache = component "Delivery Stats Cache" "Tracks real-time delivery progress (500/500 sent)" "Service"
                
                recipientCache -> deliveryStatsCache "Track progress"
            }
            
            monitoringService = container "Monitoring Service" "Prometheus + Grafana" "Tracks notification delivery performance" "Service" {
                deliveryMetrics = component "Delivery Metrics" "Tracks: messages queued, delivered, failed, latency p50/p95/p99" "Service"
                performanceMonitor = component "Performance Monitor" "Ensures delivery completes in < 1 minute" "Service"
                alerting = component "Alerting" "Alerts if delivery exceeds 60 seconds" "Service"
                
                deliveryMetrics -> performanceMonitor "Check performance"
                performanceMonitor -> alerting "Alert on SLA breach"
            }
            
            auditLog = container "Audit Log" "Database" "Logs all bulk notifications" "Database" {
                notificationLog = component "Notification Log" "teacher_id, course_id, recipient_count, timestamp" "Service"
                deliveryLog = component "Delivery Log" "Tracks delivery metrics: success_count, failure_count, avg_latency" "Service"
                
                deliveryLog -> notificationLog "Log notifications"
            }
            
            teacher -> clientApp "Compose notification for course"
            clientApp -> apiServer "POST /notifications/bulk {content, course_id}"
            apiServer -> messageQueue "Queue 500 notification messages"
            messageQueue -> workerPool "Process in parallel (5 workers)"
            workerPool -> notificationService "Deliver notifications"
            notificationService -> students "Email/SMS/Push to 500 students"
            notificationService -> database "Update delivery status"
            database -> cache "Cache delivery progress"
            messageQueue -> monitoringService "Track queue depth and delivery"
            monitoringService -> apiServer "< 1 minute delivery confirmation"
            apiServer -> auditLog "Log bulk notification sent"
            admin -> monitoringService "Monitor delivery dashboard"
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
        
        component messageQueue {
            include *
            autolayout lr
        }
        
        component workerPool {
            include *
            autolayout lr
        }
        
        component notificationService {
            include *
            autolayout lr
        }
        
        component database {
            include *
            autolayout lr
        }
        
        component cache {
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
