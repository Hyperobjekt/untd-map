import create from 'zustand'
import i18n from '@pureartisan/simple-i18n'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'
import merge from 'deepmerge'
import bbox from '@turf/bbox'

import en_US from './../../../constants/en_US'
import {
  DEFAULT_VIEWPORT,
  DEFAULT_ROUTE,
  DEFAULT_ACTIVE_LAYERS,
  ROUTE_SET,
  DEFAULT_REMOTE_SOURCES,
} from './../../../constants/map'
import { UNTD_LAYERS } from './../../../constants/layers'

const getFeatureGeometryType = feature => {
  if (!feature.geometry || !feature.geometry.type)
    return null
  return feature.geometry.type
}

const getViewportForFeature = (
  feature,
  initialViewport,
) => {
  const type = getFeatureGeometryType(feature)
  if (!type) return {}
  if (type === 'Point') {
    console.log('type is point')
    const [
      longitude,
      latitude,
    ] = feature.geometry.coordinates
    return {
      latitude,
      longitude,
      zoom: 14,
    }
  }
  const featureBbox = bbox(feature)
  const bounds = [
    [featureBbox[0], featureBbox[1]],
    [featureBbox[2], featureBbox[3]],
  ]
  return getViewportForBounds(bounds, initialViewport)
}

const getViewportForBounds = (
  bounds,
  baseViewport,
  options = {},
) => {
  const width = baseViewport.width
  const height = baseViewport.height
  const padding = options.padding || 20
  const vp = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(bounds, { padding })
  return {
    ...baseViewport,
    latitude: vp.latitude,
    longitude: vp.longitude,
    zoom: vp.zoom,
  }
}

