import { User } from "./../../../server/node_modules/.prisma/client/index.d";
import apiClient from "@/api/axios";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  password_confirmation: string;
}

interface LoginResponse {
  ok: boolean;
  message: string;
  data: User;
}

interface RegisterResponse {
  ok: boolean;
  message: string;
  data: User;
}

const LoginAPI = async ({ email, password }: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

const RegisterAPI = async ({
  email,
  password,
  name,
  password_confirmation,
}: RegisterCredentials): Promise<RegisterResponse> => {
  const response = await apiClient.post("/auth/register", {
    email,
    password,
    name,
    password_confirmation,
  });
  return response.data;
};

export default { LoginAPI, RegisterAPI };
