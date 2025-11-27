#set heading(numbering: "1.")

= ManageStudentEnrollment Business Rules

| Activity | BR Code | Description |
|----------|---------|-------------|
| (4) | BR1 | Prerequisite Check: Validate student has completed course prerequisites. If not met, warn admin but allow override. |
| (5) | BR2 | Class Capacity: Verify class has available seats (current enrollment < max capacity). Reject enrollment if full. |
| (6) | BR3 | Duplicate Prevention: Check if student already enrolled in this class. Prevent duplicate enrollments. |
| (8) | BR4 | Enrollment Persistence: Create Enrollment record linking Student to Class with status = active and enrollment date. |
