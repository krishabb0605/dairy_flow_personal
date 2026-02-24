import * as React from 'react';

export type BadgeVariant = 'primary' | 'gray' | 'danger' | 'success' | 'warning';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant: BadgeVariant;
  icon?: boolean;
};

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary/15 text-primary',
  gray: 'bg-slate-100 text-slate-600',
  danger: 'bg-red-100 text-red-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
};

const dotClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary',
  gray: 'bg-slate-400',
  danger: 'bg-red-600',
  success: 'bg-green-600',
  warning: 'bg-amber-600',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant, icon = false, children, ...props }, ref) => {
    const classes = [
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
      variantClasses[variant],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classes} {...props}>
        {icon && (
          <span
            aria-hidden='true'
            className={`h-2 w-2 rounded-full ${dotClasses[variant]}`}
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
