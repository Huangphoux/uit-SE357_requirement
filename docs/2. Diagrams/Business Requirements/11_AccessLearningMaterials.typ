#set heading(numbering: "1.")

= AccessLearningMaterials Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR150],
  [Navigation Rules:
    Student clicks on enrolled course from "Student Portal" to view course details. System calls method `navigateToCourseDetail(String courseId)` and displays course materials section.],

  [(2)],
  [BR151],
  [Authorization Rules:
    System calls method `verifyEnrollment(String userId, String courseId)` to check student enrollment by querying `SELECT \* FROM Enrollment e JOIN Class c ON e.classId = c.id WHERE e.userId = \[User.id\] AND c.courseId = \[Course.id\] AND e.status = 'ACTIVE'`.
    If not enrolled, display error (Refer to MSG 31) and block access.],

  [(3)],
  [BR152],
  [Data Retrieval Rules:
    System queries table "MATERIAL" (Refer to "Material" table in "DB Sheet" file) with syntax `SELECT \* FROM Material WHERE classId IN (SELECT id FROM Class WHERE courseId = \[Course.id\])` to fetch all materials for the course. System calls method `fetchCourseMaterials(String courseId)`.],

  [(4)],
  [BR153],
  [Filtering Rules:
    System calls method `filterVisibleMaterials(List<Material> materials, String userId)` to check visibility permissions for each material. Only materials visible to student are included in display.],

  [(5)],
  [BR154],
  [Displaying Rules:
    System displays materials list showing title, description, type, and download/view link. System calls method `renderMaterialsList(List<Material> materials)` to display data.],

  [(6)],
  [BR155],
  [Download Rules:
    When student clicks download/view link, system calls method `downloadMaterial(String materialId)` to retrieve file from storage using [Material.url].],

  [(7)],
  [BR156],
  [Logging Rules:
    System calls method `logMaterialAccess(String userId, String materialId)` to insert access log record for analytics. Logs student ID, material ID, and timestamp.],
)
