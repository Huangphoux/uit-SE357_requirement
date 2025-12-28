#set heading(numbering: "1.")

= AssignRoles Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR16],
  [Displaying Rules:
    The system displays an "Admin Dashboard" screen (Refer to "Admin Dashboard" view in "View Description" file). When admin clicks [btnManageUser], the system calls method `displayUserManagement()` and displays "Manage Users" screen (Refer to "Manage Users" view in "View Description" file).],

  [(2)],
  [BR17],
  [Selection Rules:
    The admin selects a user from the user list. The system retrieves the user data from table "User" in the database (Refer to "User" table in "DB Sheet" file) using query `SELECT * FROM User WHERE id = [User.id]`.],

  [(3)],
  [BR18],
  [Role Selection Rules:
    The system displays available roles for selection: STUDENT, TEACHER, or ADMIN. These roles correspond to the valid values in [User.role] field (Refer to "User" table in "DB Sheet" file). Admin selects the desired role using method `selectRole(String role)`.],

  [(4)],
  [BR19],
  [Submission Rules:
    When the admin clicks submit button to confirm role change, the system calls method `submitRoleChange(String userId, String newRole)` to process the role update request.],

  [(5)],
  [BR20],
  [Database Update Rules:
    The system calls method `updateUserRole(String userId, String role)` to update the user's role in table "User" in the database (Refer to "User" table in "DB Sheet" file) with syntax `UPDATE User SET role = [User.role], updatedAt = CURRENT_TIMESTAMP WHERE id = [User.id]`.],

  [(6)],
  [BR21],
  [Permission Update Rules:
    After role update in the database, the system calls method `updatePermissions(String userId, String role)` to update all user permissions according to the new role. Each role has a predefined set of permissions that determine access to system features.],

  [(7)],
  [BR22],
  [Confirmation Rules:
    When the update is successful, the system displays a success confirmation message (Refer to MSG 11) and calls method `refreshUserList()` to update the user management view with the latest data.],

  [(8)],
  [BR23],
  [Displaying Rules:
    The system refreshes and displays the updated user information on "Manage Users" screen showing the new role assignment.],
)
