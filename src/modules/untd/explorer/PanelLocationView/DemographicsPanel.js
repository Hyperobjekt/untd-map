import React from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'

import useStore from './../store'
import { CoreButton } from './../../../core'
import {
  getGeoFeatureLabel,
  setActiveQuintile,
  getActiveLayerIndex,
  getRoundedValue,
} from './../utils'
import NonInteractiveScale from './../NonInteractiveScale'
import LinearScale from './../LinearScale'
import TrendChart from './TrendChart'
import IndicatorTooltip from './IndicatorTooltip'
import { CRI_COLORS } from './../../../../constants/colors'
import { UNTD_LAYERS } from './../../../../constants/layers'

const DemographicsPanel = ({ activeFeature, ...props }) => {
  const demographics = Object.keys(activeFeature.properties)
    .filter(el => {
      return (
        el.indexOf('_sd') < 0 && el.indexOf('popE') > -1
      )
    })
    .map(el => {
      return {
        id: el,
        value: activeFeature.properties[el],
      }
    })
  const demoTotal = demographics.find(
    el => el.id.indexOf('tot') > -1,
  )

  return (
    <div className={clsx('panel-demographics')}>
      <h6>{i18n.translate(`PANEL_LOCATION_DEMO`)}</h6>
      <div
        className={clsx('demo-total-group', 'demo-group')}
      >
        <span className={clsx('demo-label')}>
          {i18n.translate(demoTotal.id)}
        </span>
        {`: `}
        <span className={clsx('demo-value')}>
          {getRoundedValue(demoTotal.value)}
        </span>
      </div>
      {demographics
        .filter(el => el.id.indexOf('tot') < 0)
        .sort((a, b) => b.value - a.value)
        .map(d => (
          <div
            className={clsx('demo-group')}
            key={`demo-${d.id}`}
          >
            <span className={clsx('demo-label')}>
              {i18n.translate(d.id)}
            </span>
            {`: `}
            <span className={clsx('demo-value')}>
              {getRoundedValue(d.value)}
            </span>
          </div>
        ))}
    </div>
  )
}

export default DemographicsPanel
