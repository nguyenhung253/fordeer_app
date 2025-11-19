import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(
  undefined
);

function useSelect() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within Select");
  }
  return context;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function Select(props: SelectProps) {
  const { value: controlledValue, onValueChange, children } = props;

  const [internalValue, setInternalValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  let currentValue = internalValue;
  let currentOnValueChange: (value: string) => void = setInternalValue;

  if (controlledValue !== undefined) {
    currentValue = controlledValue;
  }

  if (onValueChange !== undefined) {
    currentOnValueChange = onValueChange;
  }

  const contextValue: SelectContextValue = {
    value: currentValue,
    onValueChange: currentOnValueChange,
    open: open,
    setOpen: setOpen,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (props, ref) => {
    const { className, children, ...otherProps } = props;
    const { open, setOpen } = useSelect();

    function handleClick() {
      setOpen(!open);
    }

    const baseClasses =
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

    const finalClasses = cn(baseClasses, className);

    let chevronClasses = "h-4 w-4 opacity-50 transition-transform";
    if (open) {
      chevronClasses = "h-4 w-4 opacity-50 transition-transform rotate-180";
    }

    return (
      <button
        ref={ref}
        type="button"
        className={finalClasses}
        onClick={handleClick}
        {...otherProps}
      >
        {children}
        <ChevronDown className={chevronClasses} />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
  placeholder?: string;
}

function SelectValue(props: SelectValueProps) {
  const { placeholder } = props;
  const { value } = useSelect();

  let displayText = placeholder;

  if (value) {
    displayText = value;
  }

  return <span>{displayText}</span>;
}
SelectValue.displayName = "SelectValue";

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "popper" | "item-aligned";
  className?: string;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  (props, _forwardedRef) => {
    const { className, children, position = "popper", ...otherProps } = props;
    const { open, setOpen } = useSelect();
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        const target = event.target as Node;

        if (contentRef.current && !contentRef.current.contains(target)) {
          setOpen(false);
        }
      }

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [open, setOpen]);

    React.useEffect(() => {
      function handleEscapeKey(event: KeyboardEvent) {
        if (event.key === "Escape") {
          setOpen(false);
        }
      }

      if (open) {
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
          document.removeEventListener("keydown", handleEscapeKey);
        };
      }
    }, [open, setOpen]);

    if (!open) {
      return null;
    }

    let baseClasses =
      "absolute z-50 mt-1 max-h-96 min-w-[8rem] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95";

    if (position === "popper") {
      baseClasses = baseClasses + " w-full";
    }

    const finalClasses = cn(baseClasses, className);

    return (
      <div ref={contentRef} className={finalClasses} {...otherProps}>
        <div className="p-1">{children}</div>
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  (props, ref) => {
    const { className, children, value: itemValue, ...otherProps } = props;
    const { value, onValueChange, setOpen } = useSelect();

    const isSelected = value === itemValue;

    function handleClick() {
      onValueChange(itemValue);
      setOpen(false);
    }

    let baseClasses =
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground";

    if (isSelected) {
      baseClasses = baseClasses + " bg-accent/50";
    }

    const finalClasses = cn(baseClasses, className);

    return (
      <div
        ref={ref}
        className={finalClasses}
        onClick={handleClick}
        {...otherProps}
      >
        {isSelected && (
          <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
            <Check className="h-4 w-4" />
          </span>
        )}
        {children}
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses = "px-2 py-1.5 text-sm font-semibold";
    const finalClasses = cn(baseClasses, className);

    return <div ref={ref} className={finalClasses} {...otherProps} />;
  }
);
SelectLabel.displayName = "SelectLabel";

interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses = "-mx-1 my-1 h-px bg-muted";
    const finalClasses = cn(baseClasses, className);

    return <div ref={ref} className={finalClasses} {...otherProps} />;
  }
);
SelectSeparator.displayName = "SelectSeparator";

interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function SelectGroup(props: SelectGroupProps) {
  const { children, ...otherProps } = props;

  return <div {...otherProps}>{children}</div>;
}
SelectGroup.displayName = "SelectGroup";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
