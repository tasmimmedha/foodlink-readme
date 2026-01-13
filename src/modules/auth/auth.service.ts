import { login as serverLogin, register as serverRegister, getCurrentUser } from "@/lib/server";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    householdId?: string;
  };
  token: string;
}

export async function login(data: LoginDto): Promise<AuthResponse> {
  return serverLogin(data);
}

export async function register(data: RegisterDto): Promise<AuthResponse> {
  return serverRegister(data);
}

export async function forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
  // Simulate forgot password - in a real app this would send an email
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { message: "If an account exists with this email, a password reset link has been sent." };
}

export async function resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
  // Simulate reset password - in a real app this would validate the token and update password
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { message: "Password has been reset successfully." };
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
  }
}

