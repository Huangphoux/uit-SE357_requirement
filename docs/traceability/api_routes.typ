= API Route Summary

== Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token

== Users
- GET /api/user/info
- GET /api/user/listTeachers
- GET /api/user/listStudents
- GET /api/user/

== Courses
- GET /api/courses
- GET /api/courses/:id
- POST /api/courses
- PUT /api/courses/:id
- DELETE /api/courses/:id
- GET /api/courses/enrolled
- POST /api/courses/enroll (student)
- POST /api/courses/enrollByAdmin (admin)
- POST /api/courses/unenroll (student)
- POST /api/courses/removeEnroll (admin)

== Classes
- GET /api/classes
- GET /api/classes/:id
- GET /api/classes/:id/students
- POST /api/classes
- PUT /api/classes/:id
- DELETE /api/classes/:id

== Materials
- GET /api/materials
- GET /api/materials/:id
- POST /api/materials/getMaterials
- POST /api/materials
- PUT /api/materials/:id
- DELETE /api/materials/:id
- GET /api/materials/enrollments
- GET /api/materials/enrollmentsByAdmin

== Assignments
- GET /api/assignments
- GET /api/assignments/:id
- GET /api/assignments/getAssignmentsByStudent
- POST /api/assignments
- PUT /api/assignments/:id
- DELETE /api/assignments/:id

== Submissions
- GET /api/submissions
- GET /api/submissions/:id
- GET /api/submissions/student
- POST /api/submissions
- PUT /api/submissions/:id
- PUT /api/submissions/:id/grade
- DELETE /api/submissions/:id

== Feedback
- GET /api/feedback
- GET /api/feedback/:id
- POST /api/feedback
- PUT /api/feedback/:id
- DELETE /api/feedback/:id

== Health Check
- GET /api/health
