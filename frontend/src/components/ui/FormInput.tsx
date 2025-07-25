import { InputHTMLAttributes, forwardRef } from 'react';

type Props = {
  label: string;
  error?: string;
  className?: string;
   placeholder?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label,type, error, className = '', placeholder,...rest  }, ref) => {
    return (
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-white">
          {label}
        </label>
        <input
        ref={ref} 
          type={type}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${error ? 'border-red-500' : 'border-gray-300'}`}
          {...rest }
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
