import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { Tooltip } from 'reactstrap'

import {
  getRoundedValue,
  getHashLeft,
  hasValue,
} from './../utils'
import useStore from './../store'

const IndicatorRawScale = ({
  indicator,
  value,
  ...props
}) => {
  // console.log('IndicatorRawScale, ', props)

  const interactionsMobile = useStore(
    state => state.interactionsMobile,
  )

  // do not render if no value
  if (!hasValue(value)) return null

  const high_is_good = !!Number(indicator.highisgood)
  const currency = !!Number(indicator.currency)
  const decimals = Number(indicator.decimals)
  const alt_u = indicator.alt_u
  const min = Number(indicator.min)
  const max = Number(indicator.max)
  const mean = Number(indicator.mean)
  const percent = !!Number(indicator.percent)

  /**
   * Founds a number in exponential notation to a whole number.
   * @param Number val Number in scientific notation
   * @returns String
   */
  const formatExponent = val => {
    if (val < 1 && val > -1) {
      return String(Math.round(val).toPrecision(1))
    } else {
      return getRoundedValue(val, 0, true, false, false)
    }
  }

  const formatValue = val =>
    String(val).indexOf('e') > 0
      ? formatExponent(val)
      : `${getRoundedValue(
          val,
          decimals,
          true,
          currency,
          percent,
        )}`

  const rightVal = !!high_is_good ? max : min
  const leftVal = !!high_is_good ? min : max

  const rightLabel = formatValue(rightVal)
  const leftLabel = formatValue(leftVal)
  const valueLabel = formatValue(value)
  const meanLabel = formatValue(mean)

  const percentFromLeft = getHashLeft(
    value,
    !!high_is_good ? min : max,
    !!high_is_good ? max : min,
  )
  const meanPercentFromLeft = getHashLeft(
    mean,
    !!high_is_good ? min : max,
    !!high_is_good ? max : min,
  )

  // Preserve: For checking a particular indicator, if there are issues with its presentation.
  // if (props.indicator.variable === 'Tot_EITC') {
  //   console.log(
  //     'Tot_EITC',
  //     meanPercentFromLeft,
  //     meanPercentFromLeft > 90 &&
  //       String(meanPercentFromLeft).length > 2,
  //     meanPercentFromLeft < 10 &&
  //       String(meanPercentFromLeft).length > 2,
  //   )
  // }

  // Manage tooltip state.
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  return (
    <div
      className={clsx('linear-scale', `${indicator.id}`)}
    >
      <div className="linear-scale-bar" />
      <div
        className="linear-scale-value hash-group"
        style={{ left: `${percentFromLeft}%` }}
      >
        <span
          className={clsx('label', 'gotham14', 'grey2', {
            'justify-right':
              percentFromLeft > 92 &&
              String(valueLabel).length > 3,
            'justify-left':
              percentFromLeft < 8 &&
              String(valueLabel).length > 3,
          })}
        >
          {valueLabel}
        </span>
        <div className="linear-scale-hash-value" />
      </div>
      <div
        className="linear-scale-mean hash-group"
        style={{ left: `${meanPercentFromLeft}%` }}
      >
        <div className="linear-scale-hash-mean" />
        <span
          id={`linear_scale_tooltip_target_${indicator.id}`}
          className={clsx('label', 'gotham12', 'grey2', {
            'justify-right': meanPercentFromLeft > 90,
            'justify-left': meanPercentFromLeft < 10,
          })}
          href="#"
        >
          {meanLabel}
        </span>
        <Tooltip
          placement={
            !!interactionsMobile ? 'auto' : 'right'
          }
          boundariesElement={`window`}
          isOpen={tooltipOpen}
          target={`linear_scale_tooltip_target_${indicator.id}`}
          toggle={toggle}
        >
          {i18n.translate(`LINEAR_SCALE_MEAN_DESC`)}
        </Tooltip>
      </div>
      <div className="linear-scale-labels">
        <span className="label gotham12 grey2">
          {leftLabel}
        </span>
        <span className="label gotham12 grey2">
          {rightLabel}
        </span>
      </div>
    </div>
  )
}

IndicatorRawScale.propTypes = {
  indicator: PropTypes.object,
  value: PropTypes.number,
}

export default IndicatorRawScale
