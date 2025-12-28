= Delete Course Materials

#table(
  columns: (auto, 1fr),
  [*Epic*], [Material Management],
  [*Actor*], [Teacher],
  [*MVP*], [Yes],
  [*BR*], [BR-MAT-3],
  [*Description / Notes*], [Remove materials from a course.],
  [*As a*], [Teacher],
  [*I want to*], [CRUD materials (PDFs, videos, links)],
  [*So that*], [Students can study relevant content.],
  [*Trigger*], [The teacher wants to remove an outdated or incorrect learning resource.],
  [*Pre-condition*],
  [
    - The teacher is logged in and assigned to the course.
    - The material exists.
  ],

  [*Post-condition*],
  [
    - The material is removed from the course.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Go to the course page.
    - Find the material to delete.
    - Click "Delete".
    - Confirm the deletion.
  ],
)
