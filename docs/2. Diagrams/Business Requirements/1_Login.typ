#set heading(numbering: "1.")

= Login Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(3)], [BR1], [Input Validation: Validate email format and non-empty fields. Display error if invalid.],
  [(5)],
  [BR2],
  [Credential Verification: Query User table for matching email and verify password against stored hash using bcrypt/SHA-256.],

  [(7)],
  [BR3],
  [Authentication Failure: If user not found or password incorrect, display generic error message (security best practice). Allow retry.],

  [(8)],
  [BR4],
  [Session Management: Generate secure JWT token with expiration time (typically 24 hours). Store token in session.],

  [(11)], [BR5], [Logout: Invalidate session token and clear authentication. Redirect to login page.],
)
