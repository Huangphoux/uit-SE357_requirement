#set heading(numbering: "1.")

= ManageClasses Business Requirements

== Create Class

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR72],
  [Displaying Rules:
    Admin navigates to "Class Management" screen (Refer to "Class Management" view in "View Description" file). When admin clicks [btnAdd], the system calls method `displayClassCreationForm()` and shows "Create Class" screen (Refer to "Create Class" view in "View Description" file) with fields [txtBoxName], [slctBoxCourse], [txtBoxSchedule], and [txtBoxCapacity].],

  [(2)],
  [BR73],
  [Input Rules:
    The admin fills in class details including class name in [txtBoxName], schedule in [txtBoxSchedule], and capacity in [txtBoxCapacity].],

  [(3)],
  [BR74],
  [Course Linking Rules:
    The admin selects a course from [slctBoxCourse]. The system queries table "Course" with `SELECT * FROM Course` to populate the course selection list. Each class MUST be linked to a valid course. The system sets [Class.courseId] to the selected course ID.],

  [(4)],
  [BR75],
  [Schedule Setting Rules:
    The admin sets the schedule/time for the class in [txtBoxSchedule].],

  [(5)],
  [BR76],
  [Submission Rules:
    When the admin clicks [btnAdd] button to submit the form, the system calls method `submitClass()` to process the class creation.],

  [(6)],
  [BR77],
  [Validation Rules:
    The system calls method `validateClassInput()` to check whether the input is valid. These fields include: [txtBoxName], [slctBoxCourse], [txtBoxSchedule], and [txtBoxCapacity].
    If the input is not valid:
    System displays an error message.
    If one of the txtBox.Text `isEmpty()` = "true" or course is not selected, the system will display a message for requiring mandatory data. (Refer to MSG 26).
    If [txtBoxName] contains non-letter characters, the system displays an error message. (Refer to MSG 27).
    If [txtBoxCapacity] is not a numeric value or is less than 1, the system displays an error message. (Refer to MSG 28).],

  [(7)],
  [BR78],
  [Database Query Rules:
    The system queries data in the table "Class" in the database (Refer to "Class" table in "DB Sheet" file) with syntax `SELECT * FROM Class WHERE title = [Class.title] AND courseId = [Class.courseId]` to check if class already exists for the selected course.
    If a class with the same title exists for the course, the system displays an error message. (Refer to MSG 29).
    Else the system proceeds to create the class.],

  [(8)],
  [BR79],
  [Class Creation Rules:
    The system calls method `createClass(Class class)` to create a new class record. Data is stored in table "Class" in the database (Refer to "Class" table in "DB Sheet" file) with syntax `INSERT INTO Class (id, courseId, title, teacherId, createdAt, updatedAt) VALUES ([Class.id], [Class.courseId], [Class.title], NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`.],

  [(9)],
  [BR80],
  [Database Persistence Rules:
    The database saves the class record and returns success confirmation to the system.],

  [(10)],
  [BR81],
  [Response Rules:
    The system receives success response from the database and prepares confirmation message.],

  [(11)],
  [BR82],
  [Displaying Rules:
    The system displays class creation confirmation message (Refer to MSG 30) and calls method `refreshClassList()` to update the class list.],

  [(12)],
  [BR83],
  [Update Display Rules:
    The system refreshes "Class Management" screen showing the newly created class in the class list.],
)

== Edit Class

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR84],
  [Displaying Rules:
    The admin views "Class Management" screen (Refer to "Class Management" view in "View Description" file) with the list of all classes.],

  [(2)],
  [BR85],
  [Selection Rules:
    The admin selects a class to edit from the class list. The system retrieves class data from table "Class" with query `SELECT * FROM Class WHERE id = [Class.id]`.],

  [(3)],
  [BR86],
  [Displaying Rules:
    The system calls method `displayEditClassForm(Class class)` and shows "Edit Class" screen (Refer to "Edit Class" view in "View Description" file) pre-filled with current class data including [txtBoxName], [slctBoxCourse], [txtBoxSchedule], and [txtBoxCapacity].],

  [(4)],
  [BR87],
  [Modification Rules:
    The admin modifies the class details including name and schedule in the available fields.],

  [(5)],
  [BR88],
  [Update Rules:
    The admin can update the course selection in [slctBoxCourse] or modify the schedule in [txtBoxSchedule].],

  [(6)],
  [BR89],
  [Submission Rules:
    When the admin clicks [btnUpdate] button, the system calls method `submitClassUpdate()` to process the changes.],

  [(7)],
  [BR90],
  [Validation Rules:
    The system calls method `validateClassInput()` to check whether the new data is valid.
    If the input is not valid:
    System displays an error message.
    If one of the txtBox.Text `isEmpty()` = "true", the system will display a message for requiring mandatory data. (Refer to MSG 31).
    If [txtBoxName] contains non-letter characters, the system displays an error message. (Refer to MSG 32).
    If [txtBoxCapacity] is not a numeric value or is less than 1, the system displays an error message. (Refer to MSG 33).],

  [(8)],
  [BR91],
  [Database Update Rules:
    The system calls method `updateClass(Class class)` to update the class in table "Class" in the database (Refer to "Class" table in "DB Sheet" file) with syntax `UPDATE Class SET courseId = [Class.courseId], title = [Class.title], updatedAt = CURRENT_TIMESTAMP WHERE id = [Class.id]`.],

  [(9)],
  [BR92],
  [Database Persistence Rules:
    The database saves the updated record and returns success confirmation.],

  [(10)],
  [BR93],
  [Response Rules:
    The system receives success response and prepares confirmation message.],

  [(11)],
  [BR94],
  [Displaying Rules:
    The system displays update confirmation message (Refer to MSG 34) and calls method `refreshClassList()`.],

  [(12)],
  [BR95],
  [Update Display Rules:
    The system refreshes "Class Management" screen showing the updated class information.],
)

