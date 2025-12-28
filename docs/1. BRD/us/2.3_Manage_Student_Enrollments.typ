= Manage Student Enrollments

#table(
  columns: (auto, 1fr),
  [*Epic*], [Course & Class Management],
  [*Actor*], [Admin],
  [*MVP*], [Yes (Implemented via Courses API)],
  [*Description / Notes*], [Assign/remove students from classes],
  [*As a*], [Admin],
  [*I want to*], [Enroll/remove students from classes],
  [*So that*], [I can manage who attends each class],
  [*Trigger*], [The administrator needs to manually enroll or unenroll students from classes.],
  [*Pre-condition*],
  [
    - The administrator has successfully logged into the system.
    - Student accounts and classes exist in the system.
  ],

  [*Post-condition*],
  [
    - Students are correctly enrolled in or removed from the specified classes.
    - Enrollment records are updated in the database (Enrollment table).
  ],

  [*Solution (Step-by-Step)*],
  [
    - Admin navigates to "Assign Management" tab in dashboard
    - System displays enrollment list via `GET /api/materials/enrollmentsByAdmin`
    - To enroll a student:
      - Admin selects class from dropdown
      - Admin selects student from dropdown
      - Admin clicks "Enroll Student" button
      - System calls `POST /api/courses/enrollByAdmin` with {classId, userId}
      - System creates enrollment record with status ACTIVE
    - To remove a student:
      - Admin clicks delete button on enrollment row
      - System calls `POST /api/courses/removeEnroll` with {classId, userId}
      - System deletes enrollment record
    - Confirmation toast message displayed on success/error
  ],

  [*API Implementation*],
  [
    - Enroll: `POST /courses/enrollByAdmin` (Admin only)
    - Remove: `POST /courses/removeEnroll` (Admin only)
    - View: `GET /materials/enrollmentsByAdmin` (returns all enrollments with user + class data)
  ],
)
