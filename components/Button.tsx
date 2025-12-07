import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "px-6 py-3 rounded-full font-bold tracking-widest uppercase text-sm transition-all duration-300 transform active:scale-95";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.4)]",
    secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600",
    outline: "bg-transparent text-white border border-white/40 hover:bg-white/10 backdrop-blur-sm"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};