import React, { useState, useEffect, useCallback, useMemo } from "react";
import Map, { Source, Layer } from "react-map-gl";
import papa from "papaparse";
import "./index.css";
import axios from "axios";
import geojsonGemeentesVlaanderen from "./Gemeenten.json";
import geojsonProvinciesVlaanderen from "./Provincies.json";
import geojsonArrondissementenVlaanderen from "./ArrondissementenVlaanderen.json";
import ControlPanel from "./control-panel";
import { Legend } from "./components/Legend.js";
import { useDebouncedCallback } from "use-debounce";
import { formatNumber } from "./utils/math";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g";

const rangeColors = ["#F2F12D", "#EED322", "#E6B71E", "#DA9C20", "#CA8323"];

function App() {
  const mapRef = React.useRef();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [year, setYear] = useState(2010);
  const [zoomLvl, setZoomLvl] = useState(6);
  const [testCsv, setTestCsv] = useState();
  const [testCsvProvincies, setTestCsvProvincies] = useState();
  const [testCsvArrondissementen, setTestCsvArrondissementen] = useState();
  const [viewport, setViewport] = useState({
    latitude: 50.616949,
    longitude: 4.88526,
    zoom: zoomLvl,
  });
  const options = {
    delimiter: ";",
    header: true,
    dynamicTyping: true,
    complete: function (results, file) {
      // console.log("Parsing complete:", results, file);
    },
  };

  const geefMedianen = (geo, csv, key) => {
    if (!csv) {
      return [0, 0];
    }
    let laagsteMediaan = csv[0].mediaan1;
    let hoogsteMediaan = csv[0].mediaan1;
    for (const element of csv) {
      if (activeLocation(geo, element, key)) {
        if (
          element.mediaan1 < laagsteMediaan &&
          element.mediaan1 !== null &&
          element.mediaan1 !== undefined
        ) {
          laagsteMediaan = element.mediaan1;
        } else if (
          element.mediaan1 > hoogsteMediaan &&
          element.mediaan1 !== null &&
          element.mediaan1 !== undefined
        ) {
          hoogsteMediaan = element.mediaan1;
        }
      }
    }
    return [laagsteMediaan, hoogsteMediaan];
  };

  const activeLocation = (geo, csvRow, key) => {
    return geo.features.find(
      (feature) =>
        csvRow?.[key]
          ?.split?.(" ")
          [key === "municipality" ? 0 : 1].toUpperCase() ===
        feature.properties.NAAM.toUpperCase()
    );
  };

  const mergeGeojson = (geo, csv, key) => {
    for (const gemeente of geo.features) {
      const ObjectGemeenteCsv = csv.find(
        (element) =>
          element?.[key]
            ?.split?.(" ")
            [key === "municipality" ? 0 : 1].toUpperCase() ===
          gemeente.properties.NAAM.toUpperCase()
      );
      if (ObjectGemeenteCsv) {
        gemeente.properties.mediaan1 = ObjectGemeenteCsv.mediaan1;
      }
    }
    return geo;
  };

  const updateMunicipalitiesByYear = (year) => {
    const activeYearsGemeentes = testCsv.filter(
      (item) => item.year === Number(year)
    );
    mapRef.current
      ?.getSource("municipalities")
      ?.setData(
        mergeGeojson(
          geojsonGemeentesVlaanderen,
          activeYearsGemeentes,
          "municipality"
        )
      );
  };

  const updateArrondissementenByYear = (year) => {
    const activeYearsArrondissementen = testCsvArrondissementen.filter(
      (item) => item.jaar === Number(year)
    );
    mapRef.current
      ?.getSource("arrondissementen")
      ?.setData(
        mergeGeojson(
          geojsonArrondissementenVlaanderen,
          activeYearsArrondissementen,
          "Arrondissement"
        )
      );
  };

  const updateProvinciesByYear = (year) => {
    const activeYearsProvincies = testCsvProvincies.filter(
      (item) => item.jaar === Number(year)
    );
    mapRef.current
      ?.getSource("provincies")
      ?.setData(
        mergeGeojson(
          geojsonProvinciesVlaanderen,
          activeYearsProvincies,
          "provincie"
        )
      );
  };

  const updateYearDebounce = useDebouncedCallback((year) => {
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
    } else if (mapZoomLvl >= 8 && mapZoomLvl < 10) {
      const activeYearsArrondissementen = testCsvArrondissementen.filter(
        (item) => item.jaar === Number(year)
      );
      mapRef.current
        ?.getSource("arrondissementen")
        ?.setData(
          mergeGeojson(
            geojsonArrondissementenVlaanderen,
            activeYearsArrondissementen,
            "Arrondissement"
          )
        );
    } else {
      const activeYearsProvincies = testCsvProvincies.filter(
        (item) => item.jaar === Number(year)
      );
      mapRef.current
        ?.getSource("provincies")
        ?.setData(
          mergeGeojson(
            geojsonProvinciesVlaanderen,
            activeYearsProvincies,
            "provincie"
          )
        );
    }
  }, [
    year,
    testCsvArrondissementen,
    testCsvProvincies,
    testCsv,
    updateYearDebounce,
  ]);

  useEffect(() => {
    const loadData = async () => {
      const csv = await axios.get("http://localhost:3000/NL_immo_jaar_v2.csv");
      const csvProvincies = await axios.get(
        "http://localhost:3000/csvProvincies.csv"
      );
      const csvArrondissementen = await axios.get(
        "http://localhost:3000/csvArrondissementenVlaanderen.csv"
      );
      setTestCsv(papa.parse(csv.data, options).data);
      setTestCsvProvincies(papa.parse(csvProvincies.data, options).data);
      setTestCsvArrondissementen(
        papa.parse(csvArrondissementen.data, options).data
      );
    };
    loadData();
  }, []);

  const onHover = useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
  }, []);

  const ranges = useMemo(() => {
    let csv = testCsvProvincies;
    let geo = geojsonProvinciesVlaanderen;
    let key = "provincie";
    if (zoomLvl > 10) {
      csv = testCsv;
      geo = geojsonGemeentesVlaanderen;
      key = "municipality";
    } else if (zoomLvl > 8 && zoomLvl < 11) {
      csv = testCsvArrondissementen;
      geo = geojsonArrondissementenVlaanderen;
      key = "Arrondissement";
    }
    const [laagste, hoogste] = geefMedianen(geo, csv, key);
    const range = (hoogste - laagste) / rangeColors.length;
    const rangeItems = rangeColors.map((color, index) => {
      const currentRange = laagste + index * range;
      return {
        bgColor: color,
        label: `${formatNumber(currentRange)} - ${formatNumber(
          currentRange + range
        )}`,
        range: currentRange,
      };
    });

    const layerColors = rangeItems.reduce((acc, item) => {
      return [...acc, item.range, item.bgColor];
    }, []);
    console.log(layerColors);
    return { layerColors, rangeItems };
  }, [zoomLvl, testCsvProvincies, testCsv, testCsvArrondissementen]);

  return (
    <>
      <Map
        ref={mapRef}
        interactiveLayerIds={[
          `arrondissementen`,
          "municipalities",
          "provincies",
        ]}
        onLoad={() => {
          updateMunicipalitiesByYear(year);
          updateArrondissementenByYear(year);
          updateProvinciesByYear(year);
        }}
        {...viewport}
        onMove={(evt) => setViewport(evt.viewport)}
        onZoom={(e) => setZoomLvl(e.viewState.zoom)}
        style={{ width: 1519, height: 721 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        onMouseLeave={() => setHoverInfo(null)}
      >
        {hoverInfo && (
          <div className="tooltip">
            <div>
              <span>Naam: {hoverInfo.feature.properties.NAAM}</span>
            </div>
            <div>
              <span>Mediaan: {hoverInfo.feature.properties.mediaan1}</span>
            </div>
          </div>
        )}

        <Legend legendItems={ranges.rangeItems} title={"Mediaan prijs (€)"} />

        <Source
          key={`municipalities`}
          id={`municipalities`}
          type="geojson"
          data={geojsonGemeentesVlaanderen}
        >
          <Layer
            {...{
              id: `municipalities`,
              source: `municipalities`,
              minzoom: 10,
              type: "fill",

              paint: {
                "fill-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "mediaan1"],
                  ...ranges.layerColors,
                ],
                "fill-opacity": 0.75,
              },
            }}
          ></Layer>
          <Layer
            {...{
              id: "outline",
              type: "line",
              source: "mediaan prijs",
              minzoom: 10,
              layout: {},
              paint: {
                "line-color": "#000",
                "line-width": 2,
              },
            }}
          ></Layer>
          {/* <Layer {
            ...{
              'id': 'label',
              'source': 'municipalities',
              'type': 'symbol',
              'layout': {
                'text-field': ['get', 'mediaan1'],
                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                'text-radial-offset': 0.5,
                'text-size': 15,
                'text-anchor': 'center'
              }
            }
          }></Layer> */}
        </Source>

        <Source
          key={`arrondissementen`}
          id={`arrondissementen`}
          type="geojson"
          data={geojsonArrondissementenVlaanderen}
        >
          <Layer
            {...{
              id: `arrondissementen`,
              source: `arrondissementen`,
              minzoom: 8,
              maxzoom: 10.2,
              type: "fill",

              paint: {
                "fill-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "mediaan1"],
                  ...ranges.layerColors,
                ],
                "fill-opacity": 0.75,
              },
            }}
          ></Layer>
          <Layer
            {...{
              id: "outline2",
              type: "line",
              source: "arrondissementen",
              minzoom: 8,
              maxzoom: 10,
              layout: {},
              paint: {
                "line-color": "#000",
                "line-width": 2,
              },
            }}
          ></Layer>
        </Source>

        <Source
          key={`provincies`}
          id={`provincies`}
          type="geojson"
          data={geojsonProvinciesVlaanderen}
        >
          <Layer
            {...{
              id: `provincies`,
              source: `provincies`,
              maxzoom: 8.2,
              type: "fill",

              paint: {
                "fill-color": [
                  "interpolate",
                  ["linear"],
                  ["get", "mediaan1"],
                  ...ranges.layerColors,
                ],
                "fill-opacity": 0.75,
              },
            }}
          ></Layer>
          <Layer
            {...{
              id: "outline3",
              type: "line",
              source: "provincies",
              maxzoom: 8,
              layout: {},
              paint: {
                "line-color": "#000",
                "line-width": 2,
              },
            }}
          ></Layer>
        </Source>
      </Map>

      <ControlPanel year={year} onChange={(value) => setYear(value)} />
    </>
  );
}

export default App;
