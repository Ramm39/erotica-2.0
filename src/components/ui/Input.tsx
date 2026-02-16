import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId =
      id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-textSecondary mb-1"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}               // 🔴 REQUIRED
          id={inputId}
          {...props}              // 🔴 REQUIRED
          className={cn(
            'w-full px-4 py-2 bg-card border border-bgSecondary rounded-lg',
            'text-text placeholder:text-textMuted',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-danger focus:ring-danger',
            className
          )}
        />

        {error && (
          <p className="mt-1 text-sm text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
