#set heading(numbering: "1.")

= ManageCourses Business Requirements

== Create Course

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR34],
  [Displaying Rules:
    Admin navigates to "Course Management" screen (Refer to "Course Management" view in "View Description" file). When admin clicks [btnAdd], the system calls method `displayCourseCreationForm()` and shows "Create Course" screen (Refer to "Create Course" view in "View Description" file) with fields [txtBoxName], [txtBoxCode], [txtBoxDesc], and [btnUpload] for course image.],

  [(2)],
  [BR35],
  [Input Rules:
    The admin fills in course details including course title in [txtBoxName], course code in [txtBoxCode], and description in [txtBoxDesc].],

  [(3)],
  [BR36],
  [Submission Rules:
    When the admin clicks [btnAdd] button to submit the form, the system calls method `submitCourse()` to process the course creation.],

  [(4)],
  [BR37],
  [Validation Rules:
    The system calls method `validateCourseInput()` to check whether the input is valid. These fields include: [txtBoxName], [txtBoxCode], and [txtBoxDesc].
    If the input is not valid:
    System displays an error message.
    If one of the txtBox.Text `isEmpty()` = "true", the system will display a message for requiring mandatory data. (Refer to MSG 16).
    If [txtBoxName] contains non-letter characters (numbers or special characters), the system displays an error message. (Refer to MSG 17).],

  [(5)],
  [BR38],
  [Database Query Rules:
    The system queries data in the table "Course" in the database (Refer to "Course" table in "DB Sheet" file) with syntax `SELECT * FROM Course WHERE title = [Course.title]` to check if course already exists.
    If a course with the same title exists, the system displays an error message. (Refer to MSG 18).
    Else the system proceeds to create the course.],

  [(6)],
  [BR39],
  [Course Creation Rules:
    The system calls method `createCourse(Course course)` to create a new course record. Data is stored in table "Course" in the database (Refer to "Course" table in "DB Sheet" file) with syntax `INSERT INTO Course (id, title, description, createdAt, updatedAt) VALUES ([Course.id], [Course.title], [Course.description], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`.],

  [(7)],
  [BR40],
  [Database Persistence Rules:
    The database saves the course record and returns success confirmation to the system.],

  [(8)],
  [BR41],
  [Response Rules:
    The system receives success response from the database and prepares confirmation message.],

  [(9)],
  [BR42],
  [Displaying Rules:
    The system displays course creation confirmation message (Refer to MSG 19) and calls method `refreshCourseList()` to update the course list.],

  [(10)],
  [BR43],
  [Update Display Rules:
    The system refreshes "Course Management" screen showing the newly created course in the course list.],
)

== Edit Course

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR44],
  [Displaying Rules:
    The admin views "Course Management" screen (Refer to "Course Management" view in "View Description" file) with the list of all courses.],

  [(2)],
  [BR45],
  [Selection Rules:
    The admin selects a course to edit from the course list. The system retrieves course data from table "Course" with query `SELECT * FROM Course WHERE id = [Course.id]`.],

  [(3)],
  [BR46],
  [Displaying Rules:
    The system calls method `displayEditCourseForm(Course course)` and shows the edit form pre-filled with current course data including [txtBoxName], [txtBoxCode], and [txtBoxDesc].],

  [(4)],
  [BR47],
  [Modification Rules:
    The admin modifies the course details in the available fields.],

  [(5)],
  [BR48],
  [Submission Rules:
    When the admin clicks [btnUpdate] button, the system calls method `submitCourseUpdate()` to process the changes.],

  [(6)],
  [BR49],
  [Validation Rules:
    The system calls method `validateCourseInput()` to check whether the new data is valid.
    If the input is not valid:
    System displays an error message.
    If one of the txtBox.Text `isEmpty()` = "true", the system will display a message for requiring mandatory data. (Refer to MSG 20).
    If [txtBoxName] contains non-letter characters, the system displays an error message. (Refer to MSG 21).],

  [(7)],
  [BR50],
  [Database Update Rules:
    The system calls method `updateCourse(Course course)` to update the course in table "Course" in the database (Refer to "Course" table in "DB Sheet" file) with syntax `UPDATE Course SET title = [Course.title], description = [Course.description], updatedAt = CURRENT_TIMESTAMP WHERE id = [Course.id]`.],

  [(8)],
  [BR51],
  [Database Persistence Rules:
    The database saves the updated record and returns success confirmation.],

  [(9)],
  [BR52],
  [Response Rules:
    The system receives success response and prepares confirmation message.],

  [(10)],
  [BR53],
  [Displaying Rules:
    The system displays update confirmation message (Refer to MSG 22) and calls method `refreshCourseList()`.],

  [(11)],
  [BR54],
  [Update Display Rules:
    The system refreshes "Course Management" screen showing the updated course information.],
)

== Delete Course

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR55],
  [Displaying Rules:
    The admin views "Course Management" screen (Refer to "Course Management" view in "View Description" file) with the list of all courses.],

  [(2)],
  [BR56],
  [Selection Rules:
    The admin selects a course to delete from the course list by clicking [btnDelete].],

  [(3)],
  [BR57],
  [Confirmation Rules:
    The system displays a confirmation dialog asking the admin to confirm the deletion. (Refer to MSG 23).],

  [(4)],
  [BR58],
  [Deletion Request Rules:
    When the admin confirms deletion, the system calls method `deleteCourse(String courseId)` to send delete request.],

  [(5)],
  [BR59],
  [Verification Rules:
    The system verifies the course exists in table "Course" with query `SELECT * FROM Course WHERE id = [Course.id]`.
    If the course does not exist, the system displays an error message. (Refer to MSG 24).
    Else the system proceeds with deletion.],

  [(6)],
  [BR60],
  [Database Deletion Rules:
    The system deletes the course from table "Course" in the database (Refer to "Course" table in "DB Sheet" file) with syntax `DELETE FROM Course WHERE id = [Course.id]`. Note: Due to CASCADE on delete constraint, related records in "Class" table will also be deleted automatically.],

  [(7)],
  [BR61],
  [Database Persistence Rules:
    The database removes the course record and returns success confirmation.],

  [(8)],
  [BR62],
  [Response Rules:
    The system receives success response and prepares confirmation message.],

  [(9)],
  [BR63],
  [Displaying Rules:
    The system displays deletion confirmation message (Refer to MSG 25) and calls method `refreshCourseList()`.],

  [(10)],
  [BR64],
  [Update Display Rules:
    The system refreshes "Course Management" screen with the updated course list excluding the deleted course.],
)

== List Courses

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR65],
  [Navigation Rules:
    The admin navigates to course management section. The system calls method `displayCourseManagement()`.],

  [(2)],
  [BR66],
  [Request Rules:
    The system calls method `requestAllCourses()` to fetch all courses from the database.],

  [(3)],
  [BR67],
  [Database Query Rules:
    The system queries all courses from table "Course" in the database (Refer to "Course" table in "DB Sheet" file) with syntax `SELECT * FROM Course ORDER BY createdAt DESC`.],

  [(4)],
  [BR68],
  [Data Retrieval Rules:
    The database returns the course list with all course records.],

  [(5)],
  [BR69],
  [Processing Rules:
    The system calls method `processCourseData(List<Course> courses)` to format and prepare the course data for display.],

  [(6)],
  [BR70],
  [Displaying Rules:
    The system displays "Course Management" screen (Refer to "Course Management" view in "View Description" file) showing the course list with pagination. Each course shows [btnEdit] and [btnDelete] action buttons.],

  [(7)],
  [BR71],
  [Action Display Rules:
    The system shows available actions for each course including edit and delete options using the action buttons.],
)
