import React, { useMemo, useRef } from 'react'
// import { fromJS } from 'immutable'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import { getLayers } from './selectors'
import MapBase, { useIdMap } from './../Map'

import {
  getQuintilesPhrase,
  getFeatureId,
  getFeatureTypeObj,
  getFeatureSource,
} from './../utils'
import { UNTD_LAYERS } from './../../../../constants/layers'
import useStore from './../store'
import useFeedbackPanel from '../Feedback/useFeedbackPanel'

const MapView = props => {
  // Generic state updates for store.
  // Accepts an object of values to update.
  const {
    setStoreValues,
    pointTypes,
    activeMetric,
    activeQuintiles,
    interactionsMobile,
    hoveredID,
    hoveredType,
    hoveredFeature,
    coords,
    setHovered,
    remoteJson,
    allDataLoaded,
    viewport,
    pointTypeLayers,
    activeLayers,
    activePointTypes,
    activeStaticLayers,
    activeFeature,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      pointTypes: state.pointTypes,
      activeMetric: state.activeMetric,
      activeQuintiles: state.activeQuintiles,
      interactionsMobile: state.interactionsMobile,
      hoveredID: state.hoveredID,
      hoveredType: state.hoveredType,
      hoveredFeature: state.hoveredFeature,
      coords: state.coords,
      setHovered: state.setHovered,
      remoteJson: state.remoteJson,
      allDataLoaded: state.allDataLoaded,
      viewport: state.viewport,
      pointTypeLayers: state.pointTypeLayers,
      activeLayers: state.activeLayers,
      activePointTypes: state.activePointTypes,
      activeStaticLayers: state.activeStaticLayers,
      activeFeature: state.activeFeature,
    }),
    shallow,
  )

  const { showFeedbackForPoint } = useFeedbackPanel()

  const [idMap, addToIdMap] = useIdMap()
  const isLoaded = useRef(false)
  // console.log('mapview, sources: ', remoteJson)

  // Improves slow performance
  // when selecting point types.
  // Allows activePointTypes to update and
  // point features pane to re-render
  // before map layers are reprocessed.
  // const debouncedActivePointTypes = useDebounce(
  //   activePointTypes,
  //   50,
  // )
  // const debouncedActiveMetric = useDebounce(
  //   activeMetric,
  //   50,
  // )
  // const debouncedActiveLayers = useDebounce(
  //   activeLayers,
  //   50,
  // )

  /** memoized array of shape and point layers */
  const layers = useMemo(() => {
    // console.log('triggering layers fetch')
    if (
      !activeMetric ||
      !activeQuintiles ||
      !activeLayers ||
      !allDataLoaded
    ) {
      // console.log('returning')
      return []
    }
    const context = {
      activeMetric,
      activeQuintiles,
      activeLayers,
      activePointTypes,
      pointTypes,
      pointTypeLayers,
      activeStaticLayers,
    }
    return getLayers(remoteJson, context)
  }, [
    isLoaded.current,
    allDataLoaded,
    activeMetric, // debouncedActiveMetric,
    activeQuintiles,
    activeLayers,
    activeStaticLayers,
    activePointTypes, // debouncedActivePointTypes,
    remoteJson,
  ])

  /** aria label for screen readers */
  const ariaLabel = i18n.translate('UI_MAP_SR', {
    metric: i18n.translate(activeMetric),
    quintiles: getQuintilesPhrase(activeQuintiles),
  })

  /** handler for map hover */
  const handleHover = (feature, coords, geoCoords) => {
    if (!!interactionsMobile) return
    const source = getFeatureSource(feature)
    const source_data = getFeatureTypeObj(feature)
    if (!!source_data && !!source) {
      const id = getFeatureId(feature)
      setHovered(id, source, geoCoords, feature)
    } else {
      setHovered(false, false, geoCoords, false)
    }
  }

  /** handler for map click */
  const handleClick = (feature, coords, geoCoords) => {
    // If feature source = one of the interactive geo layers
    if (
      feature.source &&
      UNTD_LAYERS.map(el => {
        return el.id
      }).indexOf(feature.source) > -1
    ) {
      // console.log('interactive geo feature clicked')
      if (
        !activeFeature ||
        activeFeature.id !== feature.id
      ) {
        setStoreValues({
          activeFeature: feature,
          slideoutPanel: {
            active: true,
            panel: 'location',
          },
        })
      } else {
        // Already selected.
        setStoreValues({
          activeFeature: 0,
          slideoutPanel: {
            active: false,
            panel: 'location',
          },
        })
      }
    }
    // If feature source = one of the point layers, launch feedback.
    if (
      feature.source &&
      feature.source.indexOf('points') > -1
    ) {
      showFeedbackForPoint(feature)
    }
  }

  // If touch events are happening, flag the device as touch.
  const handleTouch = () => {}

  /** handler for map load */
  const handleLoad = () => {
    // inform global listener that map has loaded
    // console.log('map loaded')
    // window.CPAL.trigger('map')
    isLoaded.current = true
  }
  return (
    <MapBase
      sources={!!allDataLoaded ? remoteJson : null}
      layers={layers}
      idMap={idMap}
      hoveredId={hoveredID ? hoveredID : undefined}
      hoveredType={hoveredType ? hoveredType : undefined}
      hoveredCoords={coords ? coords : undefined}
      hoveredFeature={
        hoveredFeature ? hoveredFeature : undefined
      }
      ariaLabel={ariaLabel}
      onHover={handleHover}
      onLoad={handleLoad}
      onClick={handleClick}
      onTouch={handleTouch}
      defaultViewport={viewport}
    ></MapBase>
  )
}

export default MapView
