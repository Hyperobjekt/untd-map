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
  generateFeatureId,
} from './../../utils'
import useStore from './../../store'

/**
 * Returns popup contents for map feature mouseover
 */
const PopupContent = ({ ...props }) => {
  // if (props.feature) {
  //   console.log('props.feature exists')
  //   console.log('props.feature, ', props.feature)
  // }
  // Generic state updates for store.
  // Accepts an object of values to update.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const interactionsMobile = useStore(
    state => state.interactionsMobile,
  )
  const indicators = useStore(state => state.indicators)
  const breakpoint = useStore(state => state.breakpoint)
  const activeMetric = useStore(state => state.activeMetric)

  const source = DATA_FILES.find(item => {
    return item.id === props.feature.source
  })
  const metric = indicators.find(item => {
    return item.id === activeMetric
  })

  const setActiveQuintile = quintile => {
    // console.log('setActiveQuintile, ', quintile)
    const arr = [0, 0, 0, 0, 0]
    arr[quintile] = 1
    // console.log(arr)
    return arr
  }

  if (!!props.feature) {
    if (props.feature.layer.source === 'points') {
      // console.log(`it's a points feature`)
      return (
        <div className="popup-content">
          <div className="popup-school-name">
            <h4>{props.feature.properties.Name}</h4>
          </div>
          <div
            className="popup-metric"
            key={`popup-point-${generateFeatureId(
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
      const featureLabel = props.feature.properties[
        source.label_key
      ]
        ? props.feature.properties[source.label_key]
        : false
      const rawValueHandle = String(activeMetric).replace(
        '_sd',
        '',
      )
      const value = props.feature.properties[rawValueHandle]
        ? String(props.feature.properties[rawValueHandle])
        : `Raw value not available.`
      console.log('value = ', value)
      const valueLabel = i18n.translate(rawValueHandle)
      const min = metric.min
      const max = metric.max
      const high_is_good = metric.high_is_good
      // console.log(
      //   'sd is , ',
      //   props.feature.properties[activeMetric],
      // )
      return (
        <div className="popup-content">
          {!!featureLabel && (
            <div className="popup-school-name">
              <h4>
                {props.feature.properties[source.label_key]}
              </h4>
            </div>
          )}
          {value.length > 0 && (
            <div
              className="popup-metric"
              key={`popup-metric-${metric.id}`}
            >
              <div className="popup-metric-label">
                {featureLabel}
                <br />
                <span className="metric-value">
                  {`${valueLabel}: ${
                    !!value
                      ? getRoundedValue(value, 0, false)
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
