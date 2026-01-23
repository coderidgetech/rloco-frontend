import * as React from "react";
import { cn } from "./utils";

interface LuxuryTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const LuxuryTextarea = React.forwardRef<HTMLTextAreaElement, LuxuryTextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-foreground/90 mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full px-3 py-2.5 border border-foreground/15 rounded-sm bg-background text-foreground text-sm",
            "placeholder:text-foreground/40",
            "transition-all duration-200 outline-none resize-none",
            "focus:border-foreground/40",
            "hover:border-foreground/25",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-foreground/5",
            "min-h-[120px]",
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

LuxuryTextarea.displayName = "LuxuryTextarea";

export { LuxuryTextarea };