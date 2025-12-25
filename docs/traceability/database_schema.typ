= Database Schema Overview

*Schema File:* #link("../../server/prisma/schema.prisma")[schema.prisma]

*Models & Relationships:*

```
User (id, email, password, name, role, refreshToken)
  ├── 1:N → Enrollment
  └── 1:N → Submission

Course (id, title, description)
  └── 1:N → Class

Class (id, courseId, title, teacherId)
  ├── N:1 → Course
  ├── 1:N → Enrollment
  ├── 1:N → Assignment
  └── 1:N → Material

Enrollment (id, userId, classId, status)
  ├── N:1 → User
  └── N:1 → Class

Assignment (id, title, description, classId, createdBy, dueDate, maxScore)
  ├── N:1 → Class
  └── 1:N → Submission

Submission (id, assignmentId, userId, content, fileUrl, status)
  ├── N:1 → Assignment
  ├── N:1 → User
  └── 1:N → Feedback

Feedback (id, submissionId, createdBy, comment, score)
  └── N:1 → Submission

Material (id, title, description, type, url, classId, createdBy)
  └── N:1 → Class
```

*Migrations:* #link("../../server/prisma/migrations")[migrations/] directory

== Enum Types

*UserRole:*
- STUDENT
- TEACHER
- ADMIN

*Material Types:*
- PDF
- VIDEO
- LINK
- DOC

*Enrollment Status:*
- ACTIVE
- COMPLETED
- DROPPED

*Submission Status:*
- PENDING
- SUBMITTED
- GRADED
