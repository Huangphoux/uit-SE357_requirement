import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  LogOut,
  BookOpen,
  Calendar,
  Loader2,
  AlertCircle,
  Sun,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import courseService from "../service/course";
import submissionService from "../service/submission";
import { useAuth } from "@/contexts/AuthContext";
// Types
interface Class {
  id: string;
  courseId: string;
  title: string;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  classes: Class[];
}

interface ApiResponse {
  ok: boolean;
  message: string;
  data: {
    courses: Course[];
  };
}

interface EnrollmentData {
  id: string; // Thêm id
  classId: string;
  userId: string;
  status: string; // "ACTIVE", "INACTIVE"
  createdAt: string;
  updatedAt: string;
}

interface Feedback {
  id: string;
  submissionId: string;
  createdBy: string;
  comment: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  class: {
    title: string;
    course: {
      title: string;
    };
  };
}

interface Submission {
  id: string;
  content: string;
  status: "SUBMITTED" | "GRADED";
  submittedAt: string;
  assignment: Assignment;
  feedback: Feedback[];
}

const imageUrls = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&h=400&fit=crop",
];

// Mock Components
const NotificationBellIcon = () => (
  <button className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">
    <div className="w-5 h-5 bg-white rounded-full"></div>
  </button>
);

const DarkModeToggle = () => (
  <button className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">
    <div className="w-5 h-5 bg-white rounded-full"></div>
  </button>
);

