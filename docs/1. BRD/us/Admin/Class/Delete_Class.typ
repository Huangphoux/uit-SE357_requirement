= Delete Class

#table(
  columns: (auto, 1fr),
  [*Epic*], [Class Management],
  [*Actor*], [Admin],
  [*MVP*], [Yes],
  [*BR*], [BR-CLS-3],
  [*Description / Notes*], [Delete a class in the admin panel.],
  [*As a*], [Admin],
  [*I want to*], [Delete a class],
  [*So that*], [The class is no longer available.],
  [*Trigger*], [The admin needs to remove a class.],
  [*Pre-condition*],
  [
    - The admin must be logged into the system.
    - The admin must have class management permissions.
    - The class to be deleted must exist.
  ],

  [*Post-condition*],
  [
    - The class is removed from the system.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Open class management panel.
    - Find the class to delete.
    - Click the "Delete" button for that class.
    - Confirm the deletion.
    - Backend removes the class.
  ],
)
