export interface Course {
  id: string;
  name: string;
  description: string;
  teacherId?: string;
  teacherName?: string;
  schedule?: string;
  capacity?: number;
  enrolled?: number;
  imageUrl?: string;
}

export interface Class {
  id: string;
  name: string;
  courseId: string;
  teacherId?: string;
  schedule: string;
  startTime: string;
  endTime: string;
  days: string[];
  capacity: number;
  enrolled: number;
}
type MaterialType = 'pdf' | 'video' | 'link';
export interface Material {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: MaterialType;
}
export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  points: number;
  status?: 'not_submitted' | 'submitted' | 'late' | 'graded';
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt?: string;
  fileUrl?: string;
  textContent?: string;
  status: 'not_submitted' | 'submitted' | 'late' | 'graded';
  grade?: number;
  feedback?: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
}

export interface Notification {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'teacher';
  subject: string;
  message: string;
  recipients: {
    type: 'all' | 'course' | 'specific';
    courseId?: string;
    studentIds?: string[];
  };
  priority: 'normal' | 'important';
  sentAt: string;
  readBy: string[]; // Array of student IDs who read the notification
}

// Mock Data
export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'IELTS Preparation Course',
    description: 'Comprehensive IELTS training for band 7.0+. Covers all 4 skills: Listening, Reading, Writing, Speaking with mock tests and personalized feedback.',
    teacherId: '2',
    teacherName: 'Sarah Wilson',
    schedule: 'Mon, Wed, Fri - 6:00 PM',
    capacity: 20,
    enrolled: 18,
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=250&fit=crop',
  },
  {
    id: '2',
    name: 'TOEIC 750+ Intensive',
    description: 'Intensive TOEIC preparation focusing on Listening and Reading strategies to achieve 750+ score for career advancement.',
    teacherId: '2',
    teacherName: 'Sarah Wilson',
    schedule: 'Tue, Thu - 7:00 PM',
    capacity: 25,
    enrolled: 22,
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop',
  },
  {
    id: '3',
    name: 'Business English Communication',
    description: 'Professional English for the workplace. Master presentations, emails, meetings, and negotiations in international business environments.',
    teacherId: '2',
    teacherName: 'Sarah Wilson',
    schedule: 'Sat - 9:00 AM',
    capacity: 15,
    enrolled: 12,
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
  },
  {
    id: '4',
    name: 'English for Beginners (A1-A2)',
    description: 'Foundation English course for absolute beginners. Build basic vocabulary, grammar, and confidence in everyday conversations.',
    teacherId: '2',
    teacherName: 'Sarah Wilson',
    schedule: 'Mon, Wed - 5:00 PM',
    capacity: 25,
    enrolled: 20,
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop',
  },
  {
    id: '5',
    name: 'Advanced Conversation & Pronunciation',
    description: 'Fluency-focused course for advanced learners. Improve natural speaking, pronunciation, idioms, and cultural understanding.',
    teacherId: '2',
    teacherName: 'Sarah Wilson',
    schedule: 'Sat - 2:00 PM',
    capacity: 12,
    enrolled: 8,
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=250&fit=crop',
  },
];

export const mockClasses: Class[] = [
  {
    id: '1',
    name: 'IELTS Preparation - Evening Class',
    courseId: '1',
    teacherId: '2',
    schedule: 'Mon, Wed, Fri',
    startTime: '18:00',
    endTime: '20:00',
    days: ['Monday', 'Wednesday', 'Friday'],
    capacity: 20,
    enrolled: 18,
  },
  {
    id: '2',
    name: 'TOEIC Intensive - After Work',
    courseId: '2',
    teacherId: '2',
    schedule: 'Tue, Thu',
    startTime: '19:00',
    endTime: '21:00',
    days: ['Tuesday', 'Thursday'],
    capacity: 25,
    enrolled: 22,
  },
  {
    id: '3',
    name: 'Business English - Weekend',
    courseId: '3',
    teacherId: '2',
    schedule: 'Saturday',
    startTime: '09:00',
    endTime: '12:00',
    days: ['Saturday'],
    capacity: 15,
    enrolled: 12,
  },
];

