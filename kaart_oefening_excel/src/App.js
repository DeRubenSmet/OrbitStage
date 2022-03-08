import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';
import papa from 'papaparse'
import './index.css';
import axios from 'axios';
import geojsonGemeentesVlaanderen from './Gemeenten.json';
import jsonVlaanderen from './provinciesVlaanderen.json';
import geojsonProvinciesVlaanderen from './Provincies.json';
import geojsonArrondissementenVlaanderen from './ArrondissementenVlaanderen.json';
// import {dataLayer} from './map-style';
import ControlPanel from './control-panel';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';

const legendItems = [
  {
      label: "Niet geweten",
      bgColor: "#3C3A38",
  },
  {
      label: "Undefined",
      bgColor: "#A0A0A0",
  },
  // <div><div style={{ backgroundColor: '#3C3A38' }}></div>Niet geweten</div>
  // <div><div style={{ backgroundColor: '#A0A0A0' }}></div>Undefined</div>
  // <div><div style={{ backgroundColor: '#8B4225' }}></div>700000</div>
  // <div><div style={{ backgroundColor: '#A25626' }}></div>600000</div>
  // <div><div style={{ backgroundColor: '#B86B25' }}></div>500000</div>
  // <div><div style={{ backgroundColor: '#CA8323' }}></div>400000</div>
  // <div><div style={{ backgroundColor: '#DA9C20' }}></div>300000</div>
  // <div><div style={{ backgroundColor: '#E6B71E' }}></div>200000</div>
  // <div><div style={{ backgroundColor: '#EED322' }}></div>100000</div>
  // <div><div style={{ backgroundColor: '#F2F12D' }}></div>0</div>
]

