import * as React from 'react';
import {Map, MapboxGeoJSONFeature} from 'react-map-gl';
import locaties from './locaties.json';

function App() {
  return (
    console.log(locaties),
    <Map
    mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      initialViewState={{
        longitude: 3.884229,
        latitude: 51.006661,
        zoom: 14
      }}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}

export default App;
