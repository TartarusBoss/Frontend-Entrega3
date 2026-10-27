export type UserRole = "admin" | "user";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};
