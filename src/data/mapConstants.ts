import { AccessorFunction, MapViewState, Position } from "@deck.gl/core";
import { IconLayerProps } from "@deck.gl/layers";
import IApartment from "../types/clusterLayer";

export const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -106,
  latitude: 35,
  zoom: 2,
  maxZoom: 11,
  minZoom: 3,
  pitch: 5,
  bearing: 0,
};

export const layerProps = {
  id: "icon",
  pickable: true,
};
