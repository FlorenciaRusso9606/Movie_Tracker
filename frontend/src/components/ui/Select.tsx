// components/ui/Select.tsx
import { ForwardedRef, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface SelectProps {
  name: string;
  label?: string;
  error?: FieldError;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export const Select = forwardRef(
  (
    { name, label, error, options, placeholder, className = '', defaultValue = '', ...props }: SelectProps,
    ref: ForwardedRef<HTMLSelectElement>
  ) => {
    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label htmlFor={name} className="block text-gray-300 mb-1">
            {label}
          </label>
        )}
        <select
          id={name}
          name={name}
          ref={ref}
          defaultValue={defaultValue}
          className={`w-full p-2 rounded bg-gray-700 text-white border ${
            error ? 'border-red-500' : 'border-gray-600'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-sm mt-1">{error.message}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';