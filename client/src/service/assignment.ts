// src/service/assignment.ts
import apiClient from "@/api/axios";

const createAssignment = async (assignmentData: {
  title: string;
  description?: string;
  classId: string;
  dueDate: string; // ISO string
  maxScore?: number;
}) => {
  try {
    const response = await apiClient.post(`/assignments`, assignmentData);
    return response.data;
  } catch (error) {
    console.error("Failed to create assignment:", error);
    throw error;
  }
};

const listAssignment = async (classId: string) => {
  try {
    const response = await apiClient.get(`/assignments?classId=${classId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to list assignments:", error);
    throw error;
  }
};

const deleteAssignment = async (id: string) => {
  try {
    const response = await apiClient.delete(`/assignments/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete assignment:", error);
    throw error;
  }
};

const updateAssignment = async (
  id: string,
  assignmentData: {
    title?: string;
    description?: string;
    dueDate?: string; // ISO string
    maxScore?: number;
  }
) => {
  try {
    const response = await apiClient.put(`/assignments/${id}`, assignmentData);
    return response.data;
  } catch (error) {
    console.error("Failed to update assignment:", error);
    throw error;
  }
};

export default { createAssignment, listAssignment, deleteAssignment, updateAssignment };