import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  className?: string;
}

function Badge(props: BadgeProps) {
  const { className, variant = "default", ...otherProps } = props;

  let variantClasses = "";

  switch (variant) {
    case "default":
      variantClasses =
        "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80";
      break;
    case "secondary":
      variantClasses =
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80";
      break;
    case "destructive":
      variantClasses =
        "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80";
      break;
    case "outline":
      variantClasses = "text-foreground";
      break;
  }

  const baseClasses =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const finalClasses = cn(baseClasses, variantClasses, className);

  return <div className={finalClasses} {...otherProps} />;
}

export { Badge };
