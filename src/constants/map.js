/**
 * default viewport on map view
 */

//  `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/${el.filename}.${el.ext}.gz`

export const DEFAULT_REMOTE_SOURCES = {
  // Static layers
  county: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/sm_counties.geojson.gz`,
  },
  fedcongress: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/sm_fedcongress.geojson.gz`,
  },
  statehouse: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/sm_statehouse.geojson.gz`,
  },
  statesenate: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/sm_statesenate.geojson.gz`,
  },
  schooldistricts: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/sm_schooldistricts.geojson.gz`,
  },
  // Static layer point features for label placement
  county_points: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/counties_pt.geojson.gz`,
  },
  schooldistricts_points: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/schooldistricts_pt.geojson.gz`,
  },
  fedcongress_points: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/fedcongress_pt.geojson.gz`,
  },
  statesenate_points: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/statesenate_pt.geojson.gz`,
  },
  statehouse_points: {
    type: 'geojson',
    data: `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/statehouse_pt.geojson.gz`,
  },
}

// Data files to load from remote.
export const DATA_FILES = [
  // Data dictionary.
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
  // Interactive (choropleth) layers
  {
    id: 'place',
    filename: 'sm_places',
    ext: 'geojson',
    type: 'polygon',
    popup: 1,
    id_key: 'GEOID',
    label_key: 'NAME',
    type_label_key: `UI_MAP_FEATURE_PLACE`,
  },
  {
    id: 'tract',
    filename: 'sm_tracts',
    ext: 'geojson',
    type: 'polygon',
    popup: 1,
    id_key: 'GEOID',
    label_key: 'NAME',
    type_label_key: `UI_MAP_FEATURE_TRACT`,
  },
  {
    id: 'zip',
    filename: 'sm_zcta',
    ext: 'geojson',
    type: 'polygon',
    popup: 1,
    id_key: 'GEOID',
    label_key: 'GEOID',
    type_label_key: `UI_MAP_FEATURE_ZIP`,
  },
  // Point features.
  {
    id: 'points',
    filename: 'sm_featureset',
    ext: 'geojson',
    type: 'point',
    popup: 1,
    id_key: 'FID',
    label_key: 'Type',
  },
  // Trend data csv
  {
    id: 'trends',
    filename: 'TimeSeriesAllGeographies_Long',
    ext: 'csv',
    type: 'data', // It's  dictionary file.
    storeTarget: 'trendData',
  },
]

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
  maxBounds: [
    // [-107.6, 33.8], // southwest.
    [-98, 31.5], // southwest.
    // [-65, 49.9], // northeast.
    [-95.5, 33.75], // northeast.
  ],
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
    defaultValue: 'giniE_19_sd', // 'giniE_18_sd',
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
    defaultValue: [0, 0, 1],
  },
  {
    id: 'static_layers',
    options: ['1', '0'],
    validate: 'contains_only',
    defaultValue: [0, 0, 0, 0, 0],
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
export const DEFAULT_ROUTE = `#/${ROUTE_SET[0].defaultValue}/${ROUTE_SET[1].defaultValue}/${ROUTE_SET[2].defaultValue}/${ROUTE_SET[3].defaultValue}/${ROUTE_SET[4].defaultValue}/${ROUTE_SET[5].defaultValue}/${ROUTE_SET[6].defaultValue}/${ROUTE_SET[7].defaultValue}/${ROUTE_SET[8].defaultValue}/`

export const DEFAULT_POPUP = {
  offset: 30,
  anchor: `top-left`,
  width: 320,
  height: 480,
  padding: 70,
}

// Add items that should block click or tooltip on hover here.
export const MAP_CONTROLS_CLASSES = [
  'mapboxgl-ctrl-group',
  'map-legend',
  'map-btn-group',
  '.mapboxgl-popup',
  '.mapboxgl-popup-content',
  '.custom-attribution',
]
