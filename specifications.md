# English Center Management System – Specification (v1.0)

---

## 1. Introduction

- **Purpose**: A web-based platform for managing the operations of an English learning center.  
- **Scope**: The system supports student registration, class scheduling, assignment tracking, attendance recording, learning material distribution, internal messaging, and user role management.  
- **Target Users**: Admins, Teachers, and Students.  

---

## 2. Architecture Overview

- **Architecture Style**: Client–Server, REST API, Role-based Authentication  
- **Frontend**: React.js SPA (responsive for mobile, tablet, desktop)  
- **Backend**: Express.js (Node.js) REST API, Passport.js for authentication  
- **Database**: PostgreSQL with Prisma ORM  
- **Authentication**: Local (email/password) via Passport.js  
- **File Storage**: URLs stored in DB; files hosted via file system or cloud object storage  
- **Deployment**: Docker (optional), ready for VPS/cloud deployment  

---

## 3. User Roles & Permissions

### Admin
- Full access to all system features  
- Manages users, courses, settings, and reports  

### Teacher
- Manages classes, uploads materials, creates assignments, tracks student progress  
- Sends messages and marks attendance  

### Student
- Accesses enrolled classes, downloads materials, submits assignments  
- Views feedback, messages, and progress dashboard  

---

## 4. Functional Modules

### FR1 – User Management & Security

- User registration (students only), login/logout functionality  
- Role assignment (Admin-controlled)  
- Teacher accounts created by Admin only  
- Password hashing (bcrypt)  
- Password reset functionality  
- Secure session management (via Passport.js)  

### FR2 – Course & Class Management

- Admin creates and manages courses  
- Admin/Teacher can create classes and assign them to courses  
- Teachers assigned to classes (multi-teacher support)  
- Students enrolled or removed from classes (Admin-only)  
- Students view class schedule/calendar  

### FR3 – Learning Materials

- Teachers upload PDFs, videos, or links  
- Materials can be organized by topic, course, or class  
- Students access class-specific materials  
- File URLs stored in the database  

### FR4 – Assignments & Submissions

- Teachers create open-ended (non-MCQ) assignments (text or file-based)  
- Students submit via file upload or text box  
- Teachers review, provide feedback and grades  
- Students view submission history and feedback  

### FR5 – Messaging & Notifications

- Teachers send messages to classes or individual students  
- Students receive real-time or near-real-time alerts  
- All users can view message history  
- System-generated notifications for assignments/materials  

### FR6 – Attendance & Progress Tracking

- Teachers mark attendance (Present / Absent / Late) per class session  
- Students view their attendance and learning progress  
- Teachers view student activity logs and assignment history  
- Visual dashboard for students showing progress indicators  

### FR7 – Admin Dashboard & System Settings

- Overview statistics: number of users, active courses, submitted assignments  
- Admin can update platform information (name, logo, center details)  
- User management: create, update, deactivate users  
- Control panel for adjusting platform-wide settings  

---

## 5. Use Case Summary

| ID  | Use Case                        | Description                                               |
|-----|----------------------------------|-----------------------------------------------------------|
| UC1 | Register Student Account         | Student signs up with email and password                  |
| UC2 | Login/Logout                     | Secure login/logout for all roles                         |
| UC3 | Assign User Roles                | Admin assigns or modifies user roles                      |
| UC4 | Create Teacher Account           | Admin creates new teacher accounts                        |
| UC5 | Manage Courses                   | Admin creates/updates courses                             |
| UC6 | Manage Classes                   | Admin/Teacher creates and manages classes                 |
| UC7 | Manage Class Enrollment          | Admin enrolls or removes students                         |
| UC8 | View Enrolled Classes            | Student views their class list                            |
| UC9 | Assign Teachers to Classes       | Admin assigns/removes teachers from classes               |
| UC10| Upload Learning Materials        | Teacher uploads files or links                            |
| UC11| Organize Learning Materials      | Teacher categorizes resources                             |
| UC12| Access Learning Materials        | Student views class materials                             |
| UC13| Create Assignments               | Teacher posts assignments                                 |
| UC14| Submit Assignment                | Student submits assignments                               |
| UC15| Review Assignment Submissions    | Teacher reviews and comments                              |
| UC16| View Feedback                    | Student reads feedback and grades                         |
| UC17| Send Messages                    | Teacher sends messages to students or classes             |
| UC18| Receive Notifications            | Students get notified of new content/assignments          |
| UC19| View Message History             | All users access previous messages                        |
| UC20| Monitor Student Activity         | Teachers track student engagement                         |
| UC21| Track Learning Progress          | Students view their performance dashboard                 |
| UC22| Record Attendance                | Teachers mark class attendance                            |
| UC23| View Platform Statistics         | Admin sees reports on usage and activity                  |
| UC24| Manage User Accounts             | Admin updates/deactivates users                           |
| UC25| Update System Settings           | Admin configures center/platform info                     |

