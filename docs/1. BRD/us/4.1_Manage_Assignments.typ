= Manage Assignments

#table(
  columns: (auto, 1fr),
  [*Epic*], [Assignment Management],
  [*Actor*], [Teacher],
  [*MVP*], [Yes3],
  [*Description / Notes*], [Create/update assignments],
  [*As a*], [Teacher],
  [*I want to*], [CRUD written assignments],
  [*So that*], [Students can practice and be assessed],
  [*Trigger*], [A teacher needs to create, modify, or remove assignments for a course.],
  [*Pre-condition*],
  [
    - The teacher has successfully logged into the system.
    - The teacher is assigned to the course for which assignments are being managed.
  ],

  [*Post-condition*],
  [
    - Assignments are successfully created, updated, or deleted.
    - Students enrolled in the course can view and submit the assignments.
  ],

  [*Solution (Step-by-Step)*],
  [
    - The teacher navigates to the assignment management section for a specific course.
    - The system displays a list of existing assignments for that course.
    - The teacher can:
      - Create a new assignment by providing details such as title, description, due date, and grading criteria.
      - Edit the details of an existing assignment.
      - Delete an assignment.
    - The system stores the assignment details and makes them available to students.
    - A confirmation message is displayed upon successful operation, or an error message if the operation fails.
  ],
)
