# English Center Management System – Project Requirements

---

## Overview

A web-based platform to manage an English center, supporting student enrollment, class scheduling, assignment tracking, material sharing, attendance, and communication. The system includes role-based access for admins, teachers, and students.

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Passport.js

---

## Constraints

- No multiple choice quizzes
- Must use Passport.js for authentication
- Use Prisma ORM with PostgreSQL
- React frontend with clean component architecture
- REST API with Express backend

---

## Functional Requirements & User Stories

### 1. User Authentication & Roles

**Description:** Basic login system with different user roles (Admin, Teacher, Student)

**Features:**
- Sign up / Log in / Log out
- Role-based access: Admin, Teacher, Student
- Password recovery

**User Stories:**
- US1.1 – As a new user, I want to sign up with email and password, so I can access my account.
- US1.2 – As a user, I want to log in/out securely, so I can access my dashboard safely.
- US1.3 – As an admin, I want to assign roles (student, teacher, admin), so users have correct permissions.
- US1.4 – As a user, I want to reset my password, so I can recover my account.

---

### 2. Course & Class Management

**Description:** Manage courses, class schedules, and student enrollments

**Features:**
- Create/edit/delete courses and classes
- Assign classes to courses
- Enroll/remove students from classes
- Student class schedule/calendar view

**User Stories:**
- US2.1 – As an admin, I want to create and edit courses, so we can structure learning content.
- US2.2 – As an admin or teacher, I want to create classes and assign them to courses, so students can join organized sessions.
- US2.3 – As an admin, I want to enroll/remove students from classes, so I can manage who attends.
- US2.4 – As a student, I want to view my enrolled classes, so I know when and what I'm learning.

---

### 3. Material Management

**Description:** Upload and organize learning content

**Features:**
- Upload PDFs, videos, links
- Categorize materials by course/class/topic
- Student access based on class enrollment

**User Stories:**
- US3.1 – As a teacher, I want to upload materials (PDFs, videos, links), so students can study relevant content.
- US3.2 – As a teacher, I want to categorize materials by topic or level, so content is easier to navigate.
- US3.3 – As a student, I want to access learning materials from my class, so I can study independently.

---

### 4. Assignment Management

**Description:** Create, submit, and review assignments (non-MCQ)

**Features:**
- Teacher creates assignments (text or file-based)
- Student submits via text or file
- Teachers provide feedback and grades

**User Stories:**
- US4.1 – As a teacher, I want to create written or oral assignments, so students can practice and be assessed.
- US4.2 – As a student, I want to submit my assignment via file or text, so my teacher can review it.
- US4.3 – As a teacher, I want to review and comment on submissions, so I can help students improve.
- US4.4 – As a student, I want to view teacher feedback, so I can learn from my mistakes.

---

### 5. Messaging & Notifications

**Description:** In-platform messaging and alerts

**Features:**
- Teacher-student messaging
- Notifications for assignments, materials, and classes
- View message history

**User Stories:**
- US5.1 – As a teacher, I want to send messages to students or classes, so I can share updates or guidance.
- US5.2 – As a student, I want to receive notifications, so I don't miss important updates.
- US5.3 – As any user, I want to view message history, so I can refer to past communication.

---

### 6. Student Progress Tracking

**Description:** Monitor performance, feedback, and attendance

**Features:**
- Assignment history and grades
- Attendance tracking
- Student dashboard showing personal progress

**User Stories:**
- US6.1 – As a teacher, I want to view student submissions and activity logs, so I can track engagement.
- US6.2 – As a student, I want to view my progress, so I can monitor my learning.
- US6.3 – As a teacher, I want to mark attendance, so I can track consistency.

---

### 7. Admin Dashboard & Settings

**Description:** Centralized control panel for platform management

**Features:**
- Overview statistics (users, classes, assignments)
- Full user management (create, edit, deactivate)
- Update center information and permissions

**User Stories:**
- US7.1 – As an admin, I want to view user and course stats, so I understand platform usage.
- US7.2 – As an admin, I want to manage user accounts, so I can edit or deactivate users.
- US7.3 – As an admin, I want to update center info and settings, so the platform remains current.

---

## Database Schema (Simplified)

### User
- `id` (PK)
- `name`
- `email`
- `password`
- `role` (`admin` | `teacher` | `student`)
- `bio`
- `createdAt`

### Course
- `id` (PK)
- `title`
- `description`
- `level`

### Class
- `id` (PK)
- `name`
- `courseId` (FK → Course)
- `teacherId` (FK → User)
- `scheduleId` (FK → Schedule)

### Schedule
- `id` (PK)
- `classId` (FK → Class)
- `daysOfWeek` (e.g. ["Mon", "Wed"])
- `startTime`
- `endTime`

### Enrollment
- `id` (PK)
- `studentId` (FK → User)
- `classId` (FK → Class)

### Material
- `id` (PK)
- `title`
- `fileUrl`
- `type` (e.g. `pdf`, `video`, `link`)
- `courseId` or `classId`
- `createdBy` (FK → User)

### Assignment
- `id` (PK)
- `classId` (FK → Class)
- `title`
- `description`
- `dueDate`
- `createdBy` (FK → User)

### Submission
- `id` (PK)
- `assignmentId` (FK → Assignment)
- `studentId` (FK → User)
- `content` (text or file URL)
- `submittedAt`
- `feedback`
- `grade`

### Attendance
- `id` (PK)
- `classId` (FK → Class)
- `studentId` (FK → User)
- `date`
- `status` (Present / Absent / Late)

### Message
- `id` (PK)
- `senderId` (FK → User)
- `receiverId` (FK → User or Class)
- `content`
- `createdAt`

---

## Non-Functional Requirements

- Responsive UI (mobile/tablet/desktop)
- Secure authentication and authorization (Passport.js)
- RESTful API design
- Passwords must be hashed (bcrypt)
- Error handling and validation on frontend and backend
- Logging and basic monitoring (e.g. user activity, failures)
- Modular codebase (service-controller-model structure)
- Code documentation and consistent formatting
- Ready for deployment (Docker optional, CI/CD optional)
- Minimum test coverage for backend (Jest or similar)

---

## Optional Enhancements (Future)

- Email notifications for feedback and upcoming classes
- Admin analytics dashboard (charts, graphs)
- Export reports (attendance, grades)

---

## Suggested Development Timeline (8 Weeks)

| Week | Tasks |
|------|-------|
| 1-2  | Project setup, DB schema, Auth system |
| 3-4  | Course/Class Management, Enrollments |
| 5    | Assignments, Submissions, Materials |
| 6    | Attendance, Progress, Messaging |
| 7    | Admin Dashboard, Notifications |
| 8    | Final testing, QA, Deployment

