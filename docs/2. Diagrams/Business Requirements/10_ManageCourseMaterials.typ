#set heading(numbering: "1.")

= ManageCourseMaterials Business Requirements

#table(
  columns: (1fr, 1fr, 3fr),
  [Activity], [BR Code], [Description],
  [(1)],
  [BR143],
  [Displaying Rules:
    Teacher navigates to course materials section from "Teacher Portal" screen. The system calls method `displayMaterialsManagement(String courseId)` and shows "Add Material" screen (Refer to "Add Material" view in "View Description" file) with existing materials list.],

  [(2)],
  [BR144],
  [Input Rules:
    Teacher fills in material details including [txtBoxTitle] for title and [txtBoxDesc] for description. Teacher clicks [btnUpload] to select file for upload.],

  [(3)],
  [BR145],
  [Validation Rules:
    When teacher clicks [btnAdd], system calls method `validateMaterial()` to check:
    If [txtBoxTitle].`isEmpty()` = true, display error (Refer to MSG 25).
    If [txtBoxDesc].`isEmpty()` = true, display error (Refer to MSG 26).
    If no file selected, display error (Refer to MSG 27).],

  [(4)],
  [BR146],
  [File Validation Rules:
    System calls method `validateFile(File file)` to check:
    File type must be PDF, DOC, DOCX, PPT, PPTX, MP4, or image formats.
    If invalid type, display error (Refer to MSG 28).
    File size must be less than 100MB.
    If exceeds limit, display error (Refer to MSG 29).
    Perform virus scan using method `scanFile(File file)`.],

  [(5)],
  [BR147],
  [File Upload Rules:
    System calls method `uploadFile(File file)` to store file in file storage system and returns file URL. The system stores file with unique identifier to prevent naming conflicts.],

  [(6)],
  [BR148],
  [Database Insert Rules:
    System calls method `createMaterial(Material material)` to insert record in table "MATERIAL" (Refer to "Material" table in "DB Sheet" file) with syntax `INSERT INTO Material (id, title, description, type, url, classId, createdBy, createdAt, updatedAt) VALUES (\[Material.id\], \[Material.title\], \[Material.description\], \[Material.type\], \[Material.url\], \[classId\], \[teacherId\], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`.],

  [(7)],
  [BR149],
  [Confirmation Rules:
    System displays success message (Refer to MSG 30) and calls method `refreshMaterialsList()` to update materials view. System calls method `Close()` to close "Add Material" screen.],
)
