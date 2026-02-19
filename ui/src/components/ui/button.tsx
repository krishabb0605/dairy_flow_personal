import * as React from 'react';

type ButtonVariant =
  | 'unstyled'
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'soft'
  | 'soft-primary'
  | 'neutral'
  | 'outline-muted'
  | 'outline-neutral'
  | 'secondary-muted'
  | 'danger-outline'
  | 'success-soft'
  | 'link'
  | 'link-muted'
  | 'link-danger'
  | 'link-subtle'
  | 'link-gray'
  | 'ghost-muted'
  | 'ghost-primary'
  | 'ghost-list'
  | 'soft-muted'
  | 'danger'
  | 'warning'
  | 'success'
  | 'gradient';

type ButtonSize = 'none' | 'sm' | 'md' | 'lg' | 'icon';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  unstyled: '',
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  outline:
    'bg-white border border-primary/20 text-slate-700 hover:bg-primary/5',
  ghost: 'bg-transparent text-slate-700 hover:bg-primary/10',
  soft: 'bg-primary/20 text-slate-700 hover:bg-primary/30',
  'soft-primary': 'bg-primary/10 text-primary hover:bg-primary/20',
  neutral:
    'bg-gray-100 text-[#111418] border border-transparent hover:border-gray-300',
  'outline-muted':
    'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50',
  'outline-neutral':
    'bg-white border border-[#f0f2f4] text-[#111418] hover:bg-gray-50',
  'secondary-muted':
    'bg-slate-100 text-[#637588] border border-[#f0f2f4] hover:bg-white',
  'danger-outline': 'border border-red-500 text-red-500 hover:bg-red-50',
  'success-soft':
    'bg-green-100 text-green-700 hover:bg-green-800 hover:text-white',
  link: 'bg-transparent text-primary hover:underline',
  'link-muted': 'bg-transparent text-[#637588] hover:text-primary',
  'link-danger': 'bg-transparent text-red-500 hover:underline',
  'link-subtle': 'bg-transparent text-slate-400 hover:text-primary',
  'link-gray': 'bg-transparent text-gray-500 hover:text-gray-700',
  'ghost-muted': 'bg-transparent text-[#637588] hover:bg-gray-100',
  'ghost-primary':
    'bg-transparent text-slate-700 hover:bg-primary/10 hover:text-primary',
  'ghost-list': 'bg-transparent text-slate-700 hover:bg-slate-50',
  'soft-muted': 'bg-primary/10 text-slate-700 hover:bg-primary/20',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-orange-600 text-white hover:bg-orange-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  gradient:
    'bg-linear-to-r from-[#1f6fe8] to-[#42a5ff] text-white hover:opacity-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  none: '',
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10 p-0',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant,
      size = 'none',
      type = 'button',
      disabled,
      ...props
    },
    ref,
  ) => {
    const classes = [
      'disabled:opacity-60 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export default Button;
