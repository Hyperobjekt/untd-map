import create from 'zustand'
import i18n from '@pureartisan/simple-i18n'
import { FlyToInterpolator } from 'react-map-gl'
import WebMercatorViewport from 'viewport-mercator-project'
import * as ease from 'd3-ease'
import merge from 'deepmerge'

import en_US from './../../../constants/en_US'
import {
  DEFAULT_VIEWPORT,
  DEFAULT_ROUTE,
} from './../../../constants/map'

const [useStore] = create((set, get) => ({
  // Set any store values by passing in an object of values to merge.
  setStoreValues: obj => set({ ...obj }),
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
  // Push items to indicator list.
  addIndicators: inds => {
    set(state => ({
      indicators: [...state.indicators, ...inds],
    }))
  },
  // Track loading of remote data files.
  allDataLoaded: false,
  // Percent loaded for remote data files.
  dataLoadedPercent: 0,
  // Error flag for loading failure.
  dataLoaderFailed: false,
  // Set JSON loaded from remote location.
  remoteJson: {},
  setRemoteJson: json =>
    set(state => ({
      remoteJson: { ...state.remoteJson, ...json },
    })),
  // Default route.
  defaultRoute: DEFAULT_ROUTE,
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
  flyToSchool: (lat, lng) => {
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
  schoolZonesAffix: `200`,
  activeLayers: [1, 0, 0, 0, 0, 0, 0, 0, 0],
  defaultMetric: 'tot_popE_13_sd', // Default metric.
  activeMetric: 'tot_popE_13_sd', // Active metric applied to map.
  activeQuintiles: [1, 1, 1, 1, 1],
  slideoutPanel: {
    active: false,
    panel: '', // 'filters', 'layers', or 'info'
  },
  defaultFilterTab: 'cri',
  activeFilterTab: 'cri',
  feederSchools: [],
  activeFeeder: null,
  feederLocked: false,
  highlightedSchool: '',
  shareLinkModal: false,
  unifiedShareModal: false,
  handleToggleMenu: null,
  shareHash: null,
  breakpoint: null,
  browserWidth: null,
  flyToSchoolSLN: null,
  schoolHint: null,
  showIntroModal: false,
  showPanelModal: false,
  enableTour: true, // Set this true to show the launch tour button in intro modal.
  showMapModal: false,
  // Hovered feature ID
  hovered: null,
  // Hovered feature type.
  type: null,
  // Hovered feature object.
  feature: null,
  // x, y coords of hovered object.
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
    console.log(
      'setHovered',
      hoveredId,
      hoveredType,
      coords,
    )
    set(state => ({
      hovered: hoveredId,
      type: hoveredType,
      coords: coords ? coords : state.coords,
      feature: feature,
    }))
  },
  // Position of tooltips in control panel, changes with breakpoint
  buttonTooltipPosition: 'auto',
  showMobileLegend: false,
  interactionsMobile: false,
  runTour: false,
  tourStepIndex: 0,
  // Set up for tour to run.
  setUpTour: () => {
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
      // Close modal if displayed.
      showPanelModal: false,
      // Return tour to 0.
      tourStepIndex: 0,
      // Run the tour.
      runTour: true,
    }))
  },
  // Have images been added for map symbol layers?
  mapImagesAdded: 0,
  // Do not track events before map is loaded, as these
  // are state settings based on hash and not user interactions.
  doTrackEvents: false,
  // Counters for events that don't have clear state indicators.
  eventShareTwitter: 0,
  eventShareFacebook: 0,
  eventShareEmail: 0,
  eventShareLink: 0,
  eventMapReset: 0,
  eventMapCapture: 0,
  eventSchoolSearch: 0,
  eventSchoolPage: 0,
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
  // Not counters.
  accessedSchool: null,
  eventError: 0,
}))

export default useStore
