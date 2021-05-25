import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import useStore from './../store'
import { getRoundedValue } from './../utils'

const CustomTooltip = ({ active, payload, label }) => {
  // console.log('CustomTooltip, ', active, payload, label)
  if (!active || !payload || !payload.length) return null
  return (
    <div className="trend-chart-tooltip">
      <span className={clsx('label')}>{label}</span>
      {': '}
      <span className={clsx('value')}>
        {payload[0].payload.display}
      </span>
    </div>
  )
}

const TrendChart = ({ data, config, layerIndex }) => {
  const min = config.min[layerIndex]
  const max = config.max[layerIndex]
  const currency = config.currency
  const percent = config.percent
  const decimals = config.decimals
  const id = config.id
  const dataSet = data
    .map(el => {
      return {
        name: Number(el.year),
        // Flip the value calc if high is not good.
        value: !!config.highisgood
          ? Number(el[config.id])
          : max - Number(el[config.id]),
        raw: Number(el[config.id]),
        display: getRoundedValue(
          Number(el[config.id]),
          decimals,
          false,
          currency,
          percent,
        ),
      }
    })
    .sort((a, b) => a.year - b.year)
  return (
    <ResponsiveContainer width="100%" height={32}>
      <AreaChart data={dataSet}>
        <XAxis dataKey="name" tick={false} height={1} />
        <YAxis
          dataKey="value"
          domain={['dataMin', 'dataMax']}
          // domain={[min, max]}
          tick={false}
          reversed={false}
          width={1}
        />
        <Tooltip
          allowEscapeViewBox={{ x: true, y: true }}
          content={<CustomTooltip />}
          animationBegin={1200}
          isAnimationActive={false}
          animationEasing={'linear'}
          itemStyle={{
            backgroundColor: 'white',
          }}
          wrapperStyle={{
            fontSize: 12,
            fontFamily: 'Knockout 49 A',
            color: 'white',
            backgroundColor: '#2c390b',
            padding: '1.5rem',
            borderRadius: '4px',
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#626B77"
          fill="#EAEFF4"
          dot={false}
          reversed={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const IndicatorTrend = ({ data, config, ...props }) => {
  console.log(data, config)

  const activeLayers = useStore(state => state.activeLayers)
  const years = data.map(el => {
    return Number(el.year)
  })
  const yearMax = Math.max(...years)
  const yearMin = Math.min(...years)
  const yearDiff = yearMax - yearMin + 1

  return (
    <>
      <p className="gotham12">
        {i18n.translate(`TREND_CHART_HEADING`, {
          years: yearDiff,
        })}
        {i18n.translate(`PLACEHOLDER_ROBO`)}
      </p>
      <TrendChart
        data={data}
        config={config}
        layerIndex={activeLayers.indexOf(1)}
      />
    </>
  )
}

IndicatorTrend.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
}

export default IndicatorTrend
