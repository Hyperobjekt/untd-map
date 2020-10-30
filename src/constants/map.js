/**
 * default viewport on map view
 */

// Data files to load from remote.
export const DATA_FILES = [
  {
    id: 'counties',
    filename: 'sm_counties',
    ext: 'geojson',
  },
  {
    id: 'places',
    filename: 'sm_places',
    ext: 'geojson',
  },
  {
    id: 'tracts',
    filename: 'sm_tracts',
    ext: 'geojson',
  },
  {
    id: 'zips',
    filename: 'sm_zcta',
    ext: 'geojson',
  },
]

export const DEFAULT_ROUTE =
  '/map/cri_weight/1,1,1,1,1///0,0,0,0,0,0,0/32.912/-96.866/8/'

export const BOUNDS = {
  lat: {
    max: 33.75, // 33.26625,
    min: 31.5, // 32.486597,
  },
  lng: {
    min: -98, // -97.222586,
    max: -95.5, // -96.410091,
  },
  zoom: {
    min: 6,
    max: 24,
  },
}

export const DEFAULT_VIEWPORT = {
  latitude: 32.912, // 32.7603525,
  longitude: -96.866, // -96.791731,
  zoom: 8,
  bearing: 0,
  pitch: 0,
  dragPan: true,
  touchZoom: true,
  touchRotate: true,
  preserveDrawingBuffer: true,
}
