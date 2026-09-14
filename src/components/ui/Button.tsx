import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'outline-light' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const SIZES = {
  sm: 'text-[11px] py-2.5 px-5 min-h-[44px]',
  md: 'text-xs py-3 px-7 min-h-[48px]',
  lg: 'text-xs sm:text-[13px] py-4 px-9 min-h-[54px]'
};

const VARIANTS = {
  primary:
    'bg-primary text-on-primary border border-primary hover:bg-primary-container hover:border-primary-container shadow-[0_10px_30px_-12px_rgba(43,0,24,0.55)]',
  gold:
    'bg-gold text-primary border border-gold hover:bg-gold-light hover:border-gold-light shadow-[0_10px_30px_-12px_rgba(197,160,89,0.7)]',
  outline:
    'bg-transparent text-primary border border-gold hover:bg-primary hover:text-on-primary hover:border-primary',
  'outline-light':
    'bg-transparent text-on-primary border border-gold/70 hover:bg-gold hover:text-primary hover:border-gold'
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const reduce = useReducedMotion();

  if (variant === 'tertiary') {
    return (
      <button
        className={`link-gold group font-label text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-primary hover:text-secondary transition-colors duration-200 py-2 disabled:opacity-50 ${className}`}
        disabled={disabled}
        {...props}
      >
        <span>{children}</span>
        {icon && (
          <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-[3px] font-label font-semibold uppercase tracking-[0.2em] transition-[background-color,border-color,color,box-shadow] duration-300 select-none disabled:opacity-50 disabled:cursor-not-allowed ${SIZES[size]} ${VARIANTS[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </motion.button>
  );
};
