#set heading(numbering: "1.")

= ViewEnrolledCourses Business Rules

| Activity | BR Code | Description |
|----------|---------|-------------|
| (4) | BR1 | Query Verification: Only retrieve courses where student has active Enrollment record. |
| (5) | BR2 | Data Retrieval: Join Enrollment with Course and Class tables to get complete course information. |
| (6) | BR3 | Display Rules: Show course name, code, teacher name, schedule, current grade if available. Hide unavailable courses. |
