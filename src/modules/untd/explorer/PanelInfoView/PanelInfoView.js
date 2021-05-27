import React from 'react'
import PropTypes from 'prop-types'
import useStore from './../store.js'
import i18n from '@pureartisan/simple-i18n'

import { CoreButton, TourIcon } from './../../../core'
import clsx from 'clsx'
import Panel from '../../../core/Panel/Panel.js'
import PanelHeader from '../../../core/Panel/PanelHeader.js'
import PanelBody from '../../../core/Panel/PanelBody.js'

const PanelInfoView = ({ onClose, ...props }) => {
  const activeView = useStore(state => state.activeView)
  const enableTour = useStore(state => state.enableTour)
  const setUpTour = useStore(state => state.setUpTour)
  const incrementLaunchTour = useStore(
    state => state.incrementLaunchTour,
  )
  const interactionsMobile = useStore(
    state => state.interactionsMobile,
  )

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
    <Panel className="map-panel-slideout-info" {...props}>
      <PanelHeader onClose={onClose}>
        <h3 className="gotham18">
          {i18n.translate('UI_PANEL_INFO_TITLE')}
        </h3>
      </PanelHeader>
      <PanelBody>
        <div
          className="panel-content p-5"
          dangerouslySetInnerHTML={{
            __html: getContents(),
          }}
        ></div>
        {enableTour && (
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
        )}
      </PanelBody>
    </Panel>
  )
}

export default PanelInfoView
