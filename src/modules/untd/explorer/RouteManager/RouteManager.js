import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'

import useStore from './../store'
import { getRoundedValue, useDebounce } from './../utils'
import {
  BOUNDS,
  DEFAULT_ROUTE,
  ROUTE_SET,
} from './../../../../constants/map'
import { UNTD_LAYERS } from './../../../../constants/layers'
import { validateRouteOption } from './utils/utils'

/**
 * Get a route parameters object based on the string
 * @param {string} path
 * @returns {object} e.g. { region: 'counties', metric: 'avg', ... }
 */
export const getParamsFromPathname = path => {
  // console.log('getParamsFromPathname()')
  // strip starting "#" and "/" chars
  const route = path.replace(/^#\/+/g, '')
  const routeArr = path.split('/')
  // routeArr.map((el, i) => {
  //   return DEFAULT_ROUTE[i].id
  // })
  // Construct object from hash
  return route.split('/').reduce(
    (acc, curr, i) => ({
      ...acc,
      [DEFAULT_ROUTE[i]]:
        ['zoom', 'lat', 'lon'].indexOf(DEFAULT_ROUTE[i]) >
        -1
          ? parseFloat(curr)
          : curr,
    }),
    {},
  )
}

export const getStrippedRoute = route =>
  route.replace(/^#[/]+/g, '').replace(/\/$/g, '')

export const isEmptyRoute = route =>
  getStrippedRoute(route).length === 0

// const isParamValid = ()

/**
 * Verify that view contains one of the two views.
 * @param  String view View string
 * @return Boolean
 */
// const isViewValid = view => {
//   // console.log('isViewValid, ', view)
//   return ['explorer', 'embed'].indexOf(view) > -1
// }

/**
 * Verifies that metric exists in metric collection.
 * @param  {String}  metric String that corresponds to metric ID in constants
 * @return {Boolean}
 */
// const isMetricValid = (metric, indicators) => {
//   // Check if it's in the metrics list
//   // console.log('isMetricValid')
//   // If it's empty, just return true. We'll use the default.
//   if (metric.length === 0) {
//     return true
//   } else {
//     // If not empty, verify that it's in the metrics collection.
//     // const filter = CPAL_METRICS.find(el => {
//     //   return el.id === metric
//     // })
//     // return !!filter ? true : false
//   }
// }

/**
 * Verifies that quintiles string can be converted into array of quintiles.
 * @param  {String}  quintiles String of comma-separated numbers
 * @return {Boolean}
 */
// const isQuintilesValid = quintiles => {
//   // console.log('isQuintilesValid')
//   if (!quintiles) return true
//   if (quintiles.length < 5) return false
//   const arr = quintiles.split(',')
//   let t = true
//   arr.forEach(el => {
//     const n = Number(el)
//     if (n !== 1 && n !== 0) {
//       t = false
//     }
//   })
//   return t
// }

// const isLayersValid = layers => {
//   // console.log('isLayersValid()')
//   if (!layers) return true
//   const arr = layers.split(',')
//   // console.log('arr, ', arr)
//   if (arr.length < UNTD_LAYERS.length) return false
//   let t = true
//   arr.forEach((el, i) => {
//     const n = Number(el)
//     if (n !== 1 && n !== 0) {
//       t = false
//     }
//     if (
//       UNTD_LAYERS[i].only_one === true &&
//       Number(arr[i]) === 1
//     ) {
//       // Get the name
//       const name = UNTD_LAYERS[i].only_one_name
//       // If others with same name are true in layers, return false.
//       // console.log('only one loop, others = ', others)
//       UNTD_LAYERS.forEach((item, index) => {
//         if (
//           i !== index &&
//           item.only_one === true &&
//           item.only_one_name === name
//         ) {
//           // console.log('matching up the other only-ones')
//           if (Number(arr[index]) === 1) {
//             // console.log("there's another true")
//             t = false
//           }
//         }
//       })
//     }
//   })
//   // console.log('isLayersValid(), ', t)
//   return t
// }

const isLatLngValid = (lat, lng) => {
  // console.log('isLatLngValid()')
  // Make sure they're inside the bounds.
  if (!lat && !lng) return true
  lat = Number(lat)
  lng = Number(lng)
  let isValid = true
  if (lat < BOUNDS.lat.min || lat > BOUNDS.lat.max) {
    // console.log('lat out of bounds')
    isValid = false
  }
  if (lng < BOUNDS.lng.min || lng > BOUNDS.lng.max) {
    // console.log('lng out of bounds')
    isValid = false
  }
  return isValid
}

const isZoomValid = zoom => {
  // console.log('isZoomValid, ', zoom)
  if (!zoom) return true
  // Make sure it's within the zoom min and max.
  return zoom > BOUNDS.zoom.min && zoom < BOUNDS.zoom.max
}

/**
 * Validates all route params
 * @param  {Object}  params [description]
 * @return {Boolean}        [description]
 */
const isRouteValid = (params, routeSet, indicators) => {
  // console.log('isRouteValid(), ', params)
  let isValid = true
  if (
    !isViewValid(params.view) ||
    !isMetricValid(params.metric, indicators) ||
    !isQuintilesValid(params.quintiles) ||
    !isLayersValid(params.layers) ||
    !isPointsValid(params.points) ||
    !isLatLngValid(params.lat, params.lng) ||
    !isZoomValid(params.zoom)
  ) {
    isValid = false
  }
  console.log('hash is valid = ', isValid)
  return isValid
}

/**
 * Constructs a comma-delineated string from array of active layers.
 * @param  {Array} activeLayers
 * @return {String}
 */
const getLayersString = activeLayers => {
  // console.log('getLayersString(), ', activeLayers)
  return activeLayers.toString()
}

const RouteManager = props => {
  // console.log('RouteManager!!!!!')
  // track if initial route has loaded
  const isLoaded = useRef(false)
  // Generic store value setter.
  const {
    setStoreValues,
    activeView,
    viewSelect,
    activeMetric,
    activeQuintiles,
    activeLayers,
    viewport,
    setViewport,
    shareHash,
    indicators,
    activePointTypes,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      // Active view type.
      activeView: state.activeView,
      // Update view select control
      viewSelect: state.viewSelect,
      // Metric.
      activeMetric: state.activeMetric,
      // Active standard deviations.
      activeQuintiles: state.activeQuintiles,
      activeLayers: state.activeLayers,
      viewport: state.viewport,
      setViewport: state.setViewport,
      shareHash: state.shareHash,
      indicators: state.indicators,
      activePointTypes: state.activePointTypes,
    }),
    shallow,
  )

  // Active layers.
  // const activeLayers = useStore(
  //   state => [...state.activeLayers],
  //   shallow,
  // )
  // Viewport.
  // const viewport = useStore(state => state.viewport)
  // const setViewport = useStore(state => state.setViewport)
  // Feeder is locked.
  // const feederLocked = useStore(state => state.feederLocked)
  // Track share hash and update when it changes
  // const shareHash = useStore(state => state.shareHash)
  // List of indicators
  // const indicators = useStore(state => state.indicators)

  // const activePointTypes = useStore(
  //   state => state.activePointTypes,
  // )

  /**
   * Returns a hash based on state
   * @return {String} [description]
   */
  const getHashFromState = () => {
    const hash =
      activeView +
      '/' +
      activeMetric +
      '/' +
      activeQuintiles.toString() +
      '/' +
      getLayersString(activeLayers) +
      '/' +
      activePointTypes.toString() +
      '/' +
      getRoundedValue(viewport.latitude, 4) +
      '/' +
      getRoundedValue(viewport.longitude, 4) +
      '/' +
      getRoundedValue(viewport.zoom, 2) +
      '/'

    return hash
  }

  // get the route params based on current view
  const route = getHashFromState()

  // debounce the route so it updates every 1 second max
  const debouncedRoute = useDebounce(route, 500)

  /**
   * Sets state from route params
   * @param {[type]} params [description]
   */
  const setStateFromHash = params => {
    // console.log('setStateFromHash(), ', params)

    if (!!params.view) {
      // setActiveView(params.view)
      // const newViewSelect = viewSelect.map(el => {
      //   if (String(el.id).indexOf(params.view) >= 0) {
      //     el.active = true
      //   } else {
      //     el.active = false
      //   }
      //   return el
      // })
      setStoreValues({
        activeView: params.view,
        // viewSelect: newViewSelect,
      })
    }
    if (!!params.metric) {
      setStoreValues({ activeMetric: params.metric })
      // TODO: Update this for new indicators list.
      // const tab = CPAL_METRICS.filter(
      //   el => el.id === params.metric,
      // )[0].tab
      // if (!!tab) {
      //   setStoreValues({ activeFilterTab: tab })
      // }
      // console.log('setting metric, ', params.metric, tab)
    }
    if (params.quintiles && params.quintiles.length > 0) {
      const quintiles = params.quintiles.split(',')
      setStoreValues({
        activeQuintiles: quintiles.map(el => {
          return Number(el)
        }),
      })
    }

    if (params.layers && params.layers.length > 0) {
      const getLayers = params.layers.split(',')
      setStoreValues({
        activeLayers: getLayers.map(el => {
          return Number(el)
        }),
      })
    }

    if (params.points && params.points.length > 0) {
      const getPoints = params.points.split(',')
      setStoreValues({
        activePointTypes: getPoints.map(el => {
          return Number(el)
        }),
      })
    }

    let resetViewport = false
    if (!!params.lat && !!params.lng) {
      viewport.latitude = Number(params.lat)
      viewport.longitude = Number(params.lng)
      resetViewport = true
    }
    if (!!params.zoom) {
      viewport.zoom = Number(params.zoom)
      resetViewport = true
    }
    if (!!resetViewport) {
      setViewport(viewport)
    }
  }

  useEffect(() => {
    if (isLoaded.current) {
      // When hash changes, if route is valid, update route for sharing.
      window.addEventListener('hashchange', () => {
        // console.log('hashchange')
        const path = window.location.hash
        // Construct params object from hash.
        const params = getParamsFromPathname(
          path,
          props.routeSet,
        )
        if (
          !isEmptyRoute(path) &&
          isRouteValid(
            params,
            props.routeSet,
            indicators,
          ) &&
          path !== shareHash
        ) {
          // console.log('updating hash')
          setStoreValues({
            shareHash: window.location.hash,
          })
        }
      })
    }
  }, [isLoaded.current])

  // update the hash when debounced route changes
  useEffect(() => {
    // only change the hash if the initial route has loaded
    if (isLoaded.current) {
      // window.location.hash = '#/' + debouncedRoute
      window.history.replaceState(
        { hash: '#/' + debouncedRoute },
        'Explorer state update',
        window.location.origin +
          window.location.pathname +
          '#/' +
          debouncedRoute,
      )
      localStorage.setItem(
        'cpal_hash',
        '#/' + debouncedRoute,
      )
      setStoreValues({ shareHash: '#/' + debouncedRoute })
    }
  }, [debouncedRoute])

  // load the route when the application mounts
  useEffect(() => {
    async function loadRoute() {
      // console.log('loadRoute')
      isLoaded.current = true
      // Get path.
      const path = window.location.hash
      // Construct params object from hash.
      const params = getParamsFromPathname(
        path,
        props.routeSet,
      )
      const localStorageHash = localStorage.getItem(
        'cpal_hash',
      )
      if (
        !isEmptyRoute(path) &&
        isRouteValid(params, props.routeSet, indicators)
      ) {
        // Update state based on params
        setStateFromHash(params)
      } else if (!!localStorageHash) {
        if (localStorageHash.length > 0) {
          const lsparams = getParamsFromPathname(
            localStorageHash,
            props.routeSet,
          )
          if (
            isRouteValid(
              lsparams,
              props.routeSet,
              indicators,
            )
          ) {
            setStateFromHash(lsparams)
          }
        }
      }
      if (isEmptyRoute(path) && !localStorageHash) {
        // console.log('showing intro modal')
        setStoreValues({ showIntroModal: true })
      }
    }
    loadRoute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // this component doesn't render anything
  return null
}

RouteManager.propTypes = {
  routeSet: PropTypes.array, // Constants listing params and allowable options.
}

export default RouteManager
