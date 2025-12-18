export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  email?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateField(value: any, rules: ValidationRule): ValidationResult {
  // Required check
  if (rules.required && (!value || value.toString().trim() === '')) {
    return { isValid: false, error: 'This field is required' };
  }

  // If not required and empty, it's valid
  if (!value || value.toString().trim() === '') {
    return { isValid: true, error: null };
  }

  const stringValue = value.toString();

  // Email validation
  if (rules.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(stringValue)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
  }

  // Min length
  if (rules.minLength && stringValue.length < rules.minLength) {
    return { isValid: false, error: `Must be at least ${rules.minLength} characters` };
  }

  // Max length
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return { isValid: false, error: `Must be no more than ${rules.maxLength} characters` };
  }

  // Pattern
  if (rules.pattern && !rules.pattern.test(stringValue)) {
    return { isValid: false, error: 'Invalid format' };
  }

  // Min value (for numbers)
  if (rules.min !== undefined && Number(value) < rules.min) {
    return { isValid: false, error: `Must be at least ${rules.min}` };
  }

  // Max value (for numbers)
  if (rules.max !== undefined && Number(value) > rules.max) {
    return { isValid: false, error: `Must be no more than ${rules.max}` };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true, error: null };
}

export function validateForm(formData: Record<string, any>, rules: Record<string, ValidationRule>): {
  isValid: boolean;
  errors: Record<string, string | null>;
} {
  const errors: Record<string, string | null> = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const result = validateField(formData[field], rules[field]);
    errors[field] = result.error;
    if (!result.isValid) {
      isValid = false;
    }
  });

  return { isValid, errors };
}

// Common validation rules
export const commonRules = {
  email: { required: true, email: true },
  password: { required: true, minLength: 6 },
  courseCode: { 
    required: true, 
    pattern: /^[A-Z0-9]+$/,
    minLength: 3,
    maxLength: 10
  },
  courseName: { required: true, minLength: 3, maxLength: 100 },
  capacity: { required: true, min: 1, max: 1000 },
  points: { required: true, min: 0, max: 1000 },
  futureDate: {
    required: true,
    custom: (value: string) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        return 'Date must be in the future';
      }
      return null;
    }
  }
};