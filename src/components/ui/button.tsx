import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {
      className,
      variant = "default",
      size = "default",
      ...otherProps
    } = props;

    let variantClasses = "";
    switch (variant) {
      case "default":
        variantClasses =
          "bg-primary text-primary-foreground shadow hover:bg-primary/90";
        break;
      case "destructive":
        variantClasses =
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90";
        break;
      case "outline":
        variantClasses =
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground";
        break;
      case "secondary":
        variantClasses =
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80";
        break;
      case "ghost":
        variantClasses = "hover:bg-accent hover:text-accent-foreground";
        break;
      case "link":
        variantClasses = "text-primary underline-offset-4 hover:underline";
        break;
    }

    let sizeClasses = "";
    switch (size) {
      case "default":
        sizeClasses = "h-9 px-4 py-2";
        break;
      case "sm":
        sizeClasses = "h-8 rounded-md px-3 text-xs";
        break;
      case "lg":
        sizeClasses = "h-10 rounded-md px-8";
        break;
      case "icon":
        sizeClasses = "h-9 w-9";
        break;
    }

    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors";
    const focusClasses =
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
    const disabledClasses = "disabled:pointer-events-none disabled:opacity-50";
    const iconClasses =
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    const allClasses = cn(
      baseClasses,
      focusClasses,
      disabledClasses,
      iconClasses,
      variantClasses,
      sizeClasses,
      className
    );

    return <button className={allClasses} ref={ref} {...otherProps} />;
  }
);

Button.displayName = "Button";

export { Button };
