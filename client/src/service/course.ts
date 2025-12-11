import apiClient from "@/api/axios";

const getCouresEnrollments = async () => {
  try {
    const response = await apiClient.get(`/materials/enrollments`);
    console.log(response.data.data);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch course enrollments:", error);
    throw error;
  }
};

const getCourseEnrollmentsByAdmin = async () => {
  try {
    const response = await apiClient.get(`/materials/enrollmentsByAdmin`);
    console.log(response.data.data);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch course enrollments:", error);
    throw error;
  }
};

const createCourse = async (courseData: any) => {
  try {
    const response = await apiClient.post(`/courses`, courseData);
    return response.data;
  } catch (error) {
    console.error("Failed to create course:", error);
    throw error;
  }
};

const listCourse = async () => {
  try {
    const response = await apiClient.get(`/courses`);
    return response.data;
  } catch (error) {
    console.error("Failed to list courses:", error);
    throw error;
  }
};

const deleteCourse = async (id: string) => {
  try {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete course:", error);
    throw error;
  }
};

const updateCourse = async (id: string, courseData: any) => {
  try {
    const response = await apiClient.put(`/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error("Failed to update course:", error);
    throw error;
  }
};
const enrollInClass = async (classId: string) => {
  try {
    const response = await apiClient.post(`/courses/enroll`, { classId });
    return response.data;
  } catch (error) {
    console.error("Failed to enroll in class:", error);
    throw error;
  }
};

const unenrollFromClass = async (classId: string) => {
  try {
    const response = await apiClient.post(`/courses/unenroll`, { classId });
    return response.data;
  } catch (error) {
    console.error("Failed to unenroll from class:", error);
    throw error;
  }
};

const unenrollFromClassStudent = async (classId: string, userId: string) => {
  try {
    const response = await apiClient.post(`/courses/removeEnroll`, { classId, userId });
    return response.data;
  } catch (error) {
    console.error("Failed to unenroll from class:", error);
    throw error;
  }
};
export default {
  getCouresEnrollments,
  createCourse,
  listCourse,
  deleteCourse,
  updateCourse,
  enrollInClass,
  unenrollFromClass,
  getCourseEnrollmentsByAdmin,
  unenrollFromClassStudent,
};
