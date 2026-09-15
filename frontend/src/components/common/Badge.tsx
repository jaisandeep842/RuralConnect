import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'saffron' | 'verified' | 'outline' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    brand: 'bg-brand-50 text-brand-800 border-brand-200',
    saffron: 'bg-saffron-100 text-saffron-900 border-saffron-300',
    verified: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-black tracking-wide',
    outline: 'bg-white text-slate-700 border-slate-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
