import React, { useState, useRef } from "react";
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { INITIAL_VIEW_STATE, layerProps } from "../../data/mapConstants";
import IconClusterLayer from "../../data/icon-cluster-layer";
import { useDataContext } from "../../context/DataContext";
import { MapViewState } from "@deck.gl/core";

const BASIC_STYLE = "https://tiles.stadiamaps.com/styles/alidade_smooth.json";

interface TooltipProps {
  x: number;
  y: number;
  info: string;
}

const MapComponent = () => {
  const { filteredData } = useDataContext();
  const mapRef = useRef(null);
  const [mapStyle, setMapStyle] = useState(BASIC_STYLE);
  const [tooltip, setTooltip] = useState<TooltipProps | null>(null);

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  const layer = new IconClusterLayer({
    ...layerProps,
    data: filteredData || [],
    id: "icon-cluster",
    getIcon: (d) => "marker",
    sizeScale: 40,
    pickable: true,
    onClick: (value) => {
      if (value?.coordinate)
        handleClusterClick(value.coordinate?.[0], value.coordinate?.[1]);
    },
    onHover: ({ object, x, y }) => {
      if (object && !object.properties.cluster) {
        setTooltip({
          x,
          y,
          info: object.properties.name || "No additional info",
        });
      } else {
        setTooltip(null);
      }
    },
  });

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const handleClusterClick = (longitude: number, latitude: number) => {
    setViewState({
      ...viewState,
      longitude,
      latitude,
      zoom: Math.min(viewState.zoom + 2, 12),
      transitionDuration: 500,
    });
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <DeckGL
        onViewStateChange={({ viewState }) => {
          setViewState(viewState as MapViewState);
        }}
        controller={true}
        initialViewState={viewState}
        layers={[layer]}
      >
        <Map mapStyle={mapStyle} ref={mapRef} />
      </DeckGL>
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip?.x,
            top: tooltip?.y,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "5px",
            borderRadius: "5px",
            pointerEvents: "none",
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.info}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
