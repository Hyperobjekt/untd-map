import { fromJS } from 'immutable'
// import { getDistrictColor } from './../selectors'
// import {
//   getSchoolZones,
//   getSchoolGeojson,
// } from './../utils'
import {
  DISTRICT_COLORS,
  SCHOOL_ZONE_COLORS,
  REDLINE_FILL_COLORS,
  REDLINE_STROKE_COLORS,
  FEEDER_LAYER_COLOR,
  DEMO_COLORS,
  CRI_COLORS,
} from './../../../../constants/colors'
import {
  DEMO_MAX_PERCENTS,
  UNTD_LAYERS,
} from './../../../../constants/layers'
import { CPAL_METRICS } from './../../../../constants/metrics'
import {
  getMetric,
  getQuintile,
  isInActiveQuintile,
} from './../utils'

const noDataFill = '#ccc'

const getCircleMinZoom = region =>
  region === 'schools' ? 2 : 8

export const getSchoolCircleLayer = ({
  layerId,
  region,
  metric,
  activeQuintiles,
  colors,
}) => {
  // console.log('getSchoolCircleLayer(), ', metric)
  return fromJS({
    id: 'schools-circle',
    source: 'schools',
    type: 'circle',
    minzoom: getCircleMinZoom(region),
    interactive: true,
    layout: {
      visibility: 'visible',
    },
    paint: {
      'circle-color': [
        'case',
        ['==', ['get', metric + '_sd'], 0],
        getMetric(metric, CPAL_METRICS).colors[0],
        ['==', ['get', metric + '_sd'], 1],
        getMetric(metric, CPAL_METRICS).colors[1],
        ['==', ['get', metric + '_sd'], 2],
        getMetric(metric, CPAL_METRICS).colors[2],
        ['==', ['get', metric + '_sd'], 3],
        getMetric(metric, CPAL_METRICS).colors[3],
        ['==', ['get', metric + '_sd'], 4],
        getMetric(metric, CPAL_METRICS).colors[4],
        '#ccc',
      ],
      'circle-opacity': 1,
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        11.99999, // At or below zoom level of 11.999, smaller school dots.
        [
          'case',
          ['==', ['feature-state', 'hover'], true],
          7,
          5,
        ],
        12, // At or above zoom level of 12, larger school dots.
        [
          'case',
          ['==', ['feature-state', 'hover'], true],
          16,
          12,
        ],
      ],
      'circle-stroke-opacity': 1,
      'circle-stroke-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#fff', // Hover color
        '#fff', // Normal color
      ],
      'circle-stroke-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        4,
        0.25,
        6,
        0.5, // 1.5,
        14,
        1,
      ],
    },
    filter: [
      'let',
      'quintile',
      ['number', ['get', ['concat', metric, '_sd']]],
      [
        '==',
        [
          'at',
          ['var', 'quintile'],
          ['literal', activeQuintiles],
        ],
        1,
      ],
    ],
  })
}

export const getFeedersOutlines = (
  { layerId, region },
  activeLayers,
) => {
  const isActive = activeLayers[0] === 1
  return fromJS({
    id: 'feeders',
    source: 'feeders',
    type: 'line',
    layout: {
      visibility: !!isActive ? 'visible' : 'none',
    },
    interactive: false,
    paint: {
      'line-color': FEEDER_LAYER_COLOR,
      'line-width': 2,
    },
  })
}

export const getDistrictOutline = (
  { layerId, region },
  activeLayers,
) => {
  // console.log('getDistrictOutline(), ', region)
  // const isActive = activeLayers.indexOf('districts') > -1
  const isActive = true // Changed to always active by client. // activeLayers[0] === 1
  return fromJS({
    id: 'districts',
    source: 'districts',
    type: 'line',
    layout: {
      visibility: !!isActive ? 'visible' : 'none',
    },
    interactive: false,
    paint: {
      'line-color': [
        'string',
        [
          'get',
          ['get', 'tea_id'],
          ['literal', DISTRICT_COLORS],
        ],
        'blue',
      ],
      'line-width': 2,
    },
  })
}

