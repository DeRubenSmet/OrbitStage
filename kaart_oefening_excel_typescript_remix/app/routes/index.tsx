import { useRef, useState } from "react";
import Map, { Source, Layer, MapRef } from "react-map-gl";
import { Link } from "remix";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g";

export default function Index() {
  const mapRef = useRef<MapRef | null>(null);
  const [zoom, setZoom] = useState<number>(7);
  const [viewport, setViewport] = useState({
    latitude: 50.616949,
    longitude: 4.88526,
    zoom: zoom,
  });

  return (
    <div>
      <p>
        <Link to="provincies">Provincies</Link>
      </p>
      <p>
        <Link to="provincies">Arrondissementen</Link>
      </p>
      <p>
        <Link to="provincies">Gemeentes</Link>
      </p>
      <Map
        ref={mapRef}
        {...viewport}
        //@ts-ignore
        onMove={(evt) => setViewport(evt.viewport)}
        onZoom={(e) => setZoom(e.viewState.zoom)}
        //style={{ width: 1920, height: 900 }}
        style={{ width: 1519, height: 721 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
          <Source id="provincies" type="geojson" data={''}>
            <Layer
              {...{
                type: 'fill',
                id: 'kleuren',
                source: 'provincies',
                filter: ['!=', 'mediaan1', 'noMediaan'],
                paint: {
                  'fill-color': ['interpolate', ['linear'], ['get', 'mediaan1']],
                  'fill-opacity': 0.75,
                },
              }}
            ></Layer>
          </Source>
      </Map>
    </div>
  );
}
