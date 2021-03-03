import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { css, cx } from 'emotion'
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
import PanelModal from './../PanelModal/PanelModal'
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
    setStoreValues,
    activeView,
    handleToggleMenu,
    breakpoint,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      activeView: state.activeView,
      handleToggleMenu: state.handleToggleMenu,
      breakpoint: state.breakpoint,
    }),
    shallow,
  )
  // Basic props for logo component.
  const logoProps = {
    siteHref: useStore(state => state.siteHref),
    logoSrc: useStore(state => state.logoSrc),
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

  const canvasStyles = css`
    position: relative;
    height: 100%;
  `

  const mainStyles = css`
    height: ${activeView === 'explorer'
      ? `calc(100vh - ` +
        variables.dimensions.navbarHeight +
        `)`
      : `100vh`};
  `

  const mapViewStyles = css`
    height: 100%;
    padding-left: ${(breakpoint === 'lg' ||
      breakpoint === 'xl') &&
    activeView === 'explorer'
      ? variables.dimensions.controlPanelWidth
      : 0};
  `

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
          <Logo {...logoProps} />
          <div
            className={clsx('cpal-logo')}
            role="image"
            aria-label="CPAL logo"
          ></div>
          <span className="logo-sitename">
            {i18n.translate(`SITE_TITLE`)}
          </span>
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
      <main className={clsx(cx(mainStyles))}>
        <Canvas className={clsx(cx(canvasStyles))}>
          {activeView === 'explorer' && (
            <>
              <SlideoutPanel />
              <ControlPanel></ControlPanel>
            </>
          )}
          <div
            className={clsx(
              'view-parent',
              activeView
                ? 'display-' + activeView
                : 'display-map',
              cx(mapViewStyles),
            )}
          >
            <MapView />
          </div>
          {activeView === 'explorer' && (
            <>
              <ShareLinkModal className="modal-share-link" />
              <UnifiedShareModal className="modal-u-share" />
              <IntroModal />
              <Tour />
              <PanelModal />
            </>
          )}
        </Canvas>
      </main>
    </div>
  )
}

Layout.propTypes = {}

export default Layout
