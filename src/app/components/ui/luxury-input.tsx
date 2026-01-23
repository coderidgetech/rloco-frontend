import * as React from "react";
import { cn } from "./utils";

interface LuxuryInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const LuxuryInput = React.forwardRef<HTMLInputElement, LuxuryInputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-foreground/90 mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2.5 border border-foreground/15 rounded-sm bg-background text-foreground text-sm",
            "placeholder:text-foreground/40",
            "transition-all duration-200 outline-none",
            "focus:border-foreground/40",
            "hover:border-foreground/25",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-foreground/5",
            error && "border-destructive/50 focus:border-destructive",
            className
          )}
          {...props}
        />
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

LuxuryInput.displayName = "LuxuryInput";

export { LuxuryInput };