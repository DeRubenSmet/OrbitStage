import * as fs from 'fs';
import papa from 'papaparse';

const dataLayers: { id: string; key: string; minZoom: number; maxZoom: number }[] = [
  { id: 'provincies', key: 'provincie', minZoom: 0, maxZoom: 8 },
  { id: 'arrondissementen', key: 'Arrondissement', minZoom: 8, maxZoom: 10 },
  { id: 'gemeentes', key: 'municipality', minZoom: 10, maxZoom: 22 },
];

const options = {
  delimiter: ';',
  header: true,
  dynamicTyping: true,
  complete: function (results, file) {
    // console.log("Parsing complete:", results, file);
  },
};

const getFilteredData = (
  geo: GeoJSON.FeatureCollection<GeoJSON.Geometry>,
  csv: {jaar: number, year: number, mediaan1: number }[],
  key: string
): object[] => {
  return csv
    .filter((row) => {
      return geo.features.find(
        (feature) =>
          row?.[key]?.split?.(' ')[key === 'municipality' ? 0 : 1].toUpperCase() ===
          feature.properties.NAAM.toUpperCase()
      );
    })
    .map((row) => {
      return {
        ...row,
        mediaan1: key !== 'municipality' ? row.mediaan1 * 1000 : row.mediaan1,
        naam: row?.[key]?.split?.(' ')[key === 'municipality' ? 0 : 1].toUpperCase(),
        jaar: row?.jaar || row?.year
      };
    });
};

const createDatalayers = () => {
  const result = dataLayers.map((dataLayer) => {
    const csv = fs.readFileSync(`src/data/${dataLayer.id}.csv`);
    const geo = fs.readFileSync(`src/data/${dataLayer.id}.json`);
    const csvData = papa.parse(csv.toString(), options).data;
    const geoJson = JSON.parse(geo.toString());
    return { csv: getFilteredData(geoJson, csvData, dataLayer.key), geoJson, ...dataLayer };
  });
  fs.writeFileSync('../kaart_oefening_typescript/src/result.json', JSON.stringify(result));
};

createDatalayers();
