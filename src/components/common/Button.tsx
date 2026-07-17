import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  disabled,
  children,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 disabled:cursor-not-allowed',
        size === 'sm' && 'px-2.5 py-1.5 text-xs',
        size === 'md' && 'px-3.5 py-2 text-sm',
        size === 'lg' && 'px-4 py-2.5 text-base',
        variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-500',
        variant === 'secondary' &&
          'border border-gray-200 text-gray-800 bg-white hover:bg-gray-50',
        variant === 'ghost' &&
          'text-primary-700 bg-transparent hover:bg-primary-50',
        className
      )}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading && (
        <span className="mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

export default Button;
