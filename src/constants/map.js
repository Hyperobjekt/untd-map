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
    lang_key: 'variable', // Table header to use when fetching variables.
    lang_label: 'display_name', // Table header to use when featching lang strings.
    lang_desc: 'description',
    ind_key: 'type', // Table header to use when determining if it's an indicator.
    ind_flag: 'sd', // Column value that indicates that a value is an indicator.
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
    id: 'points',
    filename: 'Data/geojson/sm_featureset',
    ext: 'geojson',
    type: 'point',
    popup: 1,
    id_key: 'Type',
    label_key: 'Type',
  },
]

// export const DEFAULT_ROUTE =
//   '/explorer/tot_popE_18_sd/1,1,1,1,1/0,0,1,0//32.912/-96.866/8/'

// export const ROUTE_SET = [
//   'view', // View type, 'explorer' or 'embed'
//   'metric', // Metric ID to set for active metric.
//   'quintiles', // quintiles that are active and inactive. Always length of 5.
//   'layers', // To determine active layers, 'district_boundaries' and/or 'redlining'
//   'points', // Point types that are active
//   'lat', // Latitude
//   'lng', // Longitude
//   'zoom', // Zoom level
// ]

// export const DEFAULT_ACTIVE_LAYERS = [0, 0, 1, 0]

export const BOUNDS = {
  lat: {
    min: 31.5, // 32.486597,
    max: 33.75, // 33.26625,
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

export const ROUTE_SET = [
  {
    id: 'view',
    options: ['explorer', 'embed'],
    validate: 'one_exact_match',
    defaultValue: 'explorer',
  },
  {
    id: 'metric',
    options: [],
    validate: 'contains_only',
    defaultValue: 'tot_popE_18_sd',
  },
  {
    id: 'quintiles',
    options: ['1', '0'], // Strings because that's what we get from the hash.
    validate: 'contains_only',
    length: 5,
    defaultValue: [1, 1, 1, 1, 1],
  },
  {
    id: 'layers',
    options: ['1', '0'],
    validate: 'contains_only',
    defaultValue: [0, 0, 1, 0],
  },
  {
    id: 'points',
    options: ['1', '0'],
    validate: 'contains_only',
    defaultValue: [],
  },
  {
    id: 'lat',
    options: [BOUNDS.lat.min, BOUNDS.lat.max],
    validate: 'between_options',
    defaultValue: DEFAULT_VIEWPORT.latitude,
  },
  {
    id: 'lng',
    options: [BOUNDS.lng.min, BOUNDS.lng.max],
    validate: 'between_options',
    defaultValue: DEFAULT_VIEWPORT.longitude,
  },
  {
    id: 'zoom',
    options: [BOUNDS.zoom.min, BOUNDS.zoom.max],
    validate: 'between_options',
    defaultValue: DEFAULT_VIEWPORT.zoom,
  },
]

// '/explorer/tot_popE_18_sd/1,1,1,1,1/0,0,1,0//32.912/-96.866/8/'
export const DEFAULT_ROUTE = `/${ROUTE_SET[0].defaultValue}/${ROUTE_SET[1].defaultValue}/${ROUTE_SET[2].defaultValue}/${ROUTE_SET[3].defaultValue}/${ROUTE_SET[4].defaultValue}/${ROUTE_SET[5].defaultValue}/${ROUTE_SET[6].defaultValue}/${ROUTE_SET[7].defaultValue}/`
