#set heading(offset: 1)


= User Authentication & Roles

== US1.1 / UC1.1
- Epic: User Authentication & Roles
- Actor: Student
- MVP: Yes
- BR: BR1
- Use Case Title: Sign up
- Description / Notes: Register on the platform
- As a: New student
- I want to: Sign up with email and password
- So that: I can access my account
- Solution (Step-by-Step):
  - Display registration form (email, password)
  - Validate input fields
  - Submit to backend API
  - Hash password, create user
  - Send confirmation email (optional)
  - Redirect or auto-login

== US1.2 / UC1.2
- Epic: User Authentication & Roles
- Actor: Any User
- MVP: Yes
- BR: BR2
- Use Case Title: Login/Logout
- Description / Notes: Authenticate with credentials
- As a: User
- I want to: Log in/out securely
- So that: I can access my dashboard safely
- Solution (Step-by-Step):
  - Show login form
  - Validate credentials
  - Backend returns session/JWT
  - Store token (cookie/localStorage)
  - Redirect to dashboard
  - Logout: clear token, redirect

== US1.3 / UC1.3
- Epic: User Authentication & Roles
- Actor: Admin
- MVP: No
- BR: BR3
- Use Case Title: Assign Roles
- Description / Notes: Change roles in admin panel
- As a: Admin
- I want to: Assign roles (student, teacher, admin)
- So that: Users have correct permissions
- Solution (Step-by-Step):
  - Open user management panel
  - Select user
  - Choose role (Student/Teacher/Admin)
  - Submit role change
  - Backend updates permissions

== US1.4 / UC1.4
- Epic: User Authentication & Roles
- Actor: Admin
- MVP: No
- BR: BR4
- Use Case Title: Create Teacher Account
- Description / Notes: Teachers must be manually added
- As a: Admin
- I want to: Make teacher's account
- So that: New users can’t be teachers by default
- Solution (Step-by-Step):
  - Admin opens create user form
  - Fill in teacher info
  - Select “Teacher” role
  - Backend creates account
  - Send activation or temp password email

= Course & Class Management

== US2.1 / UC2.1
- Epic: Course & Class Management
- Actor: Admin
- MVP: Yes
- BR: BR5
- Use Case Title: Manage Courses
- Description / Notes: Full course lifecycle management
- As a: Admin
- I want to: CRUD courses
- So that: We can structure learning content
- Solution (Step-by-Step):
  - Open course dashboard
  - Create/edit/delete course
  - Fill in course form (title, desc, etc.)
  - Submit to backend
  - Reflect updated list

== US2.2 / UC2.2
- Epic: Course & Class Management
- Actor: Admin
- MVP: Yes
- BR: BR6
- Use Case Title: Manage Classes
- Description / Notes: Link classes to courses
- As a: Admin
- I want to: CRUD classes and assign to courses
- So that: Students can join organized sessions
- Solution (Step-by-Step):
  - Access class management UI
  - Create/edit/delete classes
  - Link to a course + schedule
  - Backend stores updates
  - Classes show in course view

== US2.3 / UC2.3
- Epic: Course & Class Management
- Actor: Admin
- MVP: No
- BR: BR7
- Use Case Title: Manage Student Enrollments
- Description / Notes: Assign/remove students
- As a: Admin
- I want to: Enroll/remove students from courses
- So that: I can manage who attends
- Solution (Step-by-Step):
  - Open class or student profile
  - Click enroll/remove buttons
  - Backend updates records
  - UI reflects enrollment status

== US2.4 / UC2.4
- Epic: Course & Class Management
- Actor: Student
- MVP: Yes
- BR: BR8
- Use Case Title: View Enrolled Courses
- Description / Notes: Show list of joined courses
- As a: Student
- I want to: View my enrolled courses
- So that: I know when and what I’m learning
- Solution (Step-by-Step):
  - Student logs in
  - Fetch enrolled courses from backend
  - Display course list in dashboard

== US2.5 / UC2.5
- Epic: Course & Class Management
- Actor: Admin
- MVP: No
- BR: BR9
- Use Case Title: Manage Teacher-Class Assignment
- Description / Notes: Assign teachers per class
- As a: Admin
- I want to: Assign/remove teachers to classes
- So that: I can manage who teaches what class
- Solution (Step-by-Step):
  - Open class details
  - Choose teacher from dropdown
  - Assign/remove teacher
  - Backend updates assignment
  - Reflect in views

== US2.6 / UC2.6
- Epic: Course & Class Management
- Actor: Student
- MVP: Yes
- BR: BR10
- Use Case Title: Self-Enroll in Courses
- Description / Notes: Enroll or leave courses
- As a: Student
- I want to: Enroll / Remove from courses
- So that: I can attend courses
- Solution (Step-by-Step):
  - Access course catalog
  - Click Enroll/Unenroll
  - Backend updates enrollment
  - Dashboard shows current enrollments

= Material Management

== US3.1 / UC3.1
- Epic: Material Management
- Actor: Teacher
- MVP: Yes
- BR: BR11
- Use Case Title: Manage Course Materials
- Description / Notes: Add/edit/delete resources
- As a: Teacher
- I want to: CRUD materials (PDFs, videos, links)
- So that: Students can study relevant content
- Solution (Step-by-Step):
  - Open course materials tab
  - Upload files or add links
  - Tag with course/topic
  - Backend stores and links materials
  - Provide edit/delete options

