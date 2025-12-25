== Epic 3: Material Management

=== US 3.1: Manage Course Materials

==== BRD
- #link("../1. BRD/us/3.1_Manage_Course_Materials.typ")[3.1_Manage_Course_Materials.typ]

==== Diagrams
- Sequence: #link("../2. Diagrams/Sequence diagram/10. ManageCourseMaterials/CreateMaterial.pu")[Create], #link("../2. Diagrams/Sequence diagram/10. ManageCourseMaterials/UpdateMaterial.pu")[Update], #link("../2. Diagrams/Sequence diagram/10. ManageCourseMaterials/DeleteMaterial.pu")[Delete], #link("../2. Diagrams/Sequence diagram/11. AccessLearningMaterials/AccessLearningMaterials.pu")[Access]
- Activity: #link("../2. Diagrams/Activity diagram/10. ManageCourseMaterials/CreateMaterial.pu")[Create], #link("../2. Diagrams/Activity diagram/10. ManageCourseMaterials/UpdateMaterial.pu")[Update], #link("../2. Diagrams/Activity diagram/10. ManageCourseMaterials/DeleteMaterial.pu")[Delete], #link("../2. Diagrams/Activity diagram/11. AccessLearningMaterials/AccessLearningMaterials.pu")[Access]

==== Backend
- #link("../../server/src/materials/materials.controller.ts")[materials.controller.ts] - getMaterials, getMaterialsByClass, createMaterial, updateMaterial, deleteMaterial
- #link("../../server/src/materials/materials.service.ts")[materials.service.ts] - find, findByAdmin, create, update, delete, checkEnrollment
- #link("../../server/src/materials/materials.route.ts")[materials.route.ts]
- #link("../../server/src/materials/materials.schema.ts")[materials.schema.ts]

==== Frontend
- #link("../../client/src/pages/TeacherDashboard.tsx")[TeacherDashboard.tsx] - MaterialsManagement
- #link("../../client/src/pages/StudentCourseDetail.tsx")[StudentCourseDetail.tsx]
- #link("../../client/src/service/material.ts")[material.ts] - createMaterial, listMaterial, updateMaterial, deleteMaterial

==== Database
- #link("../../server/prisma/schema.prisma")[schema.prisma] (Material model - types: PDF, VIDEO, LINK, DOC)
