import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
  const { className, ...otherProps } = props;

  const baseClasses = "rounded-xl border bg-card text-card-foreground shadow";
  const finalClasses = cn(baseClasses, className);

  return <div ref={ref} className={finalClasses} {...otherProps} />;
});
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses = "flex flex-col space-y-1.5 p-6";
    const finalClasses = cn(baseClasses, className);

    return <div ref={ref} className={finalClasses} {...otherProps} />;
  }
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses = "font-semibold leading-none tracking-tight";
    const finalClasses = cn(baseClasses, className);

    return <h3 ref={ref} className={finalClasses} {...otherProps} />;
  }
);
CardTitle.displayName = "CardTitle";

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>((props, ref) => {
  const { className, ...otherProps } = props;

  const baseClasses = "text-sm text-muted-foreground";
  const finalClasses = cn(baseClasses, className);

  return <p ref={ref} className={finalClasses} {...otherProps} />;
});
CardDescription.displayName = "CardDescription";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses = "p-6 pt-0";
    const finalClasses = cn(baseClasses, className);

    return <div ref={ref} className={finalClasses} {...otherProps} />;
  }
);
CardContent.displayName = "CardContent";

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses = "flex items-center p-6 pt-0";
    const finalClasses = cn(baseClasses, className);

    return <div ref={ref} className={finalClasses} {...otherProps} />;
  }
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
