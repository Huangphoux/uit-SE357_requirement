#set heading(numbering: "1.")

= AssignRoles Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(3)],
  [BR1],
  [Role Selection: Only predefined roles (Student, Teacher, Admin) can be assigned. These must exist in system Role configuration table.],

  [(6)],
  [BR2],
  [Permission Update: Each role has predefined set of permissions. When role changes, all user permissions are updated accordingly.],

  [(7)],
  [BR3],
  [Database Update: Role assignment must be persisted to User table with role_id foreign key linking to Role table.],
)