export const mockMaterials: Material[] = [
  {
    id: '1',
    courseId: '1',
    title: 'IELTS Writing Task 2 - Band 9 Sample Essays',
    description: 'Collection of 20 band 9 essays covering all common IELTS topics with detailed analysis',
    type: 'pdf',
  },
  {
    id: '2',
    courseId: '1',
    title: 'IELTS Speaking Part 2 - Topic Cards & Model Answers',
    description: '50 common IELTS speaking topics with vocabulary and sample responses',
    type: 'pdf',
  },
  {
    id: '3',
    courseId: '1',
    title: 'IELTS Listening Practice - Academic Module',
    description: 'Full-length listening test with audio files and answer keys',
    type: 'video',
  },
  {
    id: '4',
    courseId: '1',
    title: 'IELTS Vocabulary by Topic - 1000 Essential Words',
    description: 'Thematic vocabulary lists for all IELTS topics with example sentences',
    type: 'pdf',
  },
  {
    id: '5',
    courseId: '2',
    title: 'TOEIC Listening Part 1-4 Strategies',
    description: 'Comprehensive guide to all TOEIC listening question types with practice exercises',
    type: 'pdf',
  },
  {
    id: '6',
    courseId: '2',
    title: 'TOEIC Reading - Time Management Techniques',
    description: 'Speed reading strategies and practice tests for TOEIC Part 5-7',
    type: 'pdf',
  },
  {
    id: '7',
    courseId: '3',
    title: 'Business Email Templates & Phrases',
    description: 'Professional email writing guide with 50+ templates for various business situations',
    type: 'pdf',
  },
  {
    id: '8',
    courseId: '3',
    title: 'Presentation Skills Masterclass',
    description: 'Video course on delivering effective business presentations in English',
    type: 'video',
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    title: 'IELTS Writing Task 2: Environmental Issues',
    description: 'Write a 250-word essay: "Some people believe that environmental problems are too big for individuals to solve. To what extent do you agree or disagree?" Follow IELTS Task 2 format with clear introduction, body paragraphs, and conclusion.',
    dueDate: '2025-12-10T23:59:00',
    points: 9,
  },
  {
    id: '2',
    courseId: '1',
    title: 'IELTS Speaking Mock Test - Part 2 & 3',
    description: 'Record a 3-4 minute response to the topic card: "Describe a person who has influenced you." Then answer 3 Part 3 discussion questions. Upload your audio/video recording.',
    dueDate: '2025-12-15T23:59:00',
    points: 9,
  },
  {
    id: '3',
    courseId: '1',
    title: 'IELTS Reading Practice Test',
    description: 'Complete the full Academic Reading test (3 passages, 40 questions) within 60 minutes. Upload your answer sheet with all answers clearly marked.',
    dueDate: '2025-12-05T23:59:00',
    points: 40,
  },
  {
    id: '4',
    courseId: '1',
    title: 'IELTS Vocabulary Journal - Week 4',
    description: 'Submit your vocabulary journal with 50 new words learned this week. Include: word, definition, example sentence, and collocations. Use words from IELTS topics: Education, Technology, Health.',
    dueDate: '2025-12-08T23:59:00',
    points: 10,
  },
  {
    id: '5',
    courseId: '2',
    title: 'TOEIC Listening Practice - Part 1-4',
    description: 'Complete the 100-question TOEIC Listening section. Time limit: 45 minutes. Submit your answer sheet as PDF or image file.',
    dueDate: '2025-12-12T23:59:00',
    points: 495,
  },
  {
    id: '6',
    courseId: '2',
    title: 'TOEIC Reading Mock Test',
    description: 'Complete all 100 questions from TOEIC Reading Part 5-7. Strict 75-minute time limit. Upload your completed answer sheet.',
    dueDate: '2025-12-18T23:59:00',
    points: 495,
  },
  {
    id: '7',
    courseId: '2',
    title: 'TOEIC Vocabulary Quiz - Business Terms',
    description: 'Online quiz covering 50 common business vocabulary words and phrases frequently appearing in TOEIC tests.',
    dueDate: '2025-12-06T23:59:00',
    points: 50,
  },
  {
    id: '8',
    courseId: '3',
    title: 'Business Presentation: Company Analysis',
    description: 'Prepare and record a 5-minute business presentation analyzing a company of your choice. Include: company overview, market position, challenges, and recommendations. Submit video or audio recording with PowerPoint slides.',
    dueDate: '2025-12-20T23:59:00',
    points: 100,
  },
  {
    id: '9',
    courseId: '3',
    title: 'Professional Email Writing Assignment',
    description: 'Write 3 professional emails: 1) Client complaint response, 2) Meeting invitation with agenda, 3) Follow-up after business meeting. Each email should be 150-200 words.',
    dueDate: '2025-12-14T23:59:00',
    points: 30,
  },
  {
    id: '10',
    courseId: '3',
    title: 'Business Meeting Role-Play',
    description: 'Form a group of 3-4 students and record a 10-minute business meeting discussing a project proposal. Submit video recording showing all participants.',
    dueDate: '2025-12-22T23:59:00',
    points: 50,
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    assignmentId: '1',
    studentId: '3',
    studentName: 'Jane Doe',
    submittedAt: '2024-12-09T18:30:00',
    fileUrl: '/submissions/jane-ielts-essay-environmental.pdf',
    status: 'graded',
    grade: 7.5,
    feedback: 'Well-structured essay with clear arguments. Your vocabulary range is impressive (environmental degradation, sustainable practices). However, pay attention to article usage ("the government" vs "government"). Task Response: 8, Coherence: 8, Vocabulary: 8, Grammar: 7. Overall Band: 7.5. To reach Band 8+, work on complex sentence structures and avoid minor grammatical errors.',
  },
  {
    id: '2',
    assignmentId: '2',
    studentId: '3',
    studentName: 'Jane Doe',
    submittedAt: '2024-12-14T20:15:00',
    fileUrl: '/submissions/jane-speaking-recording.mp3',
    status: 'graded',
    grade: 7.0,
    feedback: 'Good fluency and coherence throughout your response. You maintained the topic well and used appropriate tenses when discussing past influences. Pronunciation is clear with only minor issues. Vocabulary: 7, Grammar: 7, Fluency: 8, Pronunciation: 7. Overall Band: 7.0. Suggestions: Use more idiomatic expressions and vary your discourse markers beyond "and then" and "also".',
  },
  {
    id: '3',
    assignmentId: '3',
    studentId: '3',
    studentName: 'Jane Doe',
    submittedAt: '2024-12-04T22:45:00',
    fileUrl: '/submissions/jane-reading-answers.pdf',
    status: 'graded',
    grade: 32,
    feedback: 'Score: 32/40 (Band 7.0). Strong performance overall. You handled True/False/Not Given questions well but struggled with matching headings. Time management was good as you completed all sections. Focus on: 1) Identifying paragraph main ideas quickly for matching tasks, 2) Synonyms and paraphrasing recognition, 3) Scanning techniques for specific information. Well done!',
  },
  {
    id: '4',
    assignmentId: '4',
    studentId: '3',
    studentName: 'Jane Doe',
    submittedAt: '2024-12-07T23:50:00',
    textContent: 'Week 4 Vocabulary Journal:\n\nEducation:\n1. Curriculum (n) - The subjects comprising a course of study\n2. Pedagogical (adj) - Relating to teaching methods\n3. Literacy (n) - The ability to read and write...',
    status: 'graded',
    grade: 9,
    feedback: 'Excellent vocabulary journal! You\'ve demonstrated strong understanding of each word with accurate definitions and contextual sentences. Your collocations are particularly impressive (e.g., "compulsory curriculum," "pedagogical approach"). The variety across topics is good. Minor note: Try to include more natural example sentences from real-world contexts rather than IELTS-style examples.',
  },
  {
    id: '5',
    assignmentId: '5',
    studentId: '3',
    studentName: 'Jane Doe',
    submittedAt: '2024-12-11T19:20:00',
    fileUrl: '/submissions/jane-toeic-listening-answers.pdf',
    status: 'graded',
    grade: 420,
    feedback: 'TOEIC Listening Score: 420/495 (84.8%). Strong performance! Part 1 (Photos): 9/10, Part 2 (Q&A): 26/30, Part 3 (Conversations): 28/30, Part 4 (Talks): 21/30. Your weakest area is Part 4 - focus on note-taking strategies and recognizing speaker intent. Part 2 shows excellent progress - keep practicing with similar response patterns. To reach 450+, work on: 1) Vocabulary related to announcements and presentations, 2) Understanding implied meanings.',
  },
  {
    id: '6',
    assignmentId: '7',
    studentId: '3',
    studentName: 'Jane Doe',
    submittedAt: '2024-12-05T21:10:00',
    status: 'graded',
    grade: 44,
    feedback: 'Vocabulary Quiz Score: 44/50 (88%). Excellent work! You demonstrated strong knowledge of business terminology including "merger," "acquisition," "revenue," and "stakeholder." Areas to review: phrasal verbs used in business contexts (e.g., "take over," "phase out," "scale up") and financial terms. Keep building your business vocabulary through reading business news articles and financial reports.',
  },
  {
    id: '7',
    assignmentId: '9',
    studentId: '3',
    studentName: 'Jane Doe',
    submittedAt: '2024-12-13T16:45:00',
    textContent: 'Email 1: Client Complaint Response\n\nDear Mr. Thompson,\n\nThank you for bringing this matter to our attention. I sincerely apologize for the inconvenience you experienced...',
    status: 'graded',
    grade: 27,
    feedback: 'Score: 27/30 (90%). Excellent professional email writing! Your tone is appropriately formal yet empathetic. Email structure is clear with proper openings and closings. Strengths: 1) Appropriate register and politeness strategies, 2) Clear action points and next steps, 3) Professional vocabulary usage. Minor improvements: In Email 2, the meeting agenda could be more specific with time allocations. Overall, very professional communication that would be effective in real business contexts.',
  },
];

