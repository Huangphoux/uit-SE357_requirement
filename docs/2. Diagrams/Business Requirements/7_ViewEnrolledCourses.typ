#set heading(numbering: "1.")

= ViewEnrolledCourses Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR123],
  [Displaying Rules:
    When student logs in or navigates to dashboard, the system displays "Student Portal" screen (Refer to "Student Portal" view in "View Description" file). The system calls method `displayStudentDashboard()` to show enrolled courses.],

  [(2)],
  [BR124],
  [Authentication Rules:
    The system verifies student identity by checking session token. System calls method `getAuthenticatedUser()` to retrieve current user information from session.],

  [(3)],
  [BR125],
  [Database Query Rules:
    The system queries data in tables "ENROLLMENT", "CLASS", and "COURSE" in the database (Refer to respective tables in "DB Sheet" file) with syntax `SELECT c.*, cl.title as classTitle FROM Enrollment e JOIN Class cl ON e.classId = cl.id JOIN Course c ON cl.courseId = c.id WHERE e.userId = \[User.id\] AND e.status = 'ACTIVE'` to retrieve only active enrollments for current student. The system calls method `fetchEnrolledCourses(String userId)`.],

  [(4)],
  [BR126],
  [Data Processing Rules:
    The system calls method `joinEnrollmentData()` to combine data from Enrollment, Course, and Class tables. For each enrollment, system retrieves course title, class title, teacher name, and enrollment status.],

  [(5)],
  [BR127],
  [Displaying Rules:
    The system displays course list on "Student Portal" screen showing:
    - Course name from [Course.title]
    - Class title from [Class.title]
    - Teacher name (if assigned)
    - Enrollment status from [Enrollment.status]
    The system calls method `renderCourseList(List<Course> courses)` to display the data. System hides courses where enrollment status is not 'ACTIVE'.],

  [(6)],
  [BR128],
  [Navigation Rules:
    When student clicks on a course, system calls method `navigateToCourseDetail(String courseId)` and redirects to "View Course Catalog" screen (Refer to "View Course Catalog" view in "View Description" file) showing course materials and assignments.],
)
