const API_BASE_URL = "http://ec2-54-234-196-249.compute-1.amazonaws.com:3001";



export async function apiRequest<T = any>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erro na requisição");
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, "GET", undefined, token),

  post: <T>(endpoint: string, data: any, token?: string) =>
    apiRequest<T>(endpoint, "POST", data, token),

  put: <T>(endpoint: string, data: any, token?: string) =>
    apiRequest<T>(endpoint, "PUT", data, token),

  delete: <T>(endpoint: string, token?: string) =>
    apiRequest<T>(endpoint, "DELETE", undefined, token),
};
