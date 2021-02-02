import { fromJS } from 'immutable'

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

const getKeyArray = types => {
  return types.map(el => {
    return el.id
  })
}

export const getClusterCountBg = (type, context) => {
  const activePointTypesKey = getKeyArray(
    context.pointTypes,
  )
  // context.pointTypes.map(el => {
  //   return el.id
  // })
  return fromJS({
    id: `${type}ClusterCountBg`,
    source: type,
    type: 'circle',
    paint: {
      'circle-color': [
        'to-color',
        [
          'at',
          [
            'index-of',
            ['get', 'variable'],
            ['literal', activePointTypesKey],
          ],
          ['literal', POINT_TYPES_COLORS],
        ],
      ],
      'circle-radius': 8,
      'circle-translate': [-15, -15],
    },
    // filter: ['==', ['has', 'point_count']],
    // [
    //   'all',
    // ['==', ['has', 'point_count']],
    // [
    //   '==',
    //   [
    //     'at',
    //     [
    //       'index-of',
    //       ['get', 'variable'],
    //       ['literal', activePointTypesKey],
    //     ],
    //     ['literal', context.activePointTypes],
    //   ],
    //   1,
    // ],
    // ],
  })
}

export const getClusterCount = (type, context) => {
  return fromJS({
    id: `${type}ClusterCount`,
    source: type,
    type: 'symbol',
    filter: ['has', 'point_count'],
    paint: {
      'text-translate': [-15, -15],
    },
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': [
        'DIN Offc Pro Medium',
        'Arial Unicode MS Bold',
      ],
      'text-size': 12,
      'text-allow-overlap': true,
    },
  })
}

export const getClusterIcon = (type, context) => {
  const activePointTypesKey = getKeyArray(
    context.pointTypes,
  )
  return fromJS({
    id: `${type}ClusterIcon`,
    source: type,
    type: 'symbol',
    layout: {
      visibility: 'visible', // isVisible ? 'visible' : 'none',
      'icon-image': [
        'concat',
        ['get', 'variable'],
        '-icon',
      ],
      'icon-size': 1,
    },
    interactive: false,
    paint: {
      'icon-color': [
        'to-color',
        [
          'at',
          [
            'index-of',
            ['get', 'variable'],
            ['literal', activePointTypesKey],
          ],
          ['literal', POINT_TYPES_COLORS],
        ],
      ],
      'icon-halo-width': 3,
    },
    filter: [
      'all',
      ['==', ['has', 'point_count']],
      [
        '==',
        [
          'at',
          [
            'index-of',
            ['get', 'variable'],
            ['literal', activePointTypesKey],
          ],
          ['literal', context.activePointTypes],
        ],
        1,
      ],
    ],
  })
}

export const getPointIcons = (type, context) => {
  console.log('getPointIcons, ', type, context)
  const activePointTypesKey = getKeyArray(
    context.pointTypes,
  )
  return fromJS({
    id: `${type}Points`,
    source: type,
    type: 'symbol',
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
      'icon-color': [
        'to-color',
        [
          'at',
          [
            'index-of',
            ['get', 'variable'],
            ['literal', activePointTypesKey],
          ],
          ['literal', POINT_TYPES_COLORS],
        ],
      ],
      'icon-halo-width': 3,
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
          ['literal', context.activePointTypes],
        ],
        1,
      ],
    ],
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

export const getPolygonLines = (type, context) => {
  // console.log('getPolygonLines(), ', context)
  const isVisible =
    context.activeLayers[
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
        ['==', ['get', context.activeMetric], 0],
        CRI_COLORS[0],
        ['==', ['get', context.activeMetric], 1],
        CRI_COLORS[1],
        ['==', ['get', context.activeMetric], 2],
        CRI_COLORS[2],
        ['==', ['get', context.activeMetric], 3],
        CRI_COLORS[3],
        ['==', ['get', context.activeMetric], 4],
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
      context.activeMetric,
      context.activeQuintiles,
    ),
  })
}

export const getPolygonShapes = (type, context) => {
  // console.log('getPolygonShapes(), ', type, context)
  // console.log('CRI_COLORS', CRI_COLORS)
  const isVisible =
    context.activeLayers[
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
        ['==', ['get', context.activeMetric], 0],
        CRI_COLORS[0],
        ['==', ['get', context.activeMetric], 1],
        CRI_COLORS[1],
        ['==', ['get', context.activeMetric], 2],
        CRI_COLORS[2],
        ['==', ['get', context.activeMetric], 3],
        CRI_COLORS[3],
        ['==', ['get', context.activeMetric], 4],
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
      context.activeMetric,
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
      style: getPolygonShapes(type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Shapes`,
    },
    {
      z: z + 1,
      style: getPolygonLines(type, context),
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
    // Individual point icons.
    {
      z: z,
      style: getPointIcons(type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}Icons`,
    },
    // Cluster count background circles.
    {
      z: z + 1,
      style: getClusterCountBg(type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}ClusterCountBg`,
    },
    // Cluster count.
    {
      z: z + 2,
      style: getClusterCount(type, context),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${type}ClusterCount`,
    },
    // Cluster icons.
    // {
    //   z: z + 2,
    //   style: getClusterIcon(type, context),
    //   idMap: true,
    //   hasFeatureId: true, // isCircleId,
    //   type: `${type}ClusterIcons`,
    // },
  ]
}

export const getLayers = (sources, context) => {
  console.log('getLayers', sources, context)
  const layers = []
  layers.push(...getPolygonLayers('counties', context))
  layers.push(...getPolygonLayers('zips', context))
  layers.push(...getPolygonLayers('tracts', context))
  layers.push(...getPolygonLayers('places', context))
  // Add a layer for each point type,
  // and a cluster layer for each point type.
  layers.push(...getPointLayers('points', context))
  return layers
}
