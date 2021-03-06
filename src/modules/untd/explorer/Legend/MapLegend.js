import React from 'react'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { MdClose } from 'react-icons/md'

import useStore from '../store'
import { CoreButton } from './../../../core'
import { CRI_COLORS } from './../../../../constants/colors'
import NonInteractiveScale from './../NonInteractiveScale/NonInteractiveScale'
import { getMetric } from '../utils'

/**
 * Legend for map
 */
const MapLegend = ({ ...props }) => {
  const {
    setStoreValues,
    activeMetric,
    activeQuintiles,
    breakpoint,
    showMobileLegend,
    indicators,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      activeMetric: state.activeMetric,
      activeQuintiles: state.activeQuintiles,
      breakpoint: state.breakpoint,
      showMobileLegend: state.showMobileLegend,
      indicators: state.indicators,
    }),
    shallow,
  )

  const handleClose = () => {
    // console.log('handle close')
    setStoreValues({ showMobileLegend: false })
    // setShowMobileLegend(false)
  }
  // Active layers
  const activeLayers = useStore(
    state => [...state.activeLayers],
    shallow,
  )

  const slideoutPanel = useStore(
    state => state.slideoutPanel,
  )
  const toggleFilterPanel = () => {
    // console.log('toggleFilterPanel(), ', breakpoint)
    if (breakpoint === 'md') {
      setStoreValues({
        slideoutPanel: {
          active: false,
          panel: 'filters', // filters or weights, presumably, possibly info
        },
        showPanelModal: true,
      })
    } else {
      setStoreValues({
        slideoutPanel: {
          active: true,
          panel: 'filters', // filters or weights, presumably, possibly info
        },
      })
    }
  }

  const metric = getMetric(activeMetric, indicators)
  const metricLabel = metric => {
    if (!metric) return ''
    return !!i18n.translate(metric.id).length > 0
      ? i18n.translate(metric.id)
      : metric.id
  }

  // console.log('legend, metric: ', metric)

  if (!!metric) {
    return (
      <div
        className={clsx(
          'map-legend',
          !!showMobileLegend
            ? 'show-mobile'
            : 'hide-mobile',
        )}
      >
        {(breakpoint === 'xs' || breakpoint === 'sm') && (
          <CoreButton
            id="button_close_legend"
            label={i18n.translate(`BUTTON_CLOSE_PANEL`)}
            onClick={handleClose}
            color="none"
            className={clsx(
              'button-core',
              'button-close-legend',
            )}
          >
            <MdClose />
            <span className="sr-only">
              {i18n.translate(`BUTTON_CLOSE_PANEL`)}
            </span>
          </CoreButton>
        )}
        {!(breakpoint === 'xs' || breakpoint === 'sm') && (
          <div className="map-legend-label">
            {i18n.translate(`UI_MAP_LEGEND_TITLE`)}
            <span
              id="map_legend_open_filter"
              className={clsx(
                'map-legend-open-filter-panel',
                !!slideoutPanel.active &&
                  slideoutPanel.panel === 'filters'
                  ? 'disabled'
                  : '',
              )}
              onClick={toggleFilterPanel}
            >
              {i18n.translate('LINK_OPEN_FILTER_PANEL')}
            </span>
          </div>
        )}
        <div className="map-legend-metric-title">
          {metricLabel(metric)}
        </div>
        <div className="map-legend-zone-labels">
          <div className="fewer">
            <div className="vertically-center">
              {i18n.translate(`UI_MAP_LEGEND_FEWER`)}
            </div>
          </div>
          <div className="avg">
            <div className="vertically-center">
              {i18n.translate(`UI_MAP_LEGEND_AVG`)}
            </div>
          </div>
          <div className="more">
            <div className="vertically-center">
              {i18n.translate(`UI_MAP_LEGEND_MORE`)}
            </div>
          </div>
        </div>
        <NonInteractiveScale
          metric={activeMetric}
          quintiles={activeQuintiles}
          colors={CRI_COLORS}
          showHash={false}
          hashLeft={null}
          showMinMax={true}
          min={0}
          max={100}
        />
      </div>
    )
  } else {
    return null
  }
}

MapLegend.defaultProps = {
  activeMetric: '',
  activeQuintiles: [1, 1, 1, 1, 1],
}

MapLegend.propTypes = {
  activeMetric: PropTypes.string,
  activeQuintiles: PropTypes.array,
}

export default MapLegend
