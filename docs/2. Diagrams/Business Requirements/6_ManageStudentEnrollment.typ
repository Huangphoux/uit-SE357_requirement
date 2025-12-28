#set heading(numbering: "1.")

= ManageStudentEnrollment Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR115],
  [Displaying Rules:
    The admin accesses "Assign Management" tab from "Admin Dashboard" screen (Refer to "Admin Dashboard" view in "View Description" file). The system calls method `displayEnrollmentManagement()` and shows enrollment list.],

  [(2)],
  [BR116],
  [Data Retrieval Rules:
    The system queries data in tables "ENROLLMENT", "USER", and "CLASS" in the database (Refer to respective tables in "DB Sheet" file) with syntax `SELECT e.*, u.name as studentName, c.title as className FROM Enrollment e JOIN User u ON e.userId = u.id JOIN Class c ON e.classId = c.id` to fetch all enrollment records with user and class details. The system calls method `fetchEnrollmentsByAdmin()` to retrieve the data.],

  [(3)],
  [BR117],
  [Selection Rules:
    When admin wants to enroll a student, admin selects class from dropdown and selects student from dropdown. The system populates dropdowns by calling methods `getAvailableClasses()` and `getAvailableStudents()`.],

  [(4)],
  [BR118],
  [Validation Rules:
    When admin clicks "Enroll Student" button, the system calls method `validateEnrollment(String classId, String userId)` to check:
    If student is already enrolled in this class, system displays error message (Refer to MSG 15).
    If class has reached maximum capacity, system displays error message (Refer to MSG 16).
    System moves to step (5) if validation passes.],

  [(5)],
  [BR119],
  [Database Insert Rules:
    The system calls method `enrollStudentByAdmin(String classId, String userId)` to create enrollment record in table "ENROLLMENT" (Refer to "Enrollment" table in "DB Sheet" file) with syntax `INSERT INTO Enrollment (id, userId, classId, status, createdAt, updatedAt) VALUES ([Enrollment.id], [userId], [classId], 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`.],

  [(6)],
  [BR120],
  [Confirmation Rules:
    System displays success message (Refer to MSG 17) and calls method `refreshEnrollmentList()` to update the enrollment list view with latest data.],

  [(7)],
  [BR121],
  [Unenroll Selection Rules:
    When admin wants to remove student from class, admin clicks delete button on enrollment row. System calls method `confirmUnenroll(String enrollmentId)` to display confirmation dialog (Refer to "Confirmation message box" view in "View Description" file).],

  [(8)],
  [BR122],
  [Database Delete Rules:
    If admin confirms unenrollment, system calls method `removeEnrollment(String classId, String userId)` to delete record from table "ENROLLMENT" (Refer to "Enrollment" table in "DB Sheet" file) with syntax `DELETE FROM Enrollment WHERE userId = [userId] AND classId = [classId]`.
    System displays success message (Refer to MSG 18) and refreshes enrollment list.],
)
