import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  animate?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  animate = false
}) => {
  const baseStyles = "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border";
  
  const variants = {
    default: "bg-gray-800 text-gray-300 border-gray-700",
    success: "bg-green-900/30 text-green-400 border-green-900",
    warning: "bg-yellow-900/30 text-yellow-400 border-yellow-900",
    error: "bg-red-900/30 text-red-400 border-red-900",
    info: "bg-blue-900/30 text-blue-400 border-blue-900",
    outline: "bg-transparent text-gray-400 border-gray-700"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${animate ? 'animate-pulse' : ''} ${className}`}>
      {children}
    </span>
  );
};