import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react'
import useResizeAware from 'react-resize-aware'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import ReactMapGL, {
  NavigationControl,
  Popup,
} from 'react-map-gl'
import destination from '@turf/destination'
import centerOfMass from '@turf/center-of-mass'
import { fromJS } from 'immutable'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { css, cx } from 'emotion'

import { defaultMapStyle } from '../selectors'
import { getClosest } from '../utils'
import { usePrevious, isFeaturePoint } from './../../utils'
import { useMapViewport, useFlyToReset } from '../store'
import useMapStore from '../store'
import PopupContent from './PopupContent'
// import MapLayerToggle from './MapLayerToggle'
import MapResetButton from './MapResetButton'
import MapCaptureButton from './MapCaptureButton'
import MapLegend from './MapLegend'
import LegendToggleBtn from './LegendToggleBtn'
import MapMobileModal from './MapMobileModal'
import AddMapImages from './AddMapImages'
import {
  BOUNDS,
  DEFAULT_VIEWPORT,
} from './../../../../../constants/map'
import useStore from './../../store'
import { variables } from './../../theme'
import { ZoomIn, ZoomOut } from './../../../../core/Bitmaps'

/**
 * Returns an array of layer ids for layers that have the
 * interactive property set to true
 */
const getInteractiveLayerIds = layers => {
  // console.log('getInteractiveLayerIds', layers)
  layers
    .filter(l => l.style.get('interactive'))
    .map(l => l.style.get('id'))
}

const matchFeatureId = (layer, id) => {
  return
}

/**
 * Returns the map style with the provided layers inserted
 * @param {Map} style immutable Map of the base mapboxgl style
 * @param {array} layers list of layer objects containing style and z order
 */
const getUpdatedMapStyle = (
  style,
  layers,
  sources = fromJS({}),
) => {
  const updatedSources = style.get('sources').merge(sources)
  const updatedLayers = layers.reduce(
    (newLayers, layer) =>
      newLayers.splice(layer.z, 0, layer.style),
    style.get('layers'),
  )
  return style
    .set('sources', updatedSources)
    .set('layers', updatedLayers)
}

