import React, { useMemo } from 'react'
import { Popup } from 'react-map-gl'
import shallow from 'zustand/shallow'
import clsx from 'clsx'

import useStore from './../../store'
import PopupContent from './PopupContent'
import { DEFAULT_POPUP } from './../../../../../constants/map'

/**
 * Get the anchor and offset based on x / y and map size
 * @returns {object} {popupAnchor, popupOffset}
 */
const getPopupProps = ({ mouseXY, mapSize }) => {
  // console.log('getPopupProps, ', mapSize, mouseXY)
  const popupWidth = DEFAULT_POPUP.width
  const popupHeight = DEFAULT_POPUP.height
  const padding = DEFAULT_POPUP.padding
  const offset = DEFAULT_POPUP.offset
  let setX = mouseXY[0] + offset
  let setY = mouseXY[1] + offset
  let closeToRight = false
  let closetoBottom = false
  // If mouse is close to right edge...
  if (setX + popupWidth + padding > mapSize.width) {
    // console.log('off the right edge, resetting')
    closeToRight = true
  }
  // If mouse is close to bottom...
  if (setY + popupHeight + padding > mapSize.height) {
    // console.log('off the bottom edge, resetting')
    closetoBottom = true
  }
  let anchor = 'top-left'
  let popupOffset = [offset, offset]
  if (closeToRight) {
    anchor = 'top-right'
    popupOffset = [offset * -1, offset]
  }
  if (closetoBottom) {
    anchor = 'bottom-left'
    popupOffset = [offset, offset * -1]
  }
  if (closeToRight && closetoBottom) {
    anchor = 'bottom-right'
    popupOffset = [offset * -1, offset * -1]
  }
  return {
    popupAnchor: anchor,
    popupOffset,
  }
}

function usePopupState() {
  const {
    breakpoint,
    interactionsMobile,
    mouseXY,
    mapSize,
    hoveredID,
    mouseLatLng,
    hoveredFeature,
    isControlHovered,
  } = useStore(
    state => ({
      breakpoint: state.breakpoint,
      interactionsMobile: state.interactionsMobile,
      mouseXY: state.mouseXY,
      mapSize: state.mapSize,
      hoveredID: state.hoveredID,
      mouseLatLng: state.mouseLatLng,
      hoveredFeature: state.hoveredFeature,
      isControlHovered: state.isControlHovered,
    }),
    shallow,
  )

  const showPopup =
    // Feature is hovered
    !!hoveredID &&
    // We have coords for the mouse
    !!mouseLatLng[0] &&
    !!mouseLatLng[1] &&
    // We have mouseXY for the mouse
    !!mouseXY[0] &&
    !!mouseXY[1] &&
    // Control is not hovered
    !isControlHovered &&
    // We are not in mobile view or interactions mode
    !(
      breakpoint === 'xs' ||
      breakpoint === 'sm' ||
      breakpoint === 'md' ||
      interactionsMobile
    )
  const popupCoords = showPopup ? mouseLatLng : null
  const { popupAnchor, popupOffset } = getPopupProps({
    mouseXY,
    mapSize,
  })
  return useMemo(() => {
    return {
      show: showPopup,
      coords: popupCoords,
      anchor: popupAnchor,
      offset: popupOffset,
      feature: hoveredFeature,
    }
  }, [
    showPopup,
    popupCoords,
    popupAnchor,
    popupOffset,
    hoveredFeature,
  ])
}

const MapPopup = () => {
  const {
    show,
    coords,
    anchor,
    offset,
    feature,
  } = usePopupState()

  return (
    show && (
      <Popup
        className={clsx('school-details-tip')}
        latitude={coords[1]}
        longitude={coords[0]}
        closeButton={false}
        tipSize={0}
        anchor={anchor}
        offsetTop={offset[1]}
        offsetLeft={offset[0]}
        // latitude={coords[1]}
        // longitude={coords[0]}
        // anchor={anchor}
        // offsetTop={offset[1]}
        // offsetLeft={offset[0]}
        // closeButton={false}
        // closeOnClick={false}
        // onClose={() => this.setState({ showPopup: false })}
        // tipSize={0}
        // dynamicPosition={false}
        // captureClick={true}
        // captureDrag={true}
        // captureDoubleClick={true}
        // captureScroll={true}
      >
        <PopupContent feature={feature} />
      </Popup>
    )
  )
}
export default MapPopup
