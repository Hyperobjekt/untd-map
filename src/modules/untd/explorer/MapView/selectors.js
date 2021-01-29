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
  POINT_TYPES_COLORS,
} from './../../../../constants/layers'
import {
  getMetric,
  getQuintile,
  isInActiveQuintile,
} from './../utils'

const noDataFill = '#ccc'

export const getPointIcons = (
  type,
  context,
  activePointTypes,
  activePointTypesKey,
) => {
  console.log('getPointIcons, ', type)
  // const isVisible =
  //   activeLayers[
  //     UNTD_LAYERS.findIndex(el => el.id === type)
  //   ] === 1
  // console.log('isVisible, ', isVisible)
  return fromJS({
    id: `${type}Points`,
    source: type,
    type: 'symbol', //
    layout: {
      visibility: 'visible', // isVisible ? 'visible' : 'none',
      'icon-image': [
        'concat',
        ['get', 'variable'],
        '-icon',
      ],
      'icon-size': 1.5,
    },
    interactive: true,
    paint: {
      'icon-color': 'orange',
      // 'icon-halo-color': 'red',
      'icon-halo-width': 3,

      //   'circle-color': 'blue',
      //   'circle-opacity': 1,
      //   'circle-radius': 5,
    },
    filter: [
      'all',
      ['!', ['has', 'point_count']],
      [
        '==',
        [
          'at',
          [
            'index-of',
            ['get', 'variable'],
            ['literal', activePointTypesKey],
          ],
          ['literal', activePointTypes],
        ],
        1,
      ],
    ],
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
    // },
  })
}

const getFilter = (type, metric, activeQuintiles) => {
  switch (true) {
    case type === 'tracts':
      return [
        'let',
        'quintile',
        ['number', ['get', metric]],
        [
          'all',
          [
            '==',
            [
              'at',
              ['var', 'quintile'],
              ['literal', activeQuintiles],
            ],
            1,
          ],
          [
            '!=',
            ['number', ['get', 'fid']],
            ['number', 568],
          ],
          [
            '!=',
            ['number', ['get', 'fid']],
            ['number', 526],
          ],
        ],
      ]
      break
    case type === 'zips':
      return [
        'let',
        'quintile',
        ['number', ['get', metric]],
        [
          'all',
          [
            '==',
            [
              'at',
              ['var', 'quintile'],
              ['literal', activeQuintiles],
            ],
            1,
          ],
          [
            '!=',
            ['number', ['get', 'fid']],
            ['number', 568],
          ],
          [
            '!=',
            ['number', ['get', 'fid']],
            ['number', 526],
          ],
        ],
      ]
      break
    case type === 'counties':
      return [
        'all',
        ['!=', ['number', ['get', 'fid']], ['number', 568]],
        ['!=', ['number', ['get', 'fid']], ['number', 526]],
      ]
      // code block
      break
    case type === 'places':
      return [
        'let',
        'quintile',
        ['number', ['get', metric]],
        [
          'all',
          [
            '==',
            [
              'at',
              ['var', 'quintile'],
              ['literal', activeQuintiles],
            ],
            1,
          ],
          [
            '!=',
            ['number', ['get', 'fid']],
            ['number', 568],
          ],
          [
            '!=',
            ['number', ['get', 'fid']],
            ['number', 526],
          ],
        ],
      ]
      // code block
      break
    default:
    // code block
  }
}

export const getPolygonLines = (
  type,
  context,
  activeLayers,
) => {
  console.log('getPolygonLines(), ', context)
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
    filter: getFilter(
      type,
      context.metric,
      context.activeQuintiles,
    ),
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
        0.6,
      ],
    },
    filter: getFilter(
      type,
      context.metric,
      context.activeQuintiles,
    ),
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
  activePointTypes,
  activePointTypesKey,
) => {
  // console.log('getRedlineLayers', context)
  z = z + 3
  return [
    {
      z: z,
      style: getPointIcons(
        type,
        context,
        activePointTypes,
        activePointTypesKey,
      ),
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
  activePointTypes,
  activePointTypesKey,
) => {
  console.log('getLayers', sources, context, activeLayers)
  const layers = []
  layers.push(
    ...getPolygonLayers('counties', context, activeLayers),
  )
  layers.push(
    ...getPolygonLayers('zips', context, activeLayers),
  )
  layers.push(
    ...getPolygonLayers('tracts', context, activeLayers),
  )
  layers.push(
    ...getPolygonLayers('places', context, activeLayers),
  )
  // Add a layer for each point type,
  // and a cluster layer for each point type.
  layers.push(
    ...getPointLayers(
      'points',
      context,
      activePointTypes,
      activePointTypesKey,
    ),
  )
  return layers
}
