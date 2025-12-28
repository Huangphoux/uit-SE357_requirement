#set heading(numbering: "1.")

= UpdateSystemSettings Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR230],
  [Authorization Rules:
    Admin accesses system settings page from "Admin Dashboard". System verifies [User.role] = 'ADMIN' with system administrator privileges.
    If unauthorized, display error and block access.
    System calls method `displaySystemSettings()` to show settings page.],

  [(2)],
  [BR231],
  [Data Retrieval Rules:
    System queries `SELECT * FROM PlatformSettings` to fetch all system configuration settings.
    System calls method `fetchSystemSettings()` to retrieve settings.],

  [(3)],
  [BR232],
  [Display Rules:
    System displays settings interface showing current values for:
    - Site name
    - Default language
    - Email notification enabled/disabled
    - Maximum file upload size
    - Session timeout duration
    - Other configurable platform settings
    System calls method `renderSettingsForm(Settings settings)`.],

  [(4)],
  [BR233],
  [Validation Rules:
    When admin modifies setting and saves, system calls method `validateSetting(String key, String value)` to check:
    For string settings: validate length constraints.
    For numeric settings: validate range (e.g., file size 1MB-500MB).
    For email settings: validate email format.
    For boolean settings: ensure true/false value.
    If invalid, display error (Refer to MSG 57).],

  [(5)],
  [BR234],
  [Database Update Rules:
    System calls method `updateSetting(String key, String value)` to save with `UPDATE PlatformSettings SET value = \[value\], updatedAt = CURRENT_TIMESTAMP WHERE key = \[key\]` (Refer to "PlatformSettings" table in database).
    System displays success message (Refer to MSG 58).],

  [(6)],
  [BR235],
  [Audit Preparation Rules:
    Before updating, system calls method `getOldValue(String key)` to retrieve current value for audit trail.],

  [(7)],
  [BR236],
  [Configuration Apply Rules:
    System calls method `applySettingChange(String key, String value)` to apply configuration change to running system without requiring restart where possible.],

  [(8)],
  [BR237],
  [Audit Logging Rules:
    System calls method `logSettingChange(String adminId, String settingName, String oldValue, String newValue)` to insert audit log record with syntax `INSERT INTO AuditLog (id, userId, action, settingName, oldValue, newValue, timestamp) VALUES (\[AuditLog.id\], \[adminId\], 'SETTING_CHANGE', \[settingName\], \[oldValue\], \[newValue\], CURRENT_TIMESTAMP)`.
    Audit trail captures all setting changes with admin user, setting name, old value, new value, and timestamp for compliance and troubleshooting.],
)