---

## 6. Database Design (Simplified ERD)

### Core Tables

- **Users** (`UserID`, `Name`, `Email`, `PasswordHash`, `Role`, `Bio`, `CreatedAt`)  
- **Courses** (`CourseID`, `Title`, `Description`, `Level`)  
- **Classes** (`ClassID`, `Name`, `CourseID`)  
- **ClassTeachers** (`ID`, `ClassID`, `TeacherID`)  
- **ScheduleEntries** (`ID`, `ClassID`, `DayOfWeek`, `StartTime`, `EndTime`)  
- **Enrollments** (`ID`, `ClassID`, `StudentID`)  
- **Materials** (`MaterialID`, `Title`, `FileURL`, `Type`, `CourseID?`, `ClassID?`, `CreatedBy`)  
- **Assignments** (`AssignmentID`, `ClassID`, `Title`, `Description`, `DueDate`, `CreatedBy`)  
- **Submissions** (`SubmissionID`, `AssignmentID`, `StudentID`, `Content`, `SubmittedAt`, `Feedback`, `Grade`)  
- **Attendance** (`AttendanceID`, `ClassID`, `StudentID`, `Date`, `Status`)  
- **Messages** (`MessageID`, `SenderID`, `ReceiverID`, `Content`, `CreatedAt`)  

---

## 7. API Specification (REST)

### Authentication
- `POST /auth/register` – Student signup  
- `POST /auth/login` – Login with email/password  
- `POST /auth/logout` – Logout  
- `POST /auth/reset-password` – Password recovery  

### Users
- `GET /users/:id` – (Admin only)  
- `PUT /users/:id` – (Admin or self)  
- `DELETE /users/:id` – (Admin)  
- `POST /users/teacher` – (Admin creates teacher account)  

### Courses
- `GET /courses`  
- `POST /courses` – (Admin)  
- `PUT /courses/:id` – (Admin)  
- `DELETE /courses/:id` – (Admin)  

### Classes
- `GET /classes`  
- `POST /classes` – (Admin/Teacher)  
- `PUT /classes/:id`  
- `DELETE /classes/:id`  
- `POST /classes/:id/enroll` – (Admin)  
- `POST /classes/:id/teachers` – (Admin)  

### Materials
- `POST /materials` – (Teacher)  
- `GET /materials/:classId` – (Enrolled students only)  

### Assignments
- `POST /assignments` – (Teacher)  
- `GET /assignments/:classId`  
- `POST /submissions` – (Student)  
- `GET /submissions/:assignmentId` – (Teacher/Student)  
- `PUT /submissions/:id/feedback` – (Teacher)  

### Attendance
- `POST /attendance/:classId` – (Teacher)  
- `GET /attendance/:classId/:studentId` – (Teacher/Student)  

### Messaging
- `POST /messages` – (Teacher)  
- `GET /messages` – (All roles)  

### Reports
- `GET /admin/stats` – (Admin dashboard)  
- `GET /student/progress`  
- `GET /teacher/student-activity/:studentId`  

---

## 8. Non-Functional Requirements

- **Security**: Passport.js authentication, bcrypt password hashing, role-based access control  
- **Performance**: Efficient queries via Prisma ORM  
- **Validation**: Input validation both client and server side  
- **Error Handling**: Centralized error middleware and clear error messages  
- **Logging**: Request/response logging, user activity tracking  
- **Architecture**: Modular MVC structure (Models, Services, Controllers)  
- **Documentation**: Internal comments and optional OpenAPI/Swagger docs  
- **Testing**: Minimum backend coverage using Jest or equivalent  
- **Responsiveness**: Mobile-first design with React  
- **Deployment**: Docker-ready setup; CI/CD optional  

---

## 9. Optional Enhancements (Future)

- Email notifications for assignments, feedback, and class reminders  
- Exportable reports (grades, attendance) in PDF/CSV format  
- Admin analytics dashboard (charts and visual insights)  
- OAuth2 login support (Google, Facebook, etc.)  
- Video meeting integrations (Zoom, Google Meet, etc.)  