const MapBase = ({
  style,
  attributionControl,
  hovering,
  hoveredId,
  hoveredType,
  hoveredCoords,
  hoveredFeature,
  selectedIds,
  layers,
  sources,
  children,
  idMap,
  selectedColors,
  defaultViewport,
  ariaLabel,
  onHover,
  onClick,
  onTouch,
  onLoad,
  ...rest
}) => {
  // Mapbox API token from .env to pass into map.
  const TOKEN = process.env.GATSBY_MAPBOX_API_TOKEN

  const [loaded, setLoaded] = useState(false)

  const [resizeListener, sizes] = useResizeAware()

  const {
    setStoreValues,
    viewport,
    setViewport,
    flyToReset,
    activeMetric,
    activeQuintiles,
    activeLayers,
    activeView,
    breakpoint,
    setResetViewport,
    flyToSchoolSLN,
    interactionsMobile,
  } = useStore(state => ({
    setStoreValues: state.setStoreValues,
    viewport: state.viewport,
    setViewport: state.setViewport,
    flyToReset: state.flyToReset,
    activeMetric: state.activeMetric,
    activeQuintiles: state.activeQuintiles,
    activeLayers: state.activeLayers,
    activeView: state.activeView,
    breakpoint: state.breakpoint,
    setResetViewport: state.setResetViewport,
    flyToSchoolSLN: state.flyToSchoolSLN,
    interactionsMobile: state.interactionsMobile,
  }))

  // reference to map container DOM element
  const mapEl = useRef(null)

  // refernce to the ReactMapGL instance
  const mapRef = useRef(null)

  const currentMap =
    mapRef &&
    mapRef.current &&
    mapRef.current.getMap &&
    mapRef.current.getMap()

  // canvas element
  const canvas =
    currentMap &&
    currentMap.getCanvas &&
    currentMap.getCanvas()

  // storing previous hover / selected IDs
  const prev = usePrevious({
    hoveredId,
    hoveredType,
    selectedIds,
  })

  const setFeatureState = useCallback(
    (featureId, type, state) => {
      if (
        !loaded ||
        !featureId ||
        !currentMap ||
        !currentMap.setFeatureState
      )
        return
      // console.log('setFeatureState', featureId, type, state)
      // console.log('layers = ', layers)
      const layer = layers.find(l => l.type === type)
      // console.log('layer = ', layer)
      const id = idMap[featureId]
        ? idMap[featureId]
        : featureId
      if (layer) {
        const source = {
          source: layer.style.get('source'),
          id,
        }
        currentMap.setFeatureState(source, state)
      }
    },
    [layers, idMap, currentMap, loaded],
  )

  // update map style layers when layers change
  const mapStyle = useMemo(
    () => getUpdatedMapStyle(style, layers, sources),
    [style, layers, sources],
  )

  // update list of interactive layer ids when layers change
  const interactiveLayerIds = useMemo(
    () => getInteractiveLayerIds(layers),
    [layers],
  )

  useEffect(() => {
    if (canvas) {
      canvas.setAttribute('aria-label', ariaLabel)
    }
  }, [ariaLabel, canvas])

  // Handler for map load.
  const handleLoad = e => {
    // console.log('map loaded')
    // Enable event tracking once map is loaded.
    setStoreValues({
      doTrackEvents: true,
    })
    if (!loaded) {
      setLoaded(true)
      // HACK: remove tabindex from map div
      const tabindexEl = document.querySelector(
        '.map:first-child',
      )
      if (tabindexEl) {
        tabindexEl.children[0].removeAttribute('tabindex')
      }
      // add screen reader content for map
      if (canvas) {
        canvas.setAttribute('role', 'img')
        canvas.setAttribute('aria-label', ariaLabel)
      }
      // add geolocation
      // const geolocateControl = new mapboxgl.GeolocateControl(
      //   {
      //     positionOptions: {
      //       enableHighAccuracy: true,
      //     },
      //     trackUserLocation: true,
      //   },
      // )
      const controlContainer = document.querySelector(
        '.map__zoom:first-child',
      )
      // if (controlContainer && currentMap) {
      //   controlContainer.appendChild(
      //     geolocateControl.onAdd(currentMap),
      //   )
      // }
      // trigger load callback
      if (typeof onLoad === 'function') {
        onLoad(e)
      }
    }
  }

  // handler for viewport change, debounced to prevent
  // race errors
  const handleViewportChange = useCallback(
    (vp, options = {}) => {
      // console.log('handleViewportChange, vp = ', vp)
      // console.log('BOUNDS, ', BOUNDS)
      if (!loaded) return
      // If zoom is below min, reset zoom to min.
      if (vp.zoom && vp.zoom <= BOUNDS.zoom.min) {
        vp.zoom = BOUNDS.zoom.min
      }
      // If zoom is above max, reset zoom to max.
      if (vp.zoom && vp.zoom >= BOUNDS.zoom.max) {
        vp.zoom = BOUNDS.zoom.max
      }
      // Enforce bounds for panning.
      if (vp.longitude && vp.longitude < BOUNDS.lng.min) {
        // console.log('panned beyond lng.min')
        vp.longitude = BOUNDS.lng.min
      }
      if (vp.longitude && vp.longitude > BOUNDS.lng.max) {
        // console.log('panned beyond lng.max')
        vp.longitude = BOUNDS.lng.max
      }
      if (vp.latitude && vp.latitude < BOUNDS.lat.min) {
        // console.log('panned beyond lat.min')
        vp.latitude = BOUNDS.lat.min
      }
      if (vp.latitude && vp.latitude > BOUNDS.lat.max) {
        // console.log('panned beyond lat.max')
        vp.latitude = BOUNDS.lat.max
      }
      setViewport(vp)
    },
    [setViewport, loaded],
  )

  const [mouseCoords, setMouseCoords] = useState([
    null,
    null,
  ])
  const [mouseLngLat, setMouseLngLat] = useState([
    null,
    null,
  ])

  // handler for feature hover
  const handleHover = ({
    features,
    point,
    lngLat,
    srcEvent,
  }) => {
    // console.log(
    //   'handleHover, ',
    //   features,
    //   point,
    //   lngLat,
    //   srcEvent,
    // )
    setMouseCoords(point)
    setMouseLngLat(lngLat)
    const newHoveredFeature =
      features && features.length > 0 ? features[0] : null
    const coords =
      srcEvent && srcEvent.pageX && srcEvent.pageY
        ? [
            Math.round(srcEvent.pageX),
            Math.round(srcEvent.pageY),
          ]
        : null
    const geoCoordinates =
      newHoveredFeature && newHoveredFeature.geometry
        ? newHoveredFeature.geometry.coordinates
        : null
    onHover(newHoveredFeature, coords, geoCoordinates)
  }

  // handler for feature click
  const handleClick = ({
    features,
    point,
    srcEvent,
    ...rest
  }) => {
    // was the click on a control
    const isControl =
      getClosest(srcEvent.target, '.mapboxgl-ctrl-group') ||
      getClosest(srcEvent.target, '.map-legend') ||
      getClosest(srcEvent.target, '#map_reset_button') ||
      getClosest(srcEvent.target, '#map_capture_button') ||
      getClosest(srcEvent.target, '.mapboxgl-popup') ||
      getClosest(srcEvent.target, '.mapboxgl-popup-content')
    // console.log('click, isControl is', isControl)
    // if (!!isControl) return
    // activate feature if one was clicked and this isn't a control click
    if (features && features.length > 0 && !isControl) {
      const coords =
        srcEvent && srcEvent.pageX && srcEvent.pageY
          ? [
              Math.round(srcEvent.pageX),
              Math.round(srcEvent.pageY),
            ]
          : null
      const geoCoordinates =
        features[0] && features[0].geometry
          ? features[0].geometry.coordinates
          : null
      onClick(features[0], coords, geoCoordinates)
      // console.log('click, ', features[0].properties)
    }
  }

  // set the default viewport on mount
  useEffect(() => {
    defaultViewport && setViewport(defaultViewport)
  }, [])

  // set the map dimensions when the size changes
  useEffect(() => {
    setViewport({
      width: sizes.width,
      height: sizes.height,
    })
  }, [sizes, setViewport])

  // set hovered feature state when hoveredId changes
  useEffect(() => {
    // console.log('hoveredId changed, hoveredId', hoveredId)
    if (prev && prev.hoveredId && prev.hoveredType) {
      // Set state for unhovered school.
      setFeatureState(prev.hoveredId, prev.hoveredType, {
        hover: false,
      })
    }
    if (hoveredId) {
      // Set state for hovered school.
      setFeatureState(hoveredId, hoveredType, {
        hover: true,
      })
    }
    // eslint-disable-next-line
  }, [hoveredId, loaded]) // update only when hovered id changes

  const schoolHint = useStore(state => state.schoolHint)
  const handleFlyToSchool = () => {
    // console.log('handleFlyToSchool')
    if (!!flyToSchoolSLN) {
      const feature = currentMap.querySourceFeatures(
        'schools',
        {
          filter: ['in', 'SLN', flyToSchoolSLN],
        },
      )[0]
      // console.log(feature)

      if (!!feature) {
        const hint = {}
        hint.coords = feature.geometry.coordinates
        // console.log('hint = ', hint)
        setTimeout(() => {
          // console.log('calling onHover')
          setStoreValues({ schoolHint: hint })
          setTimeout(() => {
            setStoreValues({ schoolHint: null })
          }, 4000)
        }, 2000)
      }
    }
  }

  useEffect(() => {
    // console.log('fly to school changed')
    handleFlyToSchool()
  }, [flyToSchoolSLN])

  /** handler for resetting the viewport */
  const handleResetViewport = e => {
    e.preventDefault()
    flyToReset()
  }

  /**
   * Returns cursor state based on presence or absenced of hovered item
   * @return {[type]} [description]
   */
  const getCursor = () => {
    return !!hoveredId ? 'pointer' : 'grab'
  }

  const handleTouch = () => {
    // console.log('touch is happening')
    onTouch()
  }

  const handlePopupClose = () => {
    //
  }

  const handlePopupClick = e => {
    console.log('popup clicked, ', e.currentTarget)
    e.preventDefault()
  }

  // TODO: Add images for icons for layer.
  // https://github.com/visgl/react-map-gl/issues/1118#issuecomment-667809962

  return (
    <div
      id="map"
      className="map layout-view-map"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
      ref={mapEl}
      onMouseLeave={() =>
        handleHover({
          features: null,
          point: [null, null],
        })
      }
    >
      {resizeListener}
      <ReactMapGL
        ref={mapRef}
        attributionControl={attributionControl}
        mapStyle={mapStyle}
        dragRotate={false}
        touchRotate={false}
        dragPan={true}
        touchZoom={true}
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={handleViewportChange}
        onHover={handleHover}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        getCursor={getCursor}
        onClick={handleClick}
        onLoad={handleLoad}
        mapboxApiAccessToken={TOKEN}
        {...viewport}
        {...rest}
      >
        <AddMapImages loaded={loaded} map={currentMap} />
        {!!hoveredId &&
          !!mouseLngLat &&
          !(
            breakpoint === 'xs' ||
            breakpoint === 'sm' ||
            breakpoint === 'md' ||
            interactionsMobile
          ) && (
            <Popup
              className={clsx('school-details-tip')}
              latitude={mouseLngLat[1]}
              longitude={mouseLngLat[0]}
              anchor={`top`}
              offsetTop={20}
              onClick={handlePopupClick}
              closeButton={false}
              closeOnClick={false}
              onClose={() =>
                this.setState({ showPopup: false })
              }
              tipSize={0}
              dynamicPosition={true}
              captureClick={true}
              captureDrag={true}
              captureDoubleClick={true}
              captureScroll={true}
            >
              <PopupContent feature={hoveredFeature} />
            </Popup>
          )}
        {!!schoolHint && (
          <Popup
            className={clsx('school-interact-hint')}
            latitude={schoolHint.coords[1]}
            longitude={schoolHint.coords[0]}
            closeButton={false}
            closeOnClick={true}
            onClose={() =>
              this.setState({ showPopup: false })
            }
            tipSize={0}
            anchor="top"
            offsetTop={-55}
            dynamicPosition={true}
            captureClick={false}
            captureDrag={false}
            captureDoubleClick={false}
            captureScroll={false}
          >
            <div className="inner">
              {!interactionsMobile
                ? i18n.translate('UI_MAP_FLY_TO_PROMPT')
                : i18n.translate(
                    'UI_MAP_FLY_TO_PROMPT_MOBILE',
                  )}
            </div>
          </Popup>
        )}
        <MapLegend />
        <div className="custom-attribution">
          <span className="divider">|</span>
          <span
            dangerouslySetInnerHTML={{
              __html: i18n.translate(`MAP_UI_POWERED_BY`),
            }}
          ></span>
        </div>
        <div
          className={clsx('map__zoom', cx(mapZoomStyles))}
        >
          {activeView === 'explorer' && (
            <>
              <NavigationControl
                showCompass={false}
                onViewportChange={setViewport}
                captureClick={true}
              ></NavigationControl>
              <div className="map-btn-group">
                <MapResetButton
                  resetViewport={handleResetViewport}
                />
                <MapCaptureButton currentMap={currentMap} />
              </div>
            </>
          )}
        </div>
        {children}
      </ReactMapGL>
      {activeView === 'explorer' && <LegendToggleBtn />}
      <MapMobileModal hoveredFeature={hoveredFeature} />
    </div>
  )
}

