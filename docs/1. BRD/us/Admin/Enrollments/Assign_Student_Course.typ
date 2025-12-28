= Assign Student to Course

#table(
  columns: (auto, 1fr),
  [*Epic*], [Enrollment Management],
  [*Actor*], [Admin],
  [*MVP*], [Yes],
  [*BR*], [BR-ENR-1],
  [*Description / Notes*], [Assign a student to a course in the admin panel.],
  [*As a*], [Admin],
  [*I want to*], [Assign a student to a course],
  [*So that*], [The student is enrolled in that course.],
  [*Trigger*], [The admin needs to enroll a student in a course.],
  [*Pre-condition*],
  [
    - The admin must be logged into the system.
    - The admin must have enrollment management permissions.
    - The student and course must exist.
  ],

  [*Post-condition*],
  [
    - The student is enrolled in the course.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Open enrollment management panel.
    - Select the student and the course.
    - Click "Assign".
    - Backend creates the enrollment record.
  ],
)
