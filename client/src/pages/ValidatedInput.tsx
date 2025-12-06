import React, { useState, useEffect } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { validateField, ValidationRule } from '@/utils/validation';

interface ValidatedInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, error: string | null) => void;
  validation?: ValidationRule;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  rows?: number;
  helperText?: string;
}

export default function ValidatedInput({
  label,
  type = 'text',
  value,
  onChange,
  onValidationChange,
  validation = {},
  placeholder,
  disabled = false,
  className = '',
  rows = 4,
  helperText
}: ValidatedInputProps) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (touched || value) {
      const result = validateField(value, validation);
      setError(result.error);
      setIsValid(result.isValid);
      onValidationChange?.(result.isValid, result.error);
    }
  }, [value, touched, validation, onValidationChange]);

  const handleBlur = () => {
    setTouched(true);
  };

  const showValidation = touched && value !== '';
  const showError = showValidation && !isValid;
  const showSuccess = showValidation && isValid;

  const inputClasses = `w-full px-4 py-2 bg-card border rounded-md focus:outline-none focus:ring-2 transition-all ${
    showError 
      ? 'border-red-500 focus:ring-red-500/20' 
      : showSuccess 
      ? 'border-green-500 focus:ring-green-500/20'
      : 'border-border focus:ring-ring'
  } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  const InputElement = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className={className}>
      <label className="block mb-2">
        {label}
        {validation.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <InputElement
          type={type === 'textarea' ? undefined : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          rows={type === 'textarea' ? rows : undefined}
        />
        
        {showValidation && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {isValid ? (
              <Check className="w-5 h-5 text-green-500 animate-fade-in-up" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 animate-fade-in-up" />
            )}
          </div>
        )}
      </div>

      {showError && error && (
        <p className="mt-1 text-red-500 animate-fade-in-up" style={{ fontSize: '0.875rem' }}>
          {error}
        </p>
      )}
      
      {helperText && !showError && (
        <p className="mt-1 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}