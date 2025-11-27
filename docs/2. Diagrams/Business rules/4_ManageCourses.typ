#set heading(numbering: "1.")

= ManageCourses Business Rules

| Activity | BR Code | Description |
|----------|---------|-------------|
| (5) | BR1 | Input Validation: Validate course title not empty, course code format, numeric credits. |
| (6) | BR2 | Course Code Uniqueness: Query Course table to ensure course code is unique. No duplicate course codes allowed. |
| (7) | BR3 | Course Creation: Create new Course record in database with status = active. |
| (9) | BR4 | Audit Logging: Log course creation action (admin user, timestamp, course details) in audit table for compliance. |
