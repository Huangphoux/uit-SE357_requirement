= Create Class

#table(
  columns: (auto, 1fr),
  [*Epic*], [Class Management],
  [*Actor*], [Admin],
  [*MVP*], [Yes],
  [*BR*], [BR-CLS-1],
  [*Description / Notes*], [Create a new class in the admin panel.],
  [*As a*], [Admin],
  [*I want to*], [Create a new class],
  [*So that*], [I can define a new class for a course.],
  [*Trigger*], [The admin needs to add a new class.],
  [*Pre-condition*],
  [
    - The admin must be logged into the system.
    - The admin must have class management permissions.
    - The course for which the class is being created must exist.
  ],

  [*Post-condition*],
  [
    - A new class is created.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Open class management panel.
    - Click "Create New Class".
    - Fill in class details (e.g., class name, course, teacher).
    - Submit the form.
    - Backend creates the new class.
  ],
)
