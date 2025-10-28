import React from 'react';

// Fix: Changed to a type intersection to correctly inherit all HTML input attributes.
type InputProps = {
  label: string;
  id: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ label, id, error, ...props }: InputProps) => {
  const errorClasses = 'border-danger focus:ring-danger focus:border-danger';
  const defaultClasses = 'bg-card-light text-neutral border-gray-300 dark:border-gray-600 dark:bg-card-dark dark:text-text-dark focus:ring-primary focus:border-primary';
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none sm:text-sm ${error ? errorClasses : defaultClasses}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default Input;