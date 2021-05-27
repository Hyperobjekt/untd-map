import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { setActiveQuintile, hasValue } from './../utils'
import NonInteractiveScale from './../NonInteractiveScale'
import { CRI_COLORS } from './../../../../constants/colors'
import styled from 'styled-components'
/**
 * Get robotext for the sd bucket
 * @param Number sd Number 0 - 4
 */
export const getSDRobo = ({ sd, region }) => {
  const sdValue = i18n.translate(`SD_${sd}`)
  return i18n.translate(`SD_ROBO`, { sdValue, region })
}

const SdWrapper = styled.div`
  .n-i-scale {
    width: 80%;
  }
`

const IndicatorSdScale = ({
  indicator,
  value,
  region,
  ...props
}) => {
  if (!hasValue(value)) return null
  return (
    <SdWrapper {...props}>
      <p
        className="gotham12"
        dangerouslySetInnerHTML={{
          __html: getSDRobo({ sd: value, region }),
        }}
      />

      <NonInteractiveScale
        metric={indicator.id}
        showHash={false}
        quintiles={setActiveQuintile(value)}
        colors={CRI_COLORS}
        showMinMax={false}
        min={0}
        max={4}
      />
    </SdWrapper>
  )
}

IndicatorSdScale.propTypes = {}

export default IndicatorSdScale
