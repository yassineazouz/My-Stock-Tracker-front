export interface AuthUser {
  username: string;
  displayName: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  displayName: string;
  email: string;
  password: string;
}
