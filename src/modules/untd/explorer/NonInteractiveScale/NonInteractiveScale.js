import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'

import { getRoundedValue, getMetric } from './../utils'
import useStore from './../store'

const NonInteractiveScale = ({
  metric,
  quintiles,
  colors,
  showHash,
  hashLeft,
  showMinMax,
}) => {
  const { indicators, allData } = useStore(state => ({
    indicators: state.indicators,
    allData: state.allData,
  }))
  const metricData = allData.find(raw => {
    return raw.variable === metric.replace(/_sd/g, '')
  })
  const styles = [
    {
      backgroundColor: !!quintiles[0]
        ? colors[0]
        : 'transparent',
    },
    {
      backgroundColor: !!quintiles[1]
        ? colors[1]
        : 'transparent',
    },
    {
      backgroundColor: !!quintiles[2]
        ? colors[2]
        : 'transparent',
    },
    {
      backgroundColor: !!quintiles[3]
        ? colors[3]
        : 'transparent',
    },
    {
      backgroundColor: !!quintiles[4]
        ? colors[4]
        : 'transparent',
    },
  ]
  const hashStyles = { left: hashLeft + '%' }
  const minMaxStyle = {
    display: !!showMinMax ? 'block' : 'none',
  }
  if (!metricData) {
    return null
  } else {
    return (
      <div className="n-i-scale" key={metric}>
        <div className="n-i-scale-parent">
          {!!showHash ? (
            <div
              className="n-i-scale-hash"
              style={hashStyles}
            ></div>
          ) : null}
          <div
            className={clsx(
              'n-i-scale-quintiles',
              'metric-' + metric,
            )}
          >
            <div
              className="n-i-scale-quintile quintile-0"
              style={styles[0]}
            ></div>
            <div
              className="n-i-scale-quintile quintile-1"
              style={styles[1]}
            ></div>
            <div
              className="n-i-scale-quintile quintile-2"
              style={styles[2]}
            ></div>
            <div
              className="n-i-scale-quintile quintile-3"
              style={styles[3]}
            ></div>
            <div
              className="n-i-scale-quintile quintile-4"
              style={styles[4]}
            ></div>
          </div>
        </div>
        {!!showMinMax ? (
          <div
            className="n-i-scale-minmax"
            style={minMaxStyle}
          >
            <div className="n-i-scale-min">
              {getRoundedValue(
                !!metricData.highisgood
                  ? metricData.min
                  : metricData.max,
                Number(metricData.decimals),
                false,
                !!Number(metricData.currency),
                !!Number(metricData.percent),
              )}
            </div>
            <div className="n-i-scale-max">
              {getRoundedValue(
                !!metricData.highisgood
                  ? metricData.max
                  : metricData.min,
                Number(metricData.decimals),
                false,
                !!Number(metricData.currency),
                !!Number(metricData.percent),
              )}
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }
}

NonInteractiveScale.propTypes = {
  metric: PropTypes.string,
}

export default NonInteractiveScale
