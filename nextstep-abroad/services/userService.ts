import api from "./api";
import { UsersResponse, User } from "@/types/user.types";

export const fetchUsers = async (
  limit = 10,
  skip = 0
): Promise<UsersResponse> => {
  const response = await api.get(
    `/users?limit=${limit}&skip=${skip}`
  );

  return response.data;
};

export const searchUsers = async (
  query: string
): Promise<UsersResponse> => {
  const response = await api.get(
    `/users/search?q=${query}`
  );

  return response.data;
};

export const fetchSingleUser = async (
  id: number
): Promise<User> => {
  const response = await api.get(`/users/${id}`);

  return response.data;
};