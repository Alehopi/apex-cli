import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

const paginationItemVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-focus focus-visible:ring-offset-2 ring-offset-semantic-offset disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-semantic-border-default bg-semantic-bg-elevated text-semantic-fg-primary hover:bg-semantic-bg-hover',
        active:
          'bg-semantic-action-primary text-semantic-fg-inverse hover:bg-semantic-action-primary-hover',
        ghost:
          'text-semantic-fg-secondary hover:bg-semantic-bg-hover hover:text-semantic-fg-primary',
      },
      size: {
        sm: 'h-8 min-w-8 px-2 text-xs',
        md: 'h-9 min-w-9 px-3 text-sm',
        lg: 'h-10 min-w-10 px-3.5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface PaginationProps extends React.ComponentProps<'nav'> {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Number of sibling pages to show on each side */
  siblingCount?: number;
  /** Size of pagination buttons */
  size?: 'sm' | 'md' | 'lg';
  /** Show first/last page buttons */
  showEdges?: boolean;
}

function generatePages(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis-start' | 'ellipsis-end')[] {
  const totalSlots = siblingCount * 2 + 5; // siblings + first + last + current + 2 ellipsis

  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis-end', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + i + 1
    );
    return [1, 'ellipsis-start', ...rightRange];
  }

  const middleRange = Array.from(
    { length: siblingCount * 2 + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, 'ellipsis-start', ...middleRange, 'ellipsis-end', totalPages];
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      siblingCount = 1,
      size = 'md',
      showEdges = true,
      className,
      ...props
    },
    ref
  ) => {
    const pages = generatePages(currentPage, totalPages, siblingCount);

    return (
      <nav
        ref={ref}
        role="navigation"
        aria-label="Pagination"
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <ul className="flex items-center gap-1">
          {/* Previous button */}
          <li>
            <button
              type="button"
              className={cn(paginationItemVariants({ variant: 'ghost', size }))}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </li>

          {/* Page buttons */}
          {pages.map((page, index) => {
            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
              return (
                <li key={page}>
                  <span
                    className={cn(
                      paginationItemVariants({ variant: 'ghost', size }),
                      'cursor-default hover:bg-transparent'
                    )}
                    aria-hidden="true"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                </li>
              );
            }

            const isActive = page === currentPage;
            return (
              <li key={page}>
                <button
                  type="button"
                  className={cn(
                    paginationItemVariants({
                      variant: isActive ? 'active' : 'default',
                      size,
                    })
                  )}
                  onClick={() => onPageChange(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              </li>
            );
          })}

          {/* Next button */}
          <li>
            <button
              type="button"
              className={cn(paginationItemVariants({ variant: 'ghost', size }))}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </li>
        </ul>
      </nav>
    );
  }
);
Pagination.displayName = 'Pagination';

export { Pagination, paginationItemVariants };
