# grid-query-features

A React hook library for querying ArcGIS service features from MUI DataGrid **v6** with server mode pagination, filtering, and sorting.

## Installation

```bash
npm install @chunkangwong/grid-query-features
```

## Basic Usage

```tsx
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import {
  DataGrid,
  GridFilterModel,
  GridInputRowSelectionModel,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid"; // MUI DataGrid v6 ONLY
import useGridQueryFeatures from "@chunkangwong/grid-query-features";
import { useState } from "react";

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
      columns={[
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
      ]}
    />
  );
};
```

## API

```ts
const { featureSet, objectIds, error, isLoading, refetch } =
  useGridQueryFeatures({
    featureLayer,
    paginationModel,
    sortModel,
    filterModel,
  });
```

### Parameters

- `featureLayer:` [`FeatureLayer`](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html)

  - **Required**
  - The feature layer to query features from.

- `paginationModel:` [`GridPaginationModel`](https://mui.com/x/api/data-grid/data-grid/#DataGrid-prop-paginationModel)

  - **Required**
  - The pagination model from MUI DataGrid. It will be converted to a `start` and `num` query props and passed to the feature layer query.

- `sortModel:` [`GridSortModel`](https://mui.com/x/api/data-grid/data-grid/#DataGrid-prop-sortModel)

  - **Required**
  - The sort model from MUI DataGrid. It will be converted to a `orderByFields` query prop and passed to the feature layer query.

- `filterModel:` [`GridFilterModel`](https://mui.com/x/api/data-grid/data-grid/#DataGrid-prop-filterModel)

  - Optional
  - The filter model from MUI DataGrid. It will be converted to a SQL where clause and passed to the feature layer query.
  - If not provided, `"1=1"` will be used as the where clause to query all features.
  - _Note: For now, Quick Filter is not covered._

### Returns

- `featureSet:` [`FeatureSet`](<(https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-FeatureSet.html)>) `| null`

  - Default to `null`.
  - The feature set returned from the feature layer query.

- `objectIds: number[] | null`

  - Default to `null`.
  - The object ids returned from the feature layer query. It is used to calculate the total row count for the MUI DataGrid.

- `error: unknown`

  - The error returned from the feature layer query.

- `isLoading: boolean`

  - Default to `false`.
  - Whether the feature layer query is loading.

- `refetch: () => Promise<{ objectIds: number[]; featureSet: `[`FeatureSet`](<(https://developers.arcgis.com/javascript/latest/api-reference/esri-rest-support-FeatureSet.html)>)` } | undefined>`

  - A function to refetch the feature layer query with the current pagination, sorting, and filtering models. It returns object ids and feature set if the query is successful, otherwise `undefined`.
