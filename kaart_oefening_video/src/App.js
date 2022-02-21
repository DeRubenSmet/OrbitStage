import * as React from 'react';
import {useState} from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmFyYmFyb3NzbyIsImEiOiJja3ptd2Zlb3AwMDIyMm9xb3B3bjhqYjJiIn0.R0SXEE12p1SX1UbF7wqZ7g';
const videoSource = {
  'id': 'video',
  'type': 'video',
  'urls': [
    'https://static-assets.mapbox.com/mapbox-gl-js/drone.mp4',
    'https://static-assets.mapbox.com/mapbox-gl-js/drone.webm'
  ],
  'coordinates': [
    [-122.51596391201019, 37.56238816766053],
    [-122.51467645168304, 37.56410183312965],
    [-122.51309394836426, 37.563391708549425],
    [-122.51423120498657, 37.56161849366671]
  ]
}
const satelliteSource = {
  'id': 'raster',
  'type': 'raster',
  'url': 'mapbox://mapbox.satellite',
  'tileSize': 256
}
function App() {
  const mapRef = React.useRef();
  const vidRef = React.useRef();
  const [playingVideo, setPlayingVideo] = useState(true);

  return (
    <Map ref={mapRef}
      onClick={
        () => {
          
          if (playingVideo === true) {
            mapRef.current.getSource('video').pause();
            setPlayingVideo(false);
          }
          else {
            mapRef.current.getSource('video').play();
            setPlayingVideo(true);
          }
        }
      }
      initialViewState={{
        latitude: 37.562984,
        longitude: -122.514426,
        bearing: -96,
        zoom: 17
      }}
      style={{ width: 1850, height: 950 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <Source {...satelliteSource}>
        <Layer
          {
          ...{
            'id': 'satellite',
            'type': 'raster',
            'source': 'satellite'
          }
          } />
      </Source>
      <Source ref={vidRef}  {...videoSource}>

        <Layer
          {
          ...    {
            'id': 'video',
            'type': 'raster',
            'source': 'video'
          }
          } />
      </Source>
    </Map>
  );
}


export default App;
