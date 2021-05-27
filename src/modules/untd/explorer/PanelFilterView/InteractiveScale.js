import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import PropTypes from 'prop-types'

import useStore from './../store.js'
import {
  CRI_COLORS,
  DISABLED_COLORS,
} from './../../../../constants/colors'
import { getQuintileDesc } from './../utils'

const InteractiveScale = ({ className, ...props }) => {
  // console.log('InteractiveScale, ', props)
  // Generic state setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Active metric
  const activeMetric = useStore(state => state.activeMetric)
  // Active quintiles
  const activeQuintiles = useStore(
    state => state.activeQuintiles,
  )

  const getBgColor = (metric, quintile) => {
    // console.log('getBgColor')
    return CRI_COLORS[quintile]
  }

  const getQuintileAriaLabel = quintile => {
    const quintileDesc = i18n.translate(
      getQuintileDesc(quintile),
    )
    if (
      props.metric.id === activeMetric &&
      activeQuintiles[quintile] == 1
    ) {
      return i18n.translate(
        'UI_MAP_PANEL_QUINTILE_DISABLE',
        { quintile: quintileDesc },
      )
    } else {
      return i18n.translate(
        'UI_MAP_PANEL_QUINTILE_ENABLE',
        { quintile: quintileDesc },
      )
    }
  }

  const getElIndex = element =>
    Array.from(element.parentNode.children).indexOf(element)

  const handleQuintileClick = e => {
    e.preventDefault()
    // console.log('handleQuintileClick(), ', e.currentTarget)

    const quintile = getElIndex(e.currentTarget)
    let quintiles = activeQuintiles.slice()

    quintiles[quintile] =
      Number(quintiles[quintile]) === 1 ? 0 : 1

    // setActiveQuintiles(quintiles)
    setStoreValues({
      activeQuintiles: quintiles,
    })
  }

  const getScaleAriaLabel = () => {
    // console.log('getScaleAriaLabel()')
    const metricTitle = i18n.translate(props.metric.title)
    const prompt =
      activeMetric === props.metric.id
        ? 'UI_MAP_PANEL_METRIC_DISABLE'
        : 'UI_MAP_PANEL_METRIC_ENABLE'
    const label = i18n.translate(prompt, {
      metric: metricTitle,
    })
    // console.log('label, ', label)
    return label
  }

  return (
    <>
      <div
        className={clsx(
          'interactive-scale',
          'button-metric',
          activeMetric === props.metric.id ? 'active' : '',
          'button-' + props.metric.id,
          className,
        )}
        id={'metric_select_' + props.metric.id}
        aria-label={getScaleAriaLabel()}
      >
        {activeQuintiles.map((val, i) => {
          return (
            <button
              className={clsx(
                'quintile-button',
                props.metric.id === activeMetric &&
                  Number(val) === 1
                  ? 'active'
                  : '',
                'quintile-' + i,
              )}
              style={{
                backgroundColor:
                  props.metric.id === activeMetric &&
                  Number(val) === 1
                    ? getBgColor(props.metric, i)
                    : DISABLED_COLORS[i],
              }}
              onClick={handleQuintileClick}
              key={'quintile_button_' + i}
              aria-label={getQuintileAriaLabel(i)}
            >
              <span className="sr-only">
                {getQuintileAriaLabel(i)}
              </span>
            </button>
          )
        })}
      </div>
      <span className="hint">
        click on a color to toggle filters
      </span>
    </>
  )
}

InteractiveScale.propTypes = {
  metric: PropTypes.object,
}

InteractiveScale.defaultProps = {
  metric: {},
}

export default InteractiveScale
