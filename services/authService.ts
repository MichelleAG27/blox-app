import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";

export type LoginPayload = {
  username: string;
  token: string;
};

export const login = async ({ username, token }: LoginPayload) => {
  const response = await axios.get(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const user = response.data.find((u: any) => u.email === username);

  if (!user) throw new Error("Invalid username or token");

  return user;
};