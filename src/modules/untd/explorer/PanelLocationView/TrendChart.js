import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import useStore from './../store'
import { getRoundedValue } from './../utils'

const CustomTooltip = ({ active, payload, label }) => {
  // console.log('CustomTooltip, ', active, payload, label)
  if (active && payload && payload.length) {
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

  return null
}

const TrendChart = ({ data, config, ...props }) => {
  const { activeLayers } = useStore(
    state => ({
      activeLayers: state.activeLayers,
    }),
    shallow,
  )

  // console.log('TrendChart: ', data, config)

  const activeLayerIndex = activeLayers.indexOf(1)
  const min = config.min[activeLayerIndex]
  const max = config.max[activeLayerIndex]
  const currency = config.currency
  const percent = config.percent
  const decimals = config.decimals
  const id = config.id
  const years = data.map(el => {
    return Number(el.year)
  })
  const yearMax = Math.max(...years)
  const yearMin = Math.min(...years)
  const yearDiff = yearMax - yearMin + 1

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

  // console.log('dataset: ', dataSet)

  return (
    <div className={clsx('section', 'section-trend-chart')}>
      <h6>
        {i18n.translate(`TREND_CHART_HEADING`, {
          years: yearDiff,
        })}
      </h6>
      <AreaChart width={150} height={80} data={dataSet}>
        <XAxis dataKey="name" tick={false} height={1} />
        <YAxis
          dataKey="value"
          // domain={['dataMin', 'dataMax']}
          domain={[min, max]}
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
    </div>
  )
}

TrendChart.propTypes = {
  data: PropTypes.object,
  config: PropTypes.object,
}

export default TrendChart
