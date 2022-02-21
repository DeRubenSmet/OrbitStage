import * as React from 'react';
import { useState } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import * as turf from '@turf/turf'
import './index.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';

// San Francisco
const origin = [-122.414, 37.776];

// Washington DC
const destination = [-77.032, 38.913];

// A simple line from origin to destination.
const route = {
  'id': 'route',
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
  'id': 'point',
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
  function animate() {
    const start =
      route.features[0].geometry.coordinates[
      counter >= steps ? counter - 1 : counter
      ];
    const end =
      route.features[0].geometry.coordinates[
      counter >= steps ? counter : counter + 1
      ];
    if (!start || !end) return;

    // Update point geometry to a new position based on counter denoting
    // the index to access the arc
    point.features[0].geometry.coordinates =
      route.features[0].geometry.coordinates[counter];

    // Calculate the bearing to ensure the icon is rotated to match the route arc
    // The bearing is calculated between the current point and the next point, except
    // at the end of the arc, which uses the previous point and the current point
    point.features[0].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    // Update the source with this new data
    mapRef.current.getSource('point').setData(point);

    // Request the next frame of animation as long as the end has not been reached
    if (counter < steps) {
      requestAnimationFrame(animate);
    }

    counter = counter + 1;
  }

  return (
    <Map ref={mapRef}
    
    onLoad={
      () => {
        animate(counter);
      }
    }
      initialViewState={{
        latitude: 37.8,
        longitude: -96,
        zoom: 3
      }}
      style={{ width: 1500, height: 700 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Source type='geojson' data={route}>
        <Layer
          {
          ...{
            'id': 'route',
            'source': 'route',
            'type': 'line',
            'paint': {
              'line-width': 2,
              'line-color': '#007cbf'
            }
          }
          }>
        </Layer>
      </Source>
      <Source type='geojson' data={point}>
        <Layer
          {
          ...{
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
          }>
        </Layer>
        <div className="overlay">
          <button id='replay'
          onClick={ () => {
            point.features[0].geometry.coordinates = origin;
 
            // Update the source layer
            mapRef.current.getSource('point').setData(point);
             
            // Reset the counter
            counter = 0;
             
            // Restart the animation
            animate(counter);}}>Replay</button>
        </div>
      </Source>
    </Map>
  );
}


export default App;
