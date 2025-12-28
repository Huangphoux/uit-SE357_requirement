= Delete Course

#table(
  columns: (auto, 1fr),
  [*Epic*], [Course Management],
  [*Actor*], [Admin],
  [*MVP*], [Yes],
  [*BR*], [BR-CRS-3],
  [*Description / Notes*], [Delete a course in the admin panel.],
  [*As a*], [Admin],
  [*I want to*], [Delete a course],
  [*So that*], [The course is no longer available.],
  [*Trigger*], [The admin needs to remove a course.],
  [*Pre-condition*],
  [
    - The admin must be logged into the system.
    - The admin must have course management permissions.
    - The course to be deleted must exist.
  ],

  [*Post-condition*],
  [
    - The course is removed from the system.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Open course management panel.
    - Find the course to delete.
    - Click the "Delete" button for that course.
    - Confirm the deletion.
    - Backend removes the course.
  ],
)
