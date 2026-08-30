import * as React from 'react';
import {
  Table as BasicTable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TableColumnType<T = any> {
  title: React.ReactNode;
  dataIndex?: string;
  key?: string;
  width?: number | string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
}

export interface TablePaginationConfig {
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
}

export interface TableProps<T = any> {
  columns: TableColumnType<T>[];
  dataSource: T[];
  rowKey?: string | ((record: T) => string);
  loading?: boolean;
  pagination?: TablePaginationConfig | false;
  className?: string;
  scroll?: { x?: number | string; y?: number | string };
  size?: 'small' | 'middle' | 'large';
  emptyText?: React.ReactNode;
}

export function Table<T extends Record<string, any>>({
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  pagination,
  className,
  emptyText = 'No Data',
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') return rowKey(record);
    return String(record[rowKey] ?? index);
  };

  const renderCell = (
    col: TableColumnType<T>,
    record: T,
    index: number,
  ): React.ReactNode => {
    if (col.render && col.dataIndex !== undefined) {
      return col.render(record[col.dataIndex], record, index);
    }
    if (col.dataIndex !== undefined) {
      return record[col.dataIndex];
    }
    return null;
  };

  const pager = pagination === false ? null : pagination;
  const current = pager?.current ?? 1;
  const pageSize = pager?.pageSize ?? 10;
  const total = pager?.total ?? dataSource.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-x-auto rounded-md border border-border">
        <BasicTable>
          <TableHeader>
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead
                  key={col.key || col.dataIndex || idx}
                  style={{ width: col.width }}
                  className={cn(
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                  )}
                >
                  {col.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : dataSource.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              dataSource.map((record, index) => (
                <TableRow key={getRowKey(record, index)}>
                  {columns.map((col, colIdx) => (
                    <TableCell
                      key={col.key || col.dataIndex || colIdx}
                      className={cn(
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                        col.ellipsis && 'max-w-[200px] truncate',
                      )}
                      title={col.ellipsis && typeof record[col.dataIndex!] === 'string' ? String(record[col.dataIndex!]) : undefined}
                    >
                      {renderCell(col, record, index)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </BasicTable>
      </div>

      {pager && total > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <div className="text-sm text-muted-foreground">
            {total} items
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pager.onChange?.(current - 1, pageSize)}
              disabled={current <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {current} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pager.onChange?.(current + 1, pageSize)}
              disabled={current >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
