#set heading(numbering: "1.")

= ReceiveNotifications Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR199],
  [Displaying Rules:
    Student accesses notification section from dashboard. System calls method `displayNotifications()` and shows notification list screen.],

  [(2)],
  [BR200],
  [Query Filtering Rules:
    System queries notifications where current student is recipient with `SELECT n.*, u.name as senderName FROM Notification n JOIN User u ON n.senderId = u.id WHERE n.recipientId = \[User.id\] ORDER BY n.timestamp DESC`.
    Only retrieve notifications for current user.
    System calls method `fetchUserNotifications(String userId)`.],

  [(3)],
  [BR201],
  [Status Tracking Rules:
    System displays read/unread status for each notification from [Notification.read] field.
    When student opens notification, system calls method `markAsRead(String notificationId)` to update with `UPDATE Notification SET read = true WHERE id = \[Notification.id\]`.],

  [(4)],
  [BR202],
  [Display Rules:
    System displays notifications sorted by date (newest first) showing:
    - Sender name from query
    - Message subject/preview
    - Notification type from [Notification.type]
    - Read/unread status
    - Timestamp from [Notification.timestamp]
    System calls method `renderNotificationList(List<Notification> notifications)`.],

  [(5)],
  [BR203],
  [Interaction Rules:
    Student can click notification to view full message. System calls method `displayNotificationDetail(String notificationId)` to show complete message content and related context (e.g., link to assignment if notification about assignment).],
)