MapBase.defaultProps = {
  style: defaultMapStyle,
  idMap: {},
  layers: [],
  attributionControl: true,
  selectedColors: ['#00ff00'],
}

MapBase.propTypes = {
  style: PropTypes.object,
  layers: PropTypes.array,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  hoveredId: PropTypes.number,
  idMap: PropTypes.object,
  selectedColors: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node,
  onHover: PropTypes.func,
  onClick: PropTypes.func,
  onLoad: PropTypes.func,
}

export default MapBase

const mapZoomStyles = css`
  position: absolute;
  bottom: 0px;
  top: 0px;
  left: auto;
  right: 16px;
  height: 200px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  // Explorer mapbox css overrides
  .mapboxgl-ctrl
    button.mapboxgl-ctrl-zoom-out
    .mapboxgl-ctrl-icon {
    background-image: url(${ZoomOut});
  }
  .mapboxgl-ctrl
    button.mapboxgl-ctrl-zoom-in
    .mapboxgl-ctrl-icon {
    background-image: url(${ZoomIn});
  }
  > .mapboxgl-ctrl-group {
    box-shadow: 1px 1px 3px #ccc;
    border-radius: 0;
    background-color: ${variables.colors.white};
    margin-bottom: 8px;
    .mapboxgl-control-icon {
      background-color: ${variables.colors.white};
      box-shadow: 1px 1px 3px #ccc;
      border-radius: 0;
      height: 29px;
      width: 29px;
    }
    &:not(:empty) {
      border-radius: 0;
      box-shadow: 1px 1px 3px #ccc;
    }
  }
  // > .btn {
  //   background-color: ${variables.colors.white};
  //   box-shadow: 1px 1px 3px #ccc;
  //   border-radius: 0;
  //   height: 29px;
  //   width: 29px;
  // }
  > .mapboxgl-ctrl-icon {
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: center center;
  }
`
