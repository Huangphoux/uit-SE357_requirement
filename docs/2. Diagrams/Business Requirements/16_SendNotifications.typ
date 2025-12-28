#set heading(numbering: "1.")

= SendNotifications Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR190],
  [Displaying Rules:
    Teacher navigates to course notification section. System calls method `displayNotificationComposer(String classId)` and shows notification creation interface.],

  [(2)],
  [BR191],
  [Input Rules:
    Teacher enters notification message content and selects recipients (all students, specific groups, or individuals).],

  [(3)],
  [BR192],
  [Recipient Selection Rules:
    System calls method `getClassStudents(String classId)` to query enrolled students with `SELECT u.* FROM User u JOIN Enrollment e ON u.id = e.userId WHERE e.classId = \[Class.id\] AND e.status = 'ACTIVE'`.
    Teacher can select all or specific students from list.],

  [(4)],
  [BR193],
  [Validation Rules:
    When teacher clicks send, system calls method `validateNotification()` to check:
    If message.`isEmpty()` = true, display error (Refer to MSG 48).
    If message length < 10 characters, display error (Refer to MSG 49).
    If no recipients selected, display error (Refer to MSG 50).],

  [(5)],
  [BR194],
  [Authorization Rules:
    System verifies teacher is assigned to class by checking [Class.teacherId] = [User.id]. Only assigned teacher can send notifications to class.],

  [(6)],
  [BR195],
  [Notification Type Rules:
    System sets notification type (announcement or message) based on context. System calls method `setNotificationType(String type)`.],

  [(7)],
  [BR196],
  [Database Insert Rules:
    For each selected recipient, system calls method `createNotification(Notification notification)` to insert record in notification table with syntax `INSERT INTO Notification (id, message, recipientId, senderId, classId, type, timestamp, read) VALUES (\[Notification.id\], \[message\], \[recipientId\], \[teacherId\], \[classId\], \[type\], CURRENT_TIMESTAMP, false)`.
    Creates one record per recipient.],

  [(8)],
  [BR197],
  [Multi-channel Delivery Rules:
    System sends in-app notification immediately via real-time notification system.
    If email notifications configured, system calls method `sendEmailNotification(String recipientEmail, String message)` to send email copy.
    System queues email jobs for asynchronous sending.],

  [(9)],
  [BR198],
  [Confirmation Rules:
    System displays success message (Refer to MSG 51) showing number of recipients notified. System calls method `Close()` to close notification composer.],
)
