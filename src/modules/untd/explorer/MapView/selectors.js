import { fromJS } from 'immutable'

import { CRI_COLORS } from './../../../../constants/colors'
import {
  UNTD_LAYERS,
  POINT_CATEGORIES,
} from './../../../../constants/layers'

export const getClusterCountBg = (
  source,
  id,
  context,
  ind,
) => {
  const color = POINT_CATEGORIES.find(el => {
    return el.id === context.pointTypes[ind].category
  }).color
  return fromJS({
    id: `${id}ClusterCountBg`,
    source: source,
    type: 'circle',
    interactive: false,
    layout: {
      // 'icon-allow-overlap': true,
    },
    paint: {
      'circle-color': 'rgba(255,255,255,0.8)', // '#fff',
      'circle-radius': 16,
      'circle-stroke-color': color,
      'circle-stroke-width': 2,
      // 'circle-translate': [-15 - ind * 8, -15 - ind * 8],
    },
    filter: [
      'all',
      ['has', 'point_count'],
      ['==', ['number', context.activePointTypes[ind]], 1],
      // ['==', ['get', 'variable'], id],
    ],
  })
}

export const getClusterCount = (
  source,
  id,
  context,
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
      'text-color': `#303030`,
      'text-translate': [-6, -6],
    },
    filter: [
      'all',
      ['has', 'point_count'],
      ['==', ['number', context.activePointTypes[ind]], 1],
    ],
  })
}

export const getClusterIcon = (
  source,
  id,
  context,
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
  const color = POINT_CATEGORIES.find(el => {
    return el.id === context.pointTypes[ind].category
  }).color
  return fromJS({
    id: `${id}ClusterIcon`,
    source: source,
    type: 'symbol',
    layout: {
      'icon-allow-overlap': true,
      visibility: 'visible', // isVisible ? 'visible' : 'none',
      'icon-image': `${id}-icon`,
      // getIcon(id).length > 0
      //   ? getIcon(id)
      //   : getGenericIcon(), // 'home-icon',
      'icon-size': 0.2,
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
      'icon-translate': [3, 3],
    },
    filter: [
      'all',
      ['has', 'point_count'],
      ['==', ['number', context.activePointTypes[ind]], 1],
    ],
  })
}

export const getPointIcons = (source, id, context, ind) => {
  // console.log('getPointIcons, ', source, id, context, color)
  const color = POINT_CATEGORIES.find(el => {
    return el.id === context.pointTypes[ind].category
  }).color
  return fromJS({
    id: `${id}Points`,
    source: source,
    type: 'symbol',
    layout: {
      visibility: 'visible', // isVisible ? 'visible' : 'none',
      'icon-image': `${id}-icon`,
      // getIcon(id).length > 0
      //   ? getIcon(id)
      //   : getGenericIcon(), // 'home-icon',
      'icon-allow-overlap': true,
      // [
      //   'concat',
      //   ['get', 'variable'],
      //   '-icon',
      // ],
      'icon-size': 0.35,
    },
    interactive: true,
    paint: {
      'icon-color': color,
      'icon-halo-width': 3,
    },
    filter: [
      'all',
      ['!', ['has', 'point_count']],
      ['==', ['number', context.activePointTypes[ind]], 1],
    ],
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
      'line-width': 0.5,
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
        0.2,
        0.4,
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
  // color,
  ind,
) => {
  // console.log('getRedlineLayers', context)
  return [
    // Individual point icons.
    {
      z: pointsLevel + ind,
      style: getPointIcons(source, id, context, ind),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${id}Icons`,
    },
    // Cluster count background circles.
    {
      z: clustersLevel + 1 + ind,
      style: getClusterCountBg(source, id, context, ind),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${id}ClusterCountBg`,
    },
    // Cluster count.
    {
      z: clustersLevel + 2 + ind,
      style: getClusterCount(source, id, context, ind),
      idMap: true,
      hasFeatureId: true, // isCircleId,
      type: `${id}ClusterCount`,
    },
    // Cluster icons.
    {
      z: clustersLevel + 3 + ind,
      style: getClusterIcon(source, id, context, ind),
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
  for (
    var i = 0;
    i < context.activePointTypes.length;
    i++
  ) {
    const id = context.pointTypes[i].id
    if (!!sources[`points_${id}`]) {
      layers.push(
        ...getPointLayers(
          `points_${id}`,
          id,
          context,
          // color,
          i,
        ),
      )
    }
  }
  return layers
}
