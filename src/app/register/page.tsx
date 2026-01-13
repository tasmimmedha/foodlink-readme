"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { register } from "@/modules/auth/auth.service";
import { useUserStore } from "@/store/user.store";
import { useRoleStore } from "@/store/role.store";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      const { confirmPassword, ...registerData } = data;
      
      console.log("📝 Registering new user:", registerData.email);
      const response = await register(registerData);
      
      // Store user and token in state and localStorage
      setUser(response.user);
      setToken(response.token);
      
      // Clear any previously selected role so user must select again
      const roleStore = useRoleStore.getState();
      roleStore.clearRole();
      
      console.log("✅ Registration successful, redirecting to role selection...");
      
      // Small delay to ensure state is saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push("/role-selection");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to register";
      console.error("❌ Registration error:", errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up to start managing your food inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <FormField label="Name" error={errors.name?.message} required>
              <Input placeholder="John Doe" {...registerField("name")} />
            </FormField>
            <FormField label="Email" error={errors.email?.message} required>
              <Input type="email" placeholder="you@example.com" {...registerField("email")} />
            </FormField>
            <FormField label="Password" error={errors.password?.message} required>
              <Input type="password" placeholder="••••••••" {...registerField("password")} />
            </FormField>
            <FormField
              label="Confirm Password"
              error={errors.confirmPassword?.message}
              required
            >
              <Input
                type="password"
                placeholder="••••••••"
                {...registerField("confirmPassword")}
              />
            </FormField>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

