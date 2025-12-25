== Archive Function

#table(
  columns: (auto, auto, auto),
  align: (left, left, left),
  [*List*], [*Actor*], [*Condition*],
  [Course], [Admin], [Admin can archive courses by created date],
  [Class], [Admin/Teacher], [Admin/Teacher can archive classes by created date],
  [Assignment], [Teacher], [Teacher can archive assignments by created date],
  [Material], [Teacher], [Teacher can archive materials by created date],
  [Student Information], [Admin], [Admin can archive student records by enrollment date],
  [Submission], [Teacher/Student], [Teacher/Student can archive submissions by submission date],
  [Feedback], [Teacher/Student], [Teacher/Student can archive feedback by created date],
)

== Security Audit Function

Security Audit Function enabled for Admin to track modifications on user permissions and role assignments.

== Application Sites

#table(
  columns: (auto, auto, auto),
  align: (left, left, left),
  [\#], [*Site Name*], [*Description*],
  [1], [Admin Site], [Control console for administrators. Provides CRUD functionalities for courses, classes, teachers, and students. Allows admins to view system reports, manage notifications, and monitor overall system usage.],
  [2], [Teacher Site], [Designed for teachers. Enables creation and management of courses, classes, assignments, and materials. Facilitates grading submissions, providing feedback, and communicating with students through notifications.],
  [3], [Student Site], [Allows students to view enrolled courses, access materials, submit assignments, and view feedback. Students can track their progress and view grades provided by teachers.],
)

== Application Lists

#table(
  columns: (auto, auto, auto, auto),
  align: (left, left, left, left),
  [\#], [*List Code*], [*List Name*], [*Description*],
  [1], [List01], [Student Information], [Contains student details including name, contact information, enrollment date, and enrolled courses.],
  [2], [List02], [Teacher Information], [Stores teacher details including name, specialization, contact information, and assigned courses.],
  [3], [List03], [Course], [Holds course information including course name, description, duration, and assigned teachers.],
  [4], [List04], [Class], [Contains class details including schedule, enrolled students, assigned teacher, and associated course.],
  [5], [List05], [Assignment], [Stores assignments with details like title, description, deadline, associated course/class, and grading criteria.],
  [6], [List06], [Material], [Contains learning materials including title, description, file attachments, and associated course.],
  [7], [List07], [Submission], [Tracks student submissions with details like submission date, attached files, grade, and feedback.],
  [8], [List08], [Feedback], [Contains feedback provided by teachers or received from students with date and associated entity.],
)

== Custom Pages

No custom pages implemented.

== Scheduled Agents

No scheduled agents implemented.

== Technical Concerns

*Low Growth Rate:* With 20% annual growth, planning for scalable architecture is essential to handle future expansion.

*Large Data Volume:* 10,000 documents and growing data can impact query performance. Database indexing and query optimization required.

*Excessive Content:* Pagination implemented for course lists, student lists, and assignment views to manage content display.

*High Traffic:* 500 concurrent users requires load balancing and caching strategies for optimal performance.

*Security Measures:* Authentication, authorization, and data encryption must balance security with performance impact.

*Read-only Mode:* System supports read-only mode during 2 AM - 4 AM EST maintenance window with minimal service disruption.
