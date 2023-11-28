import { ReactNode, useMemo, useState } from "react";
import { useTable } from "react-table";
import AreaLoading from "../AreaLoading";
import ResizableWidth from "../ResizableWidth";
import styles from "./Table.module.css";

export interface ITableRow {
  [key: string]: any;
}

export interface ITableColumn<T extends ITableRow> {
  Header: ReactNode;
  accessor: string;
  width: number;
  cellWidth?: number;
  resizeDisabled?: boolean;
}

export interface ITableCellIndex<T extends ITableRow> {
  rowId?: string;
  columnAccessor?: keyof T;
  rowOriginal?: any;
}

export interface ITableHighlightedRow {
  rowId: string;
  color: "primary" | "secondary" | "warning";
}

export interface ITableProps<T extends ITableRow> {
  className?: string;
  columns: ITableColumn<T>[];
  values: T[];
  selectedCell?: ITableCellIndex<T>;
  highlightedRows?: ITableHighlightedRow[];
  loading?: boolean;
  onColumnsChange: (columns: ITableColumn<T>[]) => void;
  onCellClick?: (cellIndex: ITableCellIndex<T>) => void;
}

function Table<T extends ITableRow>(props: ITableProps<T>) {
  const [horizontalScroll, setHorizontalScroll] = useState(0);
  const tableInstance = useTable({
    columns: props.columns as any,
    data: props.values as any,
  });

  const indexedHighlightedRows = useMemo(() => {
    return new Map((props.highlightedRows ?? []).map((x) => [x.rowId, x]));
  }, [props.highlightedRows]);

  const onCellClick = (cellIndex: ITableCellIndex<T>) => {
    if (props.onCellClick) props.onCellClick(cellIndex);
  };

  const onColumnWidthChange = (width: number, column: ITableColumn<T>) => {
    if (column.resizeDisabled) return;
    props.onColumnsChange(
      props.columns.map((x) => {
        if (x === column) {
          return { ...x, width };
        }
        return x;
      })
    );
  };

  const onCellWidthChange = (column: ITableColumn<T>) => {
    props.onColumnsChange(
      props.columns.map((x) => {
        if (x === column) {
          return { ...x, cellWidth: x.width };
        }
        return x;
      })
    );
  };

  const onBodyScroll = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    setHorizontalScroll(evt.target.scrollLeft);
  };

  return (
    <div
      className={styles.root + (props.className ? ` ${props.className}` : "")}
    >
      <div className={styles.head} style={{ left: `-${horizontalScroll}px` }}>
        {tableInstance.headerGroups.map((headerGroup) => (
          /* eslint-disable react/jsx-key */
          <div className={styles.row} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, j) => {
              const headerProps = column.getHeaderProps();
              return (
                <ResizableWidth
                  key={headerProps.key}
                  className={styles.headCellResizableContainer}
                  width={props.columns[j].width}
                  onWidthChange={(width) =>
                    onColumnWidthChange(width, props.columns[j])
                  }
                  onChangeStop={() => onCellWidthChange(props.columns[j])}
                  disabled={props.columns[j].resizeDisabled}
                >
                  {/* eslint-disable-next-line react/jsx-key */}
                  <div
                    {...headerProps}
                    style={{ width: "100%", height: "100%" }}
                    className={styles.headCell}
                  >
                    {column.render("Header")}
                  </div>
                </ResizableWidth>
              );
            })}
          </div>
        ))}
      </div>
      <AreaLoading loading={props.loading} className={styles.areaLoading} />
      <div
        onScroll={onBodyScroll}
        className={styles.body}
        {...tableInstance.getTableBodyProps()}
      >
        {tableInstance.rows.map((row) => {
          tableInstance.prepareRow(row);
          const rowId = (row.original as ITableRow).id;
          const highlight = indexedHighlightedRows.get(rowId);
          const rowClasses = [
            styles.row,
            props.selectedCell?.rowId === rowId && styles.selected,
            highlight && styles[`${highlight.color}Highlighted`],
          ].filter((x) => x);

          return (
            /* eslint-disable react/jsx-key */
            <div className={rowClasses.join(" ")} {...row.getRowProps()}>
              {row.cells.map((cell, j) => {
                const cellWidth: number =
                  props.columns[j].cellWidth ?? props.columns[j].width;
                return (
                  /* eslint-disable react/jsx-key */
                  <div
                    {...cell.getCellProps()}
                    onClick={() =>
                      onCellClick({
                        rowId: (row.original as ITableRow).id,
                        columnAccessor: props.columns[j].accessor,
                        rowOriginal: row.original,
                      })
                    }
                    style={{
                      width: `${cellWidth}px`,
                      minWidth: `${cellWidth}px`,
                      maxWidth: `${cellWidth}px`,
                    }}
                  >
                    <div className={styles.cell}>{cell.render("Cell")}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Table;
