import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import styled from 'styled-components'
import shallow from 'zustand/shallow'

import useStore from './../store'
import {
  Header,
  Logo,
  Canvas,
  CoreButton,
  MenuIcon,
} from './../../../core'
import { GeocodeSearch } from './../GeocodeSearch'
import ControlPanel from './../ControlPanel/ControlPanel'
import MapView from './../MapView/MapView'
import SlideoutPanel from './../SlideoutPanel/SlideoutPanel'
import IntroModal from './../IntroModal/IntroModal'
import { FeedbackModal } from './../Feedback'
import {
  ShareLinkModal,
  UnifiedShareModal,
} from './../Share'
import Tour from './../Tour/Tour'
import { Tracking } from './../Tracking'
import { variables } from './../theme'

/**
 * Layout sets up the basic layout for the explorer.
 * @param Object children Child elements
 * @param Object props    Props passed from parent
 */
const Layout = ({ children, ...props }) => {
  // Generic state updates for store.
  // Accepts an object of values to update.
  const {
    activeView,
    handleToggleMenu,
    breakpoint,
    logoSrc,
  } = useStore(
    state => ({
      activeView: state.activeView,
      handleToggleMenu: state.handleToggleMenu,
      breakpoint: state.breakpoint,
      logoSrc: state.logoSrc,
    }),
    shallow,
  )

  const MapViewContainer = styled.div`
    height: 100%;
    padding-left: ${(breakpoint === 'lg' ||
      breakpoint === 'xl') &&
    activeView === 'explorer'
      ? variables.dimensions.controlPanelWidth
      : 0};
  `

  const AppCanvas = styled(Canvas)`
    position: relative;
    height: 100%;
  `

  const Main = styled.main`
    height: ${activeView === 'explorer'
      ? `calc(100vh - ` +
        variables.dimensions.navbarHeight +
        `)`
      : `100vh`};
  `

  // Basic props for logo component.
  const logoProps = {
    siteName: i18n.translate(`SITE_TITLE`),
    siteHref: useStore(state => state.siteHref),
  }

  // Handle clicks to any control panel button.
  const handleClick = e => {
    e.preventDefault()
    // console.log('Button clicked, ', e.currentTarget.id)
    if (e.currentTarget.id === 'button_toggle_menu') {
      // console.log('toggle menu clicked')
      if (!!handleToggleMenu) {
        handleToggleMenu()
      }
    }
  }

  return (
    <div
      className={clsx(
        'layout',
        'breakpoint-' + breakpoint,
        'view-' + activeView,
      )}
      {...props}
    >
      <Tracking />
      {activeView === 'explorer' && (
        <Header>
          <Logo {...logoProps}>
            <div
              className='cpal-logo'
              role="image"
            ></div>
            <div
              className="logo"
              dangerouslySetInnerHTML={{
                __html: logoSrc,
              }}
              role="img"
              aria-label={`${i18n.translate(
                `SITE_TITLE`,
              )} logo`}
            ></div>
          </Logo>
          <GeocodeSearch />
          <CoreButton
            id="button_toggle_menu"
            aria-label={i18n.translate(`BUTTON_MENU`)}
            onClick={handleClick}
            color="none"
            className="button-toggle-menu"
          >
            <span className="menu-icon-group">
              <MenuIcon />
              {i18n.translate(`BUTTON_MENU`)}
            </span>
          </CoreButton>
        </Header>
      )}
      <Main>
        <AppCanvas>
          {activeView === 'explorer' && (
            <>
              <SlideoutPanel />
              <ControlPanel></ControlPanel>
            </>
          )}
          <MapViewContainer
            className={clsx(
              'view-parent',
              activeView
                ? 'display-' + activeView
                : 'display-map',
            )}
          >
            <MapView />
          </MapViewContainer>
          {activeView === 'explorer' && (
            <>
              <ShareLinkModal className="modal-share-link" />
              <UnifiedShareModal className="modal-u-share" />
              <IntroModal />
              <Tour />
              <FeedbackModal />
            </>
          )}
        </AppCanvas>
      </Main>
    </div>
  )
}

Layout.propTypes = {}

export default Layout
