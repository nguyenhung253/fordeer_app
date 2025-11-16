import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChartConfig {
  [key: string]: {
    label?: string;
    color?: string;
  };
}

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
  children: React.ReactNode;
  className?: string;
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  (props, ref) => {
    const { config, children, className, ...otherProps } = props;

    const baseClasses = "w-full";
    const finalClasses = cn(baseClasses, className);

    return (
      <div ref={ref} className={finalClasses} {...otherProps}>
        {children}
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    [key: string]: any;
  }>;
  label?: string;
}

function ChartTooltip(props: ChartTooltipProps) {
  const { active, payload, label } = props;

  const hasData = active && payload && payload.length > 0;

  if (!hasData) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            {label}
          </span>
          {payload.map((entry, index) => {
            const formattedValue = entry.value.toLocaleString();

            return (
              <span key={index} className="font-bold text-foreground">
                {formattedValue}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ChartTooltipContent = ChartTooltip;

export { ChartContainer, ChartTooltip, ChartTooltipContent };
