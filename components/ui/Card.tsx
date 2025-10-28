
import React from 'react';

interface CardProps {
  className?: string;
  // FIX: Explicitly added the 'children' prop to solve type errors. In modern React with TypeScript, 'children' must be explicitly defined in component props, as it is no longer implicitly provided by React.FC.
  children: React.ReactNode;
}

// FIX: Changed to React.FC to correctly handle the 'key' prop when used in lists.
const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;