const [useStore] = create((set, get) => ({
  // Set any store values by passing in an object of values to merge.
  setStoreValues: set,
  // Active language
  activeLang: `en_US`,
  // Counter for lang pack updates.
  langUpdates: 0,
  incrementLangUpdates: () => {
    set(state => ({
      langUpdates: state.langUpdates + 1,
    }))
  },
  // Languages store.
  langs: {
    en_US: en_US,
  },
  // Get a language.
  getLang: loc => {
    return get().langs[loc]
  },
  // Set languages.
  setLang: (loc, lang) => {
    // console.log('setLang')
    const newLangs = get().langs
    // console.log('newLangs, ', newLangs)
    newLangs[loc] = merge(newLangs[loc], lang)
    set({ langs: newLangs })
    // console.log('after set: ', get().langs)
  },
  // List of indicator objects.
  indicators: [],
  // Have indicators min, max, and mean values been set?
  indicatorRangesSet: false,
  // Push items to indicator list.
  addIndicators: inds => {
    set(state => ({
      indicators: [...state.indicators, ...inds],
    }))
  },
  // List of items to show in tooltip/popup.
  tooltipItems: [],
  // Push items to indicator list.
  addTooltipItems: items => {
    set(state => ({
      tooltipItems: [...state.tooltipItems, ...items],
    }))
  },
  // Track loading of remote data files.
  allDataLoaded: false,
  // Map loaded
  mapLoaded: false,
  // Percent loaded for remote data files.
  dataLoadedPercent: 0,
  // Error flag for loading failure.
  dataLoaderFailed: false,
  // Array to collect any issues with the format of the remote data
  dataIssuesLog: [],
  // Push items to issues log
  addDataIssuesLog: items => {
    set(state => ({
      dataIssuesLog: [...state.dataIssuesLog, ...items],
    }))
  },
  // Set JSON loaded from remote location.
  remoteJson: DEFAULT_REMOTE_SOURCES,
  setRemoteJson: json =>
    set(state => ({
      remoteJson: { ...state.remoteJson, ...json },
    })),
  // Track whether all interactive layers have loaded.
  // interactiveSourcesLoaded: false,
  rangedSources: [undefined, undefined, undefined],
  pushRangedSources: item => {
    set(state => ({
      rangedSources: [...state.rangedSources, item],
    }))
  },
  loadedSources: [undefined, undefined, undefined],
  pushLoadedSources: item => {
    set(state => ({
      loadedSources: [...state.loadedSources, item],
    }))
  },
  // Trend data.
  trendData: [],
  trendMinMax: {},
  trendMinMaxSet: false,
  // Default route.
  defaultRoute: DEFAULT_ROUTE,
  // Route set with constants for route validation.
  routeSet: ROUTE_SET,
  siteHref: '/',
  logoSrc: null,
  activeView: `explorer`, // View type, explorer or embed
  viewport: {
    latitude: 32.7603525,
    longitude: -96.791731,
    zoom: 10,
    bearing: 0,
    pitch: 0,
    dragPan: true,
    touchZoom: true,
    touchRotate: true,
    preserveDrawingBuffer: true,
  },
  resetViewport: DEFAULT_VIEWPORT,
  setViewport: viewport =>
    set(state => ({
      viewport: { ...state.viewport, ...viewport },
    })),
  flyToReset: () => {
    set(state => ({
      viewport: {
        ...state.resetViewport,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic,
      },
    }))
  },
  flyToFeature: feature => {
    const viewport = {
      ...getViewportForFeature(feature, get().viewport),
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: ease.easeCubic,
    }
    set(state => ({ viewport }))
  },
  flyToBounds: bounds => {
    set(state => ({
      viewport: {
        ...getViewportForBounds(bounds, state.viewport),
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic,
      },
    }))
  },
  flyToLatLng: (lat, lng) => {
    // console.log('fly to school, ', lat)
    const newViewport = {
      latitude: lat,
      longitude: lng,
      zoom: 14,
    }
    set(state => ({
      viewport: {
        ...state.viewport,
        ...newViewport,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: ease.easeCubic,
      },
    }))
  },
  // Array of interactive layers, 1 = active, 0 = inactive
  activeLayers: ROUTE_SET.find(el => {
    return el.id === 'layers'
  }).defaultValue,
  // All data from data dict.
  allData: [],
  // Stores types of points.
  pointTypes: [],
  // Stores the point types available from the geo source.
  pointTypeLayers: [],
  // Stores active point types.
  activePointTypes: ROUTE_SET.find(el => {
    return el.id === 'points'
  }).defaultValue,
  // Stores default static layers.
  activeStaticLayers: ROUTE_SET.find(el => {
    return el.id === 'static_layers'
  }).defaultValue,
  // Point categories.
  pointCategories: [],
  defaultMetric: ROUTE_SET.find(el => {
    return el.id === 'metric'
  }).defaultValue, // Default metric.
  activeMetric: ROUTE_SET.find(el => {
    return el.id === 'metric'
  }).defaultValue, // Active metric applied to map.
  activeQuintiles: ROUTE_SET.find(el => {
    return el.id === 'quintiles'
  }).defaultValue,
  slideoutPanel: {
    active: false,
    panel: '', // 'filters', 'layers', or 'info'
  },
  shareLinkModal: false,
  unifiedShareModal: false,
  handleToggleMenu: null,
  shareHash: null,
  breakpoint: null,
  browserWidth: null,
  schoolHint: null,
  showIntroModal: false,
  enableTour: true, // Set this true to show the launch tour button in intro modal.
  // Hovered feature ID
  hoveredID: null,
  // Hovered feature type.
  hoveredType: null,
  // Hovered feature object.
  hoveredFeature: null,
  // geo coords of hovered object.
  coords: [0, 0],
  setCoords: coords => set({ coords }),
  // Sets the various state items related to school hover.
  setHovered: (
    hoveredId,
    hoveredType,
    coords,
    feature,
    options = { showTooltip: true, showMarkers: true },
  ) => {
    // Uncomment to watch what's hovered.
    // console.log(
    //   'setHovered',
    //   hoveredId,
    //   hoveredType,
    //   coords,
    // )
    set(state => ({
      hoveredID: hoveredId,
      hoveredType: hoveredType,
      coords: coords ? coords : state.coords,
      hoveredFeature: feature,
    }))
  },
  // Mouse position as an array [x,y]
  mouseXY: [0, 0],
  // Mouse position as latlng
  mouseLatLng: [],
  // Keep track of map size [width, height]
  mapSize: [0, 0],
  // Is a map control currently hovered? boolean.
  isControlHovered: false,
  // Position of tooltips in control panel, changes with breakpoint
  buttonTooltipPosition: 'auto',
  // Current location [lng, lat]
  currentLocation: [],
  // Display of modal for feedback entry and submission.
  showFeedbackModal: false,
  // The feature for populating the map.
  feedbackFeature: 0,
  // Address for feedback
  feedbackAddress: '',
  // Feedback lat long array
  feedbackLngLat: [],
  showMobileLegend: false,
  interactionsMobile: false,
  runTour: false,
  tourStepIndex: 0,
  // Set up for tour to run.
  setUpTour: () => {
    // console.log('setUpTour()')
    set(state => ({
      // Return view to map.
      activeView: 'explorer',
      // Reset metric.
      activeMetric: state.defaultMetric,
      // Reset quintiles.
      activeQuintiles: [1, 1, 1, 1, 1],
      // Close the panel.
      slideoutPanel: {
        active: false,
        panel: '',
      },
      // Active tab in slideout panel.
      activeFilterTab: state.defaultFilterTab,
      // Return tour to 0.
      tourStepIndex: 0,
      // Run the tour.
      runTour: true,
    }))
  },
  // Selected "active" feature (a geo shape (zip, place, tract))
  activeFeature: 0,
  // Have images been added for map symbol layers?
  mapImagesAdded: 0,
  // Array of map images (because hasImage isn't working)
  mapImages: [],
  // Do not track events before map is loaded, as these
  // are state settings based on hash and not user interactions.
  doTrackEvents: false,
  // Counters for events that don't have clear state indicators.
  eventGeocodeSearch: 0,
  eventShareTwitter: 0,
  eventShareFacebook: 0,
  eventShareEmail: 0,
  eventShareLink: 0,
  eventMapReset: 0,
  eventMapCapture: 0,
  eventLaunchTour: 0,
  eventCloseTour: 0,
  eventCloseTourStep: null,
  incrementLaunchTour: () => {
    set(state => ({
      eventLaunchTour: state.eventLaunchTour + 1,
    }))
  },
  incrementCloseTour: () => {
    set(state => ({
      eventCloseTour: state.eventCloseTour + 1,
      eventCloseTourStep: state.tourStepIndex,
    }))
  },
  eventError: 0,
}))

export default useStore
