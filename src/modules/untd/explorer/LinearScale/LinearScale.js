import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'

import { getRoundedValue, getHashLeft } from './../utils'

const LinearScale = ({ ...props }) => {
  // console.log('LinearScale, ', props)

  const value = props.value
  const high_is_good = !!Number(props.indicator.highisgood)
  const currency = !!Number(props.indicator.currency)
  const decimals = Number(props.indicator.decimals)
  const alt_u = props.indicator.alt_u
  const min = Number(props.indicator.min)
  const max = Number(props.indicator.max)
  const mean = Number(props.indicator.mean)
  const percent = !!Number(props.indicator.percent)

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

  return (
    <div
      className={clsx(
        'linear-scale',
        `${props.indicator.variable}`,
      )}
    >
      <div className={clsx('linear-scale-bar')}></div>
      <div
        className={clsx('linear-scale-value', 'hash-group')}
        style={{ left: `${percentFromLeft}%` }}
      >
        <span
          className={clsx(
            'label',
            percentFromLeft > 90 &&
              String(valueLabel).length > 2
              ? 'justify-right'
              : '',
            percentFromLeft < 10 &&
              String(valueLabel).length > 2
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
          className={clsx(
            'label',
            'scale-label',
            'hash-label',
            'mean-label',
            meanPercentFromLeft > 90 ? 'justify-right' : '',
            meanPercentFromLeft < 10 ? 'justify-left' : '',
          )}
        >
          {meanLabel}
        </span>
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
