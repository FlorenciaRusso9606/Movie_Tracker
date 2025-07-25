import { ForwardedRef, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface TextAreaProps {
  name: string;
  label?: string;
  error?: FieldError;
  rows?: number;
  placeholder?: string;
  className?: string;
}

export const TextArea = forwardRef(
  (
    { name, label, error, rows = 3, placeholder, className = '', ...props }: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label htmlFor={name} className="block text-gray-300 mb-1">
            {label}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          ref={ref}
          rows={rows}
          placeholder={placeholder}
          className={`w-full p-2 rounded bg-gray-700 text-white border ${
            error ? 'border-red-500' : 'border-gray-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          {...props}
        />
        {error && <p className="text-red-400 text-sm mt-1">{error.message}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';