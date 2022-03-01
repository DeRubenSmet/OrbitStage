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
  const [Gemeente, setGemeente] = useState({});
  const [filteredMunicipalities, setFilteredMunicipalities] = useState({});
  const [geojson, setGeojson] = useState({});
  //const [jsonOverheid, setJsonOverheid] = useState('');
  const [viewport, setViewport] = useState({
    latitude: 51.006822,
    longitude: 3.885334,
    zoom: 7
  });
  const options = {
    delimiter: ';', header: true, dynamicTyping: true, complete: function (results, file) {
      console.log("Parsing complete:", results, file);
    }
  };

  const zoekGemeente = (gemeente) => {
    const municipality = jsonOverheidtxt.features.find(feature => feature.properties.name === gemeente);
    return (municipality);
  }

  // const zoekGemeente2 = () => {
  //     const result = jsonFromCsv.data.filter(element => element[2] === '2010' && element[4] > 100);
  //     setFilteredMunicipalities(result);
  // }

  useEffect(async function getJsonFromCsv() {
    //const jsonOverheid = await axios.get("https://raw.githubusercontent.com/Datafable/rolling-blackout-belgium/master/data/geospatial/municipalities-belgium.geojson");
    const csv = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv");
    //setJsonFromCsv(papa.parse(csv.data, options));
    const testCsv = papa.parse(csv.data, options);
    //setJsonOverheid(jsonOverheid);
    //const result = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv").then((response) => setCsv(papa.parse(response.data, options)));

    //setGeojson({...geojson.features[0], ...jsonFromCsv})
    for (let i = 0; i < jsonOverheidtxt.features.length; i++) {
      const municipalityOverheid = jsonOverheidtxt.features[i].properties.name.split('#')[0].toUpperCase();
      let ObjectMunicipalityCsv = '';
      console.log(municipalityOverheid.split('#')[0].toUpperCase());
        ObjectMunicipalityCsv = testCsv.data.find(element => element.municipality === municipalityOverheid);
      if(ObjectMunicipalityCsv === undefined){
        jsonOverheidtxt.features[i].properties.mediaan1 = 1000000000;
      }
      else{
        jsonOverheidtxt.features[i].properties.mediaan1 = ObjectMunicipalityCsv.mediaan1;
      }
      

    }
    //{ ...jsonOverheidtxt.features[i].properties, ...ObjectMunicipalityCsv }



    //setGeojson(...geojson.features)
  }, [])
  const municipality = zoekGemeente('Aarschot');



  return (

    <Map ref={mapRef}
      onLoad={
        () => {

          //jsonOverheidtxt.features[0].properties.mediaan1 = 300001;
          console.log(jsonOverheidtxt);

          // }
          // jsonOverheidtxt.features[0].test = 300001;
          // console.log(jsonOverheidtxt.features[0].test)
          // console.log(jsonOverheidtxt)
        }
      }
      {...viewport}
      onMove={evt => setViewport(evt.viewport)}
      style={{ width: 1500, height: 700 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >

      <Source id='mediaan prijs' type='geojson' data={jsonOverheidtxt}>
        <Layer {
          ...{
            'id': 'label',
            'source': 'mediaan prijs',
            'type': 'symbol',
            'type': 'symbol',
            'layout': {
              'text-field': ['get', 'name'],
              'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
              'text-radial-offset': 0.5,
              'text-justify': 'auto',
            }
          }
        }></Layer>
        <Layer
          {
          ...{
            'id': 'mediaan prijs',
            'source': 'mediaan prijs',
            //'maxzoom': zoomThreshold,
            'type': 'fill',

            'paint': {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'mediaan1'],
                0,
                '#F2F12D',
                100000,
                '#EED322',
                200000,
                '#E6B71E',
                300000,
                '#DA9C20',
                400000,
                '#CA8323',
                500000,
                '#B86B25',
                600000,
                '#A25626',
                700000,
                '#8B4225',
                10000000,
                '#A0A0A0'
              ],
              'fill-opacity': 0.75
            }
          }
          }>
        </Layer>
      </Source>
    </Map>
  );
}

export default App;

