#set heading(numbering: "1.")

= ViewOwnSubmissions Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR210],
  [Displaying Rules:
    Student navigates to "My Submissions" page from dashboard. System calls method `displayMySubmissions()` to show list of all student's submissions.],

  [(2)],
  [BR211],
  [Authorization Rules:
    System calls method `getAuthenticatedUser()` to verify student identity from session token. Only retrieve submissions for current user.],

  [(3)],
  [BR212],
  [Submission Query Rules:
    System queries `SELECT s.*, a.title as assignmentTitle, a.dueDate, c.title as className FROM Submission s JOIN Assignment a ON s.assignmentId = a.id JOIN Class c ON a.classId = c.id WHERE s.userId = \[User.id\] ORDER BY s.submittedAt DESC` to get all submissions for current student (Refer to "Submission" table in "DB Sheet" file).
    System calls method `fetchUserSubmissions(String userId)`.],

  [(4)],
  [BR213],
  [Feedback Query Rules:
    For each submission, system queries feedback with `SELECT * FROM Feedback WHERE submissionId = \[Submission.id\]` to check if graded.
    System calls method `fetchSubmissionFeedback(String submissionId)`.],

  [(5)],
  [BR214],
  [Status Display Rules:
    System displays for each submission:
    - Assignment title from query
    - Class name from query
    - Submission status: "Submitted", "Graded", "Pending Grade"
    - Submission date from [Submission.submittedAt]
    - Due date from [Assignment.dueDate]
    - Late indicator if submitted after due date
    - Grade from [Feedback.score] if graded
    System calls method `renderSubmissionsList(List<Submission> submissions)`.],

  [(6)],
  [BR215],
  [Navigation Rules:
    Student can click on submission to view details and feedback (if graded). System calls method `navigateToSubmissionDetail(String submissionId)` to show full submission with feedback.],
)
