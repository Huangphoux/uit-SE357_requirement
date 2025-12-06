import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ValidatedInput from '@/pages/ValidatedInput';
import LoadingButton from '@/pages/LoadingButton';
import { commonRules } from '@/utils/validation';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

interface StudentRegistrationProps {
  onShowLogin: () => void;
}

export default function StudentRegistration({ onShowLogin }: StudentRegistrationProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    setLoading(false);

    if (!success) {
      toast.error('Email already exists');
    } else {
      toast.success('Registration successful!');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#0056b3' }}>
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-[#0056b3]">Create Student Account</h1>
        </div>

        {/* Registration Form */}
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name with Live Validation */}
            <ValidatedInput
              label="Full Name"
              value={formData.name}
              onChange={(value) => handleChange('name', value)}
              validation={{ required: true, minLength: 2, maxLength: 100 }}
              placeholder="John Doe"
              disabled={loading}
            />

            {/* Email with Live Validation */}
            <ValidatedInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              validation={commonRules.email}
              placeholder="your.email@example.com"
              disabled={loading}
            />

            {/* Phone with Live Validation */}
            <ValidatedInput
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(value) => handleChange('phone', value)}
              validation={{ 
                required: true, 
                pattern: /^[0-9]{10,11}$/,
                custom: (value) => {
                  if (!/^[0-9]+$/.test(value)) {
                    return 'Phone number must contain only digits';
                  }
                  if (value.length < 10) {
                    return 'Phone number must be at least 10 digits';
                  }
                  return null;
                }
              }}
              placeholder="0123456789"
              disabled={loading}
            />

            {/* Password with Live Validation */}
            <ValidatedInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              validation={{ 
                required: true, 
                minLength: 8,
                custom: (value) => {
                  if (value.length < 8) {
                    return 'Password must be at least 8 characters';
                  }
                  return null;
                }
              }}
              placeholder="Min 8 characters"
              disabled={loading}
              helperText="Min 8 characters"
            />

            {/* Confirm Password with Live Validation */}
            <ValidatedInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              validation={{ 
                required: true,
                custom: (value) => {
                  if (value !== formData.password) {
                    return 'Passwords do not match';
                  }
                  return null;
                }
              }}
              placeholder="Re-enter your password"
              disabled={loading}
            />

            {/* Submit Button with Loading State */}
            <LoadingButton
              loading={loading}
              loadingText="Registering..."
              onClick={handleSubmit}
              type="submit"
              className="w-full px-4 py-2.5 rounded-md text-white hover:opacity-90 transition-opacity mt-6"
              style={{ backgroundColor: '#0056b3' }}
            >
              Register
            </LoadingButton>

            {/* Back to Login */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onShowLogin}
                className="text-[#0056b3] hover:underline"
                style={{ fontSize: '0.875rem' }}
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