#set heading(numbering: "1.")

= ReviewSubmissions&Comment Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR175],
  [Displaying Rules:
    Teacher navigates to assignment submissions list. System calls method `displaySubmissionsList(String assignmentId)` and shows all student submissions for the assignment.],

  [(2)],
  [BR176],
  [Data Retrieval Rules:
    System queries `SELECT s.*, u.name as studentName FROM Submission s JOIN User u ON s.userId = u.id WHERE s.assignmentId = \[Assignment.id\]` to fetch all submissions with student details. System calls method `fetchSubmissions(String assignmentId)`.],

  [(3)],
  [BR177],
  [Selection Rules:
    Teacher clicks on a student submission to review. System calls method `displaySubmissionDetail(String submissionId)` and shows submission content with grading interface.],

  [(4)],
  [BR178],
  [Content Display Rules:
    System displays submission content from [Submission.content] or file link from [Submission.fileUrl]. System shows submission timestamp and student comments.],

  [(5)],
  [BR179],
  [Authorization Rules:
    System verifies teacher is assigned to class by checking [Class.teacherId] = [User.id].
    Query: `SELECT teacherId FROM Class c JOIN Assignment a ON c.id = a.classId WHERE a.id = \[Assignment.id\]`.
    Only assigned teacher can grade submissions.
    If unauthorized, display error (Refer to MSG 44).],

  [(6)],
  [BR180],
  [Grading Input Rules:
    Teacher enters grade/score and feedback comments. System provides input fields for numeric grade and text area for comments.],

  [(7)],
  [BR181],
  [Grade Validation Rules:
    System calls method `validateGrade(Float score)` to check:
    Grade must be numeric value.
    Grade must be between 0 and [Assignment.maxScore].
    If invalid, display error (Refer to MSG 45).],

  [(8)],
  [BR182],
  [Database Insert Rules:
    System calls method `createFeedback(Feedback feedback)` to insert record in table "FEEDBACK" (Refer to "Feedback" table in "DB Sheet" file) with syntax `INSERT INTO Feedback (id, submissionId, createdBy, comment, score, createdAt, updatedAt) VALUES (\[Feedback.id\], \[submissionId\], \[teacherId\], \[Feedback.comment\], \[Feedback.score\], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`.
    System also updates submission status to 'GRADED'.],

  [(9)],
  [BR183],
  [Confirmation Rules:
    System displays success message (Refer to MSG 46) and updates submission list showing graded status.],

  [(10)],
  [BR184],
  [Notification Preparation Rules:
    System calls method `prepareStudentNotification(String userId, String assignmentTitle)` to create notification for student about graded submission.],

  [(11)],
  [BR185],
  [Notification Send Rules:
    System sends notification to student informing them their submission has been graded and feedback is available. Student can view feedback through notification link.],
)
