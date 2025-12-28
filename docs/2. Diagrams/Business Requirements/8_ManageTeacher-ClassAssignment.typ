#set heading(numbering: "1.")

= ManageTeacher-ClassAssignment Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR129],
  [Displaying Rules:
    The admin accesses "Class Management" screen (Refer to "Class Management" view in "View Description" file). The system calls method `displayClassManagement()` to show list of classes with their assigned teachers.],

  [(2)],
  [BR130],
  [Selection Rules:
    Admin selects a class from the list. The system calls method `selectClass(String classId)` and displays teacher assignment interface.],

  [(3)],
  [BR131],
  [Teacher List Rules:
    The system queries data in table "USER" in the database (Refer to "User" table in "DB Sheet" file) with syntax `SELECT * FROM User WHERE role = 'TEACHER'` to retrieve all teacher accounts. The system calls method `getAvailableTeachers()` to populate teacher dropdown.],

  [(4)],
  [BR132],
  [Selection Rules:
    Admin selects a teacher from dropdown. The system temporarily stores selected teacher ID using method `setSelectedTeacher(String teacherId)`.],

  [(5)],
  [BR133],
  [Validation Rules:
    When admin clicks assign button, system calls method `validateTeacherAssignment(String teacherId, String classId)` to check:
    If teacher is already assigned to maximum class load, display warning (Refer to MSG 19).
    If teacher has schedule conflict, display warning (Refer to MSG 20).
    Admin can override warnings to proceed.],

  [(6)],
  [BR134],
  [Database Update Rules:
    The system checks if class already has assigned teacher by querying `SELECT teacherId FROM Class WHERE id = \[Class.id\]`.
    If \[Class.teacherId\] is not null, system replaces previous assignment (one teacher per class rule).
    The system calls method `assignTeacherToClass(String teacherId, String classId)` to update table "CLASS" (Refer to "Class" table in "DB Sheet" file) with syntax `UPDATE Class SET teacherId = \[teacherId\], updatedAt = CURRENT_TIMESTAMP WHERE id = \[classId\]`.],

  [(7)],
  [BR135],
  [Confirmation Rules:
    System displays success message (Refer to MSG 21) and calls method `refreshClassList()` to update class management view showing new teacher assignment.],
)
