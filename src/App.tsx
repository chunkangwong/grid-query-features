import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridInputRowSelectionModel,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { featureLayer, view } from "./arcgis";
import CustomPagination from "./components/CustomPagination";
import useGridQueryFeatures from "./hooks/useGridQueryFeatures";

const columns: GridColDef[] = [
  {
    field: "FID",
    headerName: "FID",
    type: "number",
    width: 150,
  },
  {
    field: "Tree_ID",
    headerName: "Tree_ID",
    type: "number",
    width: 150,
  },
  {
    field: "Status",
    headerName: "Status",
    width: 150,
  },
  {
    field: "Collected",
    headerName: "Collected",
    width: 300,
    type: "date",
    valueFormatter: ({ value }) => {
      return new Date(value).toLocaleDateString();
    },
  },
];

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridInputRowSelectionModel>([]);
  const { isLoading, featureSet, objectIds } = useGridQueryFeatures({
    featureLayer,
    paginationModel,
    sortModel,
    filterModel,
  });

  useEffect(() => {
    view.container = mapRef.current!;
  }, []);

  const handleRowSelectionModelChange = (
    newRowSelectionModel: GridInputRowSelectionModel
  ) => {
    setRowSelectionModel(newRowSelectionModel);
  };

  return (
    <div className="App">
      <div className="mapDiv" ref={mapRef}></div>
      <div className="tableDiv">
        <DataGrid
          rows={featureSet?.features.map((feature) => feature.attributes) || []}
          columns={columns}
          rowCount={objectIds?.length || 0}
          getRowId={(row) => row[featureLayer.objectIdField]}
          pageSizeOptions={[10, 25, 50, 100]}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          checkboxSelection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={handleRowSelectionModelChange}
          loading={isLoading}
          slots={{
            pagination: CustomPagination,
          }}
        />
      </div>
    </div>
  );
}

export default App;
