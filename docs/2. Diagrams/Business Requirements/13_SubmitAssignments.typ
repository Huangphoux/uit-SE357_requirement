#set heading(numbering: "1.")

= SubmitAssignments Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR167],
  [Displaying Rules:
    Student navigates to assignment from course page. System calls method `displayAssignmentDetail(String assignmentId)` and shows assignment with submission interface (Refer to "Edit Submission by Text Entry" or "Edit Submission by File Upload" views in "View Description" file).],

  [(2)],
  [BR168],
  [Deadline Validation Rules:
    System calls method `checkDeadline(Date dueDate)` to verify current timestamp <= [Assignment.dueDate].
    If deadline has passed, display error (Refer to MSG 39) and disable submission buttons.
    Optional grace period can be configured to allow late submissions with penalty.],

  [(3)],
  [BR169],
  [Submission Type Selection Rules:
    Student chooses between text entry using [txtBoxSubmission] or file upload using [btnSubmission]. System calls method `setSubmissionType(String type)` to track submission method.],

  [(4)],
  [BR170],
  [Input Rules:
    For text entry: Student enters submission content in [txtBoxSubmission] and optional comment in [txtBoxComment].
    For file upload: Student clicks [btnSubmission] to select file and enters optional comment in [txtBoxComment].],

  [(5)],
  [BR171],
  [File Validation Rules:
    If file upload selected, system calls method `validateSubmissionFile(File file)` to check:
    File type allowed (PDF, DOC, DOCX, ZIP, etc.).
    If invalid type, display error (Refer to MSG 40).
    File size < 50MB limit.
    If exceeds, display error (Refer to MSG 41).
    Perform virus scan.],

  [(6)],
  [BR172],
  [Duplicate Check Rules:
    System queries `SELECT \* FROM Submission WHERE assignmentId = \[Assignment.id\] AND userId = \[User.id\]` to check existing submission.
    If exists, treat as resubmission (update operation).
    If new, create submission (insert operation).
    System calls method `checkExistingSubmission(String assignmentId, String userId)`.],

  [(7)],
  [BR173],
  [Database Operation Rules:
    If new submission, system calls method `createSubmission(Submission submission)` with syntax `INSERT INTO Submission (id, assignmentId, userId, content, fileUrl, status, submittedAt, createdAt, updatedAt) VALUES (\[Submission.id\], \[assignmentId\], \[userId\], \[Submission.content\], \[Submission.fileUrl\], 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`.
    If resubmission, system calls method `updateSubmission(Submission submission)` with syntax `UPDATE Submission SET content = \[Submission.content\], fileUrl = \[Submission.fileUrl\], status = 'SUBMITTED', submittedAt = CURRENT_TIMESTAMP, updatedAt = CURRENT_TIMESTAMP WHERE id = \[Submission.id\]`.
    Refer to "Submission" table in "DB Sheet" file.],

  [(8)],
  [BR174],
  [Confirmation Rules:
    System displays success message (Refer to MSG 42 for new submission, MSG 43 for resubmission) and updates submission status display.],
)