// Toast Component
const showToast = (message: string, type: "success" | "error") => {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 1rem;
    right: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    color: white;
    z-index: 9999;
    background-color: ${type === "success" ? "#28a745" : "#dc3545"};
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<"my-courses" | "submissions" | "catalog">("catalog");
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { logout, user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  // Load courses from API
  useEffect(() => {
    const loadAll = async () => {
      await fetchCourses();
      await loadEnrollments();
      await fetchSubmissions();
    };
    loadAll();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await courseService.listCourse();
      setCourses(response.data.courses);
      setLoading(false);
    } catch (err) {
      setError("Failed to connect to server");
      console.error("Error fetching courses:", err);
      setLoading(false);
    }
  };
  const fetchSubmissions = async () => {
    try {
      setLoadingSubmissions(true);
      const response = await submissionService.getStudentSubmissionsByStudent(); // Bạn cần thêm method này vào courseService
      setSubmissions(response.data.submissions);
      setLoadingSubmissions(false);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setLoadingSubmissions(false);
    }
  };
  const loadEnrollments = async () => {
    try {
      const response = await courseService.getCouresEnrollments();
      const enrollments = response.data.enrollments;

      // Map sang dạng EnrollmentData đầy đủ
      setEnrolledClasses(enrollments); // Lưu trực tiếp data từ API
    } catch (err) {
      setEnrolledClasses([]);
      console.error("Error loading enrollments:", err);
    }
  };

  const saveEnrollments = (enrollments: EnrollmentData[]) => {
    setEnrolledClasses(enrollments);
  };

  const handleEnroll = async (classId: string, courseTitle: string) => {
    try {
      const response = await courseService.enrollInClass(classId);

      // Sau khi enroll, reload lại enrollments để có data mới từ API
      await loadEnrollments();

      showToast("Successfully enrolled in " + courseTitle, "success");
    } catch (err) {
      showToast("Failed to enroll", "error");
      console.error("Enrollment error:", err);
    }
  };

  const handleUnenroll = async (classId: string, courseTitle: string) => {
    try {
      await courseService.unenrollFromClass(classId);

      // Sau khi unenroll, reload lại enrollments
      await loadEnrollments();

      showToast("Successfully unenrolled from " + courseTitle, "success");
    } catch (err) {
      showToast("Failed to unenroll", "error");
      console.error("Unenrollment error:", err);
    }
  };

  const isEnrolled = (classId: string) => {
    return enrolledClasses.some((e) => e.classId === classId && e.status === "ACTIVE");
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrolledCourses = courses.filter((course) =>
    course.classes.some((cls) => isEnrolled(cls.id))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Sticky added */}
      <nav className="sticky top-0 z-50 bg-[#0056b3] text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo/Avatar Section (Không thay đổi) */}
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#0056b3]" />
            </div>
            <div>
              <p>Student Portal</p>
              <p className="opacity-90" style={{ fontSize: "0.875rem" }}>
                {user?.name}
              </p>
            </div>
          </div>

          {/* ➡️ Utility Icons Section (ĐÃ SỬA) */}
          <div className="flex items-center gap-1">
            {/* 🔔 1. Notification Icon (Thay thế chấm tròn 1) */}
            <button
              // Thêm onClick handler của bạn tại đây
              className="p-2 rounded-full text-white hover:bg-[#004494] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* 🌙 2. Dark Mode Toggle Icon (Thay thế chấm tròn 2) */}
            {/* NOTE: Bạn sẽ cần state để chuyển đổi giữa Sun và Moon */}
            <button
              // Thêm onClick handler của bạn tại đây (ví dụ: toggleDarkMode)
              className="p-2 rounded-full text-white hover:bg-[#004494] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Toggle Dark Mode"
            >
              {/* Giả định đang ở chế độ sáng, nên hiển thị icon Sun */}
              <Sun className="w-5 h-5" />
              {/* Hoặc dùng Moon nếu bạn muốn hiển thị chế độ để chuyển sang */}
            </button>

            {/* 🚪 3. Logout Button (Chỉ thêm gap để tách khỏi icons utility) */}
            <div className="ml-2">
              {" "}
              <button
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#004494] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "1.5rem" }}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <button
            onClick={() => setActiveTab("my-courses")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontWeight: "500",
              borderBottom: activeTab === "my-courses" ? "2px solid #0056b3" : "none",
              color: activeTab === "my-courses" ? "#0056b3" : "#6c757d",
              transition: "color 0.2s",
            }}
          >
            My Courses ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontWeight: "500",
              borderBottom: activeTab === "catalog" ? "2px solid #0056b3" : "none",
              color: activeTab === "catalog" ? "#0056b3" : "#6c757d",
              transition: "color 0.2s",
            }}
          >
            Course Catalog
          </button>

          <button
            onClick={() => setActiveTab("submissions")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontWeight: "500",
              borderBottom: activeTab === "submissions" ? "2px solid #0056b3" : "none",
              color: activeTab === "submissions" ? "#0056b3" : "#6c757d",
              transition: "color 0.2s",
            }}
          >
            My Submissions
          </button>
        </div>

        {/* Search Bar for Catalog */}
        {activeTab === "catalog" && (
          <div style={{ marginBottom: "1.5rem" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for courses by name or description..."
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                border: "1px solid #dee2e6",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0056b3")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#dee2e6")}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "5rem 0",
            }}
          >
            <Loader2
              style={{
                width: "3rem",
                height: "3rem",
                color: "#0056b3",
                animation: "spin 1s linear infinite",
                marginBottom: "1rem",
              }}
            />
            <p style={{ color: "#6c757d" }}>Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c2c7",
              color: "#842029",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <AlertCircle style={{ width: "1.25rem", height: "1.25rem" }} />
            <p style={{ margin: 0, flex: 1 }}>{error}</p>
            <button
              onClick={fetchCourses}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* My Courses Tab */}
        {!loading && activeTab === "my-courses" && (
          <div>
            {enrolledCourses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 0" }}>
                <BookOpen
                  style={{
                    width: "4rem",
                    height: "4rem",
                    color: "#adb5bd",
                    margin: "0 auto 1rem",
                  }}
                />
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#212529",
                    marginBottom: "0.5rem",
                  }}
                >
                  No Enrolled Courses
                </h3>
                <p style={{ color: "#6c757d", marginBottom: "1.5rem" }}>
                  Browse the course catalog to enroll in your first course
                </p>
                <button
                  onClick={() => setActiveTab("catalog")}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#0056b3",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#004494")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {enrolledCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrolledClasses={enrolledClasses}
                    imageIndex={courses.indexOf(course)}
                    onEnroll={handleEnroll}
                    onUnenroll={handleUnenroll}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Catalog Tab */}
        {!loading && activeTab === "catalog" && (
          <div>
            {filteredCourses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 0" }}>
                <BookOpen
                  style={{
                    width: "4rem",
                    height: "4rem",
                    color: "#adb5bd",
                    margin: "0 auto 1rem",
                  }}
                />
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#212529",
                    marginBottom: "0.5rem",
                  }}
                >
                  No courses found
                </h3>
                <p style={{ color: "#6c757d" }}>
                  {searchQuery ? "Try adjusting your search query" : "No available courses"}
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrolledClasses={enrolledClasses}
                    onEnroll={handleEnroll}
                    imageIndex={courses.indexOf(course)}
                    onUnenroll={handleUnenroll}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {!loading && activeTab === "submissions" && (
          <div style={{ padding: "1.5rem" }}>
            {loadingSubmissions ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "3rem",
                }}
              >
                <Loader2 className="animate-spin" size={32} color="#0056b3" />
                <span style={{ marginLeft: "0.75rem" }}>Loading submissions...</span>
              </div>
            ) : submissions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                }}
              >
                <BookOpen size={48} color="#6c757d" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  No Submissions Yet
                </h3>
                <p style={{ color: "#6c757d" }}>Your assignment submissions will appear here</p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "1.5rem",
                }}
              >
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "0.75rem",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      padding: "1.5rem",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "1rem",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: "600",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {submission.assignment.title}
                        </h3>
                        <p
                          style={{
                            color: "#6c757d",
                            fontSize: "0.875rem",
                          }}
                        >
                          {submission.assignment.class.course.title} -{" "}
                          {submission.assignment.class.title}
                        </p>
                      </div>
                      <span
                        style={{
                          padding: "0.375rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          backgroundColor: submission.status === "GRADED" ? "#d4edda" : "#fff3cd",
                          color: submission.status === "GRADED" ? "#155724" : "#856404",
                        }}
                      >
                        {submission.status}
                      </span>
                    </div>

                    {/* Assignment Description */}
                    <p
                      style={{
                        color: "#495057",
                        marginBottom: "1rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      {submission.assignment.description}
                    </p>

                    {/* Info Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "1rem",
                        marginBottom: "1rem",
                        padding: "1rem",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#6c757d",
                            display: "block",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Submitted
                        </span>
                        <span style={{ fontWeight: "500" }}>
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#6c757d",
                            display: "block",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Due Date
                        </span>
                        <span style={{ fontWeight: "500" }}>
                          {new Date(submission.assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#6c757d",
                            display: "block",
                            marginBottom: "0.25rem",
                          }}
                        >
                          Max Score
                        </span>
                        <span style={{ fontWeight: "500" }}>
                          {submission.assignment.maxScore} points
                        </span>
                      </div>
                    </div>

                    {/* Submission Content */}
                    <div style={{ marginBottom: "1rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "#6c757d",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Your Submission
                      </span>
                      <a
                        href={submission.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0056b3",
                          textDecoration: "none",
                          fontSize: "0.875rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        🔗 {submission.content}
                      </a>
                    </div>

                    {/* Feedback Section */}
                    {submission.feedback.length > 0 && (
                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "1rem",
                          backgroundColor: "#e7f3ff",
                          borderRadius: "0.5rem",
                          borderLeft: "4px solid #0056b3",
                        }}
                      >
                        <h4
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            marginBottom: "0.75rem",
                            color: "#0056b3",
                          }}
                        >
                          📝 Instructor Feedback
                        </h4>
                        {submission.feedback.map((fb) => (
                          <div key={fb.id}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "0.5rem",
                              }}
                            >
                              <span style={{ fontSize: "0.875rem", color: "#495057" }}>
                                {fb.comment}
                              </span>
                              <span
                                style={{
                                  fontWeight: "700",
                                  fontSize: "1.125rem",
                                  color:
                                    fb.score >= 80
                                      ? "#28a745"
                                      : fb.score >= 60
                                        ? "#ffc107"
                                        : "#dc3545",
                                }}
                              >
                                {fb.score}/{submission.assignment.maxScore}
                              </span>
                            </div>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#6c757d",
                              }}
                            >
                              Graded on {new Date(fb.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

// Course Card Component
interface CourseCardProps {
  course: Course;
  enrolledClasses: EnrollmentData[];
  onEnroll: (classId: string, courseTitle: string) => void;
  onUnenroll: (classId: string, courseTitle: string) => void;
  imageIndex: number; // ← THÊM DÒNG NÀY
}

function CourseCard({
  course,
  enrolledClasses,
  onEnroll,
  onUnenroll,
  imageIndex,
}: CourseCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [modalAction, setModalAction] = useState<"enroll" | "unenroll">("enroll");
  const imageUrl = imageUrls[imageIndex % imageUrls.length]; // ← THÊM DÒNG NÀY

  const isEnrolled = (classId: string) => {
    return enrolledClasses.some((e) => e.classId === classId && e.status === "ACTIVE");
  };

  const handleClassAction = (cls: Class, action: "enroll" | "unenroll") => {
    setSelectedClass(cls);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedClass) {
      if (modalAction === "enroll") {
        onEnroll(selectedClass.id, `${course.title} - ${selectedClass.title}`);
      } else {
        onUnenroll(selectedClass.id, `${course.title} - ${selectedClass.title}`);
      }
    }
    setShowModal(false);
  };

  const enrolledCount = course.classes.filter((cls) => isEnrolled(cls.id)).length;

  return (
    <>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          border: "1px solid #dee2e6",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.15)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div
          style={{
            height: "10rem",
            width: "100%",
            background: `url(${imageUrl}) center/cover no-repeat`,
          }}
        />

        <div style={{ padding: "1.25rem" }}>
          <h3
            style={{
              fontSize: "1.125rem",
              fontWeight: "600",
              color: "#212529",
              marginBottom: "0.5rem",
            }}
          >
            {course.title}
          </h3>
          <p style={{ fontSize: "0.875rem", color: "#6c757d", marginBottom: "1rem" }}>
            {course.description}
          </p>

          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "0.875rem", fontWeight: "500", color: "#495057" }}>
                Available Classes:
              </span>
              {enrolledCount > 0 && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    backgroundColor: "#d1e7dd",
                    color: "#0f5132",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                  }}
                >
                  {enrolledCount} enrolled
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {course.classes.map((cls) => (
                <div
                  key={cls.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "0.375rem",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Calendar style={{ width: "1rem", height: "1rem", color: "#6c757d" }} />
                    <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>{cls.title}</span>
                  </div>

                  {isEnrolled(cls.id) ? (
                    <button
                      onClick={() => handleClassAction(cls, "unenroll")}
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.75rem",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c82333")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
                    >
                      Unenroll
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClassAction(cls, "enroll")}
                      style={{
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.75rem",
                        backgroundColor: "#ffc107",
                        color: "#212529",
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0a800")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffc107")}
                    >
                      Enroll
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedClass && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "28rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
              {modalAction === "enroll" ? "Confirm Enrollment" : "Confirm Unenrollment"}
            </h3>
            <p style={{ color: "#6c757d", marginBottom: "1.5rem", lineHeight: "1.5" }}>
              {modalAction === "enroll" ? (
                <>
                  Are you sure you want to enroll in <strong>{course.title}</strong> -{" "}
                  <strong>{selectedClass.title}</strong>?
                </>
              ) : (
                <>
                  Are you sure you want to unenroll from <strong>{course.title}</strong> -{" "}
                  <strong>{selectedClass.title}</strong>? You will lose access to all course
                  materials.
                </>
              )}
            </p>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={confirmAction}
                style={{
                  flex: 1,
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  color: "white",
                  border: "none",
                  fontWeight: "500",
                  cursor: "pointer",
                  backgroundColor: modalAction === "enroll" ? "#0056b3" : "#dc3545",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    modalAction === "enroll" ? "#004494" : "#c82333")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    modalAction === "enroll" ? "#0056b3" : "#dc3545")
                }
              >
                {modalAction === "enroll" ? "Yes, Enroll" : "Yes, Unenroll"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #dee2e6",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
