#set page(margin: 0.5cm)

= Security Matrix

This security matrix maps user stories to security requirements, actors responsible, and necessary controls.

#table(
  columns: (1.5fr, 0.7fr, 0.7fr, 0.7fr),
  align: (center + horizon, center + horizon, center + horizon, center + horizon),
  stroke: 0.5pt,
  fill: (x, y) => if y == 0 { rgb("#4472C4") } else if calc.odd(y) { rgb("#D9E1F2") } else { white },
  text(white, weight: "bold", size: 10pt)[User Story],
  text(white, weight: "bold", size: 10pt)[Admin],
  text(white, weight: "bold", size: 10pt)[Teacher],
  text(white, weight: "bold", size: 10pt)[Student],

  // Authentication & Authorization
  [1.1 Sign up], [], [], [✓],

  [1.2 Login/Logout], [✓], [✓], [✓],

  [1.3 Assign Roles], [✓], [], [],

  [1.4 Create Teacher Account], [✓], [], [],

  // Course & Class Management
  [2.1 Manage Courses], [✓], [], [],

  [2.2 Manage Classes], [✓], [✓], [],

  [2.3 Manage Student Enrollments], [✓], [], [],

  [2.4 View Enrolled Courses], [], [✓], [✓],

  [2.5 Manage Teacher-Class Assignment], [✓], [], [],

  [2.6 Self-Enroll in Courses], [], [], [✓],

  // Course Materials
  [3.1 Manage Course Materials], [✓], [✓], [],

  [3.2 Access Learning Materials], [], [✓], [✓],

  // Assignments & Submissions
  [4.1 Manage Assignments], [], [✓], [],

  [4.2 Submit Assignments], [], [], [✓],

  [4.3 Review Submissions & Comment], [], [✓], [],

  [4.4 View Feedback], [], [], [✓],

  // Notifications
  [5.1 Send Notifications], [✓], [✓], [],

  [5.2 Receive Notifications], [✓], [✓], [✓],

  // Reports & Analytics
  [6.1 View Submissions], [], [✓], [],

  [6.2 View My Submissions], [], [], [✓],

  // Admin & Platform
  [7.1 View Platform Stats], [✓], [], [],

  [7.2 Manage User Accounts], [✓], [], [],

  [7.3 Update System Settings], [✓], [], [],
)

== Key Security Controls

=== Authentication
- Implement strong password requirements (minimum 8 characters, mixed case, numbers)
- Use bcrypt or similar for password hashing (minimum salt rounds: 10)
- Implement JWT tokens with expiration (recommended: 1 hour)
- Enable multi-factor authentication (MFA) for admin accounts

=== Authorization
- Implement Role-Based Access Control (RBAC) with clear role definitions
- Validate permissions on both client and server-side
- Use principle of least privilege
- Regular access reviews and audit logs

=== Data Protection
- Use HTTPS/TLS for all communications
- Encrypt sensitive data at rest (database)
- Implement proper input validation and sanitization
- Use parameterized queries to prevent SQL injection

=== Audit & Logging
- Log all authentication attempts (failed and successful)
- Log all administrative actions
- Log file uploads and access
- Maintain audit logs for minimum 1 year retention

=== File Security
- Scan uploaded files for malware
- Validate file types (whitelist allowed extensions)
- Store files outside web root
- Implement file size limits

=== Rate Limiting & DoS Prevention
- Implement rate limiting on login attempts
- Implement rate limiting on API endpoints
- Use CAPTCHA for account registration
- Monitor for suspicious activity patterns
