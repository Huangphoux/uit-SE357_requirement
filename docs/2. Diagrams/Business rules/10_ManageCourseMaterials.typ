#set heading(numbering: "1.")

= ManageCourseMaterials Business Rules

| Activity | BR Code | Description |
|----------|---------|-------------|
| (4) | BR1 | File Validation: Validate file type (PDF, doc, video, image only). Check file size < max limit (e.g., 100MB). Perform virus scan. |
| (6) | BR2 | Metadata Storage: Store material metadata (title, description, category, type) in Material table. Store file in file storage system. |
| (7) | BR3 | Access Control: Set material visibility level (all students, specific groups, specific students only). |
