import { CompositeLayer } from "@deck.gl/core";
import { IconLayer, IconLayerProps } from "@deck.gl/layers";
import Supercluster from "supercluster";
import { PointFeature, ClusterFeature } from "supercluster";
import { UpdateParameters } from "@deck.gl/core";

const getIconContent = (size: number): string => {
  return size < 10 ? `${size}` : `${Math.round(size / 10) * 10}`;
};

const clusterMaxZoom = 11; // Show all items at zoom 12+

export default class IconClusterLayer<
  DataT extends Record<string, any>,
  ExtraProps extends {} = {},
> extends CompositeLayer<Required<IconLayerProps<DataT>> & ExtraProps> {
  state!: {
    data: (PointFeature<DataT> | ClusterFeature<DataT>)[];
    index: Supercluster<DataT, DataT>;
    z: number;
  };

  shouldUpdateState({ changeFlags }: UpdateParameters<this>) {
    return changeFlags.somethingChanged;
  }

  updateState({ props, oldProps, changeFlags }: UpdateParameters<this>) {
    const rebuildIndex =
      changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

    if (rebuildIndex) {
      const index = new Supercluster<DataT, DataT>({
        maxZoom: 11,
        radius: props.sizeScale * Math.sqrt(2),
      });
      index.load(
        (props.data as DataT[])
          .filter((item) => {
            return item.latitude && item.longitude;
          })
          .map((d) => ({
            geometry: { coordinates: [d.longitude, d.latitude] },
            properties: d,
          })) as PointFeature<DataT>[],
      );
      this.setState({ index });
    }

    const z = Math.floor(this.context.viewport.zoom);
    let data;
    if (z >= clusterMaxZoom) {
      data = (props.data as DataT[]).map((d) => ({
        type: "Feature",
        geometry: { coordinates: [d.longitude, d.latitude] },
        properties: d,
      })) as PointFeature<DataT>[]; // Show raw points
    } else {
      data = this.state.index.getClusters([-180, -85, 180, 85], z);
    }

    if (rebuildIndex || z !== this.state.z) {
      this.setState({ data, z });
    }
  }

  renderLayers() {
    const { data } = this.state;
    const { sizeScale } = this.props;

    return new IconLayer<PointFeature<DataT> | ClusterFeature<DataT>>(
      {
        data,
        sizeScale,
        getPosition: (d) => [
          d.geometry.coordinates[0],
          d.geometry.coordinates[1],
        ],
        getIcon: (d) => {
          const size = d.properties.cluster ? d.properties.point_count : 1;
          const iconContent = getIconContent(size);

          const customIcon = {
            url:
              "data:image/svg+xml," +
              encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="60" height="60" preserveAspectRatio="xMidYMid meet">
                <circle cx="60" cy="60" r="50" fill="#f28cb1" stroke="5C4033" stroke-width="3"/>
                <circle cx="60" cy="60" r="40" fill-opacity="0.8" fill="#f28cb1" stroke="#5C4033" stroke-width="2"/>
                <circle cx="60" cy="60" r="30" fill-opacity="0.6" fill="#f28cb1" stroke="#5C4033" stroke-width="1"/>
                <circle cx="60" cy="60" r="20" fill-opacity="0.4" fill="#f28cb1" stroke="#5C4033" stroke-width="0.5"/>
                <circle cx="60" cy="60" r="10" fill-opacity="0.2" fill="#f28cb1" stroke="#5C4033" stroke-width="0.5"/>
                <text x="60" y="60" font-size="34" fill="white" text-anchor="middle" alignment-baseline="middle" font-weight="bold">
                  ${iconContent}
                </text>
              </svg>
            `),
            width: 60,
            height: 60,
            anchor: [0.5, 0.5],
          };

          return customIcon;
        },
        getSize: (d) => {
          return 1;
        },
        onHover: ({ object }) => {
          if (object && object.properties) {
            this.setState({
              hoveredItem: object.properties, // Save hovered item's details
            });
          }
        },
      },
      this.getSubLayerProps({
        id: "icon",
      }),
    );
  }
}
