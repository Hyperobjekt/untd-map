import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import shallow from 'zustand/shallow'

import { theme } from './../theme'
import useStore from './../store'
import { Divider, CoreButton } from './../../../core'
import {
  MetricsIcon,
  FeaturesIcon,
  InfoIcon,
} from './../../../core/Icons'
import {
  UnifiedShareBtn,
  DesktopUnifiedShareBtn,
} from './../Share'
import { TourButton } from './../Tour'

/**
 * Control panel that contains selectors and filters which alter map display.
 * @param Object children Child components
 */
const ControlPanel = ({ children }) => {
  // Generic state updates for store.
  // Accepts an object of values to update.
  const {
    setStoreValues,
    activeView,
    slideoutPanel,
    breakpoint,
    browserWidth,
    showIntroModal,
    enableTour,
    incrementLaunchTour,
    setUpTour,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      activeView: state.activeView,
      slideoutPanel: state.slideoutPanel,
      breakpoint: state.breakpoint,
      browserWidth: state.browserWidth,
      showIntroModal: state.showIntroModal,
      enableTour: state.enableTour,
      incrementLaunchTour: state.incrementLaunchTour,
      setUpTour: state.setUpTour,
    }),
    shallow,
  )

  const toggleIntroModal = () =>
    setStoreValues({
      showIntroModal: !showIntroModal,
    })

  // Handle clicks to any control panel button.
  const handleClick = e => {
    e.preventDefault()
    // console.log('Button clicked, ', e.currentTarget.id)
  }

  /**
   * Close the intro panel and start the tour
   */
  const handleStartTour = () => {
    // console.log('handleStartTour()')
    incrementLaunchTour()
    setUpTour()
  }

  /**
   * Handles click to panel toggle buttons.
   * @param  Object e Event object
   */
  const handlePanel = e => {
    // console.log(
    //   'handlePanel(), ',
    //   e.currentTarget,
    //   slideoutPanel,
    // )
    e.preventDefault()
    if (
      e.currentTarget.id !==
        'button_toggle_panel_filters' &&
      e.currentTarget.id !== 'button_toggle_panel_layers' &&
      e.currentTarget.id !== 'button_toggle_panel_info'
    )
      return
    // Retrieve clicked
    let clicked = String(e.currentTarget.id).replace(
      'button_toggle_panel_',
      '',
    )
    // Conditionally adjust panel settings
    let newActiveState = false
    if (
      breakpoint === 'xs' ||
      breakpoint === 'sm' ||
      breakpoint === 'md'
    ) {
      // console.log('show the modal')
      setStoreValues({
        showPanelModal: true,
        slideoutPanel: {
          active: false,
          panel: clicked,
        },
      })
    } else {
      // Slideout panel size, handle as slideout.
      if (
        !slideoutPanel.active &&
        slideoutPanel.panel.length < 1
      ) {
        // If never opened
        newActiveState = true
      } else if (
        !!slideoutPanel.active &&
        slideoutPanel.panel.length > 0 &&
        slideoutPanel.panel === clicked
      ) {
        // Selected existing open panel
        newActiveState = false
        clicked = ''
      } else {
        // Selected different panel
        newActiveState = true
      }
      // Reset panel state
      setStoreValues({
        slideoutPanel: {
          active: newActiveState,
          panel: clicked,
        },
      })
    }
  }

  /**
   * Determines control panel button position based on breakpoint
   * @param  {String} breakpoint
   * @return {String}
   */
  const getPositionFromBreakpoint = breakpoint => {
    // console.log('getPositionFromBreakpoint')
    if (
      breakpoint === 'md' ||
      breakpoint === 'sm' ||
      breakpoint === 'xs'
    ) {
      return 'bottom'
    } else {
      return 'right'
    }
  }
  /**
   * Updates positioning for tooltips on buttons in control panel.
   */
  const buttonTooltipPosition = useStore(
    state => state.buttonTooltipPosition,
  )
  const interactionsMobile = useStore(
    state => state.interactionsMobile,
  )
  // Set tooltip position if browser width changes.
  useEffect(() => {
    setStoreValues({
      buttonTooltipPosition: !!interactionsMobile
        ? ''
        : getPositionFromBreakpoint(breakpoint),
    })
  }, [browserWidth])
  // Set tooltip position on load.
  useEffect(() => {
    setStoreValues({
      buttonTooltipPosition: !!interactionsMobile
        ? ''
        : getPositionFromBreakpoint(breakpoint),
    })
  }, [])

  return (
    <div
      className={clsx(
        'layout-control-panel',
        activeView
          ? 'display-' + activeView
          : 'display-map',
      )}
    >
      <>
        <div className="control-label">
          {i18n.translate('CONTROL_PANEL_METRICS')}
        </div>
        <CoreButton
          id="button_toggle_panel_filters"
          label={i18n.translate(
            `BUTTON_TOGGLE_PANEL_FILTERS`,
          )}
          onClick={handlePanel}
          color="none"
          tooltip={buttonTooltipPosition}
          className={clsx(
            'button-panel-filters',
            slideoutPanel.active &&
              slideoutPanel.panel === 'filters'
              ? 'active'
              : '',
          )}
        >
          {/*<AiOutlineControl />*/}
          <MetricsIcon />
          <span className="sr-only">
            {i18n.translate(`CONTROL_PANEL_FEATURES`)}
          </span>
        </CoreButton>
        <Divider />
        <div className="control-label">
          {i18n.translate('CONTROL_PANEL_FEATURES')}
        </div>
        <CoreButton
          id="button_toggle_panel_layers"
          label={i18n.translate(
            `BUTTON_TOGGLE_PANEL_LAYERS`,
          )}
          onClick={handlePanel}
          color="none"
          tooltip={buttonTooltipPosition}
          className={clsx(
            'button-panel-layers',
            slideoutPanel.active &&
              slideoutPanel.panel === 'layers'
              ? 'active'
              : '',
          )}
        >
          {/*
          <RiMapPinLine /> */}
          <FeaturesIcon />
          <span className="sr-only">
            {i18n.translate(`BUTTON_TOGGLE_PANEL_LAYERS`)}
          </span>
        </CoreButton>
        <Divider />
      </>
      <div className="control-label">
        {i18n.translate('CONTROL_PANEL_INFO')}
      </div>
      <CoreButton
        id="button_toggle_panel_info"
        label={i18n.translate(`BUTTON_TOGGLE_PANEL_INFO`)}
        tooltip={buttonTooltipPosition}
        onClick={handlePanel}
        color="none"
        styles={{ display: 'none' }}
        className={clsx(
          'button-panel-info',
          slideoutPanel.active &&
            slideoutPanel.panel === 'info'
            ? 'active'
            : '',
        )}
      >
        <InfoIcon />
        <span className="sr-only">
          {i18n.translate(`BUTTON_TOGGLE_INFO`)}
        </span>
      </CoreButton>
      {!!enableTour && (
        <TourButton
          className="d-none d-lg-block"
          tooltip={true}
          onClick={handleStartTour}
        />
      )}
      <Divider />
      <UnifiedShareBtn className="d-block d-lg-none" />
      <DesktopUnifiedShareBtn className="d-none d-lg-block" />
    </div>
  )
}

ControlPanel.propTypes = {}

export default ControlPanel
