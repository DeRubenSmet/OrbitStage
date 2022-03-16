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
import { Legend } from './components/Legend.js';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';

const legendItemsGemeentes = [
  {
      label: "Niet geweten",
      bgColor: "#3C3A38",
  },
  {
      label: "Undefined",
      bgColor: "#A0A0A0",
  },
  {
    label: "700000",
    bgColor: "#8B4225",
  },
  {
    label: "600000",
    bgColor: "#A25626",
  },  
  {
    label: "500000",
    bgColor: "#B86B25",
  },
  {
    label: "400000",
    bgColor: "#CA8323",
  },
  {
    label: "300000",
    bgColor: "#DA9C20",
  },
  {
    label: "200000",
    bgColor: "#E6B71E",
  },
  {
    label: "100000",
    bgColor: "#EED322",
  },
  {
    label: "0",
    bgColor: "#F2F12D",
  },
]

const legendItemsArrondissementen = [
  {
      label: "Niet geweten",
      bgColor: "#3C3A38",
  },
  {
      label: "Undefined",
      bgColor: "#A0A0A0",
  },
  {
    label: "241",
    bgColor: "#CA8323",
  },
  {
    label: "214",
    bgColor: "#DA9C20",
  },
  {
    label: "184.99",
    bgColor: "#E6B71E",
  },
  {
    label: "183",
    bgColor: "#EED322",
  },
  {
    label: "179",
    bgColor: "#F2F12D",
  },
]

const legendItemsProvincies = [
  {
      label: "Niet geweten",
      bgColor: "#3C3A38",
  },
  {
      label: "Undefined",
      bgColor: "#A0A0A0",
  },
  {
    label: "241",
    bgColor: "#CA8323",
  },
  {
    label: "214",
    bgColor: "#DA9C20",
  },
  {
    label: "184.99",
    bgColor: "#E6B71E",
  },
  {
    label: "183",
    bgColor: "#EED322",
  },
  {
    label: "179",
    bgColor: "#F2F12D",
  },
]

