import React from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'

import useStore from './../store'
import { CoreButton } from './../../../core'
import IndicatorTooltip from './IndicatorTooltip'

const IndicatorButton = ({ indicator, ...props }) => {
  // Generic store value setter.
  const { setStoreValues, interactionsMobile } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      interactionsMobile: state.interactionsMobile,
    }),
    shallow,
  )

  const handleSelectMetric = () => {
    setStoreValues({
      activeMetric: indicator.id,
    })
  }

  return (
    <CoreButton
      id="location_select_metric"
      onClick={handleSelectMetric}
      color="none"
      className={clsx('button-panel-location-metric')}
    >
      <h6 className={clsx('indicator')}>
        {i18n.translate(indicator.id)}
        {!interactionsMobile && (
          <IndicatorTooltip indicator={indicator} />
        )}
      </h6>
    </CoreButton>
  )
}

export default IndicatorButton
