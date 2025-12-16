import React, { useState } from "react";
import { useAuth, User } from "@/contexts/AuthContext";
import ValidatedInput from "@/pages/ValidatedInput";
import LoadingButton from "@/pages/LoadingButton";
import { commonRules } from "@/utils/validation";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import auth from "@/service/auth";

interface LoginProps {
  onShowRegister: () => void;
}

export default function Login({ onShowRegister }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const success = await auth.LoginAPI({ email, password });
      if (success.ok) {
        toast.success("Login successful!");

        await login(success.data as any);
        setLoading(false);
      } else {
        toast.error("Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      toast.error("An error occurred during login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#0056b3] flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#0056b3]">English Center Management System</h1>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <h2 className="text-center mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field with Live Validation */}
            <ValidatedInput
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              validation={commonRules.email}
              placeholder="your.email@example.com"
              disabled={loading}
            />

            {/* Password Field with Live Validation */}
            <ValidatedInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              validation={{ required: true, minLength: 1 }}
              placeholder="Enter your password"
              disabled={loading}
            />

            {/* Submit Button with Loading State */}
            <LoadingButton
              loading={loading}
              loadingText="Signing in..."
              onClick={handleSubmit}
              type="submit"
              className="w-full px-4 py-2.5 rounded-md text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#0056b3" }}
            >
              Sign In
            </LoadingButton>

            {/* Links */}
            <div className="space-y-2 text-center">
              {/* <a
                href="#"
                className="block text-[#0056b3] hover:underline"
                style={{ fontSize: "0.875rem" }}
              >
                Forgot Password?
              </a> */}
              <button
                type="button"
                onClick={onShowRegister}
                className="block w-full text-[#0056b3] hover:underline"
                style={{ fontSize: "0.875rem" }}
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-muted-foreground text-center mb-2" style={{ fontSize: "0.75rem" }}>
              Demo Credentials:
            </p>
            <div className="space-y-1 text-center" style={{ fontSize: "0.75rem" }}>
              <p className="text-muted-foreground">Admin: admin@example.com / Admin123!</p>
              <p className="text-muted-foreground">
                Teacher: teacher1@example.com / Teacher123!
              </p>
              <p className="text-muted-foreground">
                Student: student1@example.com / Student123!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
