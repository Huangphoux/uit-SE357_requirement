import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import courseService from "../service/course";
import submissionService from "../service/submission";

interface Assignment {
  id: string;
  title: string;
  description: string;
  classId: string;
  createdBy: string;
  dueDate: string;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  content: string;
  status: "SUBMITTED" | "GRADED";
  submittedAt: string;
  feedback?: {
    id: string;
    score: number;
    comment: string;
    createdAt: string;
  }[];
}

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

export default function CourseAssignments() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchAssignments();
      fetchSubmissions();
    }
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getAssignmentsByCourse(courseId!);
      setAssignments(response.data.assignment || []);
    } catch (err: any) {
      setError(err.message || "Failed to load assignments");
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await submissionService.getStudentSubmissionsByStudent();
      setSubmissions(response.data.submissions || []);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find((s) => s.assignmentId === assignmentId);
  };

  const handleSubmit = async () => {
    if (!selectedAssignment || !submitUrl.trim()) {
      showToast("Please enter a valid URL", "error");
      return;
    }

    try {
      setSubmitting(true);
      await submissionService.submitAssignment({
        assignmentId: selectedAssignment.id,
        userId: user?.id!,
        content: submitUrl,
      });

      showToast("Assignment submitted successfully!", "success");
      setShowSubmitModal(false);
      setSubmitUrl("");
      setSelectedAssignment(null);

      // Refresh submissions
      await fetchSubmissions();
    } catch (err: any) {
      showToast(err.message || "Failed to submit assignment", "error");
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const openSubmitModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setSubmitUrl("");
    setSelectedAssignment(null);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-center mb-2">Error Loading Assignments</h3>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Course Assignments</h1>
          <p className="text-gray-600 mt-1">{assignments.length} assignments available</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {assignments.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assignments Yet</h3>
            <p className="text-gray-600">Check back later for new assignments</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {assignments.map((assignment) => {
              const submission = getSubmissionForAssignment(assignment.id);
              const overdue = isOverdue(assignment.dueDate);

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {assignment.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {assignment.description}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="ml-4">
                      {submission ? (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            submission.status === "GRADED"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {submission.status === "GRADED" ? "✓ Graded" : "✓ Submitted"}
                        </span>
                      ) : overdue ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          Overdue
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Due Date</p>
                        <p className="text-sm font-medium">
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Max Score</p>
                        <p className="text-sm font-medium">{assignment.maxScore} points</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-sm font-medium">
                          {submission ? "Completed" : "Not Submitted"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submission Section */}
                  {submission ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            Your Submission
                          </p>
                          <a
                            href={submission.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline break-all"
                          >
                            {submission.content}
                          </a>
                          <p className="text-xs text-gray-600 mt-2">
                            Submitted on {new Date(submission.submittedAt).toLocaleString()}
                          </p>

                          {/* Feedback */}
                          {submission.feedback && submission.feedback.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <p className="text-sm font-semibold text-blue-900 mb-2">
                                Instructor Feedback
                              </p>
                              {submission.feedback.map((fb) => (
                                <div key={fb.id} className="bg-white rounded p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm text-gray-700">{fb.comment}</p>
                                    <span className="text-lg font-bold text-green-600 ml-3">
                                      {fb.score}/{assignment.maxScore}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {new Date(fb.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => openSubmitModal(assignment)}
                      disabled={overdue}
                      className={`w-full py-2.5 rounded-md font-medium transition-colors ${
                        overdue
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {overdue ? "Assignment Overdue" : "Submit Assignment"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && selectedAssignment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeSubmitModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Submit Assignment</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedAssignment.title}</p>
              </div>
              <button onClick={closeSubmitModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission URL *
              </label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={submitUrl}
                  onChange={(e) => setSubmitUrl(e.target.value)}
                  placeholder="https://example.com/your-work"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter the URL to your completed assignment (Google Drive, GitHub, etc.)
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting || !submitUrl.trim()}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
              <button
                onClick={closeSubmitModal}
                disabled={submitting}
                className="px-6 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
