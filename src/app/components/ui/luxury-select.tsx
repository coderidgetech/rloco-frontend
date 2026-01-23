import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

interface LuxurySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const LuxurySelect = React.forwardRef<HTMLSelectElement, LuxurySelectProps>(
  ({ className, label, error, helperText, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-foreground/90 mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full px-3 py-2.5 pr-10 border border-foreground/15 rounded-sm bg-background text-foreground text-sm appearance-none",
              "transition-all duration-200 outline-none cursor-pointer",
              "focus:border-foreground/40",
              "hover:border-foreground/25",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-foreground/5",
              error && "border-destructive/50 focus:border-destructive",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown 
            size={16} 
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40"
          />
        </div>
        {(error || helperText) && (
          <p className={cn(
            "text-xs mt-1.5",
            error ? "text-destructive" : "text-foreground/50"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

LuxurySelect.displayName = "LuxurySelect";

export { LuxurySelect };