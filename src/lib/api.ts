import { config } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'rwid_session';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function getSession() {
  try {
    const session = await AsyncStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await getSession();
  const url = `${config.apiUrl}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `HTTP ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

