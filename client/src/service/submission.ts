import apiClient from "@/api/axios";

// Tạo submission (Student)
const createSubmission = async (submissionData: any) => {
  try {
    const response = await apiClient.post(`/submissions`, submissionData);
    return response.data;
  } catch (error) {
    console.error("Failed to create submission:", error);
    throw error;
  }
};

// Lấy submissions của student (hoặc 1 submission cụ thể)
const listSubmission = async (submissionId?: string) => {
  try {
    const url = submissionId ? `/submissions/${submissionId}` : `/submissions`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to list submissions:", error);
    throw error;
  }
};

// Lấy tất cả submissions của 1 assignment (Teacher)
const getSubmissionsByAssignment = async (assignmentId: string) => {
  try {
    const response = await apiClient.get(`/submissions`, {
      params: { assignmentId },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get submissions by assignment:", error);
    throw error;
  }
};

// Xóa submission (Student)
const deleteSubmission = async (id: string) => {
  try {
    const response = await apiClient.delete(`/submissions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete submission:", error);
    throw error;
  }
};

// Update submission (Student)
const updateSubmission = async (id: string, submissionData: any) => {
  try {
    const response = await apiClient.put(`/submissions/${id}`, submissionData);
    return response.data;
  } catch (error) {
    console.error("Failed to update submission:", error);
    throw error;
  }
};

// Grade submission (Teacher)
const gradeSubmission = async (id: string, gradeData: { grade: number; feedback?: string }) => {
  try {
    const response = await apiClient.put(`/submissions/${id}/grade`, gradeData);
    return response.data;
  } catch (error) {
    console.error("Failed to grade submission:", error);
    throw error;
  }
};

const getStudentSubmissionsByStudent = async () => {
  try {
    const response = await apiClient.get(`/submissions/student`);
    return response.data;
  } catch (error) {
    console.error("Failed to get submissions by student:", error);
    throw error;
  }
};

const submitAssignment = async (assignmentId: string, content: string, url: string) => {
  try {
    const response = await apiClient.post(`/submissions`, {
      assignmentId,
      content,
      url,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to submit assignment:", error);
    throw error;
  }
};
export default {
  createSubmission,
  listSubmission,
  getSubmissionsByAssignment,
  deleteSubmission,
  updateSubmission,
  gradeSubmission,
  getStudentSubmissionsByStudent,
  submitAssignment,
};
