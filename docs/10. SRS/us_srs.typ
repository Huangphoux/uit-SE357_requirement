#set heading(offset: 2)

#include "../1. BRD/us/1.1_Sign_up.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/0. SignUp/SignUp.png")
#image("/out/docs/2. Diagrams/Activity diagram/0. SignUp/SignUp.png")
#include "../2. Diagrams/Business rules/0_SignUp.typ"

#include "../1. BRD/us/1.2_Login_Logout.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/1. Login/Login.png")
#image("/out/docs/2. Diagrams/Activity diagram/1. Login/Login.png")
#include "../2. Diagrams/Business rules/1_Login.typ"

#include "../1. BRD/us/Admin/1.3_Assign_Roles.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/2. AssignRoles/AssignRoles.png")
#image("/out/docs/2. Diagrams/Activity diagram/2. AssignRoles/AssignRoles.png")
#include "../2. Diagrams/Business rules/2_AssignRoles.typ"

#include "../1. BRD/us/Admin/1.4_Create_Teacher_Account.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/3. CreateTeacherAccount/CreateTeacherAccount.png")
#image("/out/docs/2. Diagrams/Activity diagram/3. CreateTeacherAccount/CreateTeacherAccount.png")
#include "../2. Diagrams/Business rules/3_CreateTeacherAccount.typ"

#include "../1. BRD/us/2.1_Manage_Courses.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/4. ManageCourses/CreateCourse.png")
#image("/out/docs/2. Diagrams/Activity diagram/4. ManageCourses/CreateCourses.png")
#include "../2. Diagrams/Business rules/4_ManageCourses.typ"

#include "../1. BRD/us/Admin/Course/Create_Course.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/4. ManageCourses/CreateCourse.png")
#image("/out/docs/2. Diagrams/Activity diagram/4. ManageCourses/CreateCourses.png")

#include "../1. BRD/us/Admin/Course/Delete_Course.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/4. ManageCourses/DeleteCourse.png")
#image("/out/docs/2. Diagrams/Activity diagram/4. ManageCourses/DeleteCourses.png")

#include "../1. BRD/us/Admin/Course/Edit_Course.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/4. ManageCourses/EditCourse.png")
#image("/out/docs/2. Diagrams/Activity diagram/4. ManageCourses/EditCourses.png")

#include "../1. BRD/us/Admin/Course/List_Course.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/4. ManageCourses/ListCourse.png")
#image("/out/docs/2. Diagrams/Activity diagram/4. ManageCourses/ListCourses.png")

#include "../1. BRD/us/2.2_Manage_Classes.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/5. ManageClasses/CreateClass.png")
#image("/out/docs/2. Diagrams/Activity diagram/5. ManageClasses/CreateClass.png")
#include "../2. Diagrams/Business rules/5_ManageClasses.typ"

#include "../1. BRD/us/Admin/Class/Create_Class.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/5. ManageClasses/CreateClass.png")
#image("/out/docs/2. Diagrams/Activity diagram/5. ManageClasses/CreateClass.png")

#include "../1. BRD/us/Admin/Class/Delete_Class.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/5. ManageClasses/DeleteClass.png")
#image("/out/docs/2. Diagrams/Activity diagram/5. ManageClasses/DeleteClass.png")

#include "../1. BRD/us/Admin/Class/Edit_Class.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/5. ManageClasses/EditClass.png")
#image("/out/docs/2. Diagrams/Activity diagram/5. ManageClasses/EditClass.png")

#include "../1. BRD/us/Admin/Class/List_Class.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/5. ManageClasses/ListClass.png")
#image("/out/docs/2. Diagrams/Activity diagram/5. ManageClasses/ListClass.png")

#include "../1. BRD/us/2.3_Manage_Student_Enrollments.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/6. ManageStudentEnrollment/ManageStudentEnrollments.png")
#image("/out/docs/2. Diagrams/Activity diagram/6. ManageStudentEnrollment/AssignStudent.png")
#include "../2. Diagrams/Business rules/6_ManageStudentEnrollment.typ"

#include "../1. BRD/us/Admin/Enrollments/Assign_Student_Course.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/6. ManageStudentEnrollment/AssignStudent.png")
#image("/out/docs/2. Diagrams/Activity diagram/6. ManageStudentEnrollment/AssignStudent.png")

#include "../1. BRD/us/Admin/Enrollments/Remove_Student_Course.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/6. ManageStudentEnrollment/RemoveStudent.png")
#image("/out/docs/2. Diagrams/Activity diagram/6. ManageStudentEnrollment/RemoveStudent.png")

