#set heading(numbering: "1.")

= ManageAssignments Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR157],
  [Displaying Rules:
    Teacher navigates to assignment section for a class. System calls method `displayAssignmentManagement(String classId)` and shows "Create Assignment" screen (Refer to "Create Assignment" view in "View Description" file).],

  [(2)],
  [BR158],
  [Input Rules:
    Teacher fills in assignment details:
    [txtBoxTitle] for assignment title
    [txtBoxDesc] for assignment description
    [txtBoxDueDate] for due date
    [txtBoxPoints] for maximum score.],

  [(3)],
  [BR159],
  [Validation Rules:
    When teacher submits form, system calls method `validateAssignment()` to check:
    If [txtBoxTitle].`isEmpty()` = true, display error (Refer to MSG 32).
    If [txtBoxDesc].`isEmpty()` = true, display error (Refer to MSG 33).
    If [txtBoxDueDate].`isEmpty()` = true, display error (Refer to MSG 34).
    If [txtBoxPoints].`isEmpty()` = true, display error (Refer to MSG 35).],

  [(4)],
  [BR160],
  [Date Validation Rules:
    System calls method `validateDueDate(Date dueDate)` to check:
    Due date must be in future (after current timestamp).
    If due date is in past, display error (Refer to MSG 36).
    Validate date/time format is correct.],

  [(5)],
  [BR161],
  [Score Validation Rules:
    System validates [txtBoxPoints] is numeric value.
    If not numeric, display error (Refer to MSG 37).
    Maximum score must be greater than 0.],

  [(6)],
  [BR162],
  [Authorization Rules:
    System verifies teacher is assigned to class by checking [Class.teacherId] = [User.id]. Only assigned teacher can create assignments for class.],

  [(7)],
  [BR163],
  [Database Insert Rules:
    System calls method `createAssignment(Assignment assignment)` to insert record in table "ASSIGNMENT" (Refer to "Assignment" table in "DB Sheet" file) with syntax `INSERT INTO Assignment (id, title, description, classId, createdBy, dueDate, maxScore, createdAt, updatedAt) VALUES (\[Assignment.id\], \[Assignment.title\], \[Assignment.description\], \[classId\], \[teacherId\], \[Assignment.dueDate\], \[Assignment.maxScore\], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`.],

  [(8)],
  [BR164],
  [Confirmation Rules:
    System displays success message (Refer to MSG 38). System calls method `Close()` to close assignment creation screen.],

  [(9)],
  [BR165],
  [Notification Rules:
    System calls method `notifyStudents(String classId, String assignmentTitle)` to send notification to all enrolled students.
    System queries enrolled students and creates notification records for new assignment.],

  [(10)],
  [BR166],
  [Display Update Rules:
    System calls method `refreshAssignmentList()` to update assignment management view with new assignment.],
)
