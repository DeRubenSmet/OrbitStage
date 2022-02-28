import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import * as turf from '@turf/turf'
import './index.css';
import policeCar from './police-car.png';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';

const route = {
  'id': 'route',
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

const lineDistance = turf.length(route.features[0]);
const arc = [];
const steps = 1000;

for (let i = 0; i < lineDistance; i += lineDistance / steps) {
  const segment = turf.along(route.features[0], i);
  arc.push(segment.geometry.coordinates);
}

route.features[0].geometry.coordinates = arc;

let counter = 0;


function App() {
  const mapRef = React.useRef();
  //const [pauseStatus, setPauseStatus] = useState(false);
  const followRef = React.useRef();
  const [follow, setFollow] = useState(false);
  const [followUnfollow, setFollowUnfollow] = useState("follow");
  const [viewport, setViewport] = useState({
    latitude: 51.006822,
    longitude: 3.885334,
    zoom: 19
  });

  useEffect(() => {
    if(counter !== 0){
          followRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(followRef.current);
    }
  }, [follow]);

  function animate() {
    if (!mapRef.current) {
      return;
    }
    const start =
      route.features[0].geometry.coordinates[
      counter >= steps ? counter - 1 : counter
      ];

    const end =
      route.features[0].geometry.coordinates[
      counter >= steps ? counter : counter + 1
      ];

    if (!start || !end) return;
    point.features[0].geometry.coordinates =
      route.features[0].geometry.coordinates[counter];

    point.features[0].properties.bearing = turf.bearing(
      turf.point(start),
      turf.point(end)
    );

    mapRef.current.getMap().getSource('pointSource').setData(point);
    const camera = mapRef.current.getFreeCameraOptions();
    if (follow) {
      camera.lookAtPoint({
        lng: point.features[0].geometry.coordinates[0],
        lat: point.features[0].geometry.coordinates[1]
      });
      mapRef.current.setFreeCameraOptions(camera);
    }

    if (counter < steps) {
      followRef.current = requestAnimationFrame(animate);
    }

    counter = counter + 1;

    if (counter === 999) {
      counter = 0;
    }
  }

  return (
    <Map ref={mapRef}
      onLoad={
        () => {
          mapRef.current.loadImage(
            policeCar,
            (error, image) => {
              if (error) throw error;
              mapRef.current.addImage('police-car', image);
            })
        }
      }
      {...viewport}
      onMove={evt => setViewport(evt.viewport)}
      style={{ width: 1500, height: 700 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {/* <Source type='geojson' data={route}>
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
      </Source> */}
      <Source id='pointSource' type='geojson' data={point}>
        <Layer
          {
          ...{
            'id': 'point',
            'source': 'point',
            'type': 'symbol',
            'layout': {
              'icon-image': 'police-car',
              'icon-size': 0.08,
              'icon-rotate': ['get', 'bearing'],
              'icon-rotation-alignment': 'map',
              'icon-allow-overlap': true,
              'icon-ignore-placement': true,
            }
          }
          }>
        </Layer>
        <div className="overlay">
          <button id='start'
          onClick={() => {
            if(counter === 0){
              animate(counter);
            } 
          }
        }
          >Start</button>
        </div>
        <div className="overlay2">
          <button id='follow'
            onClick={() => {
              setFollow(!follow);
              console.log(follow);
              if (follow === false) {
                setFollowUnfollow("Unfollow");
                setViewport({ ...viewport, zoom: 21 })
              }
              else {
                setFollowUnfollow("Follow");
                setViewport({
                  ...viewport,
                  latitude: 51.006822,
                  longitude: 3.885334,
                  bearing: 0,
                  pitch: 0,
                  zoom: 19
                })
              }
            }}>{followUnfollow}</button>
        </div>
      </Source>
    </Map>
  );
}


export default App;
