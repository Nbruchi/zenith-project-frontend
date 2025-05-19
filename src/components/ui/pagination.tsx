
import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Pagination = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-center space-x-6", className)} {...props} />
);

const PaginationContent = ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn("flex flex-wrap items-center gap-1", className)} {...props} />
);

const PaginationItem = ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li className={cn("", className)} {...props} />
);

type PaginationLinkProps = {
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
} & React.HTMLAttributes<HTMLButtonElement>;

const PaginationLink = ({
  className,
  isActive,
  children,
  disabled = false,
  onClick,
  ...props
}: PaginationLinkProps) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "h-9 w-9 p-0 font-medium",
      isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "bg-transparent hover:bg-muted hover:text-foreground",
      disabled && "pointer-events-none opacity-50",
      className
    )}
    variant={isActive ? "default" : "ghost"}
    {...props}
  >
    {children}
  </Button>
);

const PaginationPrevious = ({
  className,
  onClick,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
);

const PaginationNext = ({
  className,
  onClick,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

const PaginationFirst = ({
  className,
  onClick,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to first page"
    className={cn("", className)}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    <ChevronsLeft className="h-4 w-4" />
  </PaginationLink>
);

const PaginationLast = ({
  className,
  onClick,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to last page"
    className={cn("", className)}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    <ChevronsRight className="h-4 w-4" />
  </PaginationLink>
);

const PaginationEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    ...
  </span>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
};
