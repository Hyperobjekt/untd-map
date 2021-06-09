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
import { max, min } from 'd3-array'
import useStore from './../store'
import {
  formatIndicatorValue,
  getRoundedValue,
} from './../utils'
import styled from 'styled-components'

const roundValue = (num, dec) =>
  Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec)

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

// bring chart forward in z direction
const ChartContainer = styled(ResponsiveContainer)`
  position: relative;
  z-index: 501;
  left: -5px;
`

const TrendChart = ({ data, config, layerIndex }) => {
  const currency = config.currency
  const percent = config.percent
  const decimals = config.decimals
  const id = config.id
  const dataSet = data
    .map(el => {
      return {
        name: Number(el.year),
        // Flip the value calc if high is not good.
        value: roundValue(
          Number(el[id]),
          percent ? decimals + 2 : decimals,
        ),
        raw: Number(el[id]),
        display: getRoundedValue(
          Number(el[id]),
          decimals,
          false,
          currency,
          percent,
        ),
      }
    })
    .sort((a, b) => a.year - b.year)

  return (
    <ChartContainer width="82%" height={32}>
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
          position={{
            x: 200,
            y: 36,
          }}
          wrapperStyle={{
            fontSize: 12,
            fontFamily: 'Knockout 49 A',
            color: 'white',
            backgroundColor: '#2c390b',
            padding: '1rem',
            borderRadius: '4px',
            left: '-50%',
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
    </ChartContainer>
  )
}

const IndicatorTrend = ({ data, config, ...props }) => {
  const activeLayers = useStore(state => state.activeLayers)
  const years = data.map(el => {
    return Number(el.year)
  })
  const yearMax = Math.max(...years)
  const yearMin = Math.min(...years)
  const yearDiff = yearMax - yearMin + 1

  const values = data.map(d =>
    roundValue(
      Number(d[config.id]),
      config.percent
        ? config.decimals + 2
        : config.decimals,
    ),
  )
  const highIsGood = Number(config.highisgood)
  const current = values[values.length - 1]
  const diff = current - values[0]
  const diffLabel =
    diff > 0 && highIsGood ? 'increased' : 'decreased'
  const diffValue = formatIndicatorValue(
    Math.abs(diff),
    config,
  )
  const roboKey =
    diff === 0 ? `TREND_ROBO_NO_DIFF` : `TREND_ROBO_DIFF`
  const context = {
    diff,
    diffLabel,
    diffValue,
    years: [yearMin, yearMax].join(' - '),
  }
  const roboText = i18n.translate(roboKey, context)

  return (
    <div {...props}>
      <p
        className="gotham12 mb-3"
        dangerouslySetInnerHTML={{ __html: roboText }}
      />
      <TrendChart
        data={data}
        config={config}
        layerIndex={activeLayers.indexOf(1)}
      />
    </div>
  )
}

IndicatorTrend.propTypes = {
  data: PropTypes.array,
  config: PropTypes.object,
}

export default IndicatorTrend
