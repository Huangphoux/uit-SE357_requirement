#set heading(offset: 3)

= User

- Base object for all users; stores common info like email, password, name, etc.

= Role

- Defines access levels (Student, Teacher, Admin); users can have one or more roles.

= Student

- A user with the Student role; can enroll in classes, submit assignments, view feedback.

= Teacher

- A user with the Teacher role; can manage classes, materials, assignments, and feedback.

= Admin

- A user with the Admin role; can manage users, courses, settings, and view analytics.

= Course

- Represents a course with a title, description, and syllabus.

= Class

- A session linked to a course, with schedule, assigned teacher, and enrolled students.

= TeacherAssignment

- Represents the link between a teacher and a class (who teaches what).

= Enrollment

- Represents a student's enrollment in a class; includes status and timestamps.

= LearningMaterial

- PDFs, videos, links assigned to classes or courses for study.

= Assignment

- Tasks or questions given by teachers to students, with deadlines and grading.

= Submission

- A student’s answer to an assignment; may include files or text.

= SubmissionStatus

- Status of a submission (e.g., Pending, Submitted, Graded, Resubmitted).

= Feedback / Comment

- Teacher's feedback on a submission; may include text, grade, or annotations.

= StudentProgress

- Aggregated view of a student's progress in a course (grades, completion, etc.).

= Notification

- Messages sent to students or classes for updates or reminders.

= PlatformStatistics

- Aggregated data for admin view — users, submissions, active courses, etc.

= PlatformSettings

- Configurable platform settings like branding, terms, and contact info.
