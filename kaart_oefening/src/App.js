import * as React from 'react';
import Map, {Source, Layer, Marker} from 'react-map-gl';
import Logo from './mapbox-icon.png';
import Css from 'mapbox-gl/dist/mapbox-gl.css';
import {render} from 'react-dom';
import locaties from './locaties.json';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';

function App() {
  return (
    <Map
      onLoad={}
      initialViewState={{
        longitude: 3.884229,
        latitude: 51.006661,
        zoom: 14
      }}
      style={{width: 500, height: 500}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken= {MAPBOX_TOKEN}
    >
      <Source type="geojson" data={locaties}>
          <Layer {
            ...{
              'id': 'points',
              'type': 'symbol',
              'source': 'points',
              'layout': {
              'icon-image': 'alcohol-shop-11',
              // get the title name from the source's "title" property
              'text-field': ['get', 'title'],
              'text-font': [
              'Open Sans Semibold',
              'Arial Unicode MS Bold'
              ],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
              }
              }
          } />
        </Source>
    </Map>

  );
}

export default App;
