#set heading(numbering: "1.")

= SelfEnrollCourses Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR136],
  [Displaying Rules:
    Student navigates to "Course Catalog" screen (Refer to "Course Catalog" view in "View Description" file). The system calls method `displayCourseCatalog()` to show available courses with enrollment status.],

  [(2)],
  [BR137],
  [Search Rules:
    Student can search for courses using [txtBoxSearch]. The system calls method `searchCourses(String keyword)` to filter courses by title or description matching the search term.],

  [(3)],
  [BR138],
  [Enrollment Action Rules:
    When student clicks [btnEnroll] button on a course, the system calls method `initiateEnrollment(String courseId)` and displays class selection if multiple classes available for the course.],

  [(4)],
  [BR139],
  [Validation Rules:
    The system calls method `validateEnrollment(String userId, String classId)` to check:
    If student is already enrolled, display error (Refer to MSG 22).
    The system queries `SELECT COUNT(\*) FROM Enrollment WHERE userId = \[User.id\] AND classId = \[Class.id\]`.
    If count > 0, prevent duplicate enrollment.],

  [(5)],
  [BR140],
  [Capacity Validation Rules:
    The system checks class capacity by querying `SELECT COUNT(\*) FROM Enrollment WHERE classId = \[Class.id\] AND status = 'ACTIVE'`.
    Compare with class maximum capacity.
    If class is full, display error (Refer to MSG 23) and reject enrollment.],

  [(6)],
  [BR141],
  [Database Insert Rules:
    If validation passes, system calls method `createEnrollment(String userId, String classId)` to insert record in table "ENROLLMENT" (Refer to "Enrollment" table in "DB Sheet" file) with syntax `INSERT INTO Enrollment (id, userId, classId, status, createdAt, updatedAt) VALUES (\[Enrollment.id\], \[userId\], \[classId\], 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`.],

  [(7)],
  [BR142],
  [Confirmation Rules:
    System displays success message (Refer to MSG 24) and updates course catalog view. System calls method `updateEnrollmentStatus()` to change [btnEnroll] to [btnUnenroll] for enrolled courses.],
)