== Delete Class

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR96],
  [Displaying Rules:
    The admin views "Class Management" screen (Refer to "Class Management" view in "View Description" file) with the list of all classes.],

  [(2)],
  [BR97],
  [Selection Rules:
    The admin selects a class to delete from the class list by clicking [btnDelete].],

  [(3)],
  [BR98],
  [Confirmation Rules:
    The system displays "Delete Class" confirmation dialog (Refer to "Delete Class" view in "View Description" file) asking the admin to confirm the deletion. (Refer to MSG 35).],

  [(4)],
  [BR99],
  [Deletion Request Rules:
    When the admin clicks [btnDelete] to confirm deletion, the system calls method `deleteClass(String classId)` to send delete request.],

  [(5)],
  [BR100],
  [Verification Rules:
    The system verifies the class exists in table "Class" with query `SELECT * FROM Class WHERE id = [Class.id]`.
    If the class does not exist, the system displays an error message. (Refer to MSG 36).
    Else the system proceeds with deletion.],

  [(6)],
  [BR101],
  [Enrollment Check Rules:
    The system checks for enrolled students in table "Enrollment" with query `SELECT COUNT(*) FROM Enrollment WHERE classId = [Class.id] AND status = 'ACTIVE'`.
    If there are enrolled students, the system displays a warning message. (Refer to MSG 37).
    Admin can choose to proceed or cancel.],

  [(7)],
  [BR102],
  [Database Deletion Rules:
    The system deletes the class from table "Class" in the database (Refer to "Class" table in "DB Sheet" file) with syntax `DELETE FROM Class WHERE id = [Class.id]`. Note: Due to CASCADE on delete constraint, related records in "Enrollment", "Assignment", and "Material" tables will also be deleted automatically.],

  [(8)],
  [BR103],
  [Database Persistence Rules:
    The database removes the class record and returns success confirmation.],

  [(9)],
  [BR104],
  [Response Rules:
    The system receives success response and prepares confirmation message.],

  [(10)],
  [BR105],
  [Displaying Rules:
    The system displays deletion confirmation message (Refer to MSG 38) and calls method `refreshClassList()`.],

  [(11)],
  [BR106],
  [Update Display Rules:
    The system refreshes "Class Management" screen with the updated class list excluding the deleted class.],
)

== List Classes

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR107],
  [Navigation Rules:
    The admin navigates to class management section. The system calls method `displayClassManagement()`.],

  [(2)],
  [BR108],
  [Request Rules:
    The system calls method `requestAllClasses()` to fetch all classes from the database.],

  [(3)],
  [BR109],
  [Database Query Rules:
    The system queries all classes from table "Class" in the database (Refer to "Class" table in "DB Sheet" file) with syntax `SELECT Class.*, Course.title as courseName FROM Class LEFT JOIN Course ON Class.courseId = Course.id ORDER BY Class.createdAt DESC`.],

  [(4)],
  [BR110],
  [Data Retrieval Rules:
    The database returns the class list with all class records including course information.],

  [(5)],
  [BR111],
  [Processing Rules:
    The system calls method `processClassData(List<Class> classes)` to format and prepare the class data for display.],

  [(6)],
  [BR112],
  [Displaying Rules:
    The system displays "Class Management" screen (Refer to "Class Management" view in "View Description" file) showing the class list with details.],

  [(7)],
  [BR113],
  [Information Display Rules:
    The system shows course name and schedule information for each class in the list.],

  [(8)],
  [BR114],
  [Action Display Rules:
    The system shows available actions for each class including [btnEdit], [btnDelete], and assign teacher options.],
)
