# grid-query-features

A React hook library for querying ArcGIS service features from MUI DataGrid with server mode pagination, filtering, and sorting.

## Installation

```bash
npm install @chunkangwong/grid-query-features
```

## Usage

```tsx
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import {
  DataGrid,
  GridFilterModel,
  GridInputRowSelectionModel,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { useGridQueryFeatures } from "@chunkangwong/grid-query-features";

const featureLayer = new FeatureLayer({
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
  outFields: ["*"],
});

const App = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>();
  const { isLoading, featureSet, objectIds } = useGridQueryFeatures({
    featureLayer,
    paginationModel,
    sortModel,
    filterModel,
  });

  return (
    <DataGrid
      rows={featureSet?.features.map((feature) => feature.attributes) || []}
      rowCount={objectIds?.length || 0}
      getRowId={(row) => row[featureLayer.objectIdField]}
      pagination
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={(newPaginationModel) =>
        setPaginationModel(newPaginationModel)
      }
      sortingMode="server"
      sortModel={sortModel}
      onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
      filterMode="server"
      filterModel={filterModel}
      onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}
      loading={isLoading}
    />
  );
};
```
