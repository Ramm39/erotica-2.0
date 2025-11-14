import React, { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-card',
    elevated: 'bg-card shadow-lg',
    outlined: 'bg-card border border-bgSecondary',
  };

  return (
    <div
      className={cn('rounded-lg p-4', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