== US3.2 / UC3.2
- Epic: Material Management
- Actor: Student
- MVP: Yes
- BR: BR12
- Use Case Title: Access Learning Materials
- Description / Notes: View materials in enrolled courses
- As a: Student
- I want to: Access learning materials
- So that: I can study independently
- Solution (Step-by-Step):
  - Open course page
  - Fetch materials from backend
  - Display for download/stream
  - Restrict access by enrollment

= Assignment Management

== US4.1 / UC4.1
- Epic: Assignment Management
- Actor: Teacher
- MVP: Yes
- BR: BR13
- Use Case Title: Manage Assignments
- Description / Notes: Create/update assignments
- As a: Teacher
- I want to: CRUD written assignments
- So that: Students can practice and be assessed
- Solution (Step-by-Step):
  - Go to assignment tab
  - Create/edit assignments (title, desc, deadline)
  - Submit to backend
  - Display to students

== US4.2 / UC4.2
- Epic: Assignment Management
- Actor: Student
- MVP: Yes
- BR: BR14
- Use Case Title: Submit Assignments
- Description / Notes: Upload or write submissions
- As a: Student
- I want to: CRUD submissions with file or text
- So that: My teacher can review it
- Solution (Step-by-Step):
  - Open assignment page
  - Upload file or write in editor
  - Submit to backend
  - Status shown (submitted/resubmitted)

== US4.3 / UC4.3
- Epic: Assignment Management
- Actor: Teacher
- MVP: No
- BR: BR15
- Use Case Title: Review Submissions & Comment
- Description / Notes: Evaluate and give feedback
- As a: Teacher
- I want to: Review student submissions, view submission details, add comments or feedback, and annotate or grade
- So that: I can help students improve
- Solution (Step-by-Step):
  - View submissions list
  - Open student’s submission
  - Add comments or annotations
  - Save feedback
  - Notify student

== US4.4 / UC4.4
- Epic: Assignment Management
- Actor: Student
- MVP: Yes
- BR: BR16
- Use Case Title: View Feedback
- Description / Notes: Read teacher comments
- As a: Student
- I want to: View teacher feedback/comments
- So that: I can learn from my mistakes
- Solution (Step-by-Step):
  - Open submitted assignment
  - View teacher feedback
  - Backend fetches feedback
  - Display comments/scores

= Notifications

== US5.1 / UC5.1
- Epic: Notifications
- Actor: Teacher
- MVP: No
- BR: BR17
- Use Case Title: Send Notifications
- Description / Notes: Notify enrolled students
- As a: Teacher
- I want to: Send notifications to a course
- So that: I can communicate updates or guidance
- Solution (Step-by-Step):
  - Open notification panel
  - Select recipients (class/course)
  - Compose message
  - Backend sends & stores
  - Deliver via platform/email

== US5.2 / UC5.2
- Epic: Notifications
- Actor: Student
- MVP: No
- BR: BR18
- Use Case Title: Receive Notifications
- Description / Notes: Get system or teacher updates
- As a: Student
- I want to: Receive notifications
- So that: I don’t miss important updates
- Solution (Step-by-Step):
  - View notifications in dashboard
  - Fetch from backend
  - Optional email/push alert
  - Mark as read/unread

= Student Progress Tracking

== US6.1 / UC6.1
- Epic: Student Progress Tracking
- Actor: Teacher
- MVP: No
- BR: BR19
- Use Case Title: View Submissions
- Description / Notes: See assignment submissions
- As a: Teacher
- I want to: View student submissions
- So that: I can track performance
- Solution (Step-by-Step):
  - Access assignment dashboard
  - Filter by student/status
  - View submission status
  - Export (optional)

== US6.2 / UC6.2
- Epic: Student Progress Tracking
- Actor: Student
- MVP: No
- BR: BR20
- Use Case Title: View My Submissions
- Description / Notes: Track my past work
- As a: Student
- I want to: See my submissions
- So that: I can monitor my learning
- Solution (Step-by-Step):
  - Open “My Submissions” page
  - Fetch list of submissions
  - Show status and feedback

= Admin Dashboard & Settings

== US7.1 / UC7.1
- Epic: Admin Dashboard & Settings
- Actor: Admin
- MVP: No
- BR: BR21
- Use Case Title: View Platform Stats
- Description / Notes: Dashboard of key metrics
- As a: Admin
- I want to: View total users, courses, assignments stats
- So that: I get an overview of platform usage
- Solution (Step-by-Step):
  - Open admin dashboard
  - Backend aggregates stats
  - Display charts (users, courses, submissions)
  - Add time filters

== US7.2 / UC7.2
- Epic: Admin Dashboard & Settings
- Actor: Admin
- MVP: No
- BR: BR22
- Use Case Title: Manage User Accounts
- Description / Notes: Edit/delete/deactivate users
- As a: Admin
- I want to: Manage all user accounts
- So that: I can edit or deactivate users
- Solution (Step-by-Step):
  - Open user management table
  - Search/edit/deactivate users
  - Confirm actions
  - Backend updates user records

== US7.3 / UC7.3
- Epic: Admin Dashboard & Settings
- Actor: Admin
- MVP: No
- BR: BR23
- Use Case Title: Update System Settings
- Description / Notes: Modify global/platform settings
- As a: Admin
- I want to: Update center info and settings
- So that: The system stays up to date
- Solution (Step-by-Step):
  - Open settings page
  - Edit branding, terms, contact info
  - Save to backend
  - Changes apply system-wide
