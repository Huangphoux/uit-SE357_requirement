#set heading(numbering: "1.")

= ManageTeacher-ClassAssignment Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(5)], [BR1], [Availability Check: Verify teacher is available (not at max course load, no schedule conflicts).],
  [(6)],
  [BR2],
  [Existing Assignment: If class already has teacher, previous assignment is replaced (one teacher per class).],

  [(7)], [BR3], [Assignment Persistence: Create/update TeacherAssignment record linking Teacher to Class.],
)