export const getSchoolZoneShapes = ({
  layerId,
  region,
  metric,
  activeQuintiles,
  colors,
}) => {
  // console.log(
  //   'getSchoolZoneShapes(), ',
  //   metric,
  //   getMetric(metric, CPAL_METRICS).colors[0],
  // )
  const metricSd = metric + '_sd'
  return fromJS({
    id: region + '-zone-shapes', // layerId || region + '-district-outline',
    source: 'schoolzones',
    // 'source-layer': region,
    type: 'fill',
    layout: {
      visibility: 'visible',
    },
    interactive: false,
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', metricSd], 0],
        getMetric(metric, CPAL_METRICS).colors[0],
        ['==', ['get', metricSd], 1],
        getMetric(metric, CPAL_METRICS).colors[1],
        ['==', ['get', metricSd], 2],
        getMetric(metric, CPAL_METRICS).colors[2],
        ['==', ['get', metricSd], 3],
        getMetric(metric, CPAL_METRICS).colors[3],
        ['==', ['get', metricSd], 4],
        getMetric(metric, CPAL_METRICS).colors[4],
        getMetric(metric, CPAL_METRICS).colors[2],
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.2,
        0,
      ],
    },
  })
}

export const getRedlineShapes = (
  { layerId, region },
  activeLayers,
) => {
  const isActive = activeLayers[1] === 1
  return fromJS({
    id: 'redlineShapes',
    source: 'redlines',
    type: 'fill',
    layout: {
      visibility: !!isActive ? 'visible' : 'none',
    },
    interactive: false,
    paint: {
      'fill-color': [
        'string',
        [
          'get',
          ['get', 'holc_grade'],
          ['literal', REDLINE_FILL_COLORS],
        ],
        'blue',
      ],
      // 'fill-opacity': 0.2,
    },
  })
}

export const getRedlineLines = (
  { layerId, region },
  activeLayers,
) => {
  // console.log('getRedlineLines(), ', region)
  // const isActive = activeLayers.indexOf('redlining') > -1
  const isActive = activeLayers[1] === 1
  return fromJS({
    id: 'redlineLines',
    source: 'redlines',
    type: 'line',
    layout: {
      visibility: !!isActive ? 'visible' : 'none',
    },
    interactive: false,
    paint: {
      'line-color': [
        'string',
        [
          'get',
          ['get', 'holc_grade'],
          ['literal', REDLINE_STROKE_COLORS],
        ],
        'blue',
      ],
      'line-width': 1,
    },
  })
}

export const getDemographicShapes = (
  { layerId, region },
  activeLayers,
) => {
  // console.log('getDemographicShapes, ', activeLayers)
  const isActive =
    activeLayers[2] === 1 ||
    activeLayers[3] === 1 ||
    activeLayers[4] === 1 ||
    activeLayers[5] === 1 ||
    activeLayers[6] === 1
  let varName = false
  let maxVal = false
  switch (true) {
    case activeLayers[2] === 1:
      varName = 'dem_perpoc'
      maxVal = DEMO_MAX_PERCENTS.dem_perpoc
      break
    case activeLayers[3] === 1:
      varName = 'dem_perbl'
      maxVal = DEMO_MAX_PERCENTS.dem_perbl
      break
    case activeLayers[4] === 1:
      varName = 'dem_perhi'
      maxVal = DEMO_MAX_PERCENTS.dem_perhi
      break
    case activeLayers[5] === 1:
      varName = 'dem_peras'
      maxVal = DEMO_MAX_PERCENTS.dem_peras
      break
    case activeLayers[6] === 1:
      varName = 'dem_perwh'
      maxVal = DEMO_MAX_PERCENTS.dem_perwh
      break
    default:
      varName = 'dem_perpoc'
      maxVal = DEMO_MAX_PERCENTS.dem_perpoc
  }
  // console.log('getDemographicShapes, varName = ', varName)
  return fromJS({
    id: 'demoShapes',
    source: 'demotracts',
    type: 'fill',
    layout: {
      visibility: !!isActive ? 'visible' : 'none',
    },
    interactive: false,
    paint: {
      'fill-color': [
        'let',
        'perc_floor',
        [
          'round',
          [
            '/',
            [
              '*',
              ['/', ['number', ['get', varName]], maxVal],
              100,
            ],
            20,
          ],
        ],
        [
          'interpolate',
          ['linear'],
          ['var', 'perc_floor'],
          0,
          DEMO_COLORS[0],
          1,
          DEMO_COLORS[1],
          2,
          DEMO_COLORS[2],
          3,
          DEMO_COLORS[3],
          4,
          DEMO_COLORS[4],
        ],
      ],
    },
    filter: [
      'all',
      [
        '!=',
        ['number', ['get', 'GEOID']],
        ['number', 48113980100],
      ],
      [
        '!=',
        ['number', ['get', 'GEOID']],
        ['number', 48113980000],
      ],
    ],
  })
}

