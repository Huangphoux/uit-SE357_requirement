import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, FileText, Calendar } from "lucide-react";
import courseService from "../service/course";
import assignmentService from "../service/assignment";
import { toast } from "sonner";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  classId: string;
}

export default function StudentCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  useEffect(() => {
    fetchCourseDetail();
  }, [courseId]);

  useEffect(() => {
    if (selectedClassId) {
      fetchAssignments();
    }
  }, [selectedClassId]);

  const fetchCourseDetail = async () => {
    try {
      // Fetch course info
      const response = await courseService.getCourseById(courseId);
      setCourse(response.data.course);
      
      // Auto-select first enrolled class
      if (response.data.course.classes.length > 0) {
        setSelectedClassId(response.data.course.classes[0].id);
      }
    } catch (error) {
      toast.error("Failed to load course");
    }
    setLoading(false);
  };

  const fetchAssignments = async () => {
    try {
      const response = await assignmentService.listAssignmentsByClass(selectedClassId);
      setAssignments(response.data.assignments);
    } catch (error) {
      console.error("Failed to load assignments:", error);
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;
  }

  if (!course) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Course not found</div>;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#0056b3", color: "white", padding: "1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{course.title}</h1>
          <p style={{ opacity: 0.9 }}>{course.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem" }}>
        {/* Class Selector */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Select Class:
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            style={{
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #dee2e6",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            {course.classes.map((cls: any) => (
              <option key={cls.id} value={cls.id}>
                {cls.title}
              </option>
            ))}
          </select>
        </div>

        {/* Assignments Section */}
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={24} />
            Assignments
          </h2>

          {assignments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", backgroundColor: "white", borderRadius: "0.5rem" }}>
              <BookOpen size={48} color="#6c757d" style={{ margin: "0 auto 1rem" }} />
              <p style={{ color: "#6c757d" }}>No assignments yet</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  style={{
                    backgroundColor: "white",
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                    {assignment.title}
                  </h3>
                  <p style={{ color: "#6c757d", marginBottom: "1rem" }}>
                    {assignment.description}
                  </p>
                  <div style={{ display: "flex", gap: "2rem", fontSize: "0.875rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Calendar size={16} />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <strong>Max Score:</strong> {assignment.maxScore} points
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/student/assignment/${assignment.id}`)}
                    style={{
                      marginTop: "1rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: "#0056b3",
                      color: "white",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                    }}
                  >
                    View & Submit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}