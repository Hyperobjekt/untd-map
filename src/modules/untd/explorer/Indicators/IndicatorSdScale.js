import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import {
  setActiveQuintile,
  getSDRobo,
  hasValue,
} from './../utils'
import NonInteractiveScale from './../NonInteractiveScale'
import { CRI_COLORS } from './../../../../constants/colors'

const IndicatorSdScale = ({ indicator, value }) => {
  if (!hasValue(value)) return null
  return (
    <>
      <p className="gotham12">{getSDRobo(value)}</p>
      <NonInteractiveScale
        metric={indicator.id}
        showHash={false}
        quintiles={setActiveQuintile(value)}
        colors={CRI_COLORS}
        showMinMax={false}
        min={0}
        max={4}
      />
    </>
  )
}

IndicatorSdScale.propTypes = {}

export default IndicatorSdScale
