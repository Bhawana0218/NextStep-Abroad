import api from "./api";
import { LoginPayload, AuthUser } from "@/types/auth.types";

type LoginResponse = Omit<AuthUser, "token"> & {
  token?: string;
  accessToken?: string;
};

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthUser> => {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  const data = response.data;
  const token = data.accessToken ?? data.token;

  if (!token) {
    throw new Error("Login succeeded but token is missing in response.");
  }

  return {
    ...data,
    token,
  };
};
