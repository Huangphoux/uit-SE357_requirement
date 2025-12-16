import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  LogOut,
  BookOpen,
  Calendar,
  Loader2,
  AlertCircle,
  Sun,
  Moon,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import courseService from "../service/course";
import submissionService from "../service/submission";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useNavigate } from "react-router-dom";
import material from "@/service/material";
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

const showToast = (message: string, type: "success" | "error") => {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 5rem;
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
  const [activeTab, setActiveTab] = useState<
    "my-courses" | "submissions" | "catalog" | "my-assignments"
  >("catalog");
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { logout, user } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassInfo, setSelectedClassInfo] = useState<{
    courseTitle: string;
    classTitle: string;
  } | null>(null);
  const [myAssignments, setMyAssignments] = useState<any[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitContent, setSubmitContent] = useState("");

  // Load courses from API
  useEffect(() => {
    const loadAll = async () => {
      await fetchCourses();
      await loadEnrollments();
      await fetchSubmissions();
    };
    loadAll();
  }, []);
  useEffect(() => {
    if (enrolledClasses.length > 0 && courses.length > 0) {
      fetchMyAssignments();
    }
  }, [enrolledClasses, courses]);

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
  const fetchMyAssignments = async () => {
    try {
      setLoadingAssignments(true);

      const response = await courseService.getAssignmentsByCourse();
      console.log(response.data.assignment);

      setMyAssignments(response.data.assignment || []);
      setLoadingAssignments(false);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setLoadingAssignments(false);
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

  const handleViewMaterials = (classId: string, courseTitle: string, classTitle: string) => {
    setSelectedClassId(classId);
    setSelectedClassInfo({ courseTitle, classTitle });
  };

  // ✅ THÊM HANDLER - để quay lại
  const handleBackFromMaterials = () => {
    setSelectedClassId(null);
    setSelectedClassInfo(null);
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

  const openSubmitModal = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setSubmitUrl("");
    setSubmitContent("");
    setSelectedAssignment(null);
  };

  const handleSubmitAssignment = async () => {
    if (!submitContent.trim() || !submitUrl.trim()) {
      showToast("Please fill in both content and URL", "error");
      return;
    }

    try {
      setSubmitting(true);
      await submissionService.submitAssignment(
        selectedAssignment.id,
        submitContent, // Content từ textarea
        submitUrl // URL từ input
      );

      showToast("Assignment submitted successfully!", "success");
      closeSubmitModal();
      await fetchSubmissions();
      await fetchMyAssignments();
    } catch (err: any) {
      showToast(err.message || "Failed to submit assignment", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find((s) => s.assignmentId === assignmentId);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrolledCourses = courses.filter((course) =>
    course.classes.some((cls) => isEnrolled(cls.id))
  );
  if (selectedClassId) {
    return (
      <MaterialsView
        classId={selectedClassId}
        courseTitle={selectedClassInfo?.courseTitle || ""}
        classTitle={selectedClassInfo?.classTitle || ""}
        onBack={handleBackFromMaterials}
        user={user}
        logout={logout}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }
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
            {/* <button
              // Thêm onClick handler của bạn tại đây
              className="p-2 rounded-full text-white hover:bg-[#004494] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button> */}

            {/* 🌙 2. Dark Mode Toggle Icon */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-white hover:bg-[#004494] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
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

          <button
            onClick={() => setActiveTab("my-assignments")}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              fontWeight: "500",
              borderBottom: activeTab === "my-assignments" ? "2px solid #0056b3" : "none",
              color: activeTab === "my-assignments" ? "#0056b3" : "#6c757d",
              transition: "color 0.2s",
            }}
          >
            My Assignments
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
            Browse Courses
          </button>
        </div>
        {showSubmitModal && selectedAssignment && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
              zIndex: 9999,
            }}
            onClick={closeSubmitModal}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                maxWidth: "32rem",
                width: "100%",
                padding: "1.5rem",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                    Submit Assignment
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#6c757d" }}>
                    {selectedAssignment.title}
                  </p>
                </div>
                <button
                  onClick={closeSubmitModal}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#6c757d",
                    padding: "0.25rem",
                  }}
                >
                  <AlertCircle style={{ width: "1.5rem", height: "1.5rem" }} />
                </button>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                {/* Ô nhập Content */}
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Assignment Content *
                  </label>
                  <textarea
                    value={submitContent}
                    onChange={(e) => setSubmitContent(e.target.value)}
                    placeholder="Enter your assignment description or notes..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Ô nhập URL */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Submission URL *
                  </label>
                  <input
                    type="url"
                    value={submitUrl}
                    onChange={(e) => setSubmitUrl(e.target.value)}
                    placeholder="https://example.com/your-work"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "#6c757d", marginTop: "0.5rem" }}>
                    Enter the URL to your completed assignment (Google Drive, GitHub, etc.)
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  onClick={handleSubmitAssignment}
                  disabled={submitting || !submitUrl.trim()}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: submitting || !submitUrl.trim() ? "#e9ecef" : "#0056b3",
                    color: submitting || !submitUrl.trim() ? "#6c757d" : "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontWeight: "500",
                    cursor: submitting || !submitUrl.trim() ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2
                        style={{
                          width: "1rem",
                          height: "1rem",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  onClick={closeSubmitModal}
                  disabled={submitting}
                  style={{
                    padding: "0.75rem 1.5rem",
                    border: "1px solid #dee2e6",
                    backgroundColor: "transparent",
                    borderRadius: "0.5rem",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.5 : 1,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
                    onViewMaterials={handleViewMaterials}
                    isDark={isDark}
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
                    onViewMaterials={handleViewMaterials}
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
        {!loading && activeTab === "my-assignments" && (
          <div style={{ padding: "1.5rem" }}>
            {loadingAssignments ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
                <Loader2 className="animate-spin" size={32} color="#0056b3" />
                <span style={{ marginLeft: "0.75rem" }}>Loading assignments...</span>
              </div>
            ) : myAssignments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <BookOpen size={48} color="#6c757d" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                  No Assignments Available
                </h3>
                <p style={{ color: "#6c757d" }}>Enroll in courses to see assignments</p>
              </div>
            ) : (
              (() => {
                const pendingAssignments = myAssignments.filter((assignment) => {
                  const submission = getSubmissionForAssignment(assignment.id);
                  return !submission;
                });

                if (pendingAssignments.length === 0) {
                  return (
                    <div style={{ textAlign: "center", padding: "3rem" }}>
                      <BookOpen size={48} color="#6c757d" style={{ margin: "0 auto 1rem" }} />
                      <h3
                        style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}
                      >
                        No Pending Assignments
                      </h3>
                      <p style={{ color: "#6c757d" }}>
                        Great job! You've completed all your assignments.
                      </p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: "grid", gap: "1.5rem" }}>
                    {pendingAssignments.map((assignment) => {
                      const submission = getSubmissionForAssignment(assignment.id);
                      const overdue = isOverdue(assignment.dueDate);

                      return (
                        <div
                          key={assignment.id}
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
                                {assignment.title}
                              </h3>
                              <p style={{ color: "#6c757d", fontSize: "0.875rem" }}>
                                {assignment.description}
                              </p>
                            </div>
                            <span
                              style={{
                                padding: "0.375rem 0.75rem",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: "600",
                                backgroundColor: overdue ? "#f8d7da" : "#fff3cd",
                                color: overdue ? "#842029" : "#856404",
                              }}
                            >
                              {overdue ? "Overdue" : "Pending"}
                            </span>
                          </div>

                          {/* Info Grid */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
                                Due Date
                              </span>
                              <span style={{ fontWeight: "500", fontSize: "0.875rem" }}>
                                {new Date(assignment.dueDate).toLocaleDateString()}
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
                              <span style={{ fontWeight: "500", fontSize: "0.875rem" }}>
                                {assignment.maxScore} points
                              </span>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <button
                            onClick={() => openSubmitModal(assignment)}
                            disabled={overdue}
                            style={{
                              width: "100%",
                              padding: "0.75rem",
                              borderRadius: "0.5rem",
                              border: "none",
                              fontWeight: "500",
                              cursor: overdue ? "not-allowed" : "pointer",
                              backgroundColor: overdue ? "#e9ecef" : "#0056b3",
                              color: overdue ? "#6c757d" : "white",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              if (!overdue) e.currentTarget.style.backgroundColor = "#004494";
                            }}
                            onMouseLeave={(e) => {
                              if (!overdue) e.currentTarget.style.backgroundColor = "#0056b3";
                            }}
                          >
                            {overdue ? "Assignment Overdue" : "Submit Assignment"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
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
  imageIndex: number;
  isDark: boolean;
  onViewMaterials: (classId: string, courseTitle: string, classTitle: string) => void; // ✅ THÊM PROP MỚI
}

function CourseCard({
  course,
  enrolledClasses,
  onEnroll,
  onUnenroll,
  imageIndex,
  onViewMaterials,
  isDark
}: CourseCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [modalAction, setModalAction] = useState<"enroll" | "unenroll">("enroll");
  const imageUrl = imageUrls[imageIndex % imageUrls.length];

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
      <div className="bg-card border rounded-lg shadow transition-all duration-300 overflow-hidden hover:shadow-lg hover:-translate-y-1">
        <div
          style={{
            height: "10rem",
            width: "100%",
            background: `url(${imageUrl}) center/cover no-repeat`,
          }}
        />

        <div className="p-5">
          <h3 className="text-lg font-semibold text-foreground mb-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
          {/* <button
            onClick={() => setShowDetails(!showDetails)}
            style={{
              width: "100%",
              padding: "0.5rem 0",
              marginBottom: "1rem",
              backgroundColor: "transparent",
              color: "#0056b3",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#004494")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#0056b3")}
          >
            {showDetails ? "Hide Details ↑" : "View More Details ↓"}
          </button>
          {showDetails && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                backgroundColor: "#f0f8ff",
                borderRadius: "0.5rem",
                border: "1px solid #dcdcdc",
              }}
            >
              <h4
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#0056b3",
                  marginBottom: "0.5rem",
                }}
              >
                Course Information
              </h4>
              <p style={{ fontSize: "0.875rem", color: "#495057", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600" }}>ID:</span> {course.id}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#495057", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "600" }}>Created At:</span>{" "}
                {new Date(course.createdAt).toLocaleDateString()}
              </p>
              <p style={{ fontSize: "0.875rem", color: "#495057" }}>
                <span style={{ fontWeight: "600" }}>Last Updated:</span>{" "}
                {new Date(course.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )} */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Available Classes:</span>
              {enrolledCount > 0 && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  {enrolledCount} enrolled
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {course.classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-2 bg-muted border rounded"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{cls.title}</span>
                  </div>

                  {/* ✅ THÊM DIV NÀY - wrap các buttons */}
                  <div className="flex items-center gap-2">
                    {/* ✅ THÊM NÚT VIEW MATERIALS - chỉ hiện khi enrolled */}
                    {isEnrolled(cls.id) && (
                      <button
                        onClick={() => onViewMaterials(cls.id, course.title, cls.title)}
                        className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-black rounded transition-colors"
                        title="View Materials"
                        style={{ cursor: "pointer" }}
                      >
                        View Materials
                      </button>
                    )}

                    {/* Existing enroll/unenroll buttons */}
                    {isEnrolled(cls.id) ? (
                      <button
                        onClick={() => handleClassAction(cls, "unenroll")}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-black rounded transition-colors"
                        style={{ cursor: "pointer" }}
                      >
                        Unenroll
                      </button>
                    ) : (
                      <button
                        onClick={() => handleClassAction(cls, "enroll")}
                        className="px-3 py-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded transition-colors"
                        style={{ cursor: "pointer" }}
                      >
                        Enroll
                      </button>
                    )}
                  </div>
                  {/* ✅ HẾT DIV THÊM */}
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
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginBottom: "1rem",
                color: isDark ? "#ffffff" : "#000000", // ← THÊM DÒNG NÀY
              }}
            >
              {modalAction === "enroll" ? "Confirm Enrollment" : "Confirm Unenrollment"}
            </h3>
            <p
              style={{
                color: isDark ? "#94a3b8" : "#6c757d", // ← SỬA DÒNG NÀY
                marginBottom: "1.5rem",
                lineHeight: "1.5",
              }}
            >
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

// ✅ COMPONENT MỚI - hiển thị materials của class
interface MaterialsViewProps {
  classId: string;
  courseTitle: string;
  classTitle: string;
  onBack: () => void;
  user: any;
  logout: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

function MaterialsView({
  classId,
  courseTitle,
  classTitle,
  onBack,
  user,
  logout,
  isDark,
  toggleDarkMode,
}: MaterialsViewProps) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ CALL API - lấy materials của class
        const response = await material.listMaterialByAdmin(classId);
        setMaterials(Array.isArray(response.data.materials) ? response.data.materials : []);
      } catch (err) {
        console.error("Error fetching materials:", err);
        setError("Failed to load materials");
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [classId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0056b3] text-white px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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

          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-full text-white hover:bg-[#004494] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-white hover:bg-[#004494] transition-colors"
            >
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="ml-2">
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

      {/* Content */}
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "1.5rem" }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "transparent",
            border: "1px solid #dee2e6",
            borderRadius: "0.5rem",
            cursor: "pointer",
            color: "#0056b3",
            fontWeight: "500",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          ← Back to Courses
        </button>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "0.5rem" }}>
            {courseTitle}
          </h1>
          <p style={{ color: "#6c757d", fontSize: "1.125rem" }}>{classTitle}</p>
        </div>

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
            <p style={{ color: "#6c757d" }}>Loading materials...</p>
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
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && materials.length === 0 && (
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
              No Materials Available
            </h3>
            <p style={{ color: "#6c757d" }}>Your instructor hasn't uploaded any materials yet</p>
          </div>
        )}

        {/* Materials List */}
        {!loading && !error && materials.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            {materials.map((material, index) => (
              <div
                key={material.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  padding: "1.5rem",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "start",
                  gap: "1rem",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#e9f2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BookOpen style={{ width: "1.5rem", height: "1.5rem", color: "#0056b3" }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {material.title}
                  </h3>
                  <p
                    style={{
                      color: "#6c757d",
                      fontSize: "0.875rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {material.description || "No description"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        backgroundColor: "#e9f2ff",
                        color: "#0056b3",
                        fontWeight: "500",
                      }}
                    >
                      {material.type}
                    </span>
                    {material.url && (
                      <a
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0056b3",
                          fontSize: "0.875rem",
                          textDecoration: "none",
                          fontWeight: "500",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                      >
                        View Resource →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
