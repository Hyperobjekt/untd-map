import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import {
  LineChart,
  Line,
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
    <LineChart
      width={250}
      height={150}
      data={dataSet}
      // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <XAxis dataKey="name" />
      <YAxis dataKey="value" />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="red" />
    </LineChart>
  )
}

TrendChart.propTypes = {
  data: PropTypes.object,
  metric: PropTypes.string,
}

export default TrendChart