function App() {
  const mapRef = React.useRef();
  const [jsonFromCsv, setJsonFromCsv] = useState('');
  const [Gemeente, setGemeente] = useState({});
  const [filteredMunicipalities, setFilteredMunicipalities] = useState({});
  const [geojson, setGeojson] = useState({});
  const [hoverInfo, setHoverInfo] = useState(null);
  const [fillOpacityMediaanPrijs, setFillOpacityMediaanPrijs] = useState(0.75);
  const [fillOpacityProvincies, setFillOpacityProvincies] = useState(0.75);
  const [loaded, setLoaded] = useState(false);
  const [displayLegend, setDisplayLegend] = useState('none');
  const [year, setYear] = useState(2015);
  const [allData, setAllData] = useState(null);
  //const [jsonOverheid, setJsonOverheid] = useState('');
  const [viewport, setViewport] = useState({
    latitude: 50.616949,
    longitude: 4.885260,
    zoom: 6,

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

  const ZoekProvincie = (provincie) => {
    const province = geojsonProvinciesVlaanderen.features.find(feature => feature.properties.name === provincie);
    return province;
  }

  const zoekGemeente = (gemeente) => {
    const municipality = geojsonGemeentesVlaanderen.features.find(feature => feature.properties.name === gemeente);
    return municipality;
  }

  // const zoekGemeente2 = () => {
  //     const result = jsonFromCsv.data.filter(element => element[2] === '2010' && element[4] > 100);
  //     setFilteredMunicipalities(result);
  // }

  const [coordinatesJsonVlaanderen, setCoordinatesJsonVlaanderen] = useState([]);

  useEffect(async function getJsonFromCsv() {
    //const jsonOverheid = await axios.get("https://raw.githubusercontent.com/Datafable/rolling-blackout-belgium/master/data/geospatial/municipalities-belgium.geojson");
    const csv = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv");
    const csvProvincies = await axios.get("http://localhost:3000/csvProvincies.csv");
    const csvArrondissementen = await axios.get("http://localhost:3000/csvArrondissementenVlaanderen.csv");
    //setJsonFromCsv(papa.parse(csv.data, options));
    const testCsv = papa.parse(csv.data, options);
    const testCsvProvincies = papa.parse(csvProvincies.data, options);
    const testCsvArrondissementen = papa.parse(csvArrondissementen.data, options);
    console.log(testCsvArrondissementen);
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
    for (let i = 0; i < geojsonGemeentesVlaanderen.features.length; i++) {
      
      const municipalityOverheid = geojsonGemeentesVlaanderen.features[i].properties.NAAM.split('#')[0].toUpperCase();
      
      let ObjectMunicipalityCsv = '';

      // console.log(municipalityOverheid.split('#')[0].toUpperCase());
      ObjectMunicipalityCsv = testCsv.data.find(element => element.municipality === municipalityOverheid);
      if (ObjectMunicipalityCsv === undefined) {
        geojsonGemeentesVlaanderen.features[i].properties.mediaan1 = 10000000000000;
      }
      else {
        geojsonGemeentesVlaanderen.features[i].properties.mediaan1 = ObjectMunicipalityCsv.mediaan1;
      }
    }
    for(const province of geojsonProvinciesVlaanderen.features){

      const ObjectProvinceCsv = testCsvProvincies.data.find(element => element?.provincie?.split?.(' ')[1].toUpperCase() === province.properties.NAAM.toUpperCase());
      
      province.properties.mediaan1 = ObjectProvinceCsv.mediaan1;
    }
    for(const arrondissement of geojsonArrondissementenVlaanderen.features){
      // console.log(testCsvArrondissementen);
      const ObjectArrondissementCsv = testCsvArrondissementen.data.find(element => element?.Arrondissement?.split?.(' ')[1].toUpperCase() === arrondissement.properties.NAAM.toUpperCase());
      arrondissement.properties.mediaan1 = ObjectArrondissementCsv.mediaan1;
      
      
    }
    //{ ...geojsonGemeentesVlaanderen.features[i].properties, ...ObjectMunicipalityCsv } 
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
    // console.log(hoveredFeature);
  }, []);

  const data = useMemo(() => {
    return allData; //&& updatePercentiles(allData, f => f.properties.income[year])
  }, [allData, year]);

  return (
<>
    <Map ref={mapRef}
      interactiveLayerIds={[
        "mediaan prijs",
        "arrondissementen",
        "provincies"
      ]
      }
      onLoad={
        () => {
          setLoaded(true);

          //geojsonGemeentesVlaanderen.features[0].properties.mediaan1 = 300001;
          // console.log(geojsonGemeentesVlaanderen);

          // }
          // geojsonGemeentesVlaanderen.features[0].test = 300001;
          // console.log(geojsonGemeentesVlaanderen.features[0].test)
          // console.log(geojsonGemeentesVlaanderen)
        }
      }
      {...viewport}
      onMove={evt => setViewport(evt.viewport)}
      style={{ width: 1519, height: 721 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      onMouseMove={onHover}
      onMouseLeave={()=>setHoverInfo(null)}
      onZoom={() => {if(mapRef.current.getZoom() < 8){setDisplayLegend('none')}else{setDisplayLegend('block')}
    console.log(displayLegend)}}
      //onZoom={() => {if(mapRef.current.getZoom() > 4){mapRef.current.getLayer('provincies') = 'block'; mapRef.current.getLayer('mediaan prijs').style.display = 'none';} 
      //else{mapRef.current.getLayer('mediaan prijs').style.display = 'block'; mapRef.current.getLayer('provincies').style.display = 'none';}}}
    >
      {hoverInfo && (
        <div className="tooltip">
          <div><div>Gemeente: <span>{hoverInfo.feature.properties.NAAM}</span></div></div>
          {/* <div><div>Provincie: <span>{hoverInfo.feature.properties.province}</span></div></div>
          <div><div>Regio: <span>{hoverInfo.feature.properties.region}</span></div></div>
          <div><div>Shn: <span>{hoverInfo.feature.properties.shn}</span></div></div> */}
        </div>
      )}
      {displayLegend && (<div id="legend" className="legend" style={{display: {displayLegend}}}>
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

      </div>)}
      

      <Source id='mediaan prijs' type='geojson' data={geojsonGemeentesVlaanderen}>
        <Layer 
          {
          ...{
            'id': 'mediaan prijs',
            'source': 'mediaan prijs',
            //'maxzoom': zoomThreshold,
            'minzoom': 10,
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
      <Source id='arrondissementen' type='geojson' data={geojsonArrondissementenVlaanderen}>
        <Layer {
        ...{
          'id': 'arrondissementen',
          'source': 'arrondissementen',
          'minzoom': 8,
          'maxzoom': 10,
          'type': 'fill',

            'paint': {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'mediaan1'],
                179,
                '#F2F12D',
                183,
                '#EED322',
                184.99,
                '#E6B71E',
                214,
                '#DA9C20',
                241,
                '#CA8323',
                600000,
                '#B86B25',
                610000,
                '#A25626',
                700000,
                '#8B4225',
                10000000000,
                '#A0A0A0'
              ],
              'fill-opacity': 0.75
            }
        }}>

        </Layer>
        
      
        </Source>
        <Source id='provincies' type='geojson' data={geojsonProvinciesVlaanderen}>
        <Layer {

        ...{
          'id': 'provincies',
          'source': 'provincies',
          'maxzoom': 8,
          'type': 'fill',

            'paint': {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'mediaan1'],
                179,
                '#F2F12D',
                183,
                '#EED322',
                184.99,
                '#E6B71E',
                214,
                '#DA9C20',
                241,
                '#CA8323',
                600000,
                '#B86B25',
                610000,
                '#A25626',
                700000,
                '#8B4225',
                10000000000,
                '#A0A0A0'
              ],
              'fill-opacity': 0.75
            }
        }}>
        </Layer>      
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
    <ControlPanel year={year} onChange={value => setYear(value)} />
    </>
  );
}

export default App;

