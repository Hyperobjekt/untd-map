import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { MdPhotoCamera } from 'react-icons/md'
import { CoreButton } from './../../../../core'

import useStore from './../../store'
import { variables } from './../../theme'
import styled from 'styled-components'

const MapButton = styled(CoreButton)`
  background-color: ${variables.colors.white} !important;
  box-shadow: 1px 1px 3px #ccc;
  border-radius: 0 !important;
  padding: 0;
  height: 29px;
  width: 29px;
  border-top: 1px solid #ddd !important;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05) !important;
  }
  .icon {
    width: 16px;
    height: 16px;
  }
`

/**
 * Button that captures map canvas and triggers download
 */
const MapCaptureButton = ({ currentMap, ...props }) => {
  // Generic state updates for store.
  // Accepts an object of values to update.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Whether to handle interactions like mobile device?
  const interactionsMobile = useStore(
    state => state.interactionsMobile,
  )
  // Increment to trigger event tracker for use of map capture button.
  const eventMapCapture = useStore(
    state => state.eventMapCapture,
  )

  const captureMap = () => {
    // console.log('captureMap')
    const dataURL = currentMap
      .getCanvas()
      .toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataURL
    a.setAttribute('download', 'cri-explorer-capture.png')
    a.click()
    a.remove()
    setStoreValues({ eventMapCapture: eventMapCapture + 1 })
  }

  return (
    <MapButton
      color="none"
      active={true}
      id="map_capture_button"
      className={clsx(
        `map-capture-btn`,
        `mapboxgl-ctrl-icon`,
      )}
      onClick={captureMap}
      label={i18n.translate(`UI_MAP_CAPTURE`)}
      tooltip={!interactionsMobile ? 'left' : ''}
    >
      <MdPhotoCamera className="icon" />
      <span className="sr-only">
        {i18n.translate(`UI_MAP_CAPTURE`)}
      </span>
    </MapButton>
  )
}

export default MapCaptureButton
