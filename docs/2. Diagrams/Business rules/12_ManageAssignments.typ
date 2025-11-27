#set heading(numbering: "1.")

= ManageAssignments Business Rules

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(4)], [BR1], [Deadline Validation: Deadline must be in future (not past date). Validate date/time format.],
  [(7)], [BR2], [Assignment Validation: Validate all required fields (title, description) are filled.],
  [(8)], [BR3], [Assignment Storage: Create Assignment record in database linked to Course/Class with status = active.],
  [(10)], [BR4], [Student Notification: Send notification to all enrolled students that new assignment is available.],
)
