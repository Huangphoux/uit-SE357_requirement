#set heading(numbering: "1.")

= ViewStudentSubmissions Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR204],
  [Authorization Rules:
    Teacher accesses submissions list for assignment. System calls method `verifyTeacherAssignment(String assignmentId, String userId)` by querying `SELECT c.teacherId FROM Class c JOIN Assignment a ON c.id = a.classId WHERE a.id = \[Assignment.id\]`.
    If [Class.teacherId] != [User.id], display error (Refer to MSG 52) and block access.],

  [(2)],
  [BR205],
  [Displaying Rules:
    System calls method `displaySubmissionsList(String assignmentId)` and shows "View Assignment" screen (Refer to "View Assignment" view in "View Description" file) with list of all students and their submission status.],

  [(3)],
  [BR206],
  [Data Retrieval Rules:
    System queries enrolled students for class with `SELECT u.* FROM User u JOIN Enrollment e ON u.id = e.userId JOIN Class c ON e.classId = c.id JOIN Assignment a ON c.id = a.classId WHERE a.id = \[Assignment.id\] AND e.status = 'ACTIVE'`.],

  [(4)],
  [BR207],
  [Submission Query Rules:
    System calls method `fetchAllSubmissions(String assignmentId)` to retrieve submission records with `SELECT s.*, u.name as studentName FROM Submission s RIGHT JOIN User u ON s.userId = u.id WHERE s.assignmentId = \[Assignment.id\]` (Refer to "Submission" table in "DB Sheet" file).
    Uses RIGHT JOIN to include students who haven't submitted.],

  [(5)],
  [BR208],
  [Status Display Rules:
    For each student, system displays:
    - Student name
    - Submission status: "Submitted", "Graded", "Pending", or "Not Submitted"
    - Submission timestamp from [Submission.submittedAt] if submitted
    - Grade from Feedback table if graded
    - Late indicator if submitted after due date
    System calls method `calculateSubmissionStats()` to show grading progress percentage (graded count / total students \* 100).],

  [(6)],
  [BR209],
  [Navigation Rules:
    Teacher can click on submitted assignment to view details and grade. System calls method `navigateToSubmissionDetail(String submissionId)` to open grading interface.],
)
