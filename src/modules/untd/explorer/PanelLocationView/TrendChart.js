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

const CustomTooltip = ({ active, payload, label }) => {
  console.log('CustomTooltip, ', active, payload, label)
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <span className={clsx('label')}>{label}</span>
        {': '}
        <span className={clsx('value')}>
          {payload[0].payload.raw}
        </span>
      </div>
    )
  }

  return null
}

const TrendChart = ({ ...props }) => {
  const { trendMinMax, activeLayers } = useStore(
    state => ({
      trendMinMax: state.trendMinMax,
      activeLayers: state.activeLayers,
    }),
    shallow,
  )

  const activeLayerIndex = activeLayers.indexOf(1)
  const min =
    trendMinMax[props.metric].min[activeLayerIndex]
  const max =
    trendMinMax[props.metric].max[activeLayerIndex]

  const dataSet = props.data
    .map(el => {
      return {
        name: Number(el.year),
        value:
          // Number(el[props.metric]),
          trendMinMax[props.metric].highisgood
            ? Number(el[props.metric])
            : max - Number(el[props.metric]),
        raw: Number(el[props.metric]),
      }
    })
    .sort((a, b) => a.year - b.year)

  console.log('dataset: ', dataSet)

  return (
    <div className={clsx('section', 'section-trend-chart')}>
      <h6>
        {i18n.translate(`TREND_CHART_HEADING`, {
          years: dataSet.length,
        })}
      </h6>
      <AreaChart width={150} height={80} data={dataSet}>
        <XAxis dataKey="name" tick={false} height={3} />
        <YAxis
          dataKey="value"
          // domain={['dataMin', 'dataMax']}
          domain={[min, max]}
          tick={false}
          reversed={false}
          width={3}
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
            color: 'white',
            backgroundColor: 'black',
            padding: '2rem 1rem 0.5rem 1rem',
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
  metric: PropTypes.string,
}

export default TrendChart
