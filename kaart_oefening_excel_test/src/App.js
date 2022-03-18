import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import Map, { Source, Layer } from 'react-map-gl';
import papa from 'papaparse'
import './index.css';
import axios from 'axios';
import geojsonGemeentesVlaanderen from './Gemeenten.json';
import geojsonProvinciesVlaanderen from './Provincies.json';
import geojsonArrondissementenVlaanderen from './ArrondissementenVlaanderen.json';
import ControlPanel from './control-panel';
import { Legend } from './components/Legend.js';
import { useDebouncedCallback } from "use-debounce";

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
  const mapRef = React.useRef();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [year, setYear] = useState(2010);
  const [legendItemsLayer, setLegendItemsLayer] = useState(legendItemsProvincies);
  const [stateGeojsonArrondissementenVlaanderen, setStateGeojsonArrondissementenVlaanderen] = useState(geojsonArrondissementenVlaanderen);
  const [stateGeojsonGemeentesVlaanderen, setStateGeojsonGemeentesVlaanderen] = useState(geojsonGemeentesVlaanderen);
  const [stateGeojsonProvinciesVlaanderen, setStateGeojsonProvinciesVlaanderen] = useState(geojsonProvinciesVlaanderen);
  const [testCsv, setTestCsv] = useState([]);
  const [testCsvProvincies, setTestCsvProvincies] = useState();
  const [testCsvArrondissementen, setTestCsvArrondissementen] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 50.616949,
    longitude: 4.885260,
    zoom: 6,
  });
  const options = {
    delimiter: ';', header: true, dynamicTyping: true, complete: function (results, file) {
      // console.log("Parsing complete:", results, file);
    }
  };

  const mergeProvincies = (geo, csv) => {
    for (const province of geo.features) {
      const ObjectProvinceCsv = csv.find(element => element?.provincie?.split?.(' ')[1].toUpperCase() === province.properties.NAAM.toUpperCase());
      if (ObjectProvinceCsv) {
        province.properties.mediaan1 = ObjectProvinceCsv.mediaan1;
      }
    }
    return geo;
  }

  const mergeArrondissementen = (geo, csv) => {
    for (const arrondissement of geo.features) {
      const ObjectArrondissementCsv = csv.find(element => element?.Arrondissement?.split?.(' ')[1].toUpperCase() === arrondissement.properties.NAAM.toUpperCase());
      if (ObjectArrondissementCsv) {
        arrondissement.properties.mediaan1 = ObjectArrondissementCsv.mediaan1;
      }
    }
    return geo;
  }

  const mergeGemeentes = (geo, csv) => {
    for (const gemeente of geo.features) {
      const ObjectGemeenteCsv = csv.find(element => element?.municipality?.split?.(' ')[0].toUpperCase() === gemeente.properties.NAAM.toUpperCase());
      if (ObjectGemeenteCsv) {
        gemeente.properties.mediaan1 = ObjectGemeenteCsv.mediaan1;
      }
    }
    return geo;
  }

  const updateMunicipalitiesByYear = (year) => {
    const activeYearsGemeentes = testCsv.filter((item) => item.year === Number(year));
    mapRef.current?.getSource('municipalities')?.setData(mergeGemeentes(geojsonGemeentesVlaanderen, activeYearsGemeentes));
  }

  const updateArrondissementenByYear = (year) => {
    const activeYearsArrondissementen = testCsvArrondissementen.filter((item) => item.jaar === Number(year));
    mapRef.current?.getSource('arrondissementen')?.setData(mergeArrondissementen(geojsonArrondissementenVlaanderen, activeYearsArrondissementen));
  }

  const updateProvinciesByYear = (year) => {
    const activeYearsProvincies = testCsvProvincies.filter((item) => item.jaar === Number(year));
    console.log(activeYearsProvincies);
    mapRef.current?.getSource('provincies')?.setData(mergeProvincies(geojsonProvinciesVlaanderen, activeYearsProvincies));
  }

  const updateYearDebounce = useDebouncedCallback(year => {
    updateMunicipalitiesByYear(year);
    updateArrondissementenByYear(year);
    updateProvinciesByYear(year);
  }, 1000);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    const mapZoomLvl = mapRef.current.getZoom();
    updateYearDebounce(year);
    if (mapZoomLvl >= 10) {
      updateMunicipalitiesByYear(year);
    }
    else if (mapZoomLvl >= 8 && mapZoomLvl < 10) {
      const activeYearsArrondissementen = testCsvArrondissementen.filter((item) => item.jaar === Number(year));
      mapRef.current?.getSource('arrondissementen')?.setData(mergeArrondissementen(geojsonArrondissementenVlaanderen, activeYearsArrondissementen));
    }
    else {
      const activeYearsProvincies = testCsvProvincies.filter((item) => item.jaar === Number(year));
      mapRef.current?.getSource('provincies')?.setData(mergeProvincies(geojsonProvinciesVlaanderen, activeYearsProvincies));
    }
  }, [year, testCsvArrondissementen, testCsvProvincies, testCsv, updateYearDebounce])

  useEffect(() => {
    if (testCsvProvincies) {
      updateProvinciesByYear(year);
    }
  }, [testCsvProvincies])

  useEffect(() => {
    const loadData = async () => {
      const csv = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv");
      const csvProvincies = await axios.get("http://localhost:3000/csvProvincies.csv");
      const csvArrondissementen = await axios.get("http://localhost:3000/csvArrondissementenVlaanderen.csv");
      setTestCsv(papa.parse(csv.data, options).data);
      setTestCsvProvincies(papa.parse(csvProvincies.data, options).data);
      setTestCsvArrondissementen(papa.parse(csvArrondissementen.data, options).data);
    }
    loadData();
  }, [])

  const onHover = useCallback(event => {
    const {
      features,
      point: { x, y }
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
  }, []);

  return (
    <>
      <Map ref={mapRef}

        interactiveLayerIds={[
          `arrondissementen`,
          'municipalities',
          'provincies'
        ]
        }
        onLoad={
          () => {
            updateMunicipalitiesByYear(year);
            updateArrondissementenByYear(year);
            updateProvinciesByYear(year);
          }
        }
        {...viewport}
        onMove={evt => setViewport(evt.viewport)}
        style={{ width: 1519, height: 721 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        onMouseLeave={() => setHoverInfo(null)}
        onZoom={() => {
          if (mapRef.current.getZoom() > 10) { setLegendItemsLayer(legendItemsGemeentes) }
          else if (mapRef.current.getZoom() > 8 && mapRef.current.getZoom() < 11) { setLegendItemsLayer(legendItemsArrondissementen) }
          else { setLegendItemsLayer(legendItemsProvincies) }
        }}
      >
        {hoverInfo && (
          <div className="tooltip">
            <div><span>{hoverInfo.feature.properties.mediaan1}</span></div>
          </div>
        )}

        <Legend legendItems={legendItemsLayer} title={'Mediaan prijs (€)'} />

        <Source key={`municipalities`} id={`municipalities`} type='geojson' data={stateGeojsonGemeentesVlaanderen}>
          <Layer
            {
            ...{
              'id': `municipalities`,
              'source': `municipalities`,
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

            }}></Layer>
        </Source>

        <Source key={`arrondissementen`} id={`arrondissementen`} type='geojson' data={stateGeojsonArrondissementenVlaanderen}>
          <Layer {
            ...{
              'id': `arrondissementen`,
              'source': `arrondissementen`,
              'minzoom': 8,
              'maxzoom': 10.2,
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
              'id': 'outline2',
              'type': 'line',
              'source': 'arrondissementen',
              'minzoom': 8,
              'maxzoom': 10,
              'layout': {},
              'paint': {
                'line-color': '#000',
                'line-width': 2
              }

            }}></Layer>

        </Source>

        <Source key={`provincies`} id={`provincies`} type='geojson' data={stateGeojsonProvinciesVlaanderen}>
          <Layer {

            ...{
              'id': `provincies`,
              'source': `provincies`,
              'maxzoom': 8.2,
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
                  '#FF0000',
                  214,
                  '#DA9C20',
                  241,
                  '#CA8323',
                  // 600000,
                  // '#B86B25',
                  // 610000,
                  // '#A25626',
                  // 700000,
                  // '#8B4225',
                  // 10000000000,
                  // '#A0A0A0'
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
              'source': 'provincies',
              'maxzoom': 8,
              'layout': {},
              'paint': {
                'line-color': '#000',
                'line-width': 2
              }

            }}></Layer>
        </Source>

      </Map>

      <ControlPanel year={year} onChange={value => setYear(value)} />
    </>
  );
}

export default App;
