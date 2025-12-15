import React, { useState, useRef } from "react";
import ValidatedInput from "@/pages/ValidatedInput";
import LoadingButton from "@/pages/LoadingButton";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import auth from "@/service/auth";
import { useNavigate } from "react-router-dom";

interface StudentRegistrationProps {
  onShowLogin: () => void;
}

export default function StudentRegistration({ onShowLogin }: StudentRegistrationProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  
  // Dùng ref để lưu validity state real-time
  const fieldValidityRef = useRef({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  
  const navigate = useNavigate();

  // Validate toàn bộ form
  const validateAllFields = (): boolean => {
    const { name, email, password, confirmPassword } = formData;
    
    // Validate Name
    if (!name.trim() || name.length > 100) {
      toast.error("Please enter a valid name");
      return false;
    }
    
    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Invalid email format");
      return false;
    }
    
    // Validate Password
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must include at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("Password must include at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Password must include at least one number");
      return false;
    }
    if (!/[@$!%*?&]/.test(password)) {
      toast.error("Password must include at least one special character");
      return false;
    }
    
    // Validate Confirm Password
    if (!confirmPassword) {
      toast.error("Password confirmation is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      // Validate toàn bộ form trước khi submit
      if (!validateAllFields()) {
        return;
      }

      setLoading(true);

      const success = await auth.RegisterAPI({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      setLoading(false);

      if (success.ok) {
        toast.success("Registration successful!");
        navigate("/");
        onShowLogin();
      } else {
        toast.error("Email already exists");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleValidityChange = (field: string, isValid: boolean) => {
    fieldValidityRef.current = {
      ...fieldValidityRef.current,
      [field]: isValid,
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: "#0056b3" }}
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#0056b3]">Create Student Account</h1>
        </div>

        {/* Registration Form */}
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name - Giống BE: min 1, max 100 */}
            <ValidatedInput
              label="Full Name"
              value={formData.name}
              onChange={(value) => handleChange("name", value)}
              onValidityChange={(isValid) => handleValidityChange("name", isValid)}
              validation={{
                required: true,
                minLength: 1,
                maxLength: 100,
                custom: (value) => {
                  if (!value.trim()) return "Name is required";
                  if (value.length > 100) return "Name must not exceed 100 characters";
                  return null;
                },
              }}
              placeholder="John Doe"
              disabled={loading}
            />

            {/* Email - Giống BE: z.email() */}
            <ValidatedInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => handleChange("email", value)}
              onValidityChange={(isValid) => handleValidityChange("email", isValid)}
              validation={{
                required: true,
                custom: (value) => {
                  // Email regex giống z.email()
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(value.trim())) {
                    return "Invalid email format";
                  }
                  return null;
                },
              }}
              placeholder="your.email@example.com"
              disabled={loading}
            />

            {/* Password - Giống BE: passwordSchema */}
            <ValidatedInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleChange("password", value)}
              onValidityChange={(isValid) => handleValidityChange("password", isValid)}
              validation={{
                required: true,
                custom: (value) => {
                  // Min 8 characters
                  if (value.length < 8) {
                    return "Password must be at least 8 characters long";
                  }
                  // At least one uppercase
                  if (!/[A-Z]/.test(value)) {
                    return "Password must include at least one uppercase letter";
                  }
                  // At least one lowercase
                  if (!/[a-z]/.test(value)) {
                    return "Password must include at least one lowercase letter";
                  }
                  // At least one number
                  if (!/[0-9]/.test(value)) {
                    return "Password must include at least one number";
                  }
                  // At least one special character
                  if (!/[@$!%*?&]/.test(value)) {
                    return "Password must include at least one special character";
                  }
                  return null;
                },
              }}
              placeholder="Min 8 characters"
              disabled={loading}
              helperText="At least 8 characters, uppercase, lowercase, number & special character"
            />

            {/* Confirm Password - Giống BE: refine passwords match */}
            <ValidatedInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => handleChange("confirmPassword", value)}
              onValidityChange={(isValid) => handleValidityChange("confirmPassword", isValid)}
              validation={{
                required: true,
                custom: (value) => {
                  if (!value) {
                    return "Password confirmation is required";
                  }
                  if (value !== formData.password) {
                    return "Passwords do not match";
                  }
                  return null;
                },
              }}
              placeholder="Re-enter your password"
              disabled={loading}
            />

            {/* Submit Button */}
            <LoadingButton
              loading={loading}
              loadingText="Registering..."
              onClick={handleSubmit}
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-md text-white hover:opacity-90 transition-opacity mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#0056b3" }}
            >
              Register
            </LoadingButton>

            {/* Back to Login */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onShowLogin}
                className="text-[#0056b3] hover:underline"
                style={{ fontSize: "0.875rem" }}
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}