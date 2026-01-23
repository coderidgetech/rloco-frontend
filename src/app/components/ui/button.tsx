import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary - Brand color (Brown/Gold) - Main CTAs
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
        
        // Accent - Brown/Gold - Important secondary actions (same as primary for brand consistency)
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm hover:shadow-md",
        
        // Outline - Bordered with hover fill
        outline: "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
        
        // Ghost - Minimal with hover background
        ghost: "hover:bg-muted hover:text-foreground",
        
        // Secondary - Light background
        secondary: "bg-muted text-foreground hover:bg-muted/80",
        
        // Destructive - For dangerous actions
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        
        // Link - Text only
        link: "text-primary underline-offset-4 hover:underline",
        
        // White - For dark backgrounds (like Hero)
        white: "bg-white text-black hover:bg-white/90 shadow-xl hover:shadow-2xl",
      },
      size: {
        sm: "h-9 px-4 py-2 text-sm",
        default: "h-11 px-6 py-3 text-base",
        lg: "h-14 px-10 py-4 text-base md:text-lg",
        xl: "h-16 px-12 py-4 text-lg",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };