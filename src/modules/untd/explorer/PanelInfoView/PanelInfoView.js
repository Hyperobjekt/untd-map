import React from 'react'
import PropTypes from 'prop-types'
import useStore from './../store.js'
import i18n from '@pureartisan/simple-i18n'

import { CoreButton, TourIcon } from './../../../core'
import Panel from '../../../core/Panel/Panel.js'
import PanelHeader from '../../../core/Panel/PanelHeader.js'
import PanelBody from '../../../core/Panel/PanelBody.js'
import styled from 'styled-components'

const ContentWrapper = styled.div`
  padding: 2rem;
  h3 {
    font-size: 1.6rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    &:first-child {
      margin-top: 0;
    }
  }
  p {
    margin-bottom: 1rem;
  }
`

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

  return (
    <Panel className="map-panel-slideout-info" {...props}>
      <PanelHeader onClose={onClose}>
        <h2 className="gotham18">
          {i18n.translate('UI_PANEL_INFO_TITLE')}
        </h2>
      </PanelHeader>
      <PanelBody>
        {enableTour && (
          <div className="d-flex pb-0 pt-5 px-5">
            <CoreButton
              className="p-3 text-nowrap"
              color="light"
              label={i18n.translate(
                'UI_MAP_INTRO_MODAL_TOUR_BTN',
              )}
              onClick={handleStartTour}
            >
              <TourIcon />
              {i18n.translate(
                'UI_MAP_INTRO_MODAL_TOUR_BTN',
              )}
            </CoreButton>
            <p className="hint ml-6 mt-0">
              {i18n.translate('UI_MAP_INTRO_MODAL_TOUR')}
            </p>
          </div>
        )}
        <ContentWrapper
          dangerouslySetInnerHTML={{
            __html: i18n.translate('UI_PANEL_INFO_MAP'),
          }}
        ></ContentWrapper>
      </PanelBody>
    </Panel>
  )
}

export default PanelInfoView
