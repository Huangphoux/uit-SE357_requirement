= Database Schema Documentation

== 1. User Table

#table(
  columns: 5,
  [*No.*], [*Attribute Name*], [*Data Type*], [*Constraint*], [*Meaning or Note*],
  [1], [id], [VARCHAR(50)], [PRIMARY KEY], [Unique identifier (CUID)],
  [2], [email], [VARCHAR(100)], [NOT NULL, UNIQUE], [User's email address],
  [3], [password], [VARCHAR(255)], [NOT NULL], [User's password (hashed)],
  [4], [name], [VARCHAR(100)], [NOT NULL], [User's full name],
  [5], [role], [ENUM], [NOT NULL, DEFAULT 'STUDENT'], [User role: STUDENT, TEACHER, or ADMIN],
  [6], [refreshToken], [VARCHAR(255)], [], [JWT refresh token],
  [7], [createdAt], [DATETIME], [NOT NULL], [Date and time of account creation],
  [8], [updatedAt], [DATETIME], [NOT NULL], [Date and time of last account update],
)

== 2. Course Table

#table(
  columns: 5,
  [*No.*], [*Attribute Name*], [*Data Type*], [*Constraint*], [*Meaning or Note*],
  [1], [id], [VARCHAR(50)], [PRIMARY KEY], [Unique identifier (CUID)],
  [2], [title], [VARCHAR(255)], [NOT NULL], [Course title],
  [3], [description], [TEXT], [], [Course description],
  [4], [createdAt], [DATETIME], [NOT NULL], [Date and time of course creation],
  [5], [updatedAt], [DATETIME], [NOT NULL], [Date and time of last course update],
)

== 3. Class Table

#table(
  columns: 5,
  [*No.*], [*Attribute Name*], [*Data Type*], [*Constraint*], [*Meaning or Note*],
  [1], [id], [VARCHAR(50)], [PRIMARY KEY], [Unique identifier (CUID)],
  [2], [courseId], [VARCHAR(50)], [FOREIGN KEY, NOT NULL], [References Course(id), CASCADE on delete],
  [3], [title], [VARCHAR(255)], [NOT NULL], [Class title/section],
  [4], [teacherId], [VARCHAR(50)], [INDEX], [Assigned teacher (references User.id)],
  [5], [createdAt], [DATETIME], [NOT NULL], [Date and time of class creation],
  [6], [updatedAt], [DATETIME], [NOT NULL], [Date and time of last class update],
)

== 4. Enrollment Table

#table(
  columns: 5,
  [*No.*], [*Attribute Name*], [*Data Type*], [*Constraint*], [*Meaning or Note*],
  [1], [id], [VARCHAR(50)], [PRIMARY KEY], [Unique identifier (CUID)],
  [2], [userId], [VARCHAR(50)], [FOREIGN KEY, NOT NULL], [References User(id), CASCADE on delete],
  [3], [classId], [VARCHAR(50)], [FOREIGN KEY, NOT NULL], [References Class(id), CASCADE on delete],
  [4], [status], [VARCHAR(20)], [NOT NULL, DEFAULT 'ACTIVE'], [Enrollment status: ACTIVE, COMPLETED, DROPPED],
  [5], [createdAt], [DATETIME], [NOT NULL], [Date and time of enrollment],
  [6], [updatedAt], [DATETIME], [NOT NULL], [Date and time of last enrollment update],
  [], [], [], [UNIQUE(userId, classId)], [One enrollment per student per class],
)

== 5. Assignment Table

