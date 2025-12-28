= Edit Account

#table(
  columns: (auto, 1fr),
  [*Epic*], [User Management],
  [*Actor*], [Admin],
  [*MVP*], [Yes],
  [*BR*], [BR-SYS-3],
  [*Description / Notes*], [Edit a user account in the admin panel.],
  [*As a*], [Admin],
  [*I want to*], [Edit a user's account details],
  [*So that*], [I can update their information.],
  [*Trigger*], [The admin needs to change a user's details (e.g., email, name, role).],
  [*Pre-condition*],
  [
    - The admin must be logged into the system.
    - The admin must have user management permissions.
    - The user account to be edited must exist.
  ],

  [*Post-condition*],
  [
    - The user's account details are updated.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Open user management panel.
    - Find the user to edit.
    - Click the "Edit" button for that user.
    - Modify the user's details in the form.
    - Submit the form.
    - Backend updates the user account.
  ],
)
