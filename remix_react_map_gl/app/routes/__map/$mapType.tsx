import { json, LoaderFunction, useLoaderData } from "remix";
import Map, { Source, Layer, MapRef } from "react-map-gl";
import styles from "~/styles/mapType.css";
import geoJson from "~/data/result.json";
import { formatNumber } from "~/utils/math";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: "https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css",
    },
  ];
}
import type { FillLayer } from "react-map-gl";
import { useMemo, useRef } from "react";

interface CsvRow {
  jaar?: number;
  mediaan1: number;
  naam: string;
}

const rangeColors = [
  0,
  "#feb24c",
  100000,
  "#fd8d3c",
  200000,
  "#fc4e2a",
  300000,
  "#e31a1c",
  500000,
  "#b10026",
];

const getMergedGeojson = (
  geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
  csv: CsvRow[],
  key: string
): GeoJSON.FeatureCollection<GeoJSON.Geometry> => {
  return {
    ...geoJson,
    features: geoJson.features.map((feature) => {
      const row: CsvRow | undefined = csv.find(
        (element) => element?.naam === feature.properties?.NAAM.toUpperCase()
      );

      return {
        ...feature,
        properties: {
          ...feature.properties,
          // mediaanFormatted: formatNumber(row?.mediaan1),
          mediaanFormatted: formatNumber(row?.mediaan1),
          mediaan1: row?.mediaan1 ?? "noMediaan",
          jaar: 2010,
        },
      };
    }),
  };
};

//   const updateLayerByYear = (jaartal: number | string) => {
//     const csvFilteredRows = csv.filter(
//       (item) => item.jaar === Number(jaartal)
//     );
//     const geoJson = getMergedGeojson(dataLayer.geoJson, csvFilteredRows, dataLayer.key);
//     console.log(geoJson);
//   };

export const dataLayer: FillLayer = {
  id: "data",
  type: "fill",
  filter: ["all", ["!=", "mediaan1", "noMediaan"], ["==", "jaar", 2010]],
  paint: {
    "fill-color": ['interpolate', ['linear'], ['get', 'mediaan1'], ...rangeColors],
    "fill-opacity": 1,
  },
};

type LoaderData = Awaited<ReturnType<typeof loader>>;

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(
    "https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson"
  );

  let geojson;
  if(params.mapType === 'provinces'){
    geojson = getMergedGeojson(
      //@ts-ignore
      geoJson[0].geoJson,
      //@ts-ignore
      geoJson[0].csv,
      "provincie"
    );
  }
  else if(params.mapType === 'districts'){
    geojson = getMergedGeojson(
      //@ts-ignore
      geoJson[1].geoJson,
      //@ts-ignore
      geoJson[1].csv,
      "Arrondissement"
    );
  }
  else{
    geojson = getMergedGeojson(
      //@ts-ignore
      geoJson[2].geoJson,
      //@ts-ignore
      geoJson[2].csv,
      "municipality"
    );
  }

  return json({ zoom: params.mapType, geojson });
};

export default function Test() {
  const { geojson, zoom } = useLoaderData<LoaderData>();
  const mapRef = useRef<MapRef | null>(null);
  return (
    <>
      {console.log(geojson)}
      <h2>Hier komt de map {zoom} </h2>

      <Map
        id="map"
        initialViewState={{
          latitude: 50.616949,
          longitude: 4.88526,
          zoom: 6,
        }}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={
          "pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3VsbWRiancwNXVqMzFwMTZlbXh3Y3Q1In0.4BKvUDl3t6OSJbdMmu7tkg"
        }
        interactiveLayerIds={["data"]}
      >
        <Source type="geojson" data={geojson}>
          <Layer {...dataLayer} />
        </Source>
      </Map>
    </>
  );
}
