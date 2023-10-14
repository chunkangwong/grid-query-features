import MuiPagination from "@mui/material/Pagination";
import { TablePaginationProps } from "@mui/material/TablePagination";
import {
  gridPageSizeSelector,
  GridPagination,
  gridRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

function Pagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);
  const pageCount = Math.ceil(rowCount / pageSize);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

export default CustomPagination;
