import React from 'react'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { MdClose } from 'react-icons/md'

import useStore from '../store'
import { CoreButton } from './../../../core'
import { getMetric } from '../utils'
import { Button } from 'reactstrap'
import ChoroplethLegend from './ChoroplethLegend'

/**
 * Legend for map
 */
const MapLegend = ({ ...props }) => {
  const {
    setStoreValues,
    activeMetric,
    breakpoint,
    showMobileLegend,
    indicators,
    activeView,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      activeMetric: state.activeMetric,
      breakpoint: state.breakpoint,
      showMobileLegend: state.showMobileLegend,
      indicators: state.indicators,
      activeView: state.activeView,
    }),
    shallow,
  )

  const handleClose = () => {
    // console.log('handle close')
    setStoreValues({ showMobileLegend: false })
    // setShowMobileLegend(false)
  }

  const slideoutPanel = useStore(
    state => state.slideoutPanel,
  )
  const toggleFilterPanel = () => {
    // console.log('toggleFilterPanel(), ', breakpoint)
    setStoreValues({
      slideoutPanel: {
        active: true,
        panel: 'filters', // filters or weights, presumably, possibly info
      },
    })
  }

  const metric = getMetric(activeMetric, indicators)
  const metricLabel = metric => {
    if (!metric) return ''
    return !!i18n.translate(metric.id).length > 0
      ? i18n.translate(metric.id)
      : metric.id
  }

  if (!metric) return null
  return (
    <div
      className={clsx(
        'map-legend',
        'tour-desk-4',
        'p-5',
        !!showMobileLegend ? 'show-mobile' : 'hide-mobile',
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
      <div className="map-legend-metric-title">
        <h3 className="gotham16 w500">
          {metricLabel(metric)}
        </h3>
        {!(
          breakpoint === 'xs' ||
          breakpoint === 'sm' ||
          activeView === 'embed'
        ) && (
          <Button
            id="map_legend_open_filter"
            color="outlined"
            className="map-legend-open-filter-panel knockout12 px-2 py-0"
            disabled={
              slideoutPanel.active &&
              slideoutPanel.panel === 'filters'
            }
            onClick={toggleFilterPanel}
          >
            {i18n.translate('LINK_OPEN_FILTER_PANEL')}
          </Button>
        )}
      </div>
      <ChoroplethLegend
        interactive
        className="tour-desk-7"
      />
    </div>
  )
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
