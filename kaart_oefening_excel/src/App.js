import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import papa from 'papaparse'
import './index.css';
import axios from 'axios';
import jsonOverheidtxt from './municipalities-belgium.geojson.json';
import jsonVlaanderen from './provinciesVlaanderen.json';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';

function App() {
  const mapRef = React.useRef();
  const [jsonFromCsv, setJsonFromCsv] = useState('');
  const [Gemeente, setGemeente] = useState({});
  const [filteredMunicipalities, setFilteredMunicipalities] = useState({});
  const [geojson, setGeojson] = useState({});
  const [hoverInfo, setHoverInfo] = useState(null);
  //const [jsonOverheid, setJsonOverheid] = useState('');
  const [viewport, setViewport] = useState({
    latitude: 50.616949,
    longitude: 4.885260,
    zoom: 7,

  });
  const options = {
    delimiter: ';', header: true, dynamicTyping: true, complete: function (results, file) {
      console.log("Parsing complete:", results, file);
    }
  };

  var lambert72toWGS84 = function (x, y) {

    let newLongitude, newLatitude;

    let n = 0.77164219,
      F = 1.81329763,
      thetaFudge = 0.00014204,
      e = 0.08199189,
      a = 6378388,
      xDiff = 149910,
      yDiff = 5400150,
      theta0 = 0.07604294;

    let xReal = xDiff - x,
      yReal = yDiff - y;

    let rho = Math.sqrt(xReal * xReal + yReal * yReal),
      theta = Math.atan(xReal / -yReal);

    newLongitude = (theta0 + (theta + thetaFudge) / n) * 180 / Math.PI;
    newLatitude = 0;

    for (let i = 0; i < 5; ++i) {
      newLatitude = (2 * Math.atan(Math.pow(F * a / rho, 1 / n) * Math.pow((1 + e * Math.sin(newLatitude)) / (1 - e * Math.sin(newLatitude)), e / 2))) - Math.PI / 2;
    }
    newLatitude *= 180 / Math.PI;
    return [newLatitude, newLongitude];

  }

  const zoekGemeente = (gemeente) => {
    const municipality = jsonOverheidtxt.features.find(feature => feature.properties.name === gemeente);
    return (municipality);
  }

  // const zoekGemeente2 = () => {
  //     const result = jsonFromCsv.data.filter(element => element[2] === '2010' && element[4] > 100);
  //     setFilteredMunicipalities(result);
  // }

  const [coordinatesJsonVlaanderen, setCoordinatesJsonVlaanderen] = useState([]);

  useEffect(async function getJsonFromCsv() {
    //const jsonOverheid = await axios.get("https://raw.githubusercontent.com/Datafable/rolling-blackout-belgium/master/data/geospatial/municipalities-belgium.geojson");
    const csv = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv");
    //setJsonFromCsv(papa.parse(csv.data, options));
    const testCsv = papa.parse(csv.data, options);
    var flat = [];

    // function flatten(nested) {

    //   for (var i = 0; i < nested.length; i++) {

    //     if ( isArray(nested[i]) ) {
    //       console.log( nested[i]);
    //     	flatten(nested[i]);
    //     } else {
    //     	flat.push(nested[i]);
    //     }

    //   }

    //   return flat;

    // }

    // function isArray(arr) {
    // 	return arr instanceof Array;
    // }

    // for(let i = 0; i<jsonVlaanderen.features.length; i++){
    //     console.log(flatten(jsonVlaanderen.features[i].geometry.coordinates));
    // }



    // console.log(jsonVlaanderen);
    //setJsonOverheid(jsonOverheid);
    //const result = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv").then((response) => setCsv(papa.parse(response.data, options)));
    // for(let i = 0; i < jsonVlaanderen.features.length; i++){
    //   for(let j = 0; j < jsonVlaanderen.features[i].geometry.coordinates.length; j++){
    //     console.log(jsonVlaanderen.features[i].geometry.coordinates[j].flat(Infinity));
    //     //console.log(jsonVlaanderen.features[i].geometry.coordinates[j][0][0], jsonVlaanderen.features[i].geometry.coordinates[j][0][1]);
    //     //console.log(jsonVlaanderen.features[i].geometry.coordinates[j][0], jsonVlaanderen.features[i].geometry.coordinates[j][1]);
    //     const newCoordinates = lambert72toWGS84(jsonVlaanderen.features[i].geometry.coordinates[j][0][0], jsonVlaanderen.features[i].geometry.coordinates[j][0][1]);
    //     jsonVlaanderen.features[i].geometry.coordinates[j] = newCoordinates;
    //     //console.log(jsonVlaanderen.features[i].geometry.coordinates)
    //   }
    // }
    // const test = lambert72toWGS84(212426.26600000262, 204485.9840000011);
    // console.log(test);
    //setGeojson({...geojson.features[0], ...jsonFromCsv})
    for (let i = 0; i < jsonOverheidtxt.features.length; i++) {
      const municipalityOverheid = jsonOverheidtxt.features[i].properties.name.split('#')[0].toUpperCase();
      let ObjectMunicipalityCsv = '';

      // console.log(municipalityOverheid.split('#')[0].toUpperCase());
      ObjectMunicipalityCsv = testCsv.data.find(element => element.municipality === municipalityOverheid);
      if (ObjectMunicipalityCsv === undefined) {
        jsonOverheidtxt.features[i].properties.mediaan1 = 10000000000000;
      }
      else {
        jsonOverheidtxt.features[i].properties.mediaan1 = ObjectMunicipalityCsv.mediaan1;
      }
    }
    //{ ...jsonOverheidtxt.features[i].properties, ...ObjectMunicipalityCsv }



    //setGeojson(...geojson.features)
  }, [])
  const municipality = zoekGemeente('Aarschot');

  const onHover = useCallback(event => {
    const {
      features,
      point: { x, y }
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
    console.log(hoveredFeature);
  }, []);

  return (

    <Map ref={mapRef}
      interactiveLayerIds={[
        "mediaan prijs"
      ]
      }
      onLoad={
        () => {

          //jsonOverheidtxt.features[0].properties.mediaan1 = 300001;
          // console.log(jsonOverheidtxt);

          // }
          // jsonOverheidtxt.features[0].test = 300001;
          // console.log(jsonOverheidtxt.features[0].test)
          // console.log(jsonOverheidtxt)
        }
      }
      {...viewport}
      onMove={evt => setViewport(evt.viewport)}
      style={{ width: 1519, height: 721 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      onMouseMove={onHover}
      //onMouseLeave={setHoverInfo(null)}
    >
      {hoverInfo && (
        <div className="tooltip">
          <div><div>Gemeente: <span>{hoverInfo.feature.properties.name}</span></div></div>
          <div><div>Provincie: <span>{hoverInfo.feature.properties.province}</span></div></div>
          <div><div>Regio: <span>{hoverInfo.feature.properties.region}</span></div></div>
          <div><div>Shn: <span>{hoverInfo.feature.properties.shn}</span></div></div>
        </div>
      )}
      <div id="state-legend" className="legend">
        <h4>Mediaan prijs (€)</h4>
        <div><div style={{ backgroundColor: '#3C3A38' }}></div>Niet geweten</div>
        <div><div style={{ backgroundColor: '#A0A0A0' }}></div>Undefined</div>
        <div><div style={{ backgroundColor: '#8B4225' }}></div>700000</div>
        <div><div style={{ backgroundColor: '#A25626' }}></div>600000</div>
        <div><div style={{ backgroundColor: '#B86B25' }}></div>500000</div>
        <div><div style={{ backgroundColor: '#CA8323' }}></div>400000</div>
        <div><div style={{ backgroundColor: '#DA9C20' }}></div>300000</div>
        <div><div style={{ backgroundColor: '#E6B71E' }}></div>200000</div>
        <div><div style={{ backgroundColor: '#EED322' }}></div>100000</div>
        <div><div style={{ backgroundColor: '#F2F12D' }}></div>0</div>

      </div>
      <Source id='mediaan prijs' type='geojson' data={jsonOverheidtxt}>
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
                10000000000,
                '#A0A0A0'
              ],
              'fill-opacity': 0.75
            }
          }
          }>
        </Layer>
        {/* <Layer {
          ...{
            'id': 'label',
            'source': 'mediaan prijs',
            'type': 'symbol',
            'layout': {
              'text-field': ['get', 'name'],
              'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
              'text-radial-offset': 0.5,
              'text-size': 15,
              'text-anchor': 'center'
            }
          }
        }></Layer> */}
        {/* {<Layer
        {
          ...{
            'id': 'provinces',
            'source': 'mediaan prijs',
            //'maxzoom': zoomThreshold,
            'type': 'fill',
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'region'],
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
                10000000000,
                '#A0A0A0'
              ],
              'fill-opacity': 0.75
            }
          }
          > 
        </Layer> */}

      </Source>

      {/* <Source id='oost' type='geojson' data={testOostVlaanderen}>
                <Layer
                {
                  ...{
                    'id': 'Oost',
                    'source': 'oost',
                    'type': 'fill',
                    'paint':{
                      'fill-color': '#A0A0A0'
                    }
                    
                  }
                }></Layer>
              </Source> */}

    </Map>
  );
}

export default App;

