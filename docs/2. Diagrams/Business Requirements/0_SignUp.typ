#set heading(numbering: "1.")

= SignUp Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR1],
  [Displaying Rules:
    The system displays a "Sign In" screen (Refer to "Sign In" view in "View Description" file) with btnSignUp button.],

  [(2)],
  [BR2],
  [Displaying Rules:
    When the user clicks the "Sign Up" button, the system calls method `displayRegistrationForm()` and displays a registration form screen with input fields including [txtBoxName], [txtBoxEmail], [txtBoxPassword], and [txtBoxConfirmPassword].],

  [(3)],
  [BR3],
  [Validation Rules:
    When the user enters registration information on the screen, the system will use the `validateInput()` method to check whether the input is valid (empty, wrong format or not). These fields include: [txtBoxName], [txtBoxEmail], [txtBoxPassword], and [txtBoxConfirmPassword].
    If the input is not valid:
    System moves to step (3.1) to display an error message.
    If one of the txtBox.Text `isEmpty()` = "true", the system will display a message for requiring user to enter mandatory data. (Refer to MSG 1).
    If [txtBoxEmail] is not in the correct format ..@.., the system displays an error message to notify the user to enter again. (Refer to MSG 4).
    If [txtBoxPassword] length is less than 8 characters, the system displays an error message for minimum password requirement. (Refer to MSG 2).
    If [txtBoxPassword] and [txtBoxConfirmPassword] do not match, the system displays an error message. (Refer to MSG 3).],

  [(4)],
  [BR4],
  [Password Hashing Rules:
    When validation succeeds, the system calls method `hashPassword(String password)` using bcrypt algorithm to hash the password before storage. The system never stores plain text passwords.],

  [(5)],
  [BR5],
  [Database Query Rules:
    The system queries data in the table "USER" in the database (Refer to "User" table in "DB Sheet" file) with syntax `SELECT \* FROM User WHERE email = \[User.email\]` with \[User.email\] is retrieved from \[txtBoxEmail\] to check for duplicate email.],

  [(6)],
  [BR6],
  [Validation Rules:
    When the user clicks the "Submit" button for saving registration data, the system will move to step (5) to check data in the database by method `checkDuplicateEmail(String email)`.
    The input data will be checked by table "USER" in the database (Refer to "User" table in "DB Sheet" file) to check if there are any constraints.
    If the input is not valid:
    System moves to step (6.1) to display an error message.
    If [User.email] is already registered in the system, the system displays an error message. (Refer to MSG 5).
    Else the system calls method `createUser(User user)` with parameter "user" is an object class with all information from the registration form. Data of the user information will be stored as a new record in table "USER" in the database (Refer to "User" table in "DB Sheet" file) with role set to 'STUDENT' by default.
    System moves to step (7) and displays successful notification (Refer to MSG 7), use method `Close()` to close the registration screen.],

  [(7)],
  [BR7],
  [Navigation Rules:
    After successful registration, the system redirects the user to the "Sign In" screen (Refer to "Sign In" view in "View Description" file) where they can log in with their credentials.],
)
