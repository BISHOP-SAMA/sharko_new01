import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
}

const ComicButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    const variants = {
      primary: "bg-[#38bdf8] text-white hover:bg-[#0ea5e9]",
      secondary: "bg-white text-black hover:bg-gray-50",
      accent: "bg-[#ec4899] text-white hover:bg-[#db2777]"
    };

    const sizes = {
      sm: "px-4 py-2 text-lg",
      md: "px-6 py-3 text-xl",
      lg: "px-8 py-4 text-2xl"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative font-[Bangers] tracking-wider uppercase transition-all duration-200",
          "border-2 border-black rounded-xl",
          "comic-shadow comic-shadow-hover comic-shadow-active",
          variants[variant],
          sizes[size],
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ComicButton.displayName = "ComicButton"

export { ComicButton }
