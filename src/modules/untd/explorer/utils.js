import i18n from '@pureartisan/simple-i18n'
import { useEffect, useRef, useState } from 'react'

import useStore from './store.js'
import { MAP_CONTROLS_CLASSES } from './../../../constants/map'
import { DATA_FILES } from './../../../constants/map'
import { UNTD_LAYERS } from './../../../constants/layers'

/**
 * Get robotext for the sd bucket
 * @param Number sd Number 0 - 4
 */
export const getSDRobo = sd => {
  switch (true) {
    case sd === 0:
      return i18n.translate(`SD_ROBO_0`)
      break
    case sd === 1:
      return i18n.translate(`SD_ROBO_1`)
      break
    case sd === 2:
      return i18n.translate(`SD_ROBO_2`)
      break
    case sd === 3:
      return i18n.translate(`SD_ROBO_3`)
      break
    case sd === 4:
      return i18n.translate(`SD_ROBO_4`)
      break
    default:
      return i18n.translate(`SD_ROBO_ERROR`)
  }
}

export const getActiveLayerIndex = layers => {
  return layers.indexOf(1)
}

/**
 * Builds a sentence case string from lowercase string.
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export const toSentenceCase = str => {
  let first = str.slice(0, 1)
  let rest = str.slice(1)
  first = first.toUpperCase()
  return first + rest
}

/**
 * Loads map features based on a string of locations
 * @param {string} locations locations formed as `{id},{lat},{lon}` separated by a `+`
 * @returns {Promise<Array<Feature>>}
 */
export const loadFeaturesFromRoute = locations =>
  loadFeaturesFromCoords(parseLocationsString(locations))

/**
 * Loads map features from location parameter
 * @param {*} params
 * @returns {Promise<Array<Feature>>}
 */
export const loadFeaturesFromRouteParams = params =>
  params.locations
    ? loadFeaturesFromRoute(params.locations)
    : Promise.resolve([])

// export const loadFlaggedData = type => {
//   return axios.get(FLAGGED_ENDPOINT + type + '.json')
// }

/**
 * Returns the feature with an id property that matches the
 * provided ID
 * @param {string} id
 * @param {FeatureCollection} collection
 * @returns {Feature}
 */
const getFeatureFromCollection = (id, collection) => {
  const feature = collection.find(
    f => f.properties.id === id,
  )
  if (!feature) {
    throw new Error(
      'feature ' + id + ' not found from tilequery API',
    )
  }
  return feature
}

/**
 * Converts string to title case
 * @param  String str String input
 * @return String
 */
export const toTitleCase = str => {
  str = str.toLowerCase().split(' ')
  for (var i = 0; i < str.length; i++) {
    str[i] =
      str[i].charAt(0).toUpperCase() + str[i].slice(1)
  }
  return str.join(' ')
}

/**
 * Returns a value rounded to the indicated number of decimals
 * @param  String value     Number or string, value passed to function
 * @param  Number decimals  Number of decimals to round to
 * @param  Boolan padZeroes If true, pad with extra zeroes to fill empty decimal spots
 * @return Number
 */
export const getRoundedValue = (
  value,
  decimals,
  padZeroes = false,
  isCurrency = false,
  isPercent = false,
) => {
  // console.log('getRoundedValue(), ', value)
  const type = typeof value
  if (!!isPercent) {
    value = value * 100
  }
  let fixed = null
  if (type === 'string') {
    if (padZeroes) {
      fixed = parseFloat(value)
        .toFixed(decimals)
        .toLocaleString()
    } else {
      fixed = Number(
        +parseFloat(value).toFixed(decimals),
      ).toLocaleString()
    }
  } else {
    if (padZeroes) {
      fixed = Number(
        value.toFixed(decimals),
      ).toLocaleString()
    } else {
      fixed = Number(
        value.toFixed(decimals),
      ).toLocaleString()
    }
  }
  if (!!isCurrency) {
    fixed = '$' + fixed
  }
  if (!!isPercent) {
    fixed = fixed + '%'
  }
  return fixed
}

/**
 * Returns boolean if quintile is within active quintiles
 * @param  {[type]}  quintile        [description]
 * @param  {[type]}  activeQuintiles [description]
 * @return {Boolean}                 [description]
 */
export const isInActiveQuintile = (
  quintile,
  activeQuintiles,
) => {
  return true
}

/**
 * Returns an index value for the quintile, 0 for far left, 4 for far right
 * @type {[type]}
 */
export const getQuintile = (
  value,
  min,
  max,
  high_is_good = 1,
) => {
  // console.log('getQuintile()')
  const standardized =
    (Math.abs(value - min) / Math.abs(max - min)) * 100
  switch (true) {
    case standardized >= 80:
      return high_is_good ? 4 : 0
      break
    case standardized < 80 && standardized >= 60:
      return high_is_good ? 3 : 1
      break
    case standardized < 60 && standardized >= 40:
      return 2
      break
    case standardized < 40 && standardized >= 20:
      return high_is_good ? 1 : 3
      break
    case standardized < 20 && standardized >= 0:
      return high_is_good ? 0 : 4
      break
    default:
      return 0
  }
}