export const getDemographicLines = (
  { layerId, region },
  activeLayers,
) => {
  // console.log('getDemographicLines()')
  const isActive =
    activeLayers[2] === 1 ||
    activeLayers[3] === 1 ||
    activeLayers[4] === 1 ||
    activeLayers[5] === 1
  return fromJS({
    id: 'demoLines',
    source: 'demotracts',
    type: 'line',
    layout: {
      visibility: !!isActive ? 'visible' : 'none',
    },
    interactive: false,
    paint: {
      'line-color': '#ccc',
      'line-width': 1,
    },
    filter: [
      'all',
      [
        '!=',
        ['number', ['get', 'GEOID']],
        ['number', 48113980100],
      ],
      [
        '!=',
        ['number', ['get', 'GEOID']],
        ['number', 48113980000],
      ],
    ],
  })
}

const polygonColors = [
  {
    type: 'zips',
    color: 'blue',
  },
  {
    type: 'tracts',
    color: 'red',
  },
  {
    type: 'counties',
    color: 'purple',
  },
  {
    type: 'places',
    color: 'green',
  },
]

export const getPointIcons = (
  type,
  context,
  activeLayers,
) => {
  console.log('getPointIcons, ', type)
  const isVisible =
    activeLayers[
      UNTD_LAYERS.findIndex(el => el.id === type)
    ] === 1
  console.log('isVisible, ', isVisible)
  return fromJS({
    id: `${type}Points`,
    source: type,
    type: 'circle', // 'symbol',
    layout: {
      visibility: 'visible', // !!isVisible ? 'visible' : 'none',
      // 'icon-image': `banks-icon`,
      // 'icon-size': 50,
    },
    // interactive: true,
    paint: {
      'circle-color': '#000',
      'circle-opacity': 1,
      'circle-radius': 120,
      // 'icon-color': 'red',
      // [
      //   'match', // Use the 'match' expression: https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
      //   ['get', 'STORE_TYPE'], // Use the result 'STORE_TYPE' property
      //   'Convenience Store',
      //   '#FF8C00',
      //   'Convenience Store With Gas',
      //   '#FF8C00',
      //   'Pharmacy',
      //   '#FF8C00',
      //   'Specialty Food Store',
      //   '#9ACD32',
      //   'Small Grocery Store',
      //   '#008000',
      //   'Supercenter',
      //   '#008000',
      //   'Superette',
      //   '#008000',
      //   'Supermarket',
      //   '#008000',
      //   'Warehouse Club Store',
      //   '#008000',
      //   '#FF0000', // any other store type
      // ],
    },
  })
}

