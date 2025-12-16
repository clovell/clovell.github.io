import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-display font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-roman-red text-white hover:bg-red-800 shadow-md border-2 border-transparent",
    secondary: "bg-roman-gold text-white hover:bg-yellow-700 shadow-md border-2 border-transparent",
    outline: "bg-transparent border-2 border-roman-dark text-roman-dark hover:bg-roman-dark hover:text-white",
    ghost: "bg-transparent text-roman-dark hover:bg-roman-stone/50 hover:underline",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;