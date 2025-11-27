#set heading(numbering: "1.")

= CreateTeacherAccount Business Rules

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(5)],
  [BR1],
  [Input Validation: Validate required fields (name, email, phone) and format (valid email, numeric phone). Display errors for invalid inputs.],

  [(6)],
  [BR2],
  [Duplicate Email Check: Query User table to ensure email is unique. Prevent duplicate email registrations.],

  [(7)], [BR3], [Account Creation: Create new User record with role_id = Teacher role. Account status = active.],
  [(8)], [BR4], [Temporary Password: Generate secure temporary password (or use email verification link).],
  [(9)],
  [BR5],
  [Email Notification: Send welcome email with login credentials and link to change password on first login.],
)
