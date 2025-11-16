import * as React from "react";
import { cn } from "@/lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  const { className, ...otherProps } = props;

  const tableBaseClasses = "w-full caption-bottom text-sm";
  const tableFinalClasses = cn(tableBaseClasses, className);

  return (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={tableFinalClasses} {...otherProps} />
    </div>
  );
});
Table.displayName = "Table";

interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses = "[&_tr]:border-b";
    const finalClasses = cn(baseClasses, className);

    return <thead ref={ref} className={finalClasses} {...otherProps} />;
  }
);
TableHeader.displayName = "TableHeader";

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses = "[&_tr:last-child]:border-0";
    const finalClasses = cn(baseClasses, className);

    return <tbody ref={ref} className={finalClasses} {...otherProps} />;
  }
);
TableBody.displayName = "TableBody";

interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses =
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0";
    const finalClasses = cn(baseClasses, className);

    return <tfoot ref={ref} className={finalClasses} {...otherProps} />;
  }
);
TableFooter.displayName = "TableFooter";

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses =
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted";
    const finalClasses = cn(baseClasses, className);

    return <tr ref={ref} className={finalClasses} {...otherProps} />;
  }
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses =
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]";
    const finalClasses = cn(baseClasses, className);

    return <th ref={ref} className={finalClasses} {...otherProps} />;
  }
);
TableHead.displayName = "TableHead";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  (props, ref) => {
    const { className, ...otherProps } = props;

    const baseClasses =
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]";
    const finalClasses = cn(baseClasses, className);

    return <td ref={ref} className={finalClasses} {...otherProps} />;
  }
);
TableCell.displayName = "TableCell";

interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {
  className?: string;
}

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>((props, ref) => {
  const { className, ...otherProps } = props;

  const baseClasses = "mt-4 text-sm text-muted-foreground";
  const finalClasses = cn(baseClasses, className);

  return <caption ref={ref} className={finalClasses} {...otherProps} />;
});
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
