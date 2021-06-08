import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { MdRefresh } from 'react-icons/md'

import { DEFAULT_VIEWPORT } from './../../../../../constants/map'
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
  &:hover {
    background-color: rgba(0, 0, 0, 0.05) !important;
  }
  .reset-icon {
    width: 16px;
    height: 16px;
  }
`

/**
 * Button to reset zoom and pan to default viewport settings
 */
const MapResetButton = ({ ...props }) => {
  // Generic state updates for store.
  // Accepts an object of values to update.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const resetViewport = props.resetViewport
  const viewport = useStore(state => state.viewport)
  const interactionsMobile = useStore(
    state => state.interactionsMobile,
  )
  const eventMapReset = useStore(
    state => state.eventMapReset,
  )

  const handleReset = e => {
    if (
      viewport.zoom !== DEFAULT_VIEWPORT.zoom ||
      viewport.latitude !== DEFAULT_VIEWPORT.latitude ||
      viewport.longitude !== DEFAULT_VIEWPORT.longitude
    ) {
      resetViewport(e)
      setStoreValues({ eventMapReset: eventMapReset + 1 })
    }
  }

  return (
    <MapButton
      color="none"
      active={true}
      id="map_reset_button"
      className={clsx(
        `map-reset-btn`,
        `mapboxgl-ctrl-icon`,
      )}
      onClick={e => {
        handleReset(e)
      }}
      label={i18n.translate(`UI_MAP_RESET`)}
      tooltip={!!interactionsMobile ? '' : 'left'}
    >
      <MdRefresh className="reset-icon" />
      <span className="sr-only">
        {i18n.translate(`UI_MAP_RESET`)}
      </span>
    </MapButton>
  )
}

export default MapResetButton
