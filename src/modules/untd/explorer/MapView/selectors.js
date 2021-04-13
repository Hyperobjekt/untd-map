import { fromJS } from 'immutable'

import { CRI_COLORS } from './../../../../constants/colors'
import {
  UNTD_LAYERS,
  POINT_CATEGORIES,
  UNTD_STATIC_LAYERS,
} from './../../../../constants/layers'
import { replaceWeirdQuestionmark } from './../utils'

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

// Functions for static shapes
// Lines
export const getStaticLayerLines = (source, context) => {
  // console.log('getStaticLayerLines(), ', context)
  return fromJS({
    id: `${source}Lines`,
    source: source,
    type: 'line',
    layout: {
      visibility: 'visible',
    },
    interactive: true,
    paint: {
      'line-color': [
        'case',
        ['==', source, 'county'],
        '#939308',
        ['==', source, 'fedcongress'],
        '#C0553E',
        ['==', source, 'statehouse'],
        '#7F5CCA',
        ['==', source, 'statesenate'],
        '#796848',
        ['==', source, 'schooldistricts'],
        '#4B6857',
        '#4B6857',
      ],
      'line-width': 1,
    },
  })
}
// Labels
export const getStaticLayerLabel = (source, context) => {
  // console.log('getStaticLayerLabel(), ', source, context)
  const layerObj =
    UNTD_STATIC_LAYERS[
      context.activeStaticLayers.indexOf(1)
    ]
  return fromJS({
    id: `${source}Label`,
    source: `${source}_points`,
    type: 'symbol',
    interactive: false,
    layout: {
      'icon-allow-overlap': true,
      'text-field': ['get', 'label'],
      'text-font': [
        'DIN Offc Pro Medium',
        'Arial Unicode MS Bold',
      ],
      'text-size': 12,
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': [
        'case',
        ['==', source, 'county'],
        '#939308',
        ['==', source, 'fedcongress'],
        '#C0553E',
        ['==', source, 'statehouse'],
        '#7F5CCA',
        ['==', source, 'statesenate'],
        '#796848',
        ['==', source, 'schooldistricts'],
        '#4B6857',
        '#4B6857',
      ],
    },
    // filter: [
    //   'all',
    //   ['has', 'point_count'],
    //   ['==', ['number', context.activePointTypes[ind]], 1],
    // ],
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

z = 50
/**
 * Get the static geo shape layer, line and text label
 * @param String source
 * @param String id
 * @param Object context
 * @param {*} ind
 * @returns
 */
export const getStaticLayer = (source, context) => {
  // console.log('getStaticLayer', context)
  return [
    // Lines.
    {
      z: z + 1,
      style: getStaticLayerLines(source, context),
      idMap: true,
      hasFeatureId: true,
      type: `${source}Lines`,
    },
    // Label.
    // {
    //   z: z + 2,
    //   style: getStaticLayerLabel(source, context),
    //   idMap: true,
    //   hasFeatureId: true,
    //   type: `${source}Label`,
    // },
  ]
}
// Necessary to break these out because the client has accidentally
// removed some label layers at some points during the project.
export const getStaticLayerLabellll = (source, context) => {
  // console.log('getStaticLayerLabellll', context)
  return [
    // Label.
    {
      z: z + 2,
      style: getStaticLayerLabel(source, context),
      idMap: true,
      hasFeatureId: true,
      type: `${source}Label`,
    },
  ]
}

export const getLayers = (sources, context) => {
  console.log('getLayers', sources, context)
  const layers = []
  // Interactive geo shapes
  layers.push(...getPolygonLayers('zip', context))
  layers.push(...getPolygonLayers('tract', context))
  layers.push(...getPolygonLayers('place', context))
  // Static geo shapes
  // console.log('UNTD_STATIC_LAYERS, ', UNTD_STATIC_LAYERS)
  const staticLayer = UNTD_STATIC_LAYERS[
    context.activeStaticLayers.indexOf(1)
  ]
    ? UNTD_STATIC_LAYERS[
        context.activeStaticLayers.indexOf(1)
      ].id
    : false
  if (!!staticLayer) {
    layers.push(...getStaticLayer(staticLayer, context))
  }
  // Does the static layer type get a label?
  // If so, add a layer for the labels.
  const hasStaticLayerLabel = !!UNTD_STATIC_LAYERS[
    context.activeStaticLayers.indexOf(1)
  ]
    ? UNTD_STATIC_LAYERS[
        context.activeStaticLayers.indexOf(1)
      ].has_labels
    : false
  if (hasStaticLayerLabel) {
    layers.push(
      ...getStaticLayerLabellll(staticLayer, context),
    )
  }
  // Add a layer for each point type,
  // and a cluster layer for each point type.
  // for (
  //   var i = 0;
  //   i < context.activePointTypes.length;
  //   i++
  // ) {
  //   const id = context.pointTypes[i].id
  //   if (!!sources[`points_${id}`]) {
  //     layers.push(
  //       ...getPointLayers(
  //         `points_${id}`,
  //         id,
  //         context,
  //         // color,
  //         i,
  //       ),
  //     )
  //   }
  // }
  return layers
}
