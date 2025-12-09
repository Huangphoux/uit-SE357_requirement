import apiClient from "@/api/axios";



const createUser = async (UserData: any) => {
  try {
    const response = await apiClient.post(`/user`, UserData);
    return response.data;
  } catch (error) {
    console.error("Failed to create User:", error);
    throw error;
  }
};

const listUser = async () => {
  try {
    const response = await apiClient.get(`/user`);
    return response.data;
  } catch (error) {
    console.error("Failed to list user:", error);
    throw error;
  }
};

const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete User:", error);
    throw error;
  }
};

const updateUser = async (id: string, UserData: any) => {
  try {
    const response = await apiClient.put(`/user/${id}`, UserData);
    return response.data;
  } catch (error) {
    console.error("Failed to update User:", error);
    throw error;
  }
};

export default { createUser, listUser, deleteUser, updateUser };
