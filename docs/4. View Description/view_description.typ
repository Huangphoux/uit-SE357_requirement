= Add Material

#image("images/Add_Material.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxTitle], [TextBox], [Yes], [Yes], [], [Text box to enter material's title. It must be letter only.],
  [txtBoxDesc], [TextBox], [Yes], [Yes], [], [Text box to enter material's description.],
  [btnUpload], [Button], [No], [Yes], [], [Click this button to upload material.],
  [btnAdd], [Button], [No], [Yes], [], [Click this button to add material.],
  [btnClose], [Button], [No], [Yes], [], [Click this button to close this view.],
)

= Edit Submission by Text Entry

#image("images/Assignment_Text_Entry.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxSubmission], [TextBox], [Yes], [No], [], [Text box to enter submission.],
  [txtBoxComment], [TextBox], [Yes], [No], [], [Text box to add comment for teacher.],
  [btnAdd], [Button], [No], [Yes], [], [Click this button to update this submission by text entry.],
  [btnClose], [Button], [No], [Yes], [], [Click this button to cancel updating this submission.],
)

= Edit Submission by File Upload

#image("images/Assignment_Upload_File.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnSubmission], [Button], [No], [No], [], [Click this button to upload file for submission.],
  [txtBoxComment], [TextBox], [Yes], [No], [], [Text box to add comment for teacher.],
  [btnAdd], [Button], [No], [Yes], [], [Click this button to update this submission by file upload.],
  [btnClose], [Button], [No], [Yes], [], [Click this button to cancel updating this submission.],
)

= Class Management

#image("images/Class_Management.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnAdd], [Button], [No], [No], [], [Click this button to add a new class.],
  [txtBoxSearch], [TextBox], [Yes], [No], [], [Text box to search for classes.],
  [btnEdit], [Button], [No], [Yes], [], [Click this button to update class information.],
  [btnDelete], [Button], [No], [Yes], [], [Click this button to delete class.],
)

= Course Catalog

#image("images/Course_Catalog.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxSearch], [TextBox], [Yes], [No], [], [Text box to search for courses.],
  [btnEnroll], [Button], [No], [Yes], [], [Click this button to enroll course.],
)


= Course Management

#image("images/Courses_Management.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnAdd], [Button], [No], [No], [], [Click this button to add a new course.],
  [txtBoxSearch], [TextBox], [Yes], [No], [], [Text box to search for courses.],
  [btnEdit], [Button], [No], [Yes], [], [Click this button to update course information.],
  [btnDelete], [Button], [No], [Yes], [], [Click this button to delete course.],
)

= Create Assigment

#image("images/Create_Assignment.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxTitle], [TextBox], [Yes], [Yes], [], [Text box to enter assignment's title. It must be letter only.],
  [txtBoxDesc], [TextBox], [Yes], [Yes], [], [Text box to enter assignment's description.],
  [txtBoxDueDate], [TextBox], [Yes], [Yes], [], [Text box to enter the due date.],
  [txtBoxPoints], [TextBox], [Yes], [Yes], [], [Text box to enter the maximum point.],
  [btnAdd], [Button], [No], [Yes], [], [Click this button to add material.],
  [btnClose], [Button], [No], [Yes], [], [Click this button to close this view.],
)

= Admin Dashboard

#image("images/Dashboard_admin.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnAddCourse], [Button], [No], [Yes], [], [Click this button to quickly add a new course.],
  [btnAddClass], [Button], [No], [Yes], [], [Click this button to quickly add a new class.],
  [btnManageUser], [Button], [No], [Yes], [], [Click this button to navigate to the user management view.],
)

= Delete Assigment

#image("images/Delete_Assignment.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnDelete], [Button], [No], [Yes], [], [Click this button to delete the assignment.],
  [btnCancel], [Button], [No], [Yes], [], [Click this button to cancel deleting.],
)

= Delete Class

#image("images/Delete_Class.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnDelete], [Button], [No], [Yes], [], [Click this button to delete the class.],
  [btnCancel], [Button], [No], [Yes], [], [Click this button to cancel deleting.],
)


= Unenrolling Courses

#image("images/Design_System_and_Authentication.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnUnenroll], [Button], [No], [Yes], [], [Click this button to unenroll the course.],
  [btnCancel], [Button], [No], [Yes], [], [Click this button to cancel unenrolling.],
)


= Edit Assigment

#image("images/Edit_Assignment.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxTitle], [TextBox], [Yes], [Yes], [], [Text box to enter assignment's title. It must be letter only.],
  [txtBoxDesc], [TextBox], [Yes], [Yes], [], [Text box to enter assignment's description.],
  [txtBoxDueDate], [TextBox], [Yes], [Yes], [], [Text box to enter the due date.],
  [txtBoxPoints], [TextBox], [Yes], [Yes], [], [Text box to enter the maximum point.],
  [btnUpdate], [Button], [No], [Yes], [], [Click this button to update assignment.],
  [btnClose], [Button], [No], [Yes], [], [Click this button to close this view.],
)


= Edit Class

#image("images/Edit_Class.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxName], [TextBox], [Yes], [Yes], [], [Text box to enter class name. It must be letter only.],
  [slctBoxCourse], [TextBox], [Yes], [Yes], [], [Text box to select the course.],
  [txtBoxSchedule], [TextBox], [Yes], [Yes], [], [Text box to enter the schedule.],
  [txtBoxCapacity], [TextBox], [Yes], [Yes], [], [Text box to enter the capacity.],
  [btnUpdate], [Button], [No], [Yes], [], [Click this button to update class.],
  [btnClose], [Button], [No], [Yes], [], [Click this button to close this view.],
)

