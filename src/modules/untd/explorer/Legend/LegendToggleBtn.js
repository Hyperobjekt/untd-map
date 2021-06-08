import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import useStore from './../store'
import { variables } from './../theme'
import { Button } from 'reactstrap'
import styled from 'styled-components'

const LegendButton = styled(Button)`
  position: absolute;
  top: calc(${variables.dimensions.navbarHeight} + 20px);
  left: 50%;
  width: 164px;
  height: 44px;
  border-radius: 22px !important;
  margin-left: -82px;
  background-color: ${variables.colors.white} !important;
  font-size: 1.4rem !important;
  font-weight: 400 !important;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.05);
`

/**
 * Button to toggle map legend display if legend is hidden.
 */
const LegendToggleBtn = ({ ...props }) => {
  // Generic state updates for store.
  // Accepts an object of values to update.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const showMobileLegend = useStore(
    state => state.showMobileLegend,
  )
  const activeView = useStore(state => state.activeView)
  // Current breakpoint.
  const breakpoint = useStore(state => state.breakpoint)

  const updateLegend = () => {
    // console.log('updateLegend()')
    setStoreValues({ showMobileLegend: true })
  }

  if (
    !showMobileLegend &&
    (breakpoint === 'xs' ||
      (breakpoint === 'sm' && activeView === 'explorer'))
  ) {
    return (
      <LegendButton
        color=""
        active={true}
        id="map_legend_toggle"
        className="map-legend-btn"
        onClick={() => {
          updateLegend()
        }}
        aria-label={i18n.translate(`UI_MAP_SEE_LEGEND`)}
      >
        {i18n.translate(`UI_MAP_SEE_LEGEND`)}
      </LegendButton>
    )
  } else {
    return ''
  }
}

export default LegendToggleBtn