/**
 * Calculates hash position (percent from left/0 based on min/max)
 * @param  Number value Value of metric
 * @param  Number min   Minimum of range for metric
 * @param  Number max   Maximum of range for metric
 * @return {[type]}       [description]
 */
export const getHashLeft = (value, min, max) => {
  return ((value - min) / (max - min)) * 100
}

/**
 * Filters an array of metrics, returns an object of metric data
 * @param  String metric string for metric
 * @return {[type]}        [description]
 */
export const getMetric = (metric, metrics) => {
  // console.log('getMetric, ', metric, metrics)
  const metricData = metrics.find(m => {
    return m.id === metric
  })
  if (!!metricData) {
    return metricData
  } else {
    return false
  }
}

export const getQuintilesPhrase = quintiles => {
  if (
    !!quintiles[0] &&
    !!quintiles[1] &&
    !!quintiles[2] &&
    !!quintiles[3] &&
    !!quintiles[4]
  ) {
    // all true, return
    return (
      i18n.translate('ALL_FIVE') +
      ' ' +
      i18n.translate('QUINTILES')
    )
  } else {
    let count = 0
    let last = 0
    for (let i = 1; i < quintiles.length; i++) {
      if (!!quintiles[i]) {
        last = i
        count++
      }
    }
    if (count === 0) {
      // No quintiles active
      return (
        i18n.translate('NO') +
        ' ' +
        i18n.translate('QUINTILES')
      )
    }
    if (count === 1) {
      // 1 quintiles active
      return (
        i18n.translate(getQuintileDesc(last)) +
        ' ' +
        i18n.translate('QUINTILE')
      )
    }
    let phrase = []
    quintiles.forEach((el, i) => {
      if (!!el) {
        phrase.push(i18n.translate(getQuintileDesc(i)))
      }
    })
    if (count === 2) {
      // 2 quintiles active
      // console.log('count is 2')
      phrase[phrase.length - 1] =
        i18n.translate('AND') +
        ' ' +
        phrase[phrase.length - 1]
      phrase.push(i18n.translate('QUINTILES'))
      phrase.join()
      phrase = String(phrase).replace(/,/g, ' ')

      return phrase
    } else {
      phrase[phrase.length - 1] =
        i18n.translate('AND') +
        ' ' +
        phrase[phrase.length - 1]
      phrase.join(',')
      phrase = String(phrase).replace(/,/g, ', ')
      phrase = phrase + ' ' + i18n.translate('QUINTILES')

      return phrase
    }
  }
}

/**
 * Returns string placeholder based on quintile provided
 * @param  Number quintile Quintile 0 - 4
 * @return String          String referncing translation file constant
 */
export const getQuintileDesc = quintile => {
  switch (true) {
    case quintile === 0: {
      return 'FIRST'
    }
    case quintile === 1: {
      return 'SECOND'
    }
    case quintile === 2: {
      return 'THIRD'
    }
    case quintile === 3: {
      return 'FOURTH'
    }
    case quintile === 4: {
      return 'FIFTH'
    }
  }
}

/**
 * Gets a property from a feature, returns null if not found
 * @param {Feature} feature GeoJSON feature
 * @param {string} propName property name to grab
 */
export const getFeatureProperty = (feature, propName) => {
  if (
    feature &&
    feature.properties &&
    feature.properties[propName] !== -999
  ) {
    return feature.properties[propName]
  }
  return null
}

/**
 * Returns the feature type (from feature.source)
 */
export const getFeatureType = feature => {
  return feature && feature.source ? feature.source : null
}

/**
 * Gets feature source
 * @param  {[type]} feature [description]
 * @return {[type]}         [description]
 */
export const getFeatureSource = feature => {
  if (!!feature && !!feature.source) {
    if (feature.source.indexOf('points') > -1) {
      return 'points'
    } else {
      return feature.source
    }
  } else {
    return null
  }
  // return feature && feature.source ? feature.source : null
}

/**
 * [getFeatureTypeInfo description]
 * @param  {[type]} feature [description]
 * @return {[type]}         [description]
 */
export const getFeatureTypeObj = feature => {
  const source = getFeatureSource(feature)
  // Points features are in a different config object
  // (loaded locally) than the layers, which exist as
  // remote sources.
  if (source && source.indexOf('points') > -1) {
    return source
      ? DATA_FILES.find(el => {
          return el.id === source
        })
      : null
  } else {
    return source
      ? UNTD_LAYERS.find(el => {
          return el.id === source
        })
      : null
  }
}