= Grade Submissions

#image("images/Grade_Submissions.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxScore], [TextBox], [Yes], [Yes], [], [Text box to enter score.],
  [slctBoxCourse], [TextBox], [Yes], [Yes], [], [Text box to enter feedback.],
  [btnSaveNext], [Button], [No], [Yes], [], [Click this button to save the score, then change to the next submission.],
  [btnSave], [Button], [No], [Yes], [], [Click this button to save the score.],
  [btnBack], [Button], [No], [Yes], [], [Click this button to go back to the submission page.],
)

= My Grades

#image("images/Grades.png")

= Manage Assigments

#image("images/Manage_Assignments.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnAdd], [Button], [No], [No], [], [Click this button to add a new assignment.],
  [txtBoxSearch], [TextBox], [Yes], [No], [], [Text box to search for assigments.],
  [btnEdit], [Button], [No], [Yes], [], [Click this button to update assigment.],
  [btnDelete], [Button], [No], [Yes], [], [Click this button to delete assignment.],
  [btnGrade], [Button], [No], [Yes], [], [Click this button to grade assignment.],
)

= Manage Courses

#image("images/Manage_Courses.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnLogout], [Button], [No], [Yes], [], [Click this button to log out.],
  [btnTheme], [Button], [No], [Yes], [], [Click this button to switch between light and dark theme.],
)

= Manage Submissions

#image("images/Manage_Submissions.png")

= Manage Users

#image("images/Manage_Users.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxSearch], [TextBox], [Yes], [No], [], [Text box to search for users.],
  [btnDelete], [Button], [No], [Yes], [], [Click this button to delete user.],
)

= Manage Materials

#image("images/Materials.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnAdd], [Button], [No], [Yes], [], [Click this button to add a new material.],
  [txtBoxSearch], [TextBox], [Yes], [No], [], [Text box to search for materials.],
  [btnEdit], [Button], [No], [Yes], [], [Click this button to update material.],
  [btnDelete], [Button], [No], [Yes], [], [Click this button to delete material.],
)


= Create Course

#image("images/New_Courses.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxName], [TextBox], [Yes], [Yes], [], [Text box to enter course name. It must be letter only.],
  [txtBoxCode], [TextBox], [Yes], [Yes], [], [Text box to enter course code.],
  [txtBoxDesc], [TextBox], [Yes], [Yes], [], [Text box to enter course description.],
  [btnUpload], [Button], [No], [Yes], [], [Click this button to add a course image.],
  [btnAdd], [Button], [No], [Yes], [], [Click this button to create the course.],
  [btnClose], [Button], [No], [Yes], [], [Click this button to close this view.],
)


= Create Class

#image("images/New_class.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxName], [TextBox], [Yes], [Yes], [], [Text box to enter class name. It must be letter only.],
  [slctBoxCourse], [SelectBox], [No], [Yes], [], [Text box to select course.],
  [txtBoxSchedule], [TextBox], [Yes], [Yes], [], [Text box to enter the schedule.],
  [txtBoxCapacity], [TextBox], [Yes], [Yes], [], [Text box to enter the capacity.],
  [btnAdd], [Button], [No], [Yes], [], [Click this button to create the class.],
  [btnClose], [Button], [No], [Yes], [], [Click this button to close this view.],
)


= Overview

#image("images/Overview.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnBack], [Button], [No], [Yes], [], [Click this button to go back to the courses page.],
)


= Remove Student Account

#image("images/Remove_Student.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnDelete], [Button], [No], [Yes], [], [Click this button to remove the student account.],
  [btnCancel], [Button], [No], [Yes], [], [Click this button to cancel deleting.],
)

= Sign In

#image("images/Sign_in.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [txtBoxEmail], [Button], [No], [Yes], [], [Text box to enter the email.],
  [txtBoxPwd], [Button], [No], [Yes], [], [Text box to enter the password.],
  [btnSignIn], [Button], [No], [Yes], [], [Click this button to sign in.],
  [btnForgot], [Button], [No], [Yes], [], [Click this button when forgetting the password.],
  [btnSignUp], [Button], [No], [Yes], [], [Click this button to sign up.],
)

= Student Portal

#image("images/Student_Portal.png")

#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnViewCourse], [Button], [No], [Yes], [], [Click this button to view the course's materials.],
  [btnUnenroll], [Button], [No], [Yes], [], [Click this button to unenroll the course.],
)

= Teacher Portal

#image("images/Teacher_Portal.png")

= View Assigment

#image("images/View_Assignment.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnView], [Button], [No], [Yes], [], [Click this button to view assignment.],
  [btnBack], [Button], [No], [Yes], [], [Click this button to go back to the courses page.],
)



= View Assigment

#image("images/View_Course_Catalog.png")


#table(
  columns: 6,
  [*Component*], [*Data Type*], [*Editable*], [*Mandatory*], [*Default Value*], [*Description*],
  [btnLogOut], [Button], [No], [No], [], [Click this button to log out.],
  [txtBoxSearch], [TextBox], [Yes], [No], [], [Text box to search for courses.],
  [btnEnroll], [Button], [No], [Yes], [], [Click this button to enroll the course.],
  [btnUnenroll], [Button], [No], [Yes], [], [Click this button to unenroll the course.],
)
