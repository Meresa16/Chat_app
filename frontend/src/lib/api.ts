import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Example endpoints
export const getUsers = () => api.get("/users");
export const loginUser = (data: { email: string; password: string }) => api.post("/auth/login", data);
export const registerUser = (data: { name: string; email: string; password: string }) => api.post("/auth/register", data);
