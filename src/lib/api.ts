// Lightweight fetch-based API client for connecting Frontend to NestJS Backend

const BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api";

interface RequestOptions extends RequestInit {
  bodyData?: any;
}

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { bodyData, headers, ...restOptions } = options;
  const url = `${BASE_URL}/${endpoint.replace(/^\//, "")}`;

  const requestHeaders = new Headers(headers);

  // Retrieve token from zustand localStorage persistent storage
  try {
    const authStorageStr = localStorage.getItem("auth-storage");
    if (authStorageStr) {
      const authState = JSON.parse(authStorageStr);
      const token = authState?.state?.token;
      if (token && token !== "mock_jwt_token") {
        requestHeaders.set("Authorization", `Bearer ${token}`);
      }
    }
  } catch (error) {
    console.error("Failed to parse auth token from localStorage", error);
  }

  // Set default body headers
  let body: string | undefined;
  if (bodyData) {
    requestHeaders.set("Content-Type", "application/json");
    body = JSON.stringify(bodyData);
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
    body,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody?.message || `HTTP error! Status: ${response.status}`;
    throw new Error(message);
  }

  // 204 No Content has no JSON response
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "POST", bodyData: body }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "PUT", bodyData: body }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "PATCH", bodyData: body }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
