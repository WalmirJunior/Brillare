import { api } from "./apiService";

export const login = (email: string, password: string) =>
  api.post("/login", { email, password });

export const register = (name: string, email: string, password: string) =>
  api.post("/register", { name, email, password });
