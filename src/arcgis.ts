import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export const featureLayer = new FeatureLayer({
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
  outFields: ["*"],
});

const map = new Map({
  basemap: "topo-vector",
  layers: [featureLayer],
});

export const view = new MapView({
  map: map,
  center: [-118.805, 34.027],
  zoom: 13,
});
