#set heading(numbering: "1.")

= SignUp Business Rules

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(2)],
  [BR1],
  [Input Validation: System validates input fields for empty values, email format, password strength (min 8 chars), and matching password confirmation. Display error if validation fails.],

  [(6)],
  [BR2],
  [Password Hashing: Password must be hashed using secure algorithm (bcrypt/SHA-256) before storage. Never store plain text passwords.],

  [(7)],
  [BR3],
  [Database Constraint: Email must be unique. Check User table before creating new record. If duplicate email exists, reject registration.],

  [(9)],
  [BR4],
  [Auto-login: After successful registration, system automatically generates session token and logs in user.],
)
