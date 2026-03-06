import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", padding = "md", hoverEffect = false, children, ...props }, ref) => {
    
    const baseStyles = "bg-charcoal rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.4)] border border-border overflow-hidden text-cool";
    
    const paddings = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverClass = hoverEffect 
      ? "transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,68,255,0.08)] hover:-translate-y-1" 
      : "";

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${paddings[padding]} ${hoverClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
