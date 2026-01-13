"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { login } from "@/modules/auth/auth.service";
import { useUserStore } from "@/store/user.store";
import { useRoleStore } from "@/store/role.store";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null);
      
      console.log("🔐 Attempting login for:", data.email);
      const response = await login(data);
      
      // Store user and token in state and localStorage
      setUser(response.user);
      setToken(response.token);
      
      // Clear any previously selected role so user must select again
      const roleStore = useRoleStore.getState();
      roleStore.clearRole();
      
      console.log("✅ Login successful, redirecting to role selection...");
      
      // Small delay to ensure state is saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push("/role-selection");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to login";
      console.error("❌ Login error:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <FormField label="Email" error={errors.email?.message} required>
              <Input type="email" placeholder="you@example.com" {...register("email")} />
            </FormField>
            <FormField label="Password" error={errors.password?.message} required>
              <Input type="password" placeholder="••••••••" {...register("password")} />
            </FormField>
            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

