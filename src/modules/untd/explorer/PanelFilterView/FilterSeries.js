import React from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import PropTypes from 'prop-types'
import { css, cx } from 'emotion'

import useStore from './../store.js'
import InteractiveScale from './InteractiveScale'
import { UNTD_LAYERS } from './../../../../constants/layers'
import { getActiveLayerIndex } from './../utils'

const FilterSeries = ({ ...props }) => {
  // console.log('FilterSeries, tab = ', props)
  const {
    activeMetric,
    setStoreValues,
    activeLayers,
    indicators,
  } = useStore(state => ({
    activeMetric: state.activeMetric,
    setStoreValues: state.setStoreValues,
    activeLayers: state.activeLayers,
    indicators: state.indicators,
  }))

  const filterHeadingStyles = css`
    font-family: halyard-text;
    font-weight: 300;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: #2c390b;
  `

  const filterStyles = css`
    &:last-child {
      padding-bottom: 10rem;
    }
  `

  const layerObj =
    UNTD_LAYERS[getActiveLayerIndex(activeLayers)]

  const layerIndicators = indicators.filter((el, i) => {
    return el.placeTypes.indexOf(layerObj.id) > -1
  })

  if (layerIndicators && layerIndicators.length > 0) {
    return (
      <>
        <div className="filter-panel-filter-series filter-panel-indicator-series">
          <div className="info">
            <p>
              {i18n.translate(`MAP_FILTERS_SELECT_INFO`)}
            </p>
          </div>
          {layerIndicators.map(indicator => {
            // console.log('indicator, ', indicator)
            return (
              <div
                className={clsx('filter', cx(filterStyles))}
                key={indicator.id}
              >
                <h6
                  className={clsx(cx(filterHeadingStyles))}
                >
                  {i18n.translate(indicator.id)}
                </h6>
                <InteractiveScale metric={indicator} />
              </div>
            )
          })}
        </div>
      </>
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
  tab: 'cri',
  metrics: [],
}

export default FilterSeries
