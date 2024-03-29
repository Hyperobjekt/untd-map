import React, { useEffect, useState } from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import shallow from 'zustand/shallow'

import useStore from './../store'
import { Divider, CoreButton } from './../../../core'
import {
  MetricsIcon,
  InfoIcon,
  LayersIcon,
  FeedbackIcon,
  LocationIcon,
} from './../../../core/Icons'
import {
  UnifiedShareBtn,
  DesktopUnifiedShareBtn,
} from './../Share'
import useFeedbackPanel from '../Feedback/useFeedbackPanel'

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
    activeFeature,
    buttonTooltipPosition,
    interactionsMobile,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      activeView: state.activeView,
      slideoutPanel: state.slideoutPanel,
      breakpoint: state.breakpoint,
      browserWidth: state.browserWidth,
      showIntroModal: state.showIntroModal,
      activeFeature: state.activeFeature,
      buttonTooltipPosition: state.buttonTooltipPosition,
      interactionsMobile: state.interactionsMobile,
    }),
    shallow,
  )

  const { openFeedback } = useFeedbackPanel()

  /**
   * Close the intro panel and start the tour
   */
  // const handleStartTour = () => {
  //   // console.log('handleStartTour()')
  //   incrementLaunchTour()
  //   setUpTour()
  // }

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
      e.currentTarget.id !== 'button_toggle_panel_info' &&
      e.currentTarget.id !== 'button_toggle_panel_location'
    )
      return
    // Retrieve clicked
    let clicked = String(e.currentTarget.id).replace(
      'button_toggle_panel_',
      '',
    )
    // Conditionally adjust panel settings
    let newActiveState = false
    // open panel
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
          <LayersIcon />
          <span className="sr-only">
            {i18n.translate(`BUTTON_TOGGLE_PANEL_LAYERS`)}
          </span>
        </CoreButton>
        <Divider />
        {Boolean(activeFeature) && (
          <React.Fragment>
            <div className="control-label">
              {i18n.translate('CONTROL_PANEL_LOCATION')}
            </div>
            <CoreButton
              id="button_toggle_panel_location"
              label={i18n.translate(
                `BUTTON_TOGGLE_PANEL_LOCATION`,
              )}
              onClick={handlePanel}
              color="none"
              tooltip={buttonTooltipPosition}
              className={clsx(
                'button-panel-location',
                slideoutPanel.active &&
                  slideoutPanel.panel === 'location' &&
                  !!activeFeature
                  ? 'active'
                  : '',
              )}
              disabled={!activeFeature}
            >
              <LocationIcon />
              <span className="sr-only">
                {i18n.translate(
                  `BUTTON_TOGGLE_PANEL_LOCATION`,
                )}
              </span>
            </CoreButton>
            <Divider />
          </React.Fragment>
        )}
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
      {/* {!!enableTour && (
        <TourButton
          className="d-none d-lg-block"
          tooltip={true}
          onClick={handleStartTour}
        />
      )} */}
      {/* <Divider /> */}
      {/* <div className="control-label">
        {i18n.translate('FEEDBACK')}
      </div> */}
      <hr />
      <CoreButton
        id="button_toggle_feedback"
        label={i18n.translate(`FEEDBACK_BUTTON_TOOLTIP`)}
        tooltip={buttonTooltipPosition}
        onClick={openFeedback}
        color="none"
        styles={{ display: 'none' }}
        className="button-feedback-link"
      >
        <FeedbackIcon className="d-block d-md-none" />
        <span className="d-none d-md-block">
          {i18n.translate(`FEEDBACK`)}
        </span>
      </CoreButton>
      {/* <Divider /> */}
      <UnifiedShareBtn className="d-block d-md-none" />
      <DesktopUnifiedShareBtn className="d-none d-md-block" />
    </div>
  )
}

ControlPanel.propTypes = {}

export default ControlPanel
