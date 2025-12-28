#set heading(numbering: "1.")

= ManageUserAccounts Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR223],
  [Authorization Rules:
    Admin accesses user management panel from "Admin Dashboard". System verifies [User.role] = 'ADMIN'.
    If unauthorized, display error and block access.
    System calls method `displayUserManagement()` to show user list.],

  [(2)],
  [BR224],
  [Data Retrieval Rules:
    System queries `SELECT * FROM User ORDER BY createdAt DESC` to fetch all user accounts (Refer to "User" table in "DB Sheet" file).
    System calls method `fetchAllUsers()` to retrieve user list.],

  [(3)],
  [BR225],
  [Search Rules:
    Admin can search for specific users. System calls method `searchUsers(String keyword)` to filter by name or email using `SELECT * FROM User WHERE name LIKE '%[keyword]%' OR email LIKE '%[keyword]%'`.],

  [(4)],
  [BR226],
  [Edit Selection Rules:
    Admin clicks edit button on user row. System calls method `displayUserEditForm(String userId)` to show user details form with editable fields for name, email, and role.],

  [(5)],
  [BR227],
  [Update Validation Rules:
    When admin submits changes, system calls method `validateUserUpdate()` to check:
    If email changed, query `SELECT COUNT(\*) FROM User WHERE email = \[User.email\] AND id != \[User.id\]`.
    If count > 0, email not unique, display error (Refer to MSG 54).
    Validate role is one of: STUDENT, TEACHER, ADMIN.
    Validate email format.
    Validate other fields by type.],

  [(6)],
  [BR228],
  [Database Update Rules:
    System calls method `updateUser(User user)` to save changes with `UPDATE User SET name = \[User.name\], email = \[User.email\], role = \[User.role\], updatedAt = CURRENT_TIMESTAMP WHERE id = \[User.id\]` (Refer to "User" table in "DB Sheet" file).
    System displays success message (Refer to MSG 55).],

  [(7)],
  [BR229],
  [Deactivation Rules:
    When admin clicks deactivate button, system displays confirmation dialog.
    If confirmed, system calls method `deactivateUser(String userId)` to soft delete by setting status = inactive.
    System does NOT delete user record to preserve data.
    Deactivated users cannot login but their data (submissions, enrollments) remains.
    System updates with `UPDATE User SET status = 'INACTIVE', updatedAt = CURRENT_TIMESTAMP WHERE id = \[User.id\]`.
    System displays success message (Refer to MSG 56).],
)
