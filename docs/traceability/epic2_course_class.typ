== Epic 2: Course & Class Management

=== US 2.1: Manage Courses

==== BRD
- #link("../1. BRD/us/2.1_Manage_Courses.typ")[2.1_Manage_Courses.typ]

==== Diagrams
- Sequence: #link("../2. Diagrams/Sequence diagram/4. ManageCourses/CreateCourse.pu")[Create], #link("../2. Diagrams/Sequence diagram/4. ManageCourses/EditCoures.pu")[Edit], #link("../2. Diagrams/Sequence diagram/4. ManageCourses/DeleteCoures.pu")[Delete], #link("../2. Diagrams/Sequence diagram/4. ManageCourses/ListCoures.pu")[List]
- Activity: #link("../2. Diagrams/Activity diagram/4. ManageCourses/CreateCourse.pu")[Create], #link("../2. Diagrams/Activity diagram/4. ManageCourses/EditCourse.pu")[Edit], #link("../2. Diagrams/Activity diagram/4. ManageCourses/DeleteCourse.pu")[Delete], #link("../2. Diagrams/Activity diagram/4. ManageCourses/ListCourse.pu")[List]

==== Backend
- #link("../../server/src/courses/courses.controller.ts")[courses.controller.ts] - getCourses, createCourse, updateCourse, deleteCourse
- #link("../../server/src/courses/courses.service.ts")[courses.service.ts] - find, create, update, delete
- #link("../../server/src/courses/courses.route.ts")[courses.route.ts]
- #link("../../server/src/courses/courses.schema.ts")[courses.schema.ts]

==== Frontend
- #link("../../client/src/pages/AdminDashboard.tsx")[AdminDashboard.tsx] - CourseManagement
- #link("../../client/src/service/course.ts")[course.ts] - createCourse, listCourse, updateCourse, deleteCourse

==== Database
- #link("../../server/prisma/schema.prisma")[schema.prisma] (Course model)

=== US 2.2: Manage Classes

==== BRD
- #link("../1. BRD/us/2.2_Manage_Classes.typ")[2.2_Manage_Classes.typ]

==== Diagrams
- Sequence: #link("../2. Diagrams/Sequence diagram/5. ManageClasses/CreateClass.pu")[Create], #link("../2. Diagrams/Sequence diagram/5. ManageClasses/EditClass.pu")[Edit], #link("../2. Diagrams/Sequence diagram/5. ManageClasses/DeleteClass.pu")[Delete], #link("../2. Diagrams/Sequence diagram/5. ManageClasses/ListClass.pu")[List]
- Activity: #link("../2. Diagrams/Activity diagram/5. ManageClasses/CreateClass.pu")[Create], #link("../2. Diagrams/Activity diagram/5. ManageClasses/EditClass.pu")[Edit], #link("../2. Diagrams/Activity diagram/5. ManageClasses/DeleteClass.pu")[Delete], #link("../2. Diagrams/Activity diagram/5. ManageClasses/ListClass.pu")[List]

==== Backend
- #link("../../server/src/classes/classes.controller.ts")[classes.controller.ts] - getClasses, createClass, updateClass, deleteClass, getClassStudents
- #link("../../server/src/classes/classes.service.ts")[classes.service.ts] - find, create, update, delete, getStudents
- #link("../../server/src/classes/classes.route.ts")[classes.route.ts]
- #link("../../server/src/classes/classes.schema.ts")[classes.schema.ts]

==== Frontend
- #link("../../client/src/pages/AdminDashboard.tsx")[AdminDashboard.tsx] - ClassManagement
- #link("../../client/src/service/class.ts")[class.ts] - createClass, listClass, updateClass, deleteClass

==== Database
- #link("../../server/prisma/schema.prisma")[schema.prisma] (Class model)

=== US 2.3: Manage Student Enrollments

==== BRD
- #link("../1. BRD/us/2.3_Manage_Student_Enrollments.typ")[2.3_Manage_Student_Enrollments.typ]

==== Diagrams
- Sequence: #link("../2. Diagrams/Sequence diagram/6. ManageStudentEnrollment/EnrollStudent.pu")[Enroll (Admin)], #link("../2. Diagrams/Sequence diagram/6. ManageStudentEnrollment/RemoveStudent.pu")[Remove], #link("../2. Diagrams/Sequence diagram/9. Self-EnrollCourses/EnrollCourses.pu")[Enroll (Student)]
- Activity: #link("../2. Diagrams/Activity diagram/6. ManageStudentEnrollment/EnrollStudent.pu")[Enroll (Admin)], #link("../2. Diagrams/Activity diagram/6. ManageStudentEnrollment/RemoveStudent.pu")[Remove], #link("../2. Diagrams/Activity diagram/9. Self-EnrollCourses/EnrollCourses.pu")[Enroll (Student)]

==== Backend
- #link("../../server/src/courses/courses.controller.ts")[courses.controller.ts] - enrollInClass, enrollInClassByAdmin, unenrollFromClass, unenrollFromClassStudent
- #link("../../server/src/courses/courses.service.ts")[courses.service.ts] - enrollInClass, unenrollFromClass
- #link("../../server/src/materials/materials.controller.ts")[materials.controller.ts] - getEnrollments, getEnrollmentsByAdmin
- #link("../../server/src/courses/courses.route.ts")[courses.route.ts]

==== Frontend
- #link("../../client/src/pages/AdminDashboard.tsx")[AdminDashboard.tsx] - EnrollmentManagement
- #link("../../client/src/pages/StudentDashboard.tsx")[StudentDashboard.tsx]
- #link("../../client/src/service/course.ts")[course.ts] - enrollToClassStudent, unenrollFromClassStudent, enrollInClass, unenrollFromClass, getCourseEnrollmentsByAdmin

==== Database
- #link("../../server/prisma/schema.prisma")[schema.prisma] (Enrollment model)
