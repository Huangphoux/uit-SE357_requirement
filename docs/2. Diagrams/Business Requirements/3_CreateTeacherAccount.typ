#set heading(numbering: "1.")

= CreateTeacherAccount Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR24],
  [Displaying Rules:
    The admin accesses "Manage Users" screen (Refer to "Manage Users" view in "View Description" file) and clicks a create user button. The system calls method `displayCreateUserForm()` to show a user creation form with fields [txtBoxName], [txtBoxEmail], and role selection.],

  [(2)],
  [BR25],
  [Input Rules:
    The admin fills in teacher information including name in [txtBoxName] and email in [txtBoxEmail].],

  [(3)],
  [BR26],
  [Role Selection Rules:
    The admin selects "TEACHER" role from the role options. The system sets [User.role] = "TEACHER" for the new account.],

  [(4)],
  [BR27],
  [Submission Rules:
    When the admin clicks submit button, the system calls method `submitTeacherCreation()` to process the form data.],

  [(5)],
  [BR28],
  [Validation Rules:
    The system calls method `validateInput()` to check whether the input is valid. These fields include: [txtBoxName] and [txtBoxEmail].
    If the input is not valid:
    System displays an error message.
    If one of the txtBox.Text `isEmpty()` = "true", the system will display a message for requiring mandatory data. (Refer to MSG 12).
    If [txtBoxEmail] is not in the correct format ..@.., the system displays an error message. (Refer to MSG 13).],

  [(6)],
  [BR29],
  [Database Query Rules:
    The system queries data in the table "User" in the database (Refer to "User" table in "DB Sheet" file) with syntax `SELECT * FROM User WHERE email = [User.email]` to check for duplicate email.
    If [User.email] already exists in the system, the system displays an error message. (Refer to MSG 14).
    Else the system proceeds to create the account.],

  [(7)],
  [BR30],
  [Account Creation Rules:
    The system calls method `createTeacherAccount(User teacher)` to create a new teacher account. The system calls method `generateTemporaryPassword()` to create a secure temporary password and calls method `hashPassword(String password)` to hash it using bcrypt algorithm. Data is stored in table "User" in the database (Refer to "User" table in "DB Sheet" file) with syntax `INSERT INTO User (id, email, password, name, role, createdAt, updatedAt) VALUES ([User.id], [User.email], [User.password], [User.name], 'TEACHER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`.],

  [(8)],
  [BR31],
  [Email Notification Rules:
    The system calls method `sendWelcomeEmail(String email, String temporaryPassword)` to send a welcome email to the new teacher account.],

  [(9)],
  [BR32],
  [Confirmation Rules:
    The email service confirms that the email has been sent successfully. The system receives confirmation and prepares to display success message.],

  [(10)],
  [BR33],
  [Displaying Rules:
    The system displays account created confirmation message (Refer to MSG 15) and refreshes the "Manage Users" screen to show the newly created teacher account.],
)
