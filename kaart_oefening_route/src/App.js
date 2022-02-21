import * as React from 'react';
import { useState } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import * as turf from '@turf/turf'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';
// San Francisco
const origin = [37.776, -122.414];

// Washington DC
const destination = [38.913, -77.032];

// A simple line from origin to destination.
const route = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [origin, destination]
      }
    }
  ]
};

// A single point that animates along the route.
// Coordinates are initially set to origin.
const point = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': origin
      }
    }
  ]
};

// Calculate the distance in kilometers between route start/end point.
const lineDistance = turf.length(route.features[0]);

const arc = [];

// Number of steps to use in the arc and animation, more steps means
// a smoother arc and animation, but too many steps will result in a
// low frame rate
const steps = 500;

// Draw an arc between the `origin` & `destination` of the two points
for (let i = 0; i < lineDistance; i += lineDistance / steps) {
  const segment = turf.along(route.features[0], i);
  arc.push(segment.geometry.coordinates);
}

// Update the route with calculated arc coordinates
route.features[0].geometry.coordinates = arc;

// Used to increment the value of the point measurement against the route.
let counter = 0;

function App() {
  const mapRef = React.useRef();
  return (
    <Map ref={mapRef}
    onLoad={
      () => {
        
      }
    }
      initialViewState={{
        latitude: 37.8,
        longitude: -96,
        zoom: 3
      }}
      style={{ width: 1850, height: 950 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Source type='geojson' data={route}>
        <Layer>
          {
            {
              'id': 'route',
              'source': 'route',
              'type': 'line',
              'paint': {
                'line-width': 2,
                'line-color': '#007cbf'
              }
            }
          }
        </Layer>
      </Source>
      <Source type='geojson' data={point}>
        <Layer>
          {
            {
              'id': 'point',
              'source': 'point',
              'type': 'symbol',
              'layout': {
                // This icon is a part of the Mapbox Streets style.
                // To view all images available in a Mapbox style, open
                // the style in Mapbox Studio and click the "Images" tab.
                // To add a new image to the style at runtime see
                // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
                'icon-image': 'airport-15',
                'icon-rotate': ['get', 'bearing'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
              }
            }
          }
        </Layer>
      </Source>
    </Map>
  );
}

export default App;
