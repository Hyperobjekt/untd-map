import { fromJS } from 'immutable'

import {
  CRI_COLORS,
  POINT_TYPES_COLORS,
  NO_DATA_COLOR,
  TURTLE_GREEN,
} from './../../../../constants/colors'
import {
  POINT_ICON_MAP,
  UNTD_LAYERS,
} from './../../../../constants/layers'

// import {
//   getMetric,
//   getQuintile,
//   isInActiveQuintile,
// } from './../utils'

const getIcon = id => {
  return `${
    POINT_ICON_MAP.find(el => {
      return el.types.indexOf(id) > -1
    }).id
  }-icon`
}

const getGenericIcon = () => {
  return `${
    POINT_ICON_MAP.find(el => {
      return el.types.indexOf('generic') > -1
    }).id
  }-icon`
}

export const getClusterCountBg = (
  source,
  id,
  context,
  color,
  ind,
) => {
  return fromJS({
    id: `${id}ClusterCountBg`,
    source: source,
    type: 'circle',
    interactive: false,
    layout: {
      // 'icon-allow-overlap': true,
    },
    paint: {
      'circle-color': '#fff',
      'circle-radius': 16,
      'circle-stroke-color': color,
      'circle-stroke-width': 2,
      // 'circle-translate': [-15 - ind * 8, -15 - ind * 8],
    },
    filter: [
      'all',
      ['has', 'point_count'],
      // ['==', ['get', 'variable'], id],
    ],
  })
}

export const getClusterCount = (
  source,
  id,
  context,
  color,
  ind,
) => {
  return fromJS({
    id: `${id}ClusterCount`,
    source: source,
    type: 'symbol',
    interactive: false,
    layout: {
      'icon-allow-overlap': true,
      'text-field': '{point_count_abbreviated}',
      'text-font': [
        'DIN Offc Pro Medium',
        'Arial Unicode MS Bold',
      ],
      'text-size': 12,
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': TURTLE_GREEN,
      'text-translate': [-6, -6],
    },
    filter: ['has', 'point_count'],
  })
}

export const getClusterIcon = (
  source,
  id,
  context,
  color,
  ind,
) => {
  // console.log(
  //   'getClusterIcon, ',
  //   source,
  //   id,
  //   context,
  //   color,
  //   ind,
  // )
  return fromJS({
    id: `${id}ClusterIcon`,
    source: source,
    type: 'symbol',
    layout: {
      'icon-allow-overlap': true,
      visibility: 'visible', // isVisible ? 'visible' : 'none',
      'icon-image':
        getIcon(id).length > 0
          ? getIcon(id)
          : getGenericIcon(), // 'home-icon',
      'icon-size': 0.25,
      // [
      //   'concat',
      //   ['get', 'variable'],
      //   '-icon',
      // ],
    },
    interactive: false,
    paint: {
      'icon-color': color,
      'icon-halo-width': 3,
      'icon-translate': [4, 4],
    },
    filter: ['has', 'point_count'],
  })
}

export const getPointIcons = (
  source,
  id,
  context,
  color,
) => {
  // console.log('getPointIcons, ', source, id, context, color)
  return fromJS({
    id: `${id}Points`,
    source: source,
    type: 'symbol',
    layout: {
      visibility: 'visible', // isVisible ? 'visible' : 'none',
      'icon-image':
        getIcon(id).length > 0
          ? getIcon(id)
          : getGenericIcon(), // 'home-icon',
      'icon-allow-overlap': true,
      // [
      //   'concat',
      //   ['get', 'variable'],
      //   '-icon',
      // ],
      'icon-size': 0.45,
    },
    interactive: true,
    paint: {
      'icon-color': color,
      'icon-halo-width': 3,
    },
    filter: ['!', ['has', 'point_count']],
  })
}

const getFilter = (type, metric, activeQuintiles) => {
  switch (true) {
    case type === 'tract':
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
    case type === 'zip':
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
    case type === 'county':
      return [
        'all',
        ['!=', ['number', ['get', 'fid']], ['number', 568]],
        ['!=', ['number', ['get', 'fid']], ['number', 526]],
      ]
      // code block
      break
    case type === 'place':
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

const pointsLevel = 60
const clustersLevel = 100
export const getPointLayers = (
  source,
  id,
  context,
  color,
  ind,
) => {
  // console.log('getRedlineLayers', context)
  return [
    // Individual point icons.
    {
      z: pointsLevel + ind,
      style: getPointIcons(source, id, context, color, ind),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${id}Icons`,
    },
    // Cluster count background circles.
    {
      z: clustersLevel + 1 + ind,
      style: getClusterCountBg(
        source,
        id,
        context,
        color,
        ind,
      ),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${id}ClusterCountBg`,
    },
    // Cluster count.
    {
      z: clustersLevel + 2 + ind,
      style: getClusterCount(
        source,
        id,
        context,
        color,
        ind,
      ),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${id}ClusterCount`,
    },
    // Cluster icons.
    {
      z: clustersLevel + 3 + ind,
      style: getClusterIcon(
        source,
        id,
        context,
        color,
        ind,
      ),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${id}ClusterIcons`,
    },
  ]
}

export const getLayers = (sources, context) => {
  // console.log('getLayers', sources, context)
  const layers = []
  layers.push(...getPolygonLayers('county', context))
  layers.push(...getPolygonLayers('zip', context))
  layers.push(...getPolygonLayers('tract', context))
  layers.push(...getPolygonLayers('place', context))
  // Add a layer for each point type,
  // and a cluster layer for each point type.
  context.activePointTypes.forEach((el, i) => {
    // console.log('looping through activePointTypes, ', el, i)
    // If layer is enabled, then build data and request point layers for id.
    if (el === 1) {
      const color = POINT_TYPES_COLORS[i]
      const id = context.pointTypes[i].id
      // Dont do snap for now (comment out when done testing)
      // if (id === 'snap') {
      //   // console.log('id is snap, returning')
      //   return
      // }
      // Check to see that a source layer is available.
      if (!!sources[`points_${id}`]) {
        layers.push(
          ...getPointLayers(
            `points_${id}`,
            id,
            context,
            color,
            i,
          ),
        )
      }
    }
  })
  return layers
}
