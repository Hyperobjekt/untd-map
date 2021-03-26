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
  // Construct an object from the route, using
  // the route set ids as keys.
  const params = route
    .split('/')
    .slice(0, ROUTE_SET.length - 1)
    .reduce(
      (acc, curr, i) => ({
        ...acc,
        [ROUTE_SET[i].id]:
          ['zoom', 'lat', 'lon'].indexOf(ROUTE_SET[i]) > -1
            ? parseFloat(curr)
            : curr,
      }),
      {},
    )
  // console.log('params,', params)
  return params
}

export const getStrippedRoute = route =>
  route.replace(/^#[/]+/g, '').replace(/\/$/g, '')

export const isEmptyRoute = route =>
  getStrippedRoute(route).length === 0

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
const isRouteValid = params => {
  console.log('isRouteValid(), ', params, ROUTE_SET)
  let isValid = true
  if (
    // View
    !validateRouteOption(ROUTE_SET[0], params.view) ||
    // Metric
    !validateRouteOption(ROUTE_SET[1], params.metric) ||
    // Quintiles
    !validateRouteOption(ROUTE_SET[2], params.quintiles) ||
    // Layers
    !validateRouteOption(ROUTE_SET[3], params.layers) ||
    // Points
    !validateRouteOption(ROUTE_SET[4], params.points) ||
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
    activeMetric,
    activeQuintiles,
    activeLayers,
    viewport,
    setViewport,
    indicators,
    activePointTypes,
    allDataLoaded,
    activeStaticLayers,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      // Active view type.
      activeView: state.activeView,
      // Metric.
      activeMetric: state.activeMetric,
      // Active standard deviations.
      activeQuintiles: state.activeQuintiles,
      activeLayers: state.activeLayers,
      viewport: state.viewport,
      setViewport: state.setViewport,
      indicators: state.indicators,
      activePointTypes: state.activePointTypes,
      allDataLoaded: state.allDataLoaded,
      activeStaticLayers: state.activeStaticLayers,
    }),
    shallow,
  )

  /**
   * Returns a hash based on state
   * @return {String} [description]
   */
  const getHashFromState = () => {
    // console.log('getHashFromState')
    const hash =
      activeView +
      '/' +
      activeMetric +
      '/' +
      activeQuintiles.toString() +
      '/' +
      getLayersString(activeLayers) +
      '/' +
      getLayersString(activeStaticLayers) +
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
    console.log('setStateFromHash(), ', params)
    if (!!params.view) {
      setStoreValues({
        activeView: params.view,
      })
    }

    if (!!params.metric) {
      setStoreValues({ activeMetric: params.metric })
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

    if (
      params.static_layers &&
      params.static_layers.length > 0
    ) {
      const getLayers = params.static_layers.split(',')
      setStoreValues({
        activeStaticLayers: getLayers.map(el => {
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

  // update the hash when debounced route changes
  useEffect(() => {
    // console.log('debounced route changed')
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
        'untd_hash',
        '#/' + debouncedRoute,
      )
      setStoreValues({
        shareHash: '#/' + debouncedRoute,
      })
    }
  }, [debouncedRoute])

  useEffect(() => {
    async function loadRoute() {
      // console.log('loadRoute()')
      if (allDataLoaded !== true) {
        // console.log('Data not yet loaded.')
        return
      }
      isLoaded.current = true
      // Get path.
      const path = window.location.hash
      // Construct params object from hash.
      const params = getParamsFromPathname(path)
      const localStorageHash = localStorage.getItem(
        'untd_hash',
      )
      if (
        !isEmptyRoute(path) &&
        isRouteValid(params, indicators)
      ) {
        // Update state based on params
        // console.log('setting state from hash params')
        setStateFromHash(params)
      } else if (!!localStorageHash) {
        if (localStorageHash.length > 0) {
          const lsparams = getParamsFromPathname(
            localStorageHash,
          )
          if (isRouteValid(lsparams, indicators)) {
            // console.log('setting state from local storage')
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
  }, [allDataLoaded])

  // this component doesn't render anything
  return null
}

export default RouteManager
