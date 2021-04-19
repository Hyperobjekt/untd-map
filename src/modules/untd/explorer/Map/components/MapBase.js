import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react'
import useResizeAware from 'react-resize-aware'
import ReactMapGL, { NavigationControl } from 'react-map-gl'
import { fromJS } from 'immutable'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { css, cx } from 'emotion'
import shallow from 'zustand/shallow'

import { defaultMapStyle } from '../selectors'
import { getClosest } from '../utils'
import {
  usePrevious,
  checkControlHovered,
} from './../../utils'
import MapResetButton from './MapResetButton'
import MapCaptureButton from './MapCaptureButton'
import MapLegend, { LegendToggleBtn } from './../../Legend'
import MapPopup from './MapPopup'
// import LegendToggleBtn from './../Legend/LegendToggleBtn'
import MapMobileModal from './MapMobileModal'
import AddMapImages from './AddMapImages'
import { BOUNDS } from './../../../../../constants/map'
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
    activeView,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      viewport: state.viewport,
      setViewport: state.setViewport,
      flyToReset: state.flyToReset,
      activeView: state.activeView,
    }),
    shallow,
  )

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
      mapLoaded: true,
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
    // const type =
    //   features && features.length > 0
    //     ? features[0].layer.source
    //     : null
    const newHoveredFeature =
      features && features.length > 0 ? features[0] : null
    // const coords = lngLat
    // // srcEvent && srcEvent.pageX && srcEvent.pageY
    // //   ? [
    // //       Math.round(srcEvent.pageX),
    // //       Math.round(srcEvent.pageY),
    // //     ]
    // //   : null
    // const geoCoordinates =
    //   newHoveredFeature && newHoveredFeature.geometry
    //     ? newHoveredFeature.geometry.coordinates
    //     : null
    onHover(newHoveredFeature, point, lngLat)
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
    // console.log('popup clicked, ', e.currentTarget)
    e.preventDefault()
  }

  const handleMouseMove = e => {
    // console.log('handleMouseMove(), ', e)
    setStoreValues({
      mouseXY: e.point,
      mouseLatLng: e.lngLat,
      isControlHovered: checkControlHovered(),
    })
  }

  const handleResize = size => {
    // console.log('handleResize(), ', size)
    setStoreValues({
      mapSize: size,
    })
  }

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
        onResize={handleResize}
        onMouseMove={handleMouseMove}
        mapboxApiAccessToken={TOKEN}
        {...viewport}
        {...rest}
      >
        <AddMapImages loaded={loaded} map={currentMap} />
        <MapPopup />
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

  > div {
    position: relative !important;
  }

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
  .mapboxgl-ctrl-group {
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
  > .mapboxgl-ctrl-icon {
    background-size: 24px 24px;
    background-repeat: no-repeat;
    background-position: center center;
  }
`
