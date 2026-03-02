export interface LoginPayload {
  username: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}