export const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    studentId: '3',
    courseId: '1',
    enrolledAt: '2024-11-01',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'Sarah Wilson',
    senderRole: 'teacher',
    subject: 'Important: IELTS Mock Test This Saturday',
    message: 'Dear Students,\n\nThis is a reminder that we will have our first IELTS mock test this Saturday, December 7th at 9:00 AM.\n\nPlease arrive 15 minutes early and bring:\n- Your ID card\n- Pencils and erasers\n- Water bottle\n\nThe test will cover all 4 modules (Listening, Reading, Writing, Speaking). Speaking tests will be scheduled individually after the written test.\n\nGood luck with your preparation!\n\nBest regards,\nSarah Wilson',
    recipients: {
      type: 'course',
      courseId: '1',
    },
    priority: 'important',
    sentAt: '2024-12-02T10:30:00',
    readBy: ['3'],
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'Sarah Wilson',
    senderRole: 'teacher',
    subject: 'New Study Materials Available',
    message: 'Hello everyone,\n\nI have uploaded new IELTS Writing Task 2 sample essays to the course materials section. These are band 9 essays covering recent exam topics.\n\nPlease review them and try to analyze the structure and vocabulary used. We will discuss these in our next class.\n\nHappy studying!',
    recipients: {
      type: 'course',
      courseId: '1',
    },
    priority: 'normal',
    sentAt: '2024-12-01T14:20:00',
    readBy: ['3'],
  },
  {
    id: '3',
    senderId: '2',
    senderName: 'Sarah Wilson',
    senderRole: 'teacher',
    subject: 'Class Rescheduled - December 4th',
    message: 'Dear Students,\n\nDue to unforeseen circumstances, our class on Wednesday, December 4th will be rescheduled to Thursday, December 5th at the same time (6:00 PM).\n\nWe will cover the same material as planned. Please mark your calendars.\n\nApologies for any inconvenience.\n\nThank you for your understanding.',
    recipients: {
      type: 'course',
      courseId: '1',
    },
    priority: 'important',
    sentAt: '2024-12-01T09:15:00',
    readBy: [],
  },
  {
    id: '4',
    senderId: '1',
    senderName: 'Admin User',
    senderRole: 'admin',
    subject: 'Holiday Schedule Announcement',
    message: 'Dear Students,\n\nPlease be informed that the center will be closed from December 24th to January 1st for the holiday season.\n\nAll classes will resume on January 2nd, 2025. Make-up classes for any missed sessions will be scheduled in the first week of January.\n\nWe wish you a wonderful holiday season!\n\nBest regards,\nManagement Team',
    recipients: {
      type: 'all',
    },
    priority: 'normal',
    sentAt: '2024-11-30T16:00:00',
    readBy: [],
  },
  {
    id: '5',
    senderId: '2',
    senderName: 'Sarah Wilson',
    senderRole: 'teacher',
    subject: 'Great Job on Your Writing Assignment!',
    message: 'Hi Jane,\n\nI just finished grading your IELTS Writing Task 2 essay on environmental issues. You scored 7.5 - excellent work!\n\nYour arguments were well-structured and you demonstrated a strong vocabulary range. I have left detailed feedback in the assignment section.\n\nKeep up the great work!\n\nBest regards,\nSarah',
    recipients: {
      type: 'specific',
      studentIds: ['3'],
    },
    priority: 'normal',
    sentAt: '2024-11-29T11:45:00',
    readBy: ['3'],
  },
];

// Note: All mock data arrays above are already exported
// mockCourses, mockClasses, mockMaterials, mockAssignments,
// mockSubmissions, mockEnrollments, mockNotifications