// src/service/material.ts
import apiClient from "@/api/axios";

const createMaterial = async (materialData: {
  title: string;
  description?: string;
  type: "PDF" | "VIDEO" | "LINK" | "DOC";
  url: string;
  classId: string;
}) => {
  try {
    const response = await apiClient.post(`/materials`, materialData);
    return response.data;
  } catch (error) {
    console.error("Failed to create material:", error);
    throw error;
  }
};

const listMaterial = async (classId: string) => {
  try {
    const response = await apiClient.get(`/materials?classId=${classId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to list materials:", error);
    throw error;
  }
};

const listMaterialByAdmin = async (classId: string) => {
  try {
    const response = await apiClient.post(`/materials/getMaterials`, { classId });
    return response.data;
  } catch (error) {
    console.error("Failed to list materials:", error);
    throw error;
  }
};

const deleteMaterial = async (id: string) => {
  try {
    const response = await apiClient.delete(`/materials/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete material:", error);
    throw error;
  }
};

const updateMaterial = async (
  id: string,
  materialData: {
    title?: string;
    description?: string;
    type?: "PDF" | "VIDEO" | "LINK" | "DOC";
    url?: string;
  }
) => {
  try {
    const response = await apiClient.put(`/materials/${id}`, materialData);
    return response.data;
  } catch (error) {
    console.error("Failed to update material:", error);
    throw error;
  }
};

export default { createMaterial, listMaterial, deleteMaterial, updateMaterial, listMaterialByAdmin };