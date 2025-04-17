// services/apiService.ts

const API_BASE_URL = "http://localhost:3001";

export async function apiRequest<T = any>(
  endpoint: string,
  method: string = "GET",
  data?: any,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro na requisição");
  }

  return res.json();
}
