import React, { useMemo, useEffect, useRef } from 'react'
import { fromJS } from 'immutable'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import { getLayers } from './selectors'
import MapBase, { useIdMap } from './../Map'

import { HOVER_LAYERS } from './../../../../constants/layers'
import { DATA_FILES } from './../../../../constants/map'
import {
  getMetric,
  getQuintilesPhrase,
  getFeatureProperty,
  getFeatureId,
  getFeatureTypeObj,
  getFeatureSource,
  getFeatureType,
} from './../utils'
import useStore from './../store'

const MapView = props => {
  // Generic state updates for store.
  // Accepts an object of values to update.
  const {
    setStoreValues,
    pointTypes,
    activeMetric,
    // activeQuintiles,
    breakpoint,
    showMapModal,
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
    // activeLayers,
    // activePointTypes,
    activeView,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      pointTypes: state.pointTypes,
      activeMetric: state.activeMetric,
      // activeQuintiles: state.activeQuintiles,
      breakpoint: state.breakpoint,
      showMapModal: state.showMapModal,
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
      // activeLayers: [...state.activeLayers],
      // activePointTypes: [...state.activePointTypes],
      activeView: state.activeView,
    }),
    shallow,
  )

  useEffect(() => {
    console.log('hovered feature object changed')
  }, [hoveredFeature])
  useEffect(() => {
    console.log('hovered ID changed')
  }, [hoveredID])
  // Currently active metric
  // const metric = useStore(state => state.activeMetric)
  // Active quintiles
  const activeQuintiles = useStore(
    state => [...state.activeQuintiles],
    shallow,
  )
  const activeLayers = useStore(
    state => [...state.activeLayers],
    shallow,
  )
  // Active point types
  const activePointTypes = useStore(
    state => [...state.activePointTypes],
    shallow,
  )

  const [idMap, addToIdMap] = useIdMap()
  const isLoaded = useRef(false)
  // console.log('mapview, sources: ', remoteJson)

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
    }
    return getLayers(remoteJson, context)
  }, [
    isLoaded.current,
    allDataLoaded,
    activeMetric,
    activeQuintiles,
    activeLayers,
    activePointTypes,
    remoteJson,
  ])

  /** aria label for screen readers */
  const ariaLabel = i18n.translate('UI_MAP_SR', {
    metric: i18n.translate(activeMetric),
    quintiles: getQuintilesPhrase(activeQuintiles),
  })

  /** handler for map hover */
  const handleHover = (feature, coords, geoCoords) => {
    console.log(
      'handleHover in mapview, ',
      feature,
      coords,
      geoCoords,
    )
    if (!!interactionsMobile) return
    // let type =
    //   feature && feature.source ? feature.source : null
    // const source =
    //   feature && feature.source ? feature.source : null
    // let id =
    //   feature && feature.layer && feature.layer.id
    //     ? feature.layer.id
    //     : null
    // const source_data = DATA_FILES.find(el => {
    //   return el.id === source
    // })

    const source = getFeatureSource(feature)
    const source_data = getFeatureTypeObj(feature)
    // console.log('source_data, ', source_data)
    if (source_data && !!source_data.popup) {
      console.log('has source data, has popup')
      // const id = getFeatureProperty(
      //   feature,
      //   getFeatureId(feature),
      // )
      // Verify that this is a hoverable feature.
      // if (HOVER_LAYERS.indexOf(source) > -1) {
      const id = getFeatureId(feature)
      const type = getFeatureType(feature)
      console.log('setting hovered, ', feature, id)
      setHovered(id, type, geoCoords, feature)
      // }
    } else {
      setHovered(false, false, geoCoords, false)
    }
    // if (
    //   feature &&
    //   feature.layer &&
    //   feature.layer.id === 'tractsShapes'
    // ) {
    //   console.log('Tract shape hovered.')
    //   // type = `district`
    // }
    // if (
    //   feature &&
    //   feature.layer &&
    //   feature.layer.id === 'schools-circle'
    // ) {
    //   // console.log('School circle hovered.', feature)
    //   type = `schools`
    //   // console.log('handleHover, ', feature, coords)
    //   id = getFeatureProperty(feature, 'TEA')
    //   // setHovered(id, type, geoCoords, feature)
    // }
    // console.log('handleHover, ', id)
    // setHovered(id, type, geoCoords, feature)
  }

  /** handler for map click */
  // const eventSchoolPage = useStore(
  //   state => state.eventSchoolPage,
  // )
  const handleClick = (feature, coords, geoCoords) => {
    // console.log('handle click, ', feature)
    // If the item is hovered, navigate to the school.
    // If the item is not hovered, set it as hovered.
    // setHovered(id, type, geoCoords, feature)
    if (feature.source === 'schools') {
      // console.log('school clicked, ', feature)
      if (!!interactionsMobile) {
        // If it's not yet hovered, set it as hovered.
        // console.log('Small screen, setting up modal.')
        // console.log('showMapModal, ', showMapModal)
        const type = `schools`
        const id = getFeatureProperty(feature, 'TEA')
        setHovered(id, type, geoCoords, feature)
        // Launch the map modal
        // setShowMapModal(true)
        setStoreValues({ showMapModal: true })
        // console.log('showMapModal, ', showMapModal)
      } else {
        // If it is hovered, then navigate to new window.
        if (!!window) {
          const href =
            window.location.origin +
            '/schools/' +
            feature.properties.SLN +
            '/'
          window.open(href, '_blank')
        }
        // setEventSchoolPage(eventSchoolPage + 1)
        setStoreValues({
          eventSchoolPage: eventSchoolPage + 1,
        })
      }
    }
  }

  // If touch events are happening, flag the device as touch.
  const handleTouch = () => {}

  /** handler for map load */
  const handleLoad = () => {
    // inform global listener that map has loaded
    console.log('map loaded')
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
