import * as React from 'react';
import { useState } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import * as turf from '@turf/turf'
import './index.css'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';

const route = {
  'id': 'route',
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            3.8857229053974147,
            51.00703382745128
          ],
          [
            3.8858382403850555,
            51.007017794175795
          ],
          [
            3.885905295610428,
            51.006984883750874
          ],
          [
            3.8859374821186066,
            51.006934252282306
          ],
          [
            3.8859374821186066,
            51.006826238298
          ],
          [
            3.885889202356338,
            51.00675366626101
          ],
          [
            3.885737657546997,
            51.00665746594395
          ],
          [
            3.885702788829803,
            51.00660852184644
          ],
          [
            3.885340690612793,
            51.00654945131511
          ],
          [
            3.8850630819797516,
            51.006544388123224
          ],
          [
            3.8849101960659027,
            51.00657139180697
          ],
          [
            3.884612470865249,
            51.00668784501301
          ],
          [
            3.8847438991069794,
            51.00673088199344
          ],
          [
            3.8847962021827693,
            51.006792483876325
          ],
          [
            3.8848672807216644,
            51.00691568739664
          ],
          [
            3.8849785923957825,
            51.00699163460917
          ],
          [
            3.8850724697113037,
            51.00702116960268
          ],
          [
            3.8851824402809143,
            51.00703467130773
          ],
          [
            3.8857068121433254,
            51.007035515164176
          ]
        ]
      }
    }
  ]
};

const point = {
  'id': 'point',
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': [3.8857229053974147,
          51.00703382745128]
      }
    }
  ]
};
const targetRoute = route.features[0].geometry.coordinates;
// this is the path the camera will move along
const cameraRoute = route.features[0].geometry.coordinates;

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
    const camera = mapRef.current.getFreeCameraOptions();
    // Update the source with this new data
    mapRef.current.getMap().getSource('pointSource').setData(point);
    
    camera.lookAtPoint({
      lng: point.features[0].geometry.coordinates[0],
      lat: point.features[0].geometry.coordinates[1]
    });
    mapRef.current.setFreeCameraOptions(camera);

    // Request the next frame of animation as long as the end has not been reached
    if (counter < steps) {
      requestAnimationFrame(animate);
      
      //console.log(point.features[0].geometry.coordinates[0]);
    }

    counter = counter + 1;
  }

  return (
    <Map ref={mapRef}

      onLoad={
        () => {
          //console.log(point.features[0].geometry.coordinates[0])
          //console.log(route.features[0].geometry.coordinates)
          animate(counter);
        }
      }
      initialViewState={{
        latitude: 51.006822,
        longitude: 3.885334,
        zoom: 22  
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
      <Source id='pointSource' type='geojson' data={point}>
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
            onClick={() => {
              point.features[0].geometry.coordinates = origin;

              // Update the source layer
              mapRef.current.getMap().getSource('pointSource').setData(point);

              // Reset the counter
              counter = 0;

              // Restart the animation
              animate(counter);
            }}>Replay</button>
        </div>
      </Source>
    </Map>
  );
}


export default App;
