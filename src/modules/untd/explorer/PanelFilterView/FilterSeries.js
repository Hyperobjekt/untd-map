import React from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import PropTypes from 'prop-types'
import { css, cx } from 'emotion'

import useStore from './../store.js'
import InteractiveScale from './InteractiveScale'

const FilterSeries = ({ ...props }) => {
  // console.log('FilterSeries, tab = ', props)
  // Active filter tab
  const activeFilterTab = useStore(
    state => state.activeFilterTab,
  )
  const activeMetric = useStore(state => state.activeMetric)
  // Generic state setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Get all of the items in the metrics array with matching tab node.
  const filters = props.metrics.filter(m => {
    return m.cat === props.tab && m.display === 1
  })
  // Alphabetize them by title
  filters.sort((a, b) => {
    return a.order - b.order
  })
  // If this tab is active then set the active metric as the first in the list.
  // if (filters.length > 0 && props.tab === activeFilterTab) {
  //   setStoreValues({
  //     activeMetric: filters[0].id,
  //   })
  // }
  //
  //

  const filterHeadingStyles = css`
    font-family: halyard-text;
    font-weight: 300;
    font-size: 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: #2c390b;
  `

  // {
  // font-family: halyard-text;
  // font-weight: 300;
  // font-size: 16px;
  // line-height: 20px;
  // display: flex;
  // align-items: center;
  // color: #2c390b;
  // }

  if (filters && filters.length > 0) {
    // If the activeMetric is not in the list of indicators here,
    // then set activeMetric to the first item.
    if (props.tab === activeFilterTab) {
      const isInFilters = filters.find(el => {
        return el.id === activeMetric
      })
      if (!isInFilters) {
        setStoreValues({
          activeMetric: filters[0].id,
        })
      }
    }
    return (
      <>
        <div className="filter-panel-filter-series">
          {filters.map(f => {
            return (
              <div className="filter" key={f.id}>
                <h6
                  className={clsx(cx(filterHeadingStyles))}
                >
                  {i18n.translate(f.id)}
                </h6>
                <InteractiveScale metric={f} />
              </div>
            )
          })}
        </div>
      </>
    )
  } else {
    return ''
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
