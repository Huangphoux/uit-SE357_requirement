#set heading(numbering: "1.")

= SendNotifications Business Rules

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(4)], [BR1], [Message Validation: Message content cannot be empty. Minimum length enforced.],
  [(4)],
  [BR2],
  [Recipient Selection: Can target all class students, specific groups, or individual student. Must select at least one recipient.],

  [(7)],
  [BR3],
  [Notification Storage: Create Notification record with message, recipient list, sender_id, timestamp, type (announcement/message).],

  [(8)], [BR4], [Multi-channel Delivery: Send through in-app notification. Optionally send email if configured.],
)
