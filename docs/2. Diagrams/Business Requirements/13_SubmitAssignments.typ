#set heading(numbering: "1.")

= SubmitAssignments Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(2)],
  [BR1],
  [Deadline Check: Verify current time <= assignment deadline. Block submissions after deadline (with grace period option).],

  [(5)], [BR2], [File Validation: Validate uploaded file (type allowed, size < limit, virus scan). Reject if invalid.],
  [(6)],
  [BR3],
  [Duplicate/Update: If student already submitted, treat as resubmission (update existing record, update timestamp).],

  [(7)],
  [BR4],
  [Submission Storage: Create/update Submission record with timestamp, file/text content, status = submitted.],
)
