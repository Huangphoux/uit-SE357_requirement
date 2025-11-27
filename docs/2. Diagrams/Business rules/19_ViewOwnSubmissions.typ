#set heading(numbering: "1.")

= ViewOwnSubmissions Business Rules

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(2)], [BR1], [Student Authorization: Verify student identity. Only retrieve their own submissions.],
  [(3)], [BR2], [Submission Query: Get all Submission records where student_id matches current user.],
  [(4)],
  [BR3],
  [Status Display: Show status (submitted, graded, pending grade). Show due date and submission date. If graded, display grade.],
)
