import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon,
  className = '', 
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400">
            <Icon size={20} />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 
            ${Icon ? 'pl-10' : ''}
            bg-white border border-secondary-300 
            rounded-lg text-secondary-900 
            placeholder:text-secondary-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-secondary-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
