#set heading(numbering: "1.")

= ManageUserAccounts Business Rules

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)], [BR1], [Admin Authorization: Only admin role can access user management.],
  [(5)],
  [BR2],
  [Update Validation: Email must be unique (check User table). Role must exist. Other fields validated by type.],

  [(6)], [BR3], [Update Persistence: Save user changes to User table.],
  [(7)],
  [BR4],
  [Deactivation: Soft delete only - set status = inactive. Preserve user data. User cannot login but data retained.],
)
