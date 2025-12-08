import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { toast } from "sonner";
const API_BASE_URL = "http://localhost:3000/api";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,

  (error: AxiosError) => {
    if (!error.response) {
      toast.error("Network Error: Please check your internet connection.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const errorMessage = (data as any)?.message || `Error status: ${status}`;

    if (status >= 400 && status < 500) {
      console.warn(`[Client Error] Status ${status}: ${errorMessage}`);
      toast.warning(errorMessage);

      return Promise.resolve(error.response);
    } else if (status >= 500) {
      console.error(`[Server Error] Status ${status}: ${errorMessage}`, error);

      toast.error("Server is temporarily unavailable. Please try again later.");

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