#table(
  columns: 5,
  [*No.*], [*Attribute Name*], [*Data Type*], [*Constraint*], [*Meaning or Note*],
  [1], [id], [VARCHAR(50)], [PRIMARY KEY], [Unique identifier (CUID)],
  [2], [title], [VARCHAR(255)], [NOT NULL], [Assignment title],
  [3], [description], [TEXT], [], [Assignment description/instructions],
  [4], [classId], [VARCHAR(50)], [FOREIGN KEY, NOT NULL], [References Class(id), CASCADE on delete],
  [5], [createdBy], [VARCHAR(50)], [INDEX, NOT NULL], [Teacher ID who created assignment],
  [6], [dueDate], [DATETIME], [NOT NULL], [Assignment due date],
  [7], [maxScore], [FLOAT], [NOT NULL, DEFAULT 100], [Maximum score for assignment],
  [8], [createdAt], [DATETIME], [NOT NULL], [Date and time of assignment creation],
  [9], [updatedAt], [DATETIME], [NOT NULL], [Date and time of last assignment update],
)

== 6. Submission Table

#table(
  columns: 5,
  [*No.*], [*Attribute Name*], [*Data Type*], [*Constraint*], [*Meaning or Note*],
  [1], [id], [VARCHAR(50)], [PRIMARY KEY], [Unique identifier (CUID)],
  [2], [assignmentId], [VARCHAR(50)], [FOREIGN KEY, NOT NULL], [References Assignment(id), CASCADE on delete],
  [3], [userId], [VARCHAR(50)], [FOREIGN KEY, NOT NULL], [References User(id), CASCADE on delete],
  [4], [content], [TEXT], [], [Text content of submission],
  [5], [fileUrl], [VARCHAR(500)], [], [URL of uploaded file],
  [6], [status], [VARCHAR(20)], [NOT NULL, DEFAULT 'PENDING'], [Status: PENDING, SUBMITTED, GRADED],
  [7], [submittedAt], [DATETIME], [], [Actual submission timestamp],
  [8], [createdAt], [DATETIME], [NOT NULL], [Date and time submission was created],
  [9], [updatedAt], [DATETIME], [NOT NULL], [Date and time of last submission update],
  [], [], [], [UNIQUE(assignmentId, userId)], [One submission per student per assignment],
)

== 7. Feedback Table

#table(
  columns: 5,
  [*No.*], [*Attribute Name*], [*Data Type*], [*Constraint*], [*Meaning or Note*],
  [1], [id], [VARCHAR(50)], [PRIMARY KEY], [Unique identifier (CUID)],
  [2], [submissionId], [VARCHAR(50)], [FOREIGN KEY, NOT NULL], [References Submission(id), CASCADE on delete],
  [3], [createdBy], [VARCHAR(50)], [INDEX, NOT NULL], [Teacher ID who provided feedback],
  [4], [comment], [TEXT], [], [Teacher's comment/feedback],
  [5], [score], [FLOAT], [], [Score given to submission],
  [6], [createdAt], [DATETIME], [NOT NULL], [Date and time feedback was created],
  [7], [updatedAt], [DATETIME], [NOT NULL], [Date and time of last feedback update],
)

== 8. Material Table

#table(
  columns: 5,
  [*No.*], [*Attribute Name*], [*Data Type*], [*Constraint*], [*Meaning or Note*],
  [1], [id], [VARCHAR(50)], [PRIMARY KEY], [Unique identifier (CUID)],
  [2], [title], [VARCHAR(255)], [NOT NULL], [Material title],
  [3], [description], [TEXT], [], [Material description],
  [4], [type], [VARCHAR(20)], [NOT NULL], [Material type: PDF, VIDEO, LINK, DOC],
  [5], [url], [VARCHAR(500)], [NOT NULL], [File URL or external link],
  [6], [classId], [VARCHAR(50)], [FOREIGN KEY, INDEX, NOT NULL], [References Class(id), CASCADE on delete],
  [7], [createdBy], [VARCHAR(50)], [INDEX, NOT NULL], [Teacher ID who created material],
  [8], [createdAt], [DATETIME], [NOT NULL], [Date and time material was created],
  [9], [updatedAt], [DATETIME], [NOT NULL], [Date and time of last material update],
)
