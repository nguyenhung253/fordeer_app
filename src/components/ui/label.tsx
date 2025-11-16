import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const { className, ...otherProps } = props;

  const baseClasses =
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

  const finalClasses = cn(baseClasses, className);

  return <label ref={ref} className={finalClasses} {...otherProps} />;
});
Label.displayName = "Label";

export { Label };
