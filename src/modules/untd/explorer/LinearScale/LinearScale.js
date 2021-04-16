import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { Tooltip } from 'reactstrap'
import shallow from 'zustand/shallow'

import { getRoundedValue, getHashLeft } from './../utils'
import useStore from './../store'

const LinearScale = ({ indicator, value, ...props }) => {
  // console.log('LinearScale, ', props)

  const { interactionsMobile } = useStore(
    state => ({
      interactionsMobile: state.interactionsMobile,
    }),
    shallow,
  )

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

  const rightVal = !!high_is_good ? max : min
  const leftVal = !!high_is_good ? min : max

  const rightLabel =
    String(rightVal).indexOf('e') > 0
      ? formatExponent(rightVal)
      : `${getRoundedValue(
          rightVal,
          decimals,
          true,
          currency,
          percent,
        )}`
  const leftLabel =
    String(leftVal).indexOf('e') > 0
      ? formatExponent(leftVal)
      : `${getRoundedValue(
          leftVal,
          decimals,
          true,
          currency,
          percent,
        )}`
  const valueLabel =
    String(value).indexOf('e') > 0
      ? formatExponent(value)
      : `${getRoundedValue(
          value,
          decimals,
          true,
          currency,
          percent,
        )}`

  const meanLabel =
    String(mean).indexOf('e') > 0
      ? formatExponent(mean)
      : `${getRoundedValue(
          mean,
          decimals,
          true,
          currency,
          percent,
        )}`
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
      <div className={clsx('linear-scale-bar')}></div>
      <div
        className={clsx('linear-scale-value', 'hash-group')}
        style={{ left: `${percentFromLeft}%` }}
      >
        <span
          className={clsx(
            'label',
            percentFromLeft > 92 &&
              String(valueLabel).length > 3
              ? 'justify-right'
              : '',
            percentFromLeft < 8 &&
              String(valueLabel).length > 3
              ? 'justify-left'
              : '',
          )}
        >
          {valueLabel}
        </span>
        <div
          className={clsx('linear-scale-hash-value')}
        ></div>
      </div>
      <div
        className={clsx('linear-scale-mean', 'hash-group')}
        style={{ left: `${meanPercentFromLeft}%` }}
      >
        <div
          className={clsx(
            'linear-scale-hash-mean',
            'hash-mean',
          )}
        ></div>
        <span
          id={`linear_scale_tooltip_target_${indicator.id}`}
          className={clsx(
            'label',
            'scale-label',
            'hash-label',
            'mean-label',
            meanPercentFromLeft > 90 ? 'justify-right' : '',
            meanPercentFromLeft < 10 ? 'justify-left' : '',
          )}
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
      <div
        className={clsx(
          'linear-scale-labels',
          'scale-label-group',
        )}
      >
        <div className={clsx('linear-scale-label-left')}>
          <span className={clsx('label', 'scale-label')}>
            {leftLabel}
          </span>
        </div>
        <div className={clsx('linear-scale-label-right')}>
          <span className={clsx('label', 'scale-label')}>
            {rightLabel}
          </span>
        </div>
      </div>
    </div>
  )
}

LinearScale.propTypes = {
  indicator: PropTypes.object,
  value: PropTypes.number,
}

export default LinearScale
