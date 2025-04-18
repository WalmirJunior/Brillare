import { api } from "./apiService";

export const getAllProducts = (token?: string) =>
  api.get("/products", token);
