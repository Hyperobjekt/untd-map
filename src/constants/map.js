/**
 * default viewport on map view
 */

// Data files to load from remote.
export const DATA_FILES = [
  {
    id: 'en_US',
    filename: 'DataDictionary',
    ext: 'csv',
    type: 'dict', // It's  dictionary file.
    lang: 'en_US', // Merge into this language.
    lang_key: 'Variable Name', // Table header to use when fetching variables.
    lang_value: 'Description', // Table header to use when featching lang strings.
    ind_key: 'Type', // Table header to use when determining if it's an indicator.
    ind_flag: 'sdcut', // Value that indicates that a value is an indicator.
  },
  {
    id: 'counties',
    filename: 'Data/geojson/sm_counties',
    ext: 'geojson',
    type: 'polygon',
  },
  {
    id: 'banks',
    filename: 'Data/geojson/sm_feature_banks',
    ext: 'geojson',
    type: 'point',
  },
  {
    id: 'banks',
    filename: 'Data/geojson/sm_feature_communitycenters',
    ext: 'geojson',
    type: 'point',
  },
  {
    id: 'creditu',
    filename: 'Data/geojson/sm_feature_creditunions',
    ext: 'geojson',
    type: 'point',
  },
  {
    id: 'playgr',
    filename: 'Data/geojson/sm_feature_playgrounds',
    ext: 'geojson',
    type: 'point',
  },
  {
    id: 'smarket',
    filename: 'Data/geojson/sm_feature_supermarkets',
    ext: 'geojson',
    type: 'point',
  },
  {
    id: 'places',
    filename: 'Data/geojson/sm_places',
    ext: 'geojson',
    type: 'polygon',
  },
  {
    id: 'tracts',
    filename: 'Data/geojson/sm_tracts',
    ext: 'geojson',
    type: 'polygon',
  },
  {
    id: 'zips',
    filename: 'Data/geojson/sm_zcta',
    ext: 'geojson',
    type: 'polygon',
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
