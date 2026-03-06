import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg" | "full";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm font-sans uppercase";
    
    const variants = {
      primary: "bg-royal text-white hover:bg-royal-hover hover:shadow-[0_0_20px_rgba(0,68,255,0.3)]",
      secondary: "bg-white/10 text-white hover:bg-white/20 hover:shadow-md backdrop-blur-sm",
      outline: "border border-white/20 text-gray-300 hover:text-white hover:bg-white/5 hover:border-white/40",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base min-h-[48px]",
      lg: "px-8 py-4 text-lg min-h-[56px]",
      full: "w-full px-6 py-3 text-base min-h-[56px]"
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
