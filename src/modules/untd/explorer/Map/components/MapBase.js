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
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import styled from 'styled-components'

import { defaultMapStyle } from '../selectors'
import { isNonMapEvent } from '../utils'
import { checkControlHovered } from './../../utils'
import MapResetButton from './MapResetButton'
import MapCaptureButton from './MapCaptureButton'
import MapLegend, { LegendToggleBtn } from './../../Legend'
import MapPopup from './MapPopup'
// import LegendToggleBtn from './../Legend/LegendToggleBtn'
import { BOUNDS } from './../../../../../constants/map'
import { UNTD_LAYERS } from './../../../../../constants/layers'
import useStore from './../../store'
import { variables } from './../../theme'
import { ZoomIn, ZoomOut } from './../../../../core/Bitmaps'
import useMapImageLoader from '../hooks/useMapImageLoader'
import useMapFeatureStates from '../hooks/useMapFeatureStates'

/**
 * Returns an array of layer ids for layers that have the
 * interactive property set to true
 */
const getInteractiveLayerIds = layers => {
  // console.log('getInteractiveLayerIds', layers)
  return layers
    .filter(l => l.style.get('interactive'))
    .map(l => l.style.get('id'))
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
    allDataLoaded,
    indicators,
    allData,
    loadedSources,
    rangedSources,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      viewport: state.viewport,
      setViewport: state.setViewport,
      flyToReset: state.flyToReset,
      activeView: state.activeView,
      allDataLoaded: state.allDataLoaded,
      indicators: state.indicators,
      allData: state.allData,
      loadedSources: state.loadedSources,
      rangedSources: state.rangedSources,
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

  /** Load map images for point layers */
  useMapImageLoader({ map: currentMap, loaded })

  /** Manage feature states (for hover + selected styles) */
  useMapFeatureStates(currentMap, loaded)

  /**
   * Adds shape range data to indicators array as they are loaded.
   */
  useEffect(() => {
    if (!!allDataLoaded) {
      // console.log(
      //   'updating indicators from basemap, ',
      //   loadedSources,
      // )
      // And set a min, max, and mean for each shape type
      const localIndicators = indicators.slice()
      indicators
        .filter(el => {
          return Number(el.display) === 1
        })
        .forEach((i, index) => {
          // Get raw metric from sd in indicator id
          const rawMetric = i.id.replace('_sd', '')
          const metric = allData.find(el => {
            return el.variable === rawMetric
          })
          // console.log('metric: ', metric)
          // Create placeholders for the values to be calculated.
          if (!i.raw) {
            i.raw = {
              id: rawMetric,
              min: [undefined, undefined, undefined],
              max: [undefined, undefined, undefined],
              mean: [undefined, undefined, undefined],
              decimals: Number(metric.decimals), // [undefined, undefined, undefined],
              currency: Number(metric.currency),
              percent: Number(metric.percent),
              highisgood: Number(metric.highisgood),
            }
          }
          // Iterate through each layer.
          loadedSources.forEach(layer => {
            // console.log(
            //   `Inside loaded sources layer, ${layer}`,
            // )
            // If it hasn't yet been handled...
            if (
              layer !== undefined &&
              rangedSources.indexOf(layer) < 0
            ) {
              // console.log(
              //   `it hasn not been handled yet ${layer}`,
              // )
              const ind = UNTD_LAYERS.map(el => {
                return el.id
              }).indexOf(layer)
              // console.log('ind = ', ind)
              // Get feature set from the map
              const featureSet = currentMap
                .querySourceFeatures(layer)
                .filter(item => {
                  // Filter out items without this value.
                  return (
                    !!item.properties[rawMetric] &&
                    item.properties[rawMetric] !==
                      'undefined' &&
                    item.properties[rawMetric] !== 'NA'
                  )
                })
                // Create an array of only these values.
                .map(item => {
                  return item.properties[rawMetric]
                })
              // Set min, max, and mean to the indicator for the shape
              if (featureSet.length > 0) {
                i.raw.min[ind] = Math.min(...featureSet)
                i.raw.max[ind] = Math.max(...featureSet)
                i.raw.mean[ind] =
                  featureSet.reduce(
                    (acc, curr) => acc + curr,
                  ) / featureSet.length
              }
              const newRangedSources = rangedSources.slice()
              newRangedSources[ind] = layer
              setStoreValues({
                rangedSources: newRangedSources,
              })
            }
          })
          // console.log(`completed indicator ${i.id}: `, i)
          // Replace original indicator value with this one.
          localIndicators[index] = i
        })
      setStoreValues({
        indicators: localIndicators,
        indicatorRangesSet: true,
      })
    }
  }, [allDataLoaded, ...loadedSources])

  // when sources load on the map, trigger setting min / max
  useEffect(() => {
    if (!currentMap) return
    function sourceCallback() {
      const newLoadedSources = loadedSources.slice()

      UNTD_LAYERS.forEach((layer, ind) => {
        // console.log(
        //   `Checking the untd_layers, ${layer.id}`,
        // )
        if (
          currentMap.getSource(layer.id) &&
          currentMap.isSourceLoaded(layer.id) &&
          currentMap.querySourceFeatures(layer.id).length >
            0
        ) {
          if (loadedSources.indexOf(layer.id) < 0) {
            // pushLoadedSources(layer.id)
            // const newLoadedSources = loadedSources.slice()
            newLoadedSources[ind] = layer.id
          } else {
            // console.log(
            //   `${layer.id} is already in loadedSources.`,
            // )
          }
        }
      })
      setStoreValues({
        loadedSources: newLoadedSources,
      })
    }
    currentMap.on('sourcedata', sourceCallback)
  }, [currentMap])

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
    const isControl = srcEvent && isNonMapEvent(srcEvent)
    // clear hovered feature if hovering a control (or no srcEvent)
    if (!srcEvent || isControl)
      return onHover(null, point, lngLat)
    const newHoveredFeature =
      features && features.length > 0 ? features[0] : null
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
    const isControl = isNonMapEvent(srcEvent)
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
        <MapControls className="map__zoom">
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
        </MapControls>
        {children}
      </ReactMapGL>
      {activeView === 'explorer' && <LegendToggleBtn />}
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

const MapControls = styled.div`
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
  .map-btn-group {
    background-color: #fff;
    width: 29px;
  }
`
