import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import shallow from 'zustand/shallow'

import { UNTD_LAYERS } from './../../../../../constants/layers'
import {
  getRoundedValue,
  getFeatureId,
  hasValue,
} from './../../utils'
import useStore from './../../store'
import { ChoroplethLegend } from '../../Legend/ChoroplethLegend'

/** Returns a name for the feature */
const getFeatureLabel = feature => {
  const source = UNTD_LAYERS.find(item => {
    return item.id === feature.source
  })
  const layerID = feature.layer.source
  const label = feature.properties[source.label_key]
    ? feature.properties[source.label_key]
    : false

  switch (layerID) {
    case 'zip':
      return i18n.translate(`TOOLTIP_PLACE_ZIP`, {
        label: label,
      })
    case 'tract':
      return i18n.translate(`TOOLTIP_PLACE_TRACT`, {
        label: label,
      })
    case 'county':
      return i18n.translate(`TOOLTIP_PLACE_COUNTY`, {
        label: label,
      })
    default:
      return label
  }
}

const getActiveQuintile = (activeMetric, feature) => {
  const quintile = Number(feature.properties[activeMetric])
  return isNaN(quintile) ? [] : [quintile]
}

const PointPopup = ({ feature }) => {
  const hasAddress =
    feature.properties.Address &&
    feature.properties.Address !== 'null'
  return (
    <div className="popup-content">
      <div className="popup-place-name">
        <h4>{feature.properties.Name}</h4>
      </div>
      <div
        className="popup-metric"
        key={`popup-point-${getFeatureId(feature)}`}
      >
        <div className="popup-metric-label address">
          {feature.properties.Display}
          <br />
          {hasAddress && feature.properties.Address}
          {hasAddress && <br />}
          {feature.properties.City}
        </div>
      </div>
      <p className="hint mt-3">
        {i18n.translate('POPUP_CLICK_TO_FEEDBACK')}
      </p>
    </div>
  )
}

const CountyPopup = ({ feature }) => {
  const featureLabel = getFeatureLabel(feature)
  return (
    <div className="popup-content">
      {!!featureLabel && (
        <div className="popup-place-name">
          <h4>{featureLabel}</h4>
        </div>
      )}
      <p className="hint mt-3">
        {i18n.translate('POPUP_CLICK_TO_FEEDBACK')}
      </p>
    </div>
  )
}

/**
 * Returns popup contents for map feature mouseover
 */
const DataPopup = ({ feature }) => {
  const {
    indicators,
    activeMetric,
    allData,
    tooltipItems,
  } = useStore(
    state => ({
      indicators: state.indicators,
      activeMetric: state.activeMetric,
      allData: state.allData,
      tooltipItems: state.tooltipItems,
    }),
    shallow,
  )
  const metric = indicators.find(item => {
    return item.id === activeMetric
  })
  const rawMetric = allData.find(d => {
    return d.variable === activeMetric.replace('_sd', '')
  })
  const featureLabel = getFeatureLabel(feature)
  const value = feature.properties[rawMetric.variable]
  const isNumberValue = hasValue(value)
  const formattedValue = isNumberValue
    ? getRoundedValue(
        value,
        Number(rawMetric.decimals),
        false,
        Number(rawMetric.currency),
        Number(rawMetric.percent),
      )
    : 'Not available'
  const valueLabel = i18n.translate(rawMetric.variable)
  return (
    <div className="popup-content">
      {!!featureLabel && (
        <div className="popup-place-name">
          <h4>{featureLabel}</h4>
        </div>
      )}

      <div
        className="popup-metric"
        key={`popup-metric-${metric.id}`}
      >
        <div className="popup-metric-label">
          {valueLabel}:{' '}
          <span className="metric-value">
            {formattedValue}
          </span>
        </div>
        <div className="popup-metric-scale">
          <ChoroplethLegend
            activeIndexes={getActiveQuintile(
              activeMetric,
              feature,
            )}
            labelIndexes={getActiveQuintile(
              activeMetric,
              feature,
            )}
            noLabels
            condensed
          />
        </div>
        <div className={clsx('popup-indicator-list')}>
          {tooltipItems
            .sort((a, b) => {
              return a.order - b.order
            })
            .map(el => {
              if (!feature.properties[el.id]) return null
              return (
                <div
                  className="indicator-item"
                  key={`indicator-item-${el.id}`}
                >
                  <span className={clsx('indicator-title')}>
                    {i18n.translate(el.id)}:
                  </span>{' '}
                  <span className={clsx('indicator-value')}>
                    {getRoundedValue(
                      feature.properties[el.id],
                      el.decimals,
                      true,
                      el.currency,
                      el.percent,
                    )}
                  </span>
                </div>
              )
            })}
        </div>
      </div>

      <p className="hint mt-3">
        {i18n.translate('POPUP_CLICK_TO_LEARN')}
      </p>
    </div>
  )
}

/**
 * Returns popup contents for map feature mouseover
 */
const PopupContent = ({ feature }) => {
  if (!feature) return null

  if (feature.layer.source.indexOf('points') > -1)
    return <PointPopup feature={feature} />

  // NOTE: lane - june 15, 2021
  //  not sure if county popups are actually used?
  //  leaving in just in case
  if (feature.layer.source.indexOf('county') > -1)
    return <CountyPopup feature={feature} />

  // Popup for census tracts, cities, zips
  return <DataPopup feature={feature} />
}
export default PopupContent
