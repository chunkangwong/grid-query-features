import type FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import type Field from "@arcgis/core/layers/support/Field";
import type FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import {
  GridFilterItem,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";

type UseGridQueryFeaturesProps = {
  featureLayer: FeatureLayer;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  filterModel?: GridFilterModel;
};

const operatorMap = {
  "=": "=",
  "!=": "<>",
  ">": ">",
  ">=": ">=",
  "<": "<",
  "<=": "<=",
  isEmpty: "IS NULL",
  isNotEmpty: "IS NOT NULL",
  isAnyOf: "IN",
  contains: "LIKE",
  equals: "=",
  startsWith: "LIKE",
  endsWith: "LIKE",
  is: "=",
  not: "<>",
  after: ">",
  onOrAfter: ">=",
  before: "<",
  onOrBefore: "<=",
} as const;

type GridOperator = keyof typeof operatorMap;
type EsriOperator = (typeof operatorMap)[GridOperator];

const isNumberField = (esriType: Field["type"]) => {
  return (
    esriType === "double" ||
    esriType === "integer" ||
    esriType === "long" ||
    esriType === "oid" ||
    esriType === "single" ||
    esriType === "small-integer"
  );
};

const getFormattedValue = (esriType: Field["type"], value: any) => {
  if (esriType === "date") {
    return `Date '${new Date(value).toISOString().split("T")[0]}'`;
  } else if (isNumberField(esriType)) {
    return value;
  }
  return `'${value}'`;
};

const getInFormattedValue = (esriType: Field["type"], values: any[]) => {
  if (isNumberField(esriType)) {
    return `(${values.join(",")})`;
  }
  return `(${values.map((v) => `'${v}'`).join(",")})`;
};

const getLikeFormattedValue = (gridOperator: GridOperator, value: any) => {
  if (gridOperator === "startsWith") {
    return `'${value}%'`;
  } else if (gridOperator === "endsWith") {
    return `'%${value}'`;
  }
  return `'%${value}%'`;
};

const getExpression = (
  esriType: Field["type"],
  gridFilterItem: GridFilterItem
) => {
  const { field, operator, value } = gridFilterItem;
  const gridOperatorValue = operator as GridOperator;
  const esriOperatorValue: EsriOperator = operatorMap[gridOperatorValue];
  if (esriOperatorValue === "IS NULL" || esriOperatorValue === "IS NOT NULL") {
    return `${field} ${esriOperatorValue}`;
  } else if (esriOperatorValue === "IN") {
    return `${field} ${esriOperatorValue} ${getInFormattedValue(
      esriType,
      value
    )}`;
  } else if (esriOperatorValue === "LIKE") {
    return `${field} ${esriOperatorValue} ${getLikeFormattedValue(
      gridOperatorValue,
      value
    )}`;
  }
  return `${field} ${esriOperatorValue} ${getFormattedValue(esriType, value)}`;
};

const getWhereClause = (fields: Field[], filterModel?: GridFilterModel) => {
  if (filterModel && filterModel.items.length > 0) {
    const fieldTypeMap = fields.reduce((acc, field) => {
      acc[field.name] = field.type;
      return acc;
    }, {} as Record<string, Field["type"]>);
    const expressions = filterModel.items.map((gridFilterItem) => {
      return getExpression(fieldTypeMap[gridFilterItem.field], gridFilterItem);
    });
    return expressions.join(` ${filterModel.logicOperator} `);
  }
  return "1=1";
};

const useGridQueryFeatures = ({
  featureLayer,
  filterModel,
  paginationModel,
  sortModel,
}: UseGridQueryFeaturesProps) => {
  const [featureSet, setFeatureSet] = useState<FeatureSet | null>(null);
  const [objectIds, setObjectIds] = useState<number[] | null>(null);
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    refetch();
  }, [featureLayer, filterModel, paginationModel, sortModel]);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await featureLayer.load();
      const fields = featureLayer.fields;
      const where = getWhereClause(fields, filterModel);
      const orderByFields = sortModel.map((sortModel) => {
        return `${sortModel.field} ${sortModel.sort}`;
      });
      const objectIds = await featureLayer.queryObjectIds({
        where: where,
      });
      const featureSet = await featureLayer.queryFeatures({
        start: paginationModel.page * paginationModel.pageSize,
        num: paginationModel.pageSize,
        where: where,
        returnGeometry: true,
        orderByFields: orderByFields,
        outFields: ["*"],
      });
      setObjectIds(objectIds);
      setFeatureSet(featureSet);
      return {
        objectIds,
        featureSet,
      };
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    featureSet,
    objectIds,
    error,
    isLoading,
    refetch,
  };
};

export default useGridQueryFeatures;
