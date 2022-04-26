import React, { useRef, useState } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl';
import logo from './logo.svg';
import './App.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';


function App() {
  const mapRef = useRef<MapRef | null>(null);
  const [zoom, setZoom] = useState<number>(7);
  const [viewport, setViewport] = useState({
    latitude: 50.616949,
    longitude: 4.88526,
    zoom: zoom,
  });
  
  return (
    <>
      <Map
        ref={mapRef}
        {...viewport}
        //@ts-ignore
        onMove={(evt) => setViewport(evt.viewport)}
        onZoom={(e) => setZoom(e.viewState.zoom)}
        //style={{ width: 1920, height: 900 }}
        style={{ width: 1519, height: 721 }}
        // mapStyle="mapbox://styles/mapbox/streets-v9"
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        


        {sourceLayers.map((sourceLayer) => (
          <Source key={sourceLayer.id} id={sourceLayer.id} type="geojson" data={sourceLayer.geoJson}>
            <Layer
              {...{
                type: 'fill',
                id: `${sourceLayer.id}`,
                source: sourceLayer.id,
                minzoom: sourceLayer.minZoom,
                maxzoom: sourceLayer.maxZoom + 0.2,
                filter: ['!=', 'mediaan1', 'noMediaan'],
                paint: {
                  'fill-color': ['interpolate', ['linear'], ['get', 'mediaan1'], ...ranges.layerColors],
                  'fill-opacity': 1,
                },
              }}
            ></Layer>
            <Layer
              {...{
                id: `${sourceLayer.id}-outline`,
                type: 'line',
                source: sourceLayer.id,
                minzoom: sourceLayer.minZoom,
                maxzoom: sourceLayer.maxZoom + 0.2,
                layout: {},
                paint: {
                  'line-color': '#000',
                  'line-width': 2,
                },
              }}
            ></Layer>
            <Layer
              {...{
                id: `${sourceLayer.id}-symbol`,
                type: 'symbol',
                source: sourceLayer.id,
                minzoom: sourceLayer.minZoom,
                maxzoom: sourceLayer.maxZoom + 0.2,
                filter: ['!=', 'mediaan1', 'noMediaan'],
                layout: {
                  'text-field': ['concat', ['get', 'NAAM'], '\n', ['get', 'mediaanFormatted']],
                  'symbol-placement': 'point',
                },
              }}
            ></Layer>
          </Source>
        ))}
      </Map>

      <ControlPanel year={year} onChange={(value) => setYear(value)} />
    </>
  );
}

export default App;
