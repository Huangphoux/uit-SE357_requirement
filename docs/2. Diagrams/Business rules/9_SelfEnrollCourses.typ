#set heading(numbering: "1.")

= SelfEnrollCourses Business Rules

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(3)],
  [BR1],
  [Prerequisite Validation: Check student has completed course prerequisites before allowing enrollment. Block if not met.],

  [(4)], [BR2], [Capacity Check: Verify course/class has available seats. Reject enrollment if full.],
  [(6)], [BR3], [Duplicate Prevention: Prevent student from enrolling in same course twice.],
  [(7)], [BR4], [Enrollment Creation: Create Enrollment record with status = active and timestamp.],
)
