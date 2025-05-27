import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";

export type LoginPayload = {
  email: string;
  token: string;
};

export const login = async ({ email, token }: LoginPayload) => {
  const response = await axios.get(`${API_BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const user = response.data.find((u: any) => u.email === email);

  if (!user) throw new Error("Invalid email or token");

  return user;
};