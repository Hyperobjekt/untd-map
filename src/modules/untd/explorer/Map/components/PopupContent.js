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
} from './../../utils'
import useStore from './../../store'

/**
 * Returns popup contents for map feature mouseover
 */
const PopupContent = ({ ...props }) => {
  if (props.feature) {
    console.log('props.feature exists')
    console.log('props.feature, ', props.feature)
  }
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

  const source = DATA_FILES.find(item => {
    return item.id === props.feature.source
  })

  console.log('source = ', source)

  // For tracking access school page events.
  // const eventSchoolPage = useStore(
  //   state => state.eventSchoolPage,
  // )

  // const metrics = []
  // CPAL_METRICS.forEach(el => {
  //   if (el.tab_level === 0) {
  //     metrics.push(el.id)
  //   }
  // })

  const setActiveQuintile = quintile => {
    const arr = [0, 0, 0, 0, 0]
    arr[quintile] = 1
    return arr
  }

  // const navigateToSchool = e => {
  //   e.preventDefault()
  //   // console.log('navigateToSchool()')
  //   if (!!window) {
  //     // console.log('navigateToSchool() window exists')
  //     const href =
  //       window.location.origin +
  //       '/schools/' +
  //       props.feature.properties.SLN +
  //       '/'
  //     // console.log('navigateToSchool() href is ', href)
  //     window.open(href, '_blank')
  //     setStoreValues({
  //       eventSchoolPage: eventSchoolPage + 1,
  //       accessedSchool: props.feature.properties.SLN,
  //     })
  //   }
  // }
  //
  // {!!(
  //   breakpoint === 'xs' ||
  //   breakpoint === 'sm' ||
  //   breakpoint === 'md' ||
  //   interactionsMobile
  // ) && (
  //   <CoreButton
  //     id="modal_access_school"
  //     className="click-school-prompt"
  //     onClick={navigateToSchool}
  //     aira-label={i18n.translate(
  //       'UI_MAP_SCHOOL_ACCESS_LINK',
  //     )}
  //     color="light"
  //   >
  //     <FaExternalLinkSquareAlt />
  //     {i18n.translate('UI_MAP_SCHOOL_ACCESS_LINK')}
  //   </CoreButton>
  // )}

  if (!!props.feature) {
    return (
      <div className="popup-content">
        <div className="popup-school-name">
          <h4>
            {props.feature.properties[source.label_key]}
          </h4>
        </div>
        {indicators.map(metric => {
          // const metricData = getMetric(metric, indicators)
          console.log('metric, ', metric)
          const label = i18n.translate(metric.id)
          const value = String(
            props.feature.properties[
              String(metric.id).replace('_sd', '')
            ],
          )
          const min = metric.min
          const max = metric.max
          const high_is_good = metric.high_is_good
          if (value.length > 0) {
            return (
              <div
                className="popup-metric"
                key={`popup-metric-${metric.id}`}
              >
                <div className="popup-metric-label">
                  {label}&nbsp;&nbsp;
                  <span className="metric-value">
                    {!!value
                      ? getRoundedValue(value, 0, false)
                      : ''}
                  </span>
                </div>
                <div className="popup-metric-scale">
                  <NonInteractiveScale
                    metric={metric}
                    showHash={false}
                    quintiles={setActiveQuintile(
                      getQuintile(
                        value,
                        min,
                        max,
                        high_is_good,
                      ),
                    )}
                    colors={CRI_COLORS}
                    showMinMax={false}
                    min={min}
                    max={max}
                  />
                </div>
              </div>
            )
          } else {
            return ''
          }
        })}
      </div>
    )
  } else {
    setStoreValues({ showMapModal: false })
    return null
  }
}
export default PopupContent
