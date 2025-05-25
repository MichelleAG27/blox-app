import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users?per_page=10&page=1`);
    return {
      data: response.data,
      total: parseInt(response.headers["x-pagination-total"], 10),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts?per_page=10&page=1`);
    return {
      data: response.data,
      total: parseInt(response.headers["x-pagination-total"], 10),
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