#include "../1. BRD/us/Student/2.4_View_Enrolled_Courses.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/7. ViewEnrolledCourses/ViewEnrolledCourses.png")
#image("/out/docs/2. Diagrams/Activity diagram/7. ViewEnrolledCourses/ViewEnrolledCourses.png")
#include "../2. Diagrams/Business rules/7_ViewEnrolledCourses.typ"

#include "../1. BRD/us/2.5_Manage_Teacher-Class_Assignment.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/8. ManageTeacher-ClassAssignment/AssignTeacher.png")
#image("/out/docs/2. Diagrams/Activity diagram/8. ManageTeacher-ClassAssignment/AssignTeacher.png")
#include "../2. Diagrams/Business rules/8_ManageTeacher-ClassAssignment.typ"

#include "../1. BRD/us/Admin/Assign_Teacher_Class.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/8. ManageTeacher-ClassAssignment/AssignTeachertoClass.png")
#image("/out/docs/2. Diagrams/Activity diagram/8. ManageTeacher-ClassAssignment/AssignTeachertoClass.png")

#include "../1. BRD/us/Admin/Remove_Teacher_Class.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/8. ManageTeacher-ClassAssignment/RemoveAssignTeachertoClass.png")
#image("/out/docs/2. Diagrams/Activity diagram/8. ManageTeacher-ClassAssignment/RemoveAssignTeachertoClass.png")

#include "../1. BRD/us/Student/2.6_Self-Enroll_in_Courses.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/9. Self-EnrollCourses/SelfEnrollInCourses.png")
#image("/out/docs/2. Diagrams/Activity diagram/9. Self-EnrollCourses/SelfEnrollCourses.png")
#include "../2. Diagrams/Business rules/9_SelfEnrollCourses.typ"

#include "../1. BRD/us/3.1_Manage_Course_Materials.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/10. ManageCourseMaterials/CreateCourseMaterials.png")
#image("/out/docs/2. Diagrams/Activity diagram/10. ManageCourseMaterials/CreateCourseMaterials.png")
#include "../2. Diagrams/Business rules/10_ManageCourseMaterials.typ"

#include "../1. BRD/us/Teacher/Course Materials/Create_Materials.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/10. ManageCourseMaterials/CreateCourseMaterials.png")
#image("/out/docs/2. Diagrams/Activity diagram/10. ManageCourseMaterials/CreateCourseMaterials.png")

#include "../1. BRD/us/Teacher/Course Materials/Delete_Materials.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/10. ManageCourseMaterials/DeleteCourseMaterials.png")
#image("/out/docs/2. Diagrams/Activity diagram/10. ManageCourseMaterials/DeleteCourseMaterials.png")

#include "../1. BRD/us/Teacher/Course Materials/Edit_Materials.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/10. ManageCourseMaterials/EditCourseMaterials.png")
#image("/out/docs/2. Diagrams/Activity diagram/10. ManageCourseMaterials/EditCourseMaterials.png")

#include "../1. BRD/us/Teacher/Course Materials/List_Materials.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/10. ManageCourseMaterials/ListCourseMaterials.png")
#image("/out/docs/2. Diagrams/Activity diagram/10. ManageCourseMaterials/ListCourseMaterials.png")

#include "../1. BRD/us/Student/3.2_Access_Learning_Materials.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/11. AccessLearningMaterials/AccessLearningMaterials.png")
#image("/out/docs/2. Diagrams/Activity diagram/11. AccessLearningMaterials/AccessLearningMaterials.png")
#include "../2. Diagrams/Business rules/11_AccessLearningMaterials.typ"

#include "../1. BRD/us/4.1_Manage_Assignments.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/12. Manage Assignments/CreateTeacherAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/12. Manage Assignments/CreateTeacherAssignment.png")
#include "../2. Diagrams/Business rules/12_ManageAssignments.typ"

#include "../1. BRD/us/Teacher/TeacherAssignment/Create_Assignment.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/12. Manage Assignments/CreateTeacherAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/12. Manage Assignments/CreateTeacherAssignment.png")

#include "../1. BRD/us/Teacher/TeacherAssignment/Delete_Assignment.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/12. Manage Assignments/DeleteTeacherAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/12. Manage Assignments/DeleteTeacherAssignment.png")

#include "../1. BRD/us/Teacher/TeacherAssignment/Edit_Assignment.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/12. Manage Assignments/EditTeacherAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/12. Manage Assignments/EditTeacherAssignment.png")

