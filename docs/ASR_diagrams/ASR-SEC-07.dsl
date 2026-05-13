workspace "ASR-SEC-07: Data Encryption at Rest" "C1-C3 Model for 100% Encryption of Sensitive Data in Database" {

    model {
        user = person "User" "Data stored securely at rest" "External"
        admin = person "DBA" "Manages encryption keys and database security" "External"
        
        lmsSystem = softwareSystem "LMS System" "Encrypts 100% of sensitive data at rest" {
            apiServer = container "API Server" "Express.js + Node.js" "Receives and encrypts sensitive data before storage" "Service" {
                dataClassifier = component "Data Classifier" "Identifies sensitive fields (password, email, ssn, payment)" "Service"
                encryptionService = component "Encryption Service" "Encrypts sensitive data before sending to database" "Service"
                keyProvider = component "Key Provider" "Retrieves encryption keys from key manager" "Service"
                
                dataClassifier -> encryptionService "Mark sensitive data"
                encryptionService -> keyProvider "Get encryption key"
            }
            
            database = container "Database" "PostgreSQL with Encryption" "Stores encrypted sensitive data at rest" "Database" {
                encryptedColumnHandler = component "Encrypted Column Handler" "Handles encryption/decryption of individual columns" "Service"
                sensitiveDataColumns = component "Sensitive Data Columns" "password_hash, ssn, credit_card (all encrypted)" "Service"
                plainTextColumns = component "Plain Text Columns" "course_id, user_name, email (not PII, not encrypted)" "Service"
                databaseEncryption = component "Database-Level Encryption" "Transparent data encryption (TDE) for entire database" "Service"
                
                sensitiveDataColumns -> encryptedColumnHandler "Encrypted storage"
                plainTextColumns -> databaseEncryption "Plain text within encrypted DB"
                encryptedColumnHandler -> databaseEncryption "Layer encryption"
            }
            
            encryptionKeyManagement = container "Encryption Key Management" "AWS KMS / HashiCorp Vault" "Securely stores and rotates encryption keys" "Service" {
                masterKeyStore = component "Master Key Store" "Stores master encryption key (KMS or Vault)" "Service"
                keyRotationScheduler = component "Key Rotation Scheduler" "Rotates keys annually or on-demand" "Service"
                keyAccessControl = component "Key Access Control" "Restricts key access to authorized services only" "Service"
                keyVersioning = component "Key Versioning" "Maintains multiple key versions for decrypting old data" "Service"
                
                masterKeyStore -> keyRotationScheduler "Rotate keys"
                keyRotationScheduler -> keyVersioning "Maintain versions"
                masterKeyStore -> keyAccessControl "Control access"
            }
            
            diskEncryption = container "Disk Encryption Layer" "LUKS / dm-crypt / EBS Encryption" "Encrypts all disk storage at the OS/infrastructure level" "Service" {
                volumeEncryption = component "Volume Encryption" "Encrypts entire disk volumes" "Service"
                bootVolumeProtection = component "Boot Volume Protection" "Encrypts OS and boot partition" "Service"
                backupEncryption = component "Backup Encryption" "All backups encrypted with same keys" "Service"
                
                volumeEncryption -> bootVolumeProtection "Protect boot volume"
                backupEncryption -> volumeEncryption "Encrypt backups"
            }
            
            backupManagement = container "Backup Management" "PostgreSQL Backups" "Creates encrypted backups of database" "Service" {
                backupScheduler = component "Backup Scheduler" "Daily incremental, weekly full backups" "Service"
                backupEncryptor = component "Backup Encryptor" "Encrypts backup files with KMS keys" "Service"
                backupValidation = component "Backup Validation" "Verifies backup integrity and decryption ability" "Service"
                
                backupScheduler -> backupEncryptor "Encrypt backup"
                backupEncryptor -> backupValidation "Validate encryption"
            }
            
            decryptionService = container "Decryption Service" "On-demand Data Access" "Decrypts sensitive data only when authorized access occurs" "Service" {
                accessValidator = component "Access Validator" "Validates user has permission to access data" "Service"
                auditLogger = component "Audit Logger" "Logs all data access attempts and decryption events" "Service"
                decryptor = component "Decryptor" "Decrypts data using KMS key" "Service"
                
                accessValidator -> auditLogger "Log access"
                auditLogger -> decryptor "Decrypt if authorized"
            }
            
            secureFileStorage = container "Secure File Storage" "S3 / Cloud Storage" "Stores uploaded documents with encryption" "Service" {
                fileEncryptor = component "File Encryptor" "Encrypts uploaded files before storage" "Service"
                fileKeyMapping = component "File-Key Mapping" "Maps each file to its encryption key" "Service"
                
                fileEncryptor -> fileKeyMapping "Store mapping"
            }
            
            monitoringService = container "Monitoring Service" "Prometheus + Grafana" "Monitors encryption status and key health" "Service" {
                encryptionHealthMonitor = component "Encryption Health Monitor" "Checks all encrypted columns are properly encrypted" "Service"
                keyExpiryMonitor = component "Key Expiry Monitor" "Alerts when keys need rotation" "Service"
                decryptionFailureDetector = component "Decryption Failure Detector" "Alerts on decryption errors (possible key corruption)" "Service"
                
                encryptionHealthMonitor -> keyExpiryMonitor "Monitor key age"
                keyExpiryMonitor -> decryptionFailureDetector "Detect failures"
            }
            
            user -> apiServer "Submit sensitive data (password, payment)"
            apiServer -> encryptionKeyManagement "Request encryption key"
            apiServer -> database "Store encrypted data"
            database -> diskEncryption "All data encrypted at rest"
            database -> backupManagement "Backup encrypted data"
            admin -> encryptionKeyManagement "Rotate keys"
            admin -> decryptionService "Access encrypted data (authorized)"
            decryptionService -> encryptionKeyManagement "Retrieve key to decrypt"
            decryptionService -> database "Fetch encrypted data"
            monitoringService -> database "Monitor encryption"
            monitoringService -> encryptionKeyManagement "Monitor keys"
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
        
        component database {
            include *
            autolayout lr
        }
        
        component encryptionKeyManagement {
            include *
            autolayout lr
        }
        
        component diskEncryption {
            include *
            autolayout lr
        }
        
        component decryptionService {
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
