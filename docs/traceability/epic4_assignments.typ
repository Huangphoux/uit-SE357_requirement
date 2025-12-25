== Epic 4: Assignment Management

=== US 4.1: Manage Assignments

==== BRD
- #link("../1. BRD/us/4.1_Manage_Assignments.typ")[4.1_Manage_Assignments.typ]

==== Diagrams
- Sequence: #link("../2. Diagrams/Sequence diagram/12. Manage Assignments/CreateTeacherAssignment.pu")[Create], #link("../2. Diagrams/Sequence diagram/12. Manage Assignments/EditTeacherAssignment.pu")[Edit], #link("../2. Diagrams/Sequence diagram/12. Manage Assignments/DeleteTeacherAssignment.pu")[Delete], #link("../2. Diagrams/Sequence diagram/13. SubmitAssignments/SubmitAssignment.pu")[Submit], #link("../2. Diagrams/Sequence diagram/14. ReviewSubmissions&Comment/GradeSubmission.pu")[Grade], #link("../2. Diagrams/Sequence diagram/15. ViewFeedback/ViewFeedback.pu")[ViewFeedback]
- Activity: #link("../2. Diagrams/Activity diagram/12. Manage Assignments/CreateTeacherAssignment.pu")[Create], #link("../2. Diagrams/Activity diagram/12. Manage Assignments/EditTeacherAssignment.pu")[Edit], #link("../2. Diagrams/Activity diagram/12. Manage Assignments/DeleteTeacherAssignment.pu")[Delete], #link("../2. Diagrams/Activity diagram/13. SubmitAssignments/SubmitAssignment.pu")[Submit], #link("../2. Diagrams/Activity diagram/14. ReviewSubmissions&Comment/GradeSubmission.pu")[Grade], #link("../2. Diagrams/Activity diagram/15. ViewFeedback/ViewFeedback.pu")[ViewFeedback]

==== Backend
- Assignments:
- #link("../../server/src/assignments/assignments.controller.ts")[assignments.controller.ts] - getAssignments, getAssignmentsByStudent, createAssignment, updateAssignment, deleteAssignment
- #link("../../server/src/assignments/assignments.service.ts")[assignments.service.ts]
- #link("../../server/src/assignments/assignments.route.ts")[assignments.route.ts]
- #link("../../server/src/assignments/assignments.schema.ts")[assignments.schema.ts]
- Submissions:
- #link("../../server/src/submissions/submissions.controller.ts")[submissions.controller.ts] - getSubmissions, getStudentSubmissions, createSubmission, gradeSubmission, updateSubmission, deleteSubmission
- #link("../../server/src/submissions/submissions.service.ts")[submissions.service.ts]
- #link("../../server/src/submissions/submissions.route.ts")[submissions.route.ts]
- #link("../../server/src/submissions/submissions.schema.ts")[submissions.schema.ts]
- Feedback:
- #link("../../server/src/feedback/feedback.controller.ts")[feedback.controller.ts] - getFeedback, createFeedback, updateFeedback, deleteFeedback
- #link("../../server/src/feedback/feedback.service.ts")[feedback.service.ts]
- #link("../../server/src/feedback/feedback.route.ts")[feedback.route.ts]
- #link("../../server/src/feedback/feedback.schema.ts")[feedback.schema.ts]

==== Frontend
- #link("../../client/src/pages/TeacherDashboard.tsx")[TeacherDashboard.tsx] - AssignmentsManagement
- #link("../../client/src/pages/StudentDashboard.tsx")[StudentDashboard.tsx] - my-assignments tab
- #link("../../client/src/pages/CourseAssignments.tsx")[CourseAssignments.tsx]
- #link("../../client/src/service/assignment.ts")[assignment.ts], #link("../../client/src/service/submission.ts")[submission.ts], #link("../../client/src/service/feedback.ts")[feedback.ts]

==== Database
- #link("../../server/prisma/schema.prisma")[schema.prisma] (Assignment, Submission, Feedback models)
