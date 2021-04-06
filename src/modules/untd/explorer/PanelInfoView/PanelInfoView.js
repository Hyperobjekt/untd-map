import React from 'react'
import PropTypes from 'prop-types'
import useStore from './../store.js'
import i18n from '@pureartisan/simple-i18n'

import { CoreButton, TourIcon } from './../../../core'
import clsx from 'clsx'

const PanelInfoView = ({ ...props }) => {
  const activeView = useStore(state => state.activeView)
  const enableTour = useStore(state => state.enableTour)
  const setUpTour = useStore(state => state.setUpTour)
  const incrementLaunchTour = useStore(
    state => state.incrementLaunchTour,
  )
  const interactionsMobile = useStore(
    state => state.interactionsMobile,
  )

  const getTourButton = () => {
    // console.log('getTourButton()')
    if (!!enableTour) {
      // console.log('return tour button')
      return (
        <CoreButton
          color="light"
          label={i18n.translate(
            'UI_MAP_INTRO_MODAL_TOUR_BTN',
          )}
          onClick={handleStartTour}
        >
          <TourIcon />
          {i18n.translate('UI_MAP_INTRO_MODAL_TOUR_BTN')}
        </CoreButton>
      )
    } else {
      return ''
    }
  }

  /**
   * Close the intro panel and start the tour
   */
  const handleStartTour = () => {
    // console.log('handleStartTour()')
    incrementLaunchTour()
    setUpTour()
  }

  const getContents = () => {
    // Right now, just check for feeder OR map.
    return i18n.translate('UI_PANEL_INFO_MAP')
  }
  return (
    <div className="map-panel-slideout-info">
      <div>
        <div
          className={clsx('panel-content')}
          dangerouslySetInnerHTML={{
            __html: getContents(),
          }}
        ></div>
        {getTourButton()}
      </div>
    </div>
  )
}

export default PanelInfoView
