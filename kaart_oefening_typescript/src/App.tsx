// import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Map, { Source, Layer, MapRef } from 'react-map-gl';
import './index.css';
import ControlPanel from './control-panel';
import { Legend } from './components/Legend';
import { formatNumber } from './utils/math';
import './App.css';
import dataLayers from './result.json';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Feature } from 'geojson';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';

const rangeColors = ['#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'];

interface CsvRow {
  year?: number;
  jaar?: number;
  mediaan1: number;
  naam: string;
}

interface DataLayer {
  id: string;
  key: string;
  csv: CsvRow[];
  geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  minZoom: number;
  maxZoom: number;
}

function App() {
  const mapRef = useRef<MapRef | null>(null);
  const sourceLayers = dataLayers as DataLayer[];
  const [year, setYear] = useState<number>(2010);
  const [hoverInfo, setHoverInfo] = useState<Feature | null>(null);
  const interactiveLayerIds = sourceLayers.map((dataLayer) => dataLayer.id);
  const [zoom, setZoom] = useState<number>(7);
  const [viewport, setViewport] = useState({
    latitude: 50.616949,
    longitude: 4.88526,
    zoom: zoom,
  });

  const [activeLayer, setActiveLayer] = useState<DataLayer>(sourceLayers[0]);
  const getActiveLayer = (zoom: number): DataLayer => {
    return sourceLayers.find((dataLayer) => dataLayer.maxZoom >= zoom && dataLayer.minZoom < zoom) || sourceLayers[0];
  };

  const updateLayerByYear = (jaartal: number | string, dataLayer: DataLayer) => {
    const csvFilteredRows = dataLayer.csv.filter(
      (item) => item[dataLayer.id === 'gemeentes' ? 'year' : 'jaar'] === Number(jaartal)
    );
    const geoJson = getMergedGeojson(dataLayer.geoJson, csvFilteredRows, dataLayer.key);
    console.log(geoJson);
    mapRef.current
      ?.getSource(dataLayer.id)
      //@ts-ignore
      ?.setData(geoJson);
  };

  const updateYearDebounce = useDebouncedCallback((jaartal, activeLayer) => {
    updateLayerByYear(jaartal, activeLayer);
  }, 0);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    updateYearDebounce(year, activeLayer);
  }, [year, mapRef, updateYearDebounce, activeLayer]);

  useEffect(() => {
    const newActiveLayer: DataLayer = getActiveLayer(zoom);
    if (newActiveLayer.id !== activeLayer.id) {
      setActiveLayer(newActiveLayer);
    }
  }, [zoom, activeLayer]);

  const getMediaanRange = (csv: CsvRow[]) => {
    const min = csv.reduce((acc, row) => Math.min(row.mediaan1 ?? Number.MAX_VALUE, acc), Number.MAX_VALUE);
    const max = csv.reduce((acc, row) => Math.max(row.mediaan1 ?? 0, acc), 0);
    return [min, max];
  };

  const getMergedGeojson = (
    geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
    csv: CsvRow[],
    key: string
  ): GeoJSON.FeatureCollection<GeoJSON.Geometry> => {
    return {
      ...geoJson,
      features: geoJson.features.map((feature) => {
        const row: CsvRow | undefined = csv.find((element) => element?.naam === feature.properties?.NAAM.toUpperCase());
        return {
          ...feature,
          properties: {
            ...feature.properties,
            mediaanFormatted: formatNumber(row?.mediaan1),
            mediaan1: row?.mediaan1 ?? 'noMediaan',
          },
        };
      }),
    };
  };

  const onHover = useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(hoveredFeature);
  }, []);

  const ranges = useMemo(() => {
    const [laagste, hoogste] = getMediaanRange(activeLayer.csv);
    const range = (hoogste - laagste) / rangeColors.length;
    const rangeItems: { bgColor: string; label: string; range: number }[] = rangeColors.map((color, index) => {
      const currentRange = laagste + index * range;
      return {
        bgColor: color,
        label: `${formatNumber(currentRange)} - ${formatNumber(currentRange + range)}`,
        range: currentRange,
      };
    });
    //@ts-ignore
    const layerColors: Array<number | string> = rangeItems.reduce(
      //@ts-ignore
      (acc, item): Array<number | string> => [...acc, item.range, item.bgColor],
      []
    );
    return { layerColors, rangeItems };
  }, [activeLayer]);

  return (
    <>
      <Map
        ref={mapRef}
        interactiveLayerIds={interactiveLayerIds}
        onLoad={() => {
          updateLayerByYear(year, activeLayer);
        }}
        {...viewport}
        //@ts-ignore
        onMove={(evt) => setViewport(evt.viewport)}
        onZoom={(e) => setZoom(e.viewState.zoom)}
        style={{ width: 1920, height: 900 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        onMouseLeave={() => setHoverInfo(null)}
      >
        {hoverInfo && (
          <div className="tooltip">
            <div>
              <span>Naam: {hoverInfo.properties?.NAAM}</span>
            </div>
            <div>
              <span>Mediaan: {hoverInfo.properties?.mediaan1}</span>
            </div>
          </div>
        )}

        <Legend legendItems={ranges.rangeItems} title={'Mediaan prijs (€)'} />

        {sourceLayers.map((sourceLayer) => (
          <Source key={sourceLayer.id} id={sourceLayer.id} type="geojson" data={sourceLayer.geoJson}>
            <Layer
              {...{
                type: 'fill',
                id: `${sourceLayer.id}`,
                source: sourceLayer.id,
                minzoom: sourceLayer.minZoom,
                maxzoom: sourceLayer.maxZoom + 0.2,
                filter: ['!=', 'mediaan1', 'noMediaan'],
                paint: {
                  'fill-color': ['interpolate', ['linear'], ['get', 'mediaan1'], ...ranges.layerColors],
                  'fill-opacity': 1,
                },
              }}
            ></Layer>
            <Layer
              {...{
                id: `${sourceLayer.id}-outline`,
                type: 'line',
                source: sourceLayer.id,
                minzoom: sourceLayer.minZoom,
                maxzoom: sourceLayer.maxZoom + 0.2,
                layout: {},
                paint: {
                  'line-color': '#000',
                  'line-width': 2,
                },
              }}
            ></Layer>
            <Layer
              {...{
                id: `${sourceLayer.id}-symbol`,
                type: 'symbol',
                source: sourceLayer.id,
                minzoom: sourceLayer.minZoom,
                maxzoom: sourceLayer.maxZoom + 0.2,
                filter: ['!=', 'mediaan1', 'noMediaan'],
                layout: {
                  'text-field': ['concat', ['get', 'NAAM'], '\n', ['get', 'mediaanFormatted']],
                  'symbol-placement': 'point',
                },
              }}
            ></Layer>
          </Source>
        ))}
      </Map>

      <ControlPanel year={year} onChange={(value) => setYear(value)} />
    </>
  );
}

export default App;
