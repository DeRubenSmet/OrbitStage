import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import papa from 'papaparse'
import './index.css';
import axios from 'axios';
import jsonOverheidtxt from './municipalities-belgium.geojson.json'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';

function App() {
  const mapRef = React.useRef();
  const [jsonFromCsv, setJsonFromCsv] = useState('');
  const[Gemeente, setGemeente] = useState({});
  //const [jsonOverheid, setJsonOverheid] = useState('');
  const [viewport, setViewport] = useState({
    latitude: 51.006822,
    longitude: 3.885334,
    zoom: 7
  });
  const options = { delimiter: ';' };

  const zoekGemeente = (gemeente) => {
    const municipality = jsonOverheidtxt.features.find(feature => feature.properties.name === gemeente);
    console.log(municipality);
  }

  useEffect(async function getJsonFromCsv() {
    //const jsonOverheid = await axios.get("https://raw.githubusercontent.com/Datafable/rolling-blackout-belgium/master/data/geospatial/municipalities-belgium.geojson");
    const csv = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv");
    setJsonFromCsv(papa.parse(csv.data, options));
    //setJsonOverheid(jsonOverheid);
    console.log(jsonFromCsv);
    //const result = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv").then((response) => setCsv(papa.parse(response.data, options)));
  }, [])

  return (
    <Map ref={mapRef}
    onLoad = {
      () => {
        zoekGemeente('Aarschot');
        console.log('ZoekGemeente()');
      }
    }
      {...viewport}
      onMove={evt => setViewport(evt.viewport)}
      style={{ width: 1500, height: 700 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Source type='geojson' data={jsonOverheidtxt}>
        <Layer
          {
          ...{
            id: 'data',
            type: 'fill',
            paint: {
              'fill-color': '#0000EE',
              'fill-opacity': 0.8
            }
          }
          }>
        </Layer>
      </Source>
    </Map>
  );
}

export default App;

