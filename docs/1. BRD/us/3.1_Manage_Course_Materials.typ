= Manage Course Materials

#table(
  columns: (auto, 1fr),
  [*Epic*], [Material Management],
  [*Actor*], [Teacher],
  [*MVP*], [Yes1],
  [*Description / Notes*], [Add/edit/delete resources],
  [*As a*], [Teacher],
  [*I want to*], [CRUD materials (PDFs, videos, links)],
  [*So that*], [Students can study relevant content],
  [*Trigger*], [A teacher needs to provide or update learning materials for a course.],
  [*Pre-condition*],
  [
    - The teacher has successfully logged into the system.
    - The teacher is assigned to the course for which materials are being managed.
  ],

  [*Post-condition*],
  [
    - Course materials are successfully added, updated, or deleted.
    - Students enrolled in the course can access the updated materials.
  ],

  [*Solution (Step-by-Step)*],
  [
    - The teacher navigates to the course materials management section for a specific course.
    - The system displays a list of existing materials for that course.
    - The teacher can:
      - Upload new files (e.g., PDFs, presentations).
      - Add links to external resources (e.g., videos, articles).
      - Edit the details of existing materials (e.g., title, description).
      - Delete materials that are no longer needed.
    - The system stores the materials and associates them with the course.
    - A confirmation message is displayed upon successful operation, or an error message if the operation fails.
  ],
)
