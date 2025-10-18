#set heading(offset: 1)

= Entities

- User: Represents a user of the platform (student, teacher, admin)

- Course: Represents a course with its details (title, description, etc.)

- Class: Represents a class associated with a course, with a specific schedule

- Enrollment: Represents the relationship between a student and a course/class

- Material: Represents learning materials (PDFs, videos, links)

- Assignment: Represents an assignment with details (title, description, etc.)

- Submission: Represents a student's submission for an assignment

- Feedback: Represents teacher feedback on student submissions

- Notification: Represents a system or teacher notification for users

- SubmissionStatus: Represents the status of a student's submission (e.g., pending, graded)

- PlatformStats: Represents key metrics of the platform (user count, course count, etc.)

= Boundaries

- Registration Form: User interface for user sign-up

- Login Form: User interface for user authentication

- Admin Panel: User interface for admin operations (role assignment, user management)

- Course Dashboard: Admin interface for managing courses

- Class Management UI: Admin interface for managing classes and linking them to courses

- Course Catalog: Student interface for viewing and enrolling in courses

- Material Management UI: Teacher interface for uploading and managing course materials

- Assignment UI: Teacher interface for creating assignments

- Submission UI: Student interface for submitting assignments

- Notification Panel: Teacher interface for sending notifications

- Student Dashboard: Student interface for viewing progress, assignments, and materials

- Admin Dashboard: Admin interface for viewing platform statistics and user activity

- Settings Page: Admin interface for modifying platform settings

= Controllers

- UserController: Handles user registration, login, and authentication

- AdminController: Handles admin-related actions such as managing users, courses, and settings

- CourseController: Handles actions related to creating, editing, and deleting courses

- ClassController: Handles actions related to creating, editing, and deleting classes

- MaterialController: Handles actions for adding/editing course materials

- AssignmentController: Handles creation and management of assignments

- SubmissionController: Handles student submissions, grading, and feedback management

- NotificationController: Manages sending and receiving notifications

- ProgressController: Manages student progress tracking, submission reviews, and feedback

- StatsController: Manages platform statistics and admin dashboard data aggregation

- SettingsController: Handles the modification of system settings and configuration
