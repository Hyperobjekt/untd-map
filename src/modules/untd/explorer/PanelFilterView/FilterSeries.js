import React, { useState } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import PropTypes from 'prop-types'
import { css, cx } from 'emotion'
import { FiInfo } from 'react-icons/fi'
import { Tooltip } from 'reactstrap'

import useStore from './../store.js'
import InteractiveScale from './InteractiveScale'
import { UNTD_LAYERS } from './../../../../constants/layers'
import { getActiveLayerIndex } from './../utils'

const IndicatorTooltip = ({ indicator, ...rest }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)
  return (
    <>
      <FiInfo
        className={clsx('indicator-tip')}
        id={'tip_prompt_' + indicator.id}
      />
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={'tip_prompt_' + indicator.id}
        toggle={toggle}
        autohide={false}
        className={'tip-prompt-layer'}
        dangerouslySetInnerHTML={{
          __html: i18n.translate(`${indicator.id}_desc`),
        }}
      ></Tooltip>
    </>
  )
}

const FilterSeries = ({ ...props }) => {
  // console.log('FilterSeries, tab = ', props)
  const {
    activeMetric,
    setStoreValues,
    activeLayers,
    indicators,
    interactionsMobile,
  } = useStore(state => ({
    activeMetric: state.activeMetric,
    setStoreValues: state.setStoreValues,
    activeLayers: state.activeLayers,
    indicators: state.indicators,
    interactionsMobile: state.interactionsMobile,
  }))

  const layerObj =
    UNTD_LAYERS[getActiveLayerIndex(activeLayers)]

  const layerIndicators = indicators.filter((el, i) => {
    return el.placeTypes.indexOf(layerObj.id) > -1
  })

  if (layerIndicators && layerIndicators.length > 0) {
    return (
      <div className="filter-panel-filter-series filter-panel-indicator-series">
        <div className="info">
          <p>{i18n.translate(`MAP_FILTERS_SELECT_INFO`)}</p>
        </div>
        {layerIndicators
          .filter(el => {
            return el.display === 1
          })
          .sort((a, b) => {
            return a.order - b.order
          })
          .map(indicator => {
            // console.log('indicator, ', indicator)
            return (
              <div
                className={clsx(
                  'filter',
                  `layer-order-${indicator.order}`,
                )}
                key={indicator.id}
              >
                <h6>
                  {i18n.translate(indicator.id)}
                  {!interactionsMobile && (
                    <IndicatorTooltip
                      indicator={indicator}
                    />
                  )}
                </h6>
                <InteractiveScale metric={indicator} />
              </div>
            )
          })}
      </div>
    )
  } else {
    return (
      <div className="filter-panel-filter-series filter-panel-indicator-series">
        <div className="info">
          <p>{i18n.translate(`MAP_FILTERS_SELECT_NONE`)}</p>
        </div>
      </div>
    )
  }
}

FilterSeries.propTypes = {
  tab: PropTypes.string,
  metrics: PropTypes.array,
}

FilterSeries.defaultProps = {
  tab: '',
  metrics: [],
}

export default FilterSeries
