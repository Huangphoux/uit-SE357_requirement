= Manage Classes

#table(
  columns: (auto, 1fr),
  [*Epic*], [Course & Class Management],
  [*Actor*], [Admin],
  [*MVP*], [Yes],
  [*Description / Notes*], [Link classes to courses],
  [*As a*], [Admin],
  [*I want to*], [CRUD classes and assign to courses],
  [*So that*], [Students can join organized sessions],
  [*Trigger*], [The administrator wants to manage class information in the system.],
  [*Pre-condition*],
  [
    - The administrator has successfully logged into the system.
    - There are existing courses to which classes can be assigned.
  ],

  [*Post-condition*],
  [
    - Class information is successfully created, updated, or deleted.
    - Classes are correctly linked to courses and reflected in the system.
  ],

  [*Solution (Step-by-Step)*],
  [
    - The administrator navigates to the class management interface.
    - The system displays a list of all classes, including their assigned courses and schedules.
    - The administrator can:
      - Create a new class by specifying details such as class name, associated course, schedule, and capacity.
      - Edit the details of an existing class.
      - Delete a class from the system.
    - The system validates the input and updates the class records in the database.
    - A confirmation or error message is displayed to the administrator.
  ],
)
