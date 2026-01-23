import * as React from "react";
import { cn } from "./utils";

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function FormGroup({ className, children, ...props }: FormGroupProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean;
}

function FormHelperText({ className, error, children, ...props }: FormHelperTextProps) {
  return (
    <p
      className={cn(
        "text-xs tracking-wide",
        error ? "text-destructive" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export { FormGroup, FormHelperText };
