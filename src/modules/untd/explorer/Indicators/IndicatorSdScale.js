import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import { hasValue } from './../utils'
import styled from 'styled-components'
import { ChoroplethLegend } from '../Legend/ChoroplethLegend'
/**
 * Get robotext for the sd bucket
 * @param Number sd Number 0 - 4
 */
export const getSDRobo = ({ sd, region }) => {
  const sdValue = i18n.translate(`SD_${sd}`)
  return i18n.translate(`SD_ROBO`, { sdValue, region })
}

const SdWrapper = styled.div`
  .choropleth-legend {
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
        className="gotham12 mb-3"
        dangerouslySetInnerHTML={{
          __html: getSDRobo({ sd: value, region }),
        }}
      />
      <ChoroplethLegend
        activeIndexes={[value]}
        noLabels
        condensed
      />
    </SdWrapper>
  )
}

IndicatorSdScale.propTypes = {}

export default IndicatorSdScale
