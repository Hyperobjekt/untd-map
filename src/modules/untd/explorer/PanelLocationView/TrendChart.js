import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

const TrendChart = ({ ...props }) => {
  const dataSet = props.data.map(el => {
    return {
      name: el.year,
      value: el[props.metric],
    }
  })

  console.log('dataset: ', dataSet)

  return (
    <AreaChart
      width={150}
      height={80}
      data={dataSet}
      // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="name" tick={false} />
      <YAxis
        dataKey="value"
        domain={['dataMin', 'dataMax']}
        tick={false}
      />
      {/* <Tooltip /> */}
      <Area
        type="monotone"
        dataKey="value"
        stroke="#626B77"
        fill="#EAEFF4"
        dot={false}
      />
      {/* <Line
        type="monotone"
        dataKey="value"
        stroke="red"
        dot={false}
      /> */}
    </AreaChart>
  )
}

TrendChart.propTypes = {
  data: PropTypes.object,
  metric: PropTypes.string,
}

export default TrendChart
