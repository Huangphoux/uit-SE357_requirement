= Assign Roles

#table(
  columns: (auto, 1fr),
  [*Epic*], [User Authentication & Roles],
  [*Actor*], [Admin],
  [*MVP*], [No],
  [*Description / Notes*], [Change roles in admin panel],
  [*As a*], [Admin],
  [*I want to*], [Assign roles (student, teacher, admin)],
  [*So that*], [Users have correct permissions],
  [*Trigger*], [An admin needs to change a user's role.],
  [*Pre-condition*],
  [
    - Admin is logged in.
    - User account exists.
  ],

  [*Post-condition*],
  [
    - User has the new role assigned.
  ],

  [*Solution (Step-by-Step)*],
  [
    - Open user management panel
    - Select user
    - Choose role (Student/Teacher/Admin)
    - Submit role change
    - Backend updates permissions
  ],
)