export const getPolygonLines = (
  type,
  context,
  activeLayers,
) => {
  // console.log('getPolygonLines()')
  const isVisible =
    activeLayers[
      UNTD_LAYERS.findIndex(el => el.id === type)
    ] === 1
  return fromJS({
    id: `${type}Lines`,
    source: type,
    type: 'line',
    layout: {
      visibility: !!isVisible ? 'visible' : 'none',
    },
    interactive: true,
    paint: {
      'line-color': [
        'case',
        ['==', ['get', context.metric], 0],
        CRI_COLORS[0],
        ['==', ['get', context.metric], 1],
        CRI_COLORS[1],
        ['==', ['get', context.metric], 2],
        CRI_COLORS[2],
        ['==', ['get', context.metric], 3],
        CRI_COLORS[3],
        ['==', ['get', context.metric], 4],
        CRI_COLORS[4],
        CRI_COLORS[2],
      ],
      // 'line-color': polygonColors.find(
      //   el => el.type === type,
      // ).color,
      'line-width': 2,
    },
  })
}

export const getPolygonShapes = (
  type,
  context,
  activeLayers,
) => {
  console.log(
    'getPolygonShapes(), ',
    type,
    context,
    activeLayers,
  )
  console.log('CRI_COLORS', CRI_COLORS)
  const isVisible =
    activeLayers[
      UNTD_LAYERS.findIndex(el => el.id === type)
    ] === 1
  // console.log('isVisible, ', isVisible)
  return fromJS({
    id: `${type}Shapes`,
    source: type,
    type: 'fill',
    layout: {
      visibility: !!isVisible ? 'visible' : 'none',
    },
    interactive: true,
    paint: {
      'fill-color': [
        'case',
        ['==', ['get', context.metric], 0],
        CRI_COLORS[0],
        ['==', ['get', context.metric], 1],
        CRI_COLORS[1],
        ['==', ['get', context.metric], 2],
        CRI_COLORS[2],
        ['==', ['get', context.metric], 3],
        CRI_COLORS[3],
        ['==', ['get', context.metric], 4],
        CRI_COLORS[4],
        CRI_COLORS[2],
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.4,
        0.2,
      ],
    },
  })
}

let z = 20

export const getPolygonLayers = (
  type,
  context,
  activeLayers,
) => {
  // console.log('getRedlineLayers', context)
  z = z + 2
  return [
    {
      z: z,
      style: getPolygonShapes(type, context, activeLayers),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Shapes`,
    },
    {
      z: z + 1,
      style: getPolygonLines(type, context, activeLayers),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Lines`,
    },
  ]
}

export const getPointLayers = (
  type,
  context,
  activeLayers,
) => {
  // console.log('getRedlineLayers', context)
  z = z + 3
  return [
    {
      z: z,
      style: getPointIcons(type, context, activeLayers),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Points`,
    },
    // {
    //   z: z + 1,
    //   style: getPointLines(type, context, activeLayers),
    //   idMap: true,
    //   hasFeatureId: true, // isCircleId,
    //   type: `${type}Lines`,
    // },
  ]
}

export const getLayers = (
  sources,
  context,
  activeLayers,
) => {
  console.log('getLayers', sources, context, activeLayers)
  const layers = []
  const sourceKeys = Object.keys(sources)
  sourceKeys.forEach((key, i) => {
    const layer = UNTD_LAYERS.find(el => {
      return el.id === key
    })
    const types = layer.types
    // If the layer isn't supposed to be visible,
    // don't process it at all. Save some time.
    const index = UNTD_LAYERS.indexOf(layer)
    const isVisible = activeLayers[index] === 1
    // console.log(`isVisible is ${isVisible}.`)
    if (!isVisible) return

    switch (true) {
      case types.indexOf('polygons') > -1:
        layers.push(
          ...getPolygonLayers(key, context, activeLayers),
        )
        break
      case types.indexOf('points') > -1:
        layers.push(
          ...getPointLayers(key, context, activeLayers),
        )
        break
      default:
        console.log(`No match for geojson source ${key}.`)
    }
  })

  return layers
}
