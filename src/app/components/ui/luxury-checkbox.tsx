import * as React from "react";
import { cn } from "./utils";

interface LuxuryCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const LuxuryCheckbox = React.forwardRef<HTMLInputElement, LuxuryCheckboxProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <label className="flex items-start gap-2.5 cursor-pointer group">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "w-4 h-4 mt-0.5 flex-shrink-0 border border-foreground/20 rounded-sm bg-background cursor-pointer",
            "transition-all duration-200 outline-none",
            "checked:bg-foreground checked:border-foreground",
            "focus:ring-2 focus:ring-foreground/20 focus:ring-offset-1",
            "hover:border-foreground/40",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {(label || children) && (
          <span className="text-sm text-foreground/80 select-none">
            {label || children}
          </span>
        )}
      </label>
    );
  }
);

LuxuryCheckbox.displayName = "LuxuryCheckbox";

export { LuxuryCheckbox };
