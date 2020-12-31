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
    popup: 0, // Does this geo feature get a popup?
    id_key: 'GEOID', // What feature property to use for hovered ID?
    label_key: 'NAMELSAD', // What feature property to use for label?
  },
  {
    id: 'places',
    filename: 'Data/geojson/sm_places',
    ext: 'geojson',
    type: 'polygon',
    popup: 1,
    id_key: 'PLACENS',
    label_key: 'NAME.y',
    type_label_key: `UI_MAP_FEATURE_PLACE`,
  },
  {
    id: 'tracts',
    filename: 'Data/geojson/sm_tracts',
    ext: 'geojson',
    type: 'polygon',
    popup: 1,
    id_key: 'Geoid2',
    label_key: 'NAME.y',
    type_label_key: `UI_MAP_FEATURE_TRACT`,
  },
  {
    id: 'zips',
    filename: 'Data/geojson/sm_zcta',
    ext: 'geojson',
    type: 'polygon',
    popup: 1,
    id_key: 'GEOID',
    label_key: 'ZIP',
    type_label_key: `UI_MAP_FEATURE_ZIP`,
  },
  {
    id: 'banks',
    filename: 'Data/geojson/sm_feature_banks',
    ext: 'geojson',
    type: 'point',
    popup: 1,
    id_key: 'OBJECTID',
    label_key: 'Name',
  },
  {
    id: 'commc',
    filename: 'Data/geojson/sm_feature_communitycenters',
    ext: 'geojson',
    type: 'point',
    popup: 1,
    id_key: 'OBJECTID',
    label_key: 'Name',
  },
  {
    id: 'creditu',
    filename: 'Data/geojson/sm_feature_creditunions',
    ext: 'geojson',
    type: 'point',
    popup: 1,
    id_key: 'OBJECTID',
    label_key: 'Name',
  },
  {
    id: 'playgr',
    filename: 'Data/geojson/sm_feature_playgrounds',
    ext: 'geojson',
    type: 'point',
    popup: 1,
    id_key: 'OBJECTID',
    label_key: 'Name',
  },
  {
    id: 'smarket',
    filename: 'Data/geojson/sm_feature_supermarkets',
    ext: 'geojson',
    type: 'point',
    popup: 1,
    id_key: 'OBJECTID',
    label_key: 'Name',
  },
]

export const DEFAULT_ROUTE =
  '/map/cri_weight/1,1,1,1,1///1,0,0,0,0,0,0,0,0/32.912/-96.866/8/'

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