#include "../1. BRD/us/Teacher/TeacherAssignment/List_Assignment.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/12. Manage Assignments/ListTeacherAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/12. Manage Assignments/ListTeacherAssignment.png")

#include "../1. BRD/us/Student/4.2_Submit_Assignments.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/13. SubmitAssignments/CreateSubmitAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/13. SubmitAssignments/CreateAssignment.png")
#include "../2. Diagrams/Business rules/13_SubmitAssignments.typ"

#include "../1. BRD/us/Student/Submit/Create_Submit.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/13. SubmitAssignments/CreateSubmitAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/13. SubmitAssignments/CreateAssignment.png")

#include "../1. BRD/us/Student/Submit/Delete_Submit.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/13. SubmitAssignments/DeleteSubmitAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/13. SubmitAssignments/DeleteAssignment.png")

#include "../1. BRD/us/Student/Submit/Edit_Submit.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/13. SubmitAssignments/EditSubmitAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/13. SubmitAssignments/EditAssignment.png")

#include "../1. BRD/us/Student/Submit/List_Submit.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/13. SubmitAssignments/ListSubmitAssignment.png")
#image("/out/docs/2. Diagrams/Activity diagram/13. SubmitAssignments/ListAssignment.png")

#include "../1. BRD/us/Teacher/4.3_Review_Submissions_Comment.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/14. ReviewSubmissions&Comment/ReviewSubmissionsComment.png")
#image("/out/docs/2. Diagrams/Activity diagram/14. ReviewSubmissions&Comment/ReviewSubmissionsComment.png")
#include "../2. Diagrams/Business rules/14_ReviewSubmissions_Comment.typ"

#include "../1. BRD/us/Student/4.4_View_Feedback.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/15. ViewFeedback/ViewFeedback.png")
#image("/out/docs/2. Diagrams/Activity diagram/15. ViewFeedback/ViewFeedback.png")
#include "../2. Diagrams/Business rules/15_ViewFeedback.typ"

#include "../1. BRD/us/Teacher/5.1_Send_Notifications.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/16. SendNotifications/SendNotification.png")
#image("/out/docs/2. Diagrams/Activity diagram/16. SendNotifications/SendNotifications.png")
#include "../2. Diagrams/Business rules/16_SendNotifications.typ"

#include "../1. BRD/us/Student/5.2_Receive_Notifications.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/17. ReceiveNotifications/ReceiveNotifications.png")
#image("/out/docs/2. Diagrams/Activity diagram/17. ReceiveNotifications/ReceiveNotifications.png")
#include "../2. Diagrams/Business rules/17_ReceiveNotifications.typ"

#include "../1. BRD/us/Teacher/6.1_View_Submissions.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/18. ViewStudentSubmissions/ViewStudentSubmissions.png")
#image("/out/docs/2. Diagrams/Activity diagram/18. ViewStudentSubmissions/ViewStudentSubmissions.png")
#include "../2. Diagrams/Business rules/18_ViewStudentSubmissions.typ"

#include "../1. BRD/us/Student/6.2_View_My_Submissions.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/19. ViewOwnSubmissions/ViewOwnSubmissions.png")
#image("/out/docs/2. Diagrams/Activity diagram/19. ViewOwnSubmissions/ViewOwnSubmissions.png")
#include "../2. Diagrams/Business rules/19_ViewOwnSubmissions.typ"

#include "../1. BRD/us/7.2_Manage_User_Accounts.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/21. ManageUserAccounts/CreateUserAccount.png")
#image("/out/docs/2. Diagrams/Activity diagram/21. ManageUserAccounts/CreateAccount.png")
#include "../2. Diagrams/Business rules/21_ManageUserAccounts.typ"

#include "../1. BRD/us/Admin/Update_System_Settings.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/22. UpdateSystemSettings/UpdateSystemSettings.png")
#image("/out/docs/2. Diagrams/Activity diagram/22. UpdateSystemSettings/UpdateSystemSettings.png")
#include "../2. Diagrams/Business rules/22_UpdateSystemSettings.typ"

#include "../1. BRD/us/Admin/View_Platform_Stats.typ"
#image("/out/docs/2. Diagrams/Sequence diagram/20. ViewPlatformStats/ViewPlatformStats.png")
#image("/out/docs/2. Diagrams/Activity diagram/20. ViewPlatformStats/ViewPlatformStats.png")
#include "../2. Diagrams/Business rules/20_ViewPlatformStats.typ"
