import apiClient from "@/api/axios";



const createClass = async (ClassData: any) => {
  try {
    const response = await apiClient.post(`/classes`, ClassData);
    return response.data;
  } catch (error) {
    console.error("Failed to create Class:", error);
    throw error;
  }
};

const listClass = async () => {
  try {
    const response = await apiClient.get(`/classes`);
    return response.data;
  } catch (error) {
    console.error("Failed to list classes:", error);
    throw error;
  }
};

const deleteClass = async (id: string) => {
  try {
    const response = await apiClient.delete(`/classes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete Class:", error);
    throw error;
  }
};

const updateClass = async (id: string, ClassData: any) => {
  try {
    const response = await apiClient.put(`/classes/${id}`, ClassData);
    return response.data;
  } catch (error) {
    console.error("Failed to update Class:", error);
    throw error;
  }
};

export default { createClass, listClass, deleteClass, updateClass };
