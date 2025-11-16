import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(
  undefined
);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog");
  }
  return context;
}

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog(props: DialogProps) {
  const { open: controlledOpen, onOpenChange, children } = props;

  const [internalOpen, setInternalOpen] = React.useState(false);

  let currentOpen = internalOpen;
  let currentOnOpenChange: (open: boolean) => void = setInternalOpen;

  if (controlledOpen !== undefined) {
    currentOpen = controlledOpen;
  }

  if (onOpenChange !== undefined) {
    currentOnOpenChange = onOpenChange;
  }

  const contextValue: DialogContextValue = {
    open: currentOpen,
    onOpenChange: currentOnOpenChange,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
}

interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  className?: string;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  (props, ref) => {
    const { onClick, ...otherProps } = props;
    const { onOpenChange } = useDialog();

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
      onOpenChange(true);

      if (onClick) {
        onClick(event);
      }
    }

    return <button ref={ref} onClick={handleClick} {...otherProps} />;
  }
);
DialogTrigger.displayName = "DialogTrigger";

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;
    const { open } = useDialog();

    if (!open) {
      return null;
    }

    const baseClasses = "fixed inset-0 z-50 bg-black/80 animate-in fade-in-0";
    const finalClasses = cn(baseClasses, className);

    return <div ref={ref} className={finalClasses} {...otherProps} />;
  }
);
DialogOverlay.displayName = "DialogOverlay";

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (props, ref) => {
    const { className, children, ...otherProps } = props;
    const { open, onOpenChange } = useDialog();

    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [open]);

    React.useEffect(() => {
      function handleEscapeKey(event: KeyboardEvent) {
        if (event.key === "Escape") {
          onOpenChange(false);
        }
      }

      if (open) {
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
          document.removeEventListener("keydown", handleEscapeKey);
        };
      }
    }, [open, onOpenChange]);

    if (!open) {
      return null;
    }

    function handleOverlayClick() {
      onOpenChange(false);
    }

    function handleCloseButtonClick() {
      onOpenChange(false);
    }

    const baseClasses =
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg";

    const finalClasses = cn(baseClasses, className);

    return (
      <>
        <DialogOverlay onClick={handleOverlayClick} />
        <div ref={ref} className={finalClasses} {...otherProps}>
          {children}
          <button
            onClick={handleCloseButtonClick}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </>
    );
  }
);
DialogContent.displayName = "DialogContent";

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function DialogHeader(props: DialogHeaderProps) {
  const { className, ...otherProps } = props;

  const baseClasses = "flex flex-col space-y-1.5 text-center sm:text-left";
  const finalClasses = cn(baseClasses, className);

  return <div className={finalClasses} {...otherProps} />;
}
DialogHeader.displayName = "DialogHeader";

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function DialogFooter(props: DialogFooterProps) {
  const { className, ...otherProps } = props;

  const baseClasses =
    "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2";
  const finalClasses = cn(baseClasses, className);

  return <div className={finalClasses} {...otherProps} />;
}
DialogFooter.displayName = "DialogFooter";

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses = "text-lg font-semibold leading-none tracking-tight";
    const finalClasses = cn(baseClasses, className);

    return <h2 ref={ref} className={finalClasses} {...otherProps} />;
  }
);
DialogTitle.displayName = "DialogTitle";

interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>((props, ref) => {
  const { className, ...otherProps } = props;

  const baseClasses = "text-sm text-muted-foreground";
  const finalClasses = cn(baseClasses, className);

  return <p ref={ref} className={finalClasses} {...otherProps} />;
});
DialogDescription.displayName = "DialogDescription";

interface DialogCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  (props, ref) => {
    const { onClick, ...otherProps } = props;
    const { onOpenChange } = useDialog();

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
      onOpenChange(false);

      if (onClick) {
        onClick(event);
      }
    }

    return <button ref={ref} onClick={handleClick} {...otherProps} />;
  }
);
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
