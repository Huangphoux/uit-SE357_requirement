#set heading(numbering: "1.")

= ViewFeedback Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR186],
  [Authorization Rules:
    Student opens graded assignment. System calls method `verifySubmissionOwnership(String submissionId, String userId)` by querying `SELECT userId FROM Submission WHERE id = \[Submission.id\]`.
    If [Submission.userId] != [User.id], display error (Refer to MSG 47) and block access.
    Students can only view feedback for their own submissions.],

  [(2)],
  [BR187],
  [Data Retrieval Rules:
    System queries `SELECT f.*, u.name as teacherName FROM Feedback f JOIN User u ON f.createdBy = u.id WHERE f.submissionId = \[Submission.id\]` to fetch feedback with teacher details. System calls method `fetchFeedback(String submissionId)`.],

  [(3)],
  [BR188],
  [Display Rules:
    System displays feedback screen showing:
    - Grade/score prominently from [Feedback.score] vs [Assignment.maxScore]
    - Teacher comments from [Feedback.comment]
    - Teacher name from teacher query
    - Grading date from [Feedback.createdAt]
    - Original submission content
    System calls method `renderFeedbackView(Feedback feedback)` to display all data.],

  [(4)],
  [BR189],
  [Annotation Display Rules:
    If teacher provided annotations or file markup, system displays annotated version of submission. System retrieves annotated file from storage if available.],
)
