import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import PropTypes from 'prop-types'
import useStore from './../store.js'
import shallow from 'zustand/shallow'
import IndicatorList from './IndicatorList'
import styled from 'styled-components'
import useCategorizedIndicators from '../App/hooks/useCategorizedIndicators.js'

const FilterSeries = ({ ...props }) => {
  // console.log('FilterSeries, tab = ', props)
  const {
    interactionsMobile,
    setStoreValues,
    activeMetric,
  } = useStore(
    ({
      activeLayers,
      indicators,
      interactionsMobile,
      setStoreValues,
      activeMetric,
    }) => ({
      activeLayers,
      indicators,
      interactionsMobile,
      setStoreValues,
      activeMetric,
    }),
    shallow,
  )
  const indicatorsByCategory = useCategorizedIndicators()

  if (indicatorsByCategory.length === 0)
    return i18n.translate(`MAP_FILTERS_SELECT_NONE`)

  const handleIndicatorSelect = indicator => {
    setStoreValues({
      activeMetric: indicator.id,
    })
  }

  return (
    <>
      {indicatorsByCategory.map(({ name, indicators }) => (
        <CategoryWrapper key={name}>
          <h3>{name}</h3>
          <IndicatorList
            indicators={indicators}
            showHints={!interactionsMobile}
            onSelect={handleIndicatorSelect}
            activeId={activeMetric}
          />
        </CategoryWrapper>
      ))}
    </>
  )
}

const CategoryWrapper = styled.div`
  padding: 2rem;
  .list-group {
    margin-top: 1.2rem;
    margin-left: -2rem;
    margin-right: -2rem;
  }
`

FilterSeries.propTypes = {
  tab: PropTypes.string,
  metrics: PropTypes.array,
}

FilterSeries.defaultProps = {
  tab: '',
  metrics: [],
}

export default FilterSeries
