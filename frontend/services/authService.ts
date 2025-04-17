import { apiRequest } from "./apiService"

export const login = (email: string, password: string) =>
  apiRequest("/login", "POST", { email, password });

export const register = (name: string, email: string, password: string) =>
  apiRequest("/register", "POST", { name, email, password });