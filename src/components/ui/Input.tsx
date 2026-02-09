import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode | LucideIcon;
  endIcon?: React.ReactNode | LucideIcon;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className = '',
  containerClassName = '',
  type = 'text',
  id,
  ...props
}, ref) => {
  // Generate a unique ID if none provided, for accessibility
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isError = !!error;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Start Icon */}
        {StartIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {/* @ts-ignore - Handle both component and element */}
            {typeof StartIcon === 'function' ? <StartIcon size={18} /> : StartIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full bg-bg-input border rounded-lg text-sm text-text-primary transition-all duration-200
            placeholder:text-text-muted
            focus:outline-none focus:ring-2 focus:ring-primary/20
            ${StartIcon ? 'pl-10' : 'px-3'}
            ${EndIcon ? 'pr-10' : 'px-3'}
            py-2.5
            ${isError 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-border focus:border-primary'
            }
            ${className}
          `}
          {...props}
        />

        {/* End Icon */}
        {EndIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {/* @ts-ignore */}
            {typeof EndIcon === 'function' ? <EndIcon size={18} /> : EndIcon}
          </div>
        )}
      </div>

      {/* Helper Text or Error Message */}
      {(error || helperText) && (
        <p className={`text-xs ${isError ? 'text-red-500' : 'text-text-secondary'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