function App() {
  const [keyData, setKeyData] = useState(Math.random());
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
  const [year, setYear] = useState(2010);
  const [allData, setAllData] = useState(null);
  const [legendItemsLayer, setLegendItemsLayer] = useState(legendItemsProvincies);
  const [stateGeojsonArrondissementenVlaanderen, setStateGeojsonArrondissementenVlaanderen] = useState([]);
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
  const [testCsv, setTestCsv] = useState([]);
  const [testCsvProvincies, setTestCsvProvincies] = useState([]);
  const [testCsvArrondissementen, setTestCsvArrondissementen] = useState([]);
  useEffect(() => {
    (async() => {
      const csv = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv");
      const csvProvincies = await axios.get("http://localhost:3000/csvProvincies.csv");
      const csvArrondissementen = await axios.get("http://localhost:3000/csvArrondissementenVlaanderen.csv");
      //setJsonFromCsv(papa.parse(csv.data, options));
      setTestCsv(papa.parse(csv.data, options));
      setTestCsvProvincies(papa.parse(csvProvincies.data, options));
      setTestCsvArrondissementen(papa.parse(csvArrondissementen.data, options));
    })()
  }, [])

  useEffect(function getJsonFromCsv() {
    
    //const jsonOverheid = await axios.get("https://raw.githubusercontent.com/Datafable/rolling-blackout-belgium/master/data/geospatial/municipalities-belgium.geojson");
    
    
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
      

      // console.log(municipalityOverheid.split('#')[0].toUpperCase());
      const ObjectMunicipalityCsv = testCsv.data.filter(element => element.municipality === municipalityOverheid && element.year === year);
      if (ObjectMunicipalityCsv === undefined) {
        geojsonGemeentesVlaanderen.features[i].properties.mediaan1 = 10000000000000;
      }
      else {
        console.log(ObjectMunicipalityCsv);
        geojsonGemeentesVlaanderen.features[i].properties.mediaan1 = ObjectMunicipalityCsv[0].mediaan1;
      }
    }
    // const activeProvinceYears = testCsvProvincies.data.filter((item) => item.jaar === Number(year));
    // for(const province of geojsonProvinciesVlaanderen.features){

    //   const ObjectProvinceCsv = activeProvinceYears.find(element => element?.provincie?.split?.(' ')[1].toUpperCase() === province.properties.NAAM.toUpperCase());
      
    //   province.properties.mediaan1 = Number(ObjectProvinceCsv.mediaan1);
    // }
    console.log(testCsvArrondissementen);
    const activeYears = testCsvArrondissementen.data.filter((item) => item.jaar === Number(year));
    for(const arrondissement of geojsonArrondissementenVlaanderen.features){
      // console.log(testCsvArrondissementen);
      const ObjectArrondissementCsv = activeYears.find(element => element?.Arrondissement?.split?.(' ')[1].toUpperCase() === arrondissement.properties.NAAM.toUpperCase());
      
      arrondissement.properties.mediaan1 = Number(ObjectArrondissementCsv.mediaan1);
      console.log(arrondissement.properties.mediaan1);
      // for(let i = 0; i < stateGeojsonArrondissementenVlaanderen.features)
      // console.log(arrondissement.properties.mediaan1);
    }
    
    setStateGeojsonArrondissementenVlaanderen(geojsonArrondissementenVlaanderen);
    setKeyData(Math.random());
    // setGeojsonArrondissementen()
    //{ ...geojsonGemeentesVlaanderen.features[i].properties, ...ObjectMunicipalityCsv } 
    //setGeojson(...geojson.features)
  }, [year])

  //useEffect(() => {setStateGeojsonArrondissementenVlaanderen(stateGeojsonArrondissementenVlaanderen)}, [stateGeojsonArrondissementenVlaanderen]);
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

  // const data = useMemo(() => {
  //   setYear(year); //&& updatePercentiles(allData, f => f.properties.income[year])
  // }, [allData, year]);
  //return <> {JSON.stringify(stateGeojsonArrondissementenVlaanderen?.features.map((feature) => feature.properties.mediaan1))} <ControlPanel year={year} onChange={value => setYear(value)} /></>
  return (
<>
    <Map ref={mapRef}
      interactiveLayerIds={[
        "arrondissementen",
      ]
      }
      onLoad={
        () => {

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
      onZoom={() => {if(mapRef.current.getZoom() > 10){setLegendItemsLayer(legendItemsGemeentes)} 
                    else if(mapRef.current.getZoom() > 8 && mapRef.current.getZoom() < 11){setLegendItemsLayer(legendItemsArrondissementen)} 
                    else{setLegendItemsLayer(legendItemsProvincies)}}}
      //onZoom={() => {if(mapRef.current.getZoom() > 4){mapRef.current.getLayer('provincies') = 'block'; mapRef.current.getLayer('mediaan prijs').style.display = 'none';} 
      //else{mapRef.current.getLayer('mediaan prijs').style.display = 'block'; mapRef.current.getLayer('provincies').style.display = 'none';}}}
    >
      {hoverInfo && (
        <div className="tooltip">
          <div><span>{hoverInfo.feature.properties.mediaan1}</span></div>
          {/* <div><div>Provincie: <span>{hoverInfo.feature.properties.province}</span></div></div>
          <div><div>Regio: <span>{hoverInfo.feature.properties.region}</span></div></div>
          <div><div>Shn: <span>{hoverInfo.feature.properties.shn}</span></div></div> */}
        </div>
      )}
      {/* {displayLegend && (<div id="legend" className="legend" style={{display: {displayLegend}}}>
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

      </div>)} */}

      
      <Legend legendItems={legendItemsLayer} title={'Mediaan prijs (€)'}/>
      
      {/* <Source id='mediaan prijs' type='geojson' data={geojsonGemeentesVlaanderen}>
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
        <Layer
        {
          ...
            {
              'id': 'outline',
              'type': 'line',
              'source': 'mediaan prijs',
              'minzoom': 10,
              'layout': {},
              'paint': {
              'line-color': '#000',
              'line-width': 2
              }
              
          }}></Layer> */}
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

      {/* </Source> */}
      <Source id={'arrondissementen' + keyData} type='geojson' data={stateGeojsonArrondissementenVlaanderen}>
        <Layer {
        ...{
          'key': 'arrondissementen' + keyData,
          'id': 'arrondissementen',
          'source': 'arrondissementen' + keyData,
          'minzoom': 8,
          'maxzoom': 10,
          'type': 'fill',

            'paint': {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'mediaan1'],
                179,
                '#FF0000',
                183,
                '#00FF00',
                184.99,
                '#0000FF',
                214,
                '#FFFF00',
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
        <Layer
        {
          ...
            {
              'id': 'outline2' + keyData,
              'type': 'line',
              'source': 'mediaan prijs',
              'minzoom': 8,
              'maxzoom': 10,
              'layout': {},
              'paint': {
              'line-color': '#000',
              'line-width': 2
              }
              
          }}></Layer>
      
      </Source>
      {/* <Source id='provincies' type='geojson' data={geojsonProvinciesVlaanderen}>
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
        <Layer
        {
          ...
            {
              'id': 'outline3',
              'type': 'line',
              'source': 'mediaan prijs',
              'maxzoom': 8,
              'layout': {},
              'paint': {
              'line-color': '#000',
              'line-width': 2
              }
              
          }}></Layer>     
      </Source> */}
    </Map>      

          <button onClick={() => setYear(2015)}>2015</button>

    <ControlPanel year={year} onChange={value => setYear(value)} />
    </>
  );
}

export default App;

