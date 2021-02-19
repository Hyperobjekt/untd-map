import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import { Button } from 'reactstrap'
import { FaExternalLinkSquareAlt } from 'react-icons/fa'

import { CoreButton } from './../../../../core'
import NonInteractiveScale from './../../NonInteractiveScale/NonInteractiveScale'
import { CRI_COLORS } from './../../../../../constants/colors'
import { DATA_FILES } from './../../../../../constants/map'
import {
  getRoundedValue,
  getFeatureId,
} from './../../utils'
import useStore from './../../store'
import clsx from 'clsx'

/**
 * Returns popup contents for map feature mouseover
 */
const PopupContent = ({ ...props }) => {
  const {
    setStoreValues,
    interactionsMobile,
    indicators,
    breakpoint,
    activeMetric,
    allData,
    tooltipItems,
  } = useStore(state => ({
    setStoreValues: state.setStoreValues,
    interactionsMobile: state.interactionsMobile,
    indicators: state.indicators,
    breakpoint: state.breakpoint,
    activeMetric: state.activeMetric,
    allData: state.allData,
    tooltipItems: state.tooltipItems,
  }))
  const source = DATA_FILES.find(item => {
    return item.id === props.feature.source
  })
  const metric = indicators.find(item => {
    return item.id === activeMetric
  })
  const rawMetric = allData.find(d => {
    return d.variable === activeMetric.replace('_sd', '')
  })
  // console.log('rawMetric,', rawMetric)

  const setActiveQuintile = quintile => {
    // console.log('setActiveQuintile, ', quintile)
    const arr = [0, 0, 0, 0, 0]
    arr[quintile] = 1
    // console.log(arr)
    return arr
  }

  const getFeatureLabel = feature => {
    const layerID = feature.layer.source
    const label = feature.properties[source.label_key]
      ? feature.properties[source.label_key]
      : false

    switch (true) {
      case layerID === 'zip':
        return i18n.translate(`TOOLTIP_PLACE_ZIP`, {
          label: label,
        })
        break
      case layerID === 'place':
        return `${label}`
        break
      case layerID === 'tract':
        return i18n.translate(`TOOLTIP_PLACE_TRACT`, {
          label: label,
        })
        break
      case layerID === 'county':
        return i18n.translate(`TOOLTIP_PLACE_COUNTY`, {
          label: label,
        })
        break
    }
  }

  // console.log('PopupContent, ', props)
  // console.log('tooltipItems, ', tooltipItems)

  if (!!props.feature && props.feature !== undefined) {
    if (props.feature.layer.source.indexOf('points') > -1) {
      // console.log(`it's a points feature, `, props.feature)
      return (
        <div className="popup-content">
          <div className="popup-place-name">
            <h4>{props.feature.properties.Name}</h4>
          </div>
          <div
            className="popup-metric"
            key={`popup-point-${getFeatureId(
              props.feature,
            )}`}
          >
            <div className="popup-metric-label">
              {props.feature.properties.Display}
              <br />
              {`${props.feature.properties.Address}, ${props.feature.properties.City}`}
            </div>
          </div>
        </div>
      )
    } else if (
      props.feature.layer.source.indexOf('county') > -1
    ) {
      // console.log('it is a county feature')
      const featureLabel = getFeatureLabel(props.feature)
      return (
        <div className="popup-content">
          {!!featureLabel && (
            <div className="popup-place-name">
              <h4>{featureLabel}</h4>
            </div>
          )}
        </div>
      )
    } else {
      // console.log('not a points or county feature')
      const featureLabel = getFeatureLabel(props.feature)
      const value = props.feature.properties[
        rawMetric.variable
      ]
        ? String(
            props.feature.properties[rawMetric.variable],
          )
        : `Raw value not available.`
      // console.log('value = ', value)
      const valueLabel = i18n.translate(rawMetric.variable)
      const min = rawMetric.min
      const max = rawMetric.max
      const high_is_good = rawMetric.highisgood
      // console.log(
      //   'sd is , ',
      //   props.feature.properties[activeMetric],
      // )
      return (
        <div className="popup-content">
          {!!featureLabel && (
            <div className="popup-place-name">
              <h4>{featureLabel}</h4>
            </div>
          )}
          {String(value.length) > 0 && (
            <div
              className="popup-metric"
              key={`popup-metric-${metric.id}`}
            >
              <div className="popup-metric-label">
                <span className="metric-value">
                  {`${valueLabel}: ${
                    !!value
                      ? getRoundedValue(
                          value,
                          Number(rawMetric.decimals),
                          false,
                          Number(rawMetric.currency),
                          Number(rawMetric.percent),
                        )
                      : 'Not available'
                  }`}
                </span>
              </div>
              <div className="popup-metric-scale">
                <NonInteractiveScale
                  metric={activeMetric}
                  showHash={false}
                  quintiles={setActiveQuintile(
                    Number(
                      props.feature.properties[
                        activeMetric
                      ],
                    ),
                  )}
                  colors={CRI_COLORS}
                  showMinMax={false}
                  min={min}
                  max={max}
                />
              </div>
              <div className={clsx('popup-indicator-list')}>
                {tooltipItems.map(el => {
                  if (!!props.feature.properties[el.id]) {
                    return (
                      <div className="indicator-item">
                        <span
                          className={clsx(
                            'indicator-title',
                          )}
                        >
                          {i18n.translate(el.id)}:
                        </span>{' '}
                        <span
                          className={clsx(
                            'indicator-value',
                          )}
                        >
                          {getRoundedValue(
                            props.feature.properties[el.id],
                            el.decimals,
                            true,
                            el.currency,
                            el.percent,
                          )}
                        </span>
                      </div>
                    )
                  } else {
                    return ''
                  }
                })}
              </div>
            </div>
          )}
        </div>
      )
    }
  } else {
    setStoreValues({ showMapModal: false })
    return null
  }
}
export default PopupContent
