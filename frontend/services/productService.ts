import { api } from "./apiService";

export const getAllProducts = (token?: string) =>
  api.get("/products", token);

export const getProductById = (id: string, token?: string) =>
  api.get(`/products/${id}`, token);