export const getFeatureId = feature => {
  const source = getFeatureSource(feature)
  // if (source && source.indexOf('points') > -1) {
  //   return feature.properties.FID
  // } else {
  const info = getFeatureTypeObj(feature)
  return feature.properties[info.id_key]
  // }
}

// export const generateFeatureId = feature => {
//   const lat = Math.round(
//     Math.abs(feature.properties.Latitude) * 10000000,
//   )
//   const lng = Math.round(
//     Math.abs(feature.properties.Longitude) * 10000000,
//   )
//   const id = Number(String(lng) + String(lat))
//   return id
// }

/**
 * Returns feature Id from properties field identified in
 * data map.
 */
// export const getFeatureId = feature => {
//   // console.log('getFeatureId, ', feature)
//   if (feature.layer.source === 'points') {
//     // Calculate an ID for the point based on its latlng,
//     // because no ID is provided by the feature.
//     const id = generateFeatureId(feature)
//     return id
//   } else {
//     const info = getFeatureTypeObj(feature)
//     return feature.properties[info.id_key]
//   }
// }

/**
 * Returns feature label from a properties field
 * designated in data map.
 */
export const getFeatureLabel = feature => {
  const info = getFeatureTypeObj(feature)
  return !!info ? feature.properties[info.label_key] : null
}

export const isFeaturePoint = feature => {
  return feature.geometry.type === 'Point'
}

/**
 * Gets a property from a feature, returns null if not found
 * @param {Feature} feature GeoJSON feature
 * @param {string} propName property name to grab
 */
export const getFeaturePropertyFromSet = (
  feature,
  propName,
) => {
  DATA_FILES

  if (
    feature &&
    feature.properties &&
    feature.properties[propName] !== -999
  ) {
    return feature.properties[propName]
  }
  return null
}

// Hook
export const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}

// https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
export const useDebounce = (value, delay) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(
    value,
  )

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler)
      }
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value, delay],
  )

  return debouncedValue
}

// https://gomakethings.com/how-to-get-the-closest-parent-element-with-a-matching-selector-using-vanilla-javascript/
export const getClosest = (elem, selector) => {
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        var matches = (
            this.document || this.ownerDocument
          ).querySelectorAll(s),
          i = matches.length
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1
      }
  }

  // Get the closest matching element
  for (
    ;
    elem && elem !== document;
    elem = elem.parentNode
  ) {
    if (elem.matches(selector)) return elem
  }
  return null
}

// Get all parents of an element.
// https://gomakethings.com/how-to-get-all-parent-elements-with-vanilla-javascript/
export const getParents = function (elem) {
  // Set up a parent array
  var parents = []

  // Push each parent element to the array
  for (
    ;
    elem && elem !== document;
    elem = elem.parentNode
  ) {
    parents.push(elem)
  }

  // Return our parent array
  return parents
}

/**
 * Check whether or not a control is hovered,
 * based on an array of class selectors.
 */
export const checkControlHovered = () => {
  // console.log('checkControlHovered()')
  const hoveredElements = document.querySelectorAll(
    ':hover',
  )
  const parents = []
  hoveredElements.forEach(el => {
    parents.push(getParents(el))
  })
  const parentsList = Object.values(parents)
  const nodeList = Object.values(hoveredElements)
  const isControl =
    nodeList.some(node => {
      // console.log('node, ', node, node.classList)
      return MAP_CONTROLS_CLASSES.some(item =>
        node.classList.contains(item),
      )
    }) ||
    parentsList.some(node => {
      // console.log('node, ', node, node.classList)
      return MAP_CONTROLS_CLASSES.some(
        item =>
          node &&
          node.classlist &&
          node.classList.contains(item),
      )
    })
  // console.log('isControl, ', isControl)
  return isControl
}

/**
 * Returns a feature label specific to the feature type.
 * @param Object feature
 * @returns String
 */
export const getGeoFeatureLabel = feature => {
  const source = UNTD_LAYERS.find(item => {
    return item.id === feature.source
  })
  const layerID = feature.layer.source
  const label = feature.properties[source.label_key]
    ? feature.properties[source.label_key]
    : false

  switch (true) {
    case layerID === 'zip':
      return i18n.translate(`TOOLTIP_PLACE_ZIP`, {
        label: label,
      })
      break
    case layerID === 'place':
      return `${label}`
      break
    case layerID === 'tract':
      return i18n.translate(`TOOLTIP_PLACE_TRACT`, {
        label: label,
      })
      break
    case layerID === 'county':
      return i18n.translate(`TOOLTIP_PLACE_COUNTY`, {
        label: label,
      })
      break
  }
}

export const setActiveQuintile = quintile => {
  // console.log('setActiveQuintile, ', quintile)
  const arr = [0, 0, 0, 0, 0]
  arr[quintile] = 1
  // console.log(arr)
  return arr
}

export const replaceWeirdQuestionmark = str => {
  return str.replaceAll('�', '')
}
