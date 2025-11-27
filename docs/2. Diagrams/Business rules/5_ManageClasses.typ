#set heading(numbering: "1.")

= ManageClasses Business Rules

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(3)], [BR1], [Course Linking: Each class MUST be linked to a course. Invalid course selection must be rejected.],
  [(6)], [BR2], [Schedule Validation: Class schedule must not be empty. Validate start time < end time.],
  [(7)],
  [BR3],
  [Schedule Conflict Detection: Check for conflicts with other classes in same room/with same teacher. Alert admin of conflicts.],

  [(8)], [BR4], [Class Creation: Create Class record linked to Course (foreign key). Set status = active.],
)
