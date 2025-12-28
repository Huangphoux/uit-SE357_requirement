#set heading(numbering: "1.")

= Login Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR8],
  [Displaying Rules:
    The system displays a "Sign In" screen (Refer to "Sign In" view in "View Description" file) with input fields [txtBoxEmail], [txtBoxPwd], and buttons [btnSignIn], [btnForgot], [btnSignUp].],

  [(2)],
  [BR9],
  [Displaying Rules:
    When the user enters login credentials on the screen, the system prepares to validate the input using method `submitCredentials()`.],

  [(3)],
  [BR10],
  [Validation Rules:
    When the user submits credentials, the system will use the `validateInput()` method to check whether the input is valid (empty, wrong format or not). These fields include: [txtBoxEmail] and [txtBoxPwd].
    If the input is not valid:
    System moves to step (3.1) to display an error message.
    If one of the txtBox.Text `isEmpty()` = "true", the system will display a message for requiring user to enter mandatory data. (Refer to MSG 8).
    If [txtBoxEmail] is not in the correct format ..@.., the system displays an error message to notify the user to enter again. (Refer to MSG 9).],

  [(4)],
  [BR11],
  [Database Query Rules:
    The system queries data in the table "User" in the database (Refer to "User" table in "DB Sheet" file) with syntax `SELECT \* FROM User WHERE email = [User.email]` with [User.email] is retrieved from [txtBoxEmail] to find the user account.],

  [(5)],
  [BR12],
  [Authentication Rules:
    When the user account is found, the system calls method `verifyPassword(String password, String hashedPassword)` to verify the password from [txtBoxPwd] against the stored hash in [User.password] using bcrypt algorithm.
    If authentication fails (user not found or password incorrect):
    System moves to step (5.1) to display an error message.
    The system displays a generic error message for security purposes. (Refer to MSG 10).
    System allows retry and moves back to step (2).],

  [(6)],
  [BR13],
  [Session Management Rules:
    When authentication succeeds, the system calls method `generateToken(User user)` to create a secure JWT token with expiration time (typically 24 hours). The system calls method `storeToken(String token)` to store the token in session storage or HTTP-only cookie.],

  [(7)],
  [BR14],
  [Navigation Rules:
    After successful authentication, the system redirects the user to their role-specific dashboard using method `redirectToDashboard(String role)`:
    If [User.role] = "STUDENT", redirect to "Student Portal" view (Refer to "Student Portal" view in "View Description" file).
    If [User.role] = "TEACHER", redirect to "Teacher Portal" view (Refer to "Teacher Portal" view in "View Description" file).
    If [User.role] = "ADMIN", redirect to "Admin Dashboard" view (Refer to "Admin Dashboard" view in "View Description" file).],

  [(8)],
  [BR15],
  [Logout Rules:
    When the user clicks logout button, the system calls method `logout()` to invalidate the session token using method `clearToken()` and clear authentication data. The system then redirects to "Sign In" screen (Refer to "Sign In" view in "View Description" file).],
)
