import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverEffect = false
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-[#161b22] border border-gray-800 rounded-xl p-5 
        transition-all duration-200 
        ${hoverEffect ? 'hover:border-blue-500/50 hover:bg-[#1c2128] cursor-pointer group relative' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};