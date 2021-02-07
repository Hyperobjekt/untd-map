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
  getMetric,
  getHashLeft,
  getQuintile,
  getFeatureId,
} from './../../utils'
import useStore from './../../store'

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
  } = useStore(state => ({
    setStoreValues: state.setStoreValues,
    interactionsMobile: state.interactionsMobile,
    indicators: state.indicators,
    breakpoint: state.breakpoint,
    activeMetric: state.activeMetric,
    allData: state.allData,
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
      case layerID === 'zips':
        return `Zip code ${label}`
        break
      case layerID === 'places':
        return `${label}`
        break
      case layerID === 'tracts':
        return `Census tract ${label}`
        break
    }
  }

  // console.log('PopupContent, ', props)

  if (!!props.feature && props.feature !== undefined) {
    if (props.feature.layer.source.indexOf('points') > -1) {
      // console.log(`it's a points feature, `, props.feature)
      return (
        <div className="popup-content">
          <div className="popup-school-name">
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
    } else {
      // console.log('not a points feature')
      const featureLabel = getFeatureLabel(props.feature)
      // props.feature.properties[
      //   source.label_key
      // ]
      //   ? props.feature.properties[source.label_key]
      //   : false
      // const rawValueHandle = String(activeMetric).replace(
      //   '_sd',
      //   '',
      // )
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
            <div className="popup-school-name">
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
