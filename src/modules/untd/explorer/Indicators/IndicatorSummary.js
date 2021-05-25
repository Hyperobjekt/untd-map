import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'

import { hasValue } from './../utils'

import IndicatorButton from './IndicatorButton'
import IndicatorRawScale from './IndicatorRawScale'
import IndicatorSdScale from './IndicatorSdScale'
import IndicatorTrend from './IndicatorTrend'
import styled from 'styled-components'
import IndicatorTooltip from '../PanelLocationView/IndicatorTooltip'
import { Button } from 'reactstrap'

const Summary = styled.div`
  padding: 0rem 0rem 2rem;
  &.active {
    background-image: linear-gradient(
      #ffffdd,
      transparent 64px
    );
  }
`

const SummaryTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 0rem 1rem 0rem;
  * + * {
    margin-left: 0.8rem;
  }
  // * + *:last-child {
  //   margin-left: auto;
  // }
`

const SummaryBody = styled.div`
  padding: 0rem 0rem 0rem 2rem;
`

const IndicatorSummary = ({
  indicator,
  data,
  trends,
  active,
  activeLayerIndex,
}) => {
  console.log({ indicator, data, trends, activeLayerIndex })
  const rawMetric = {
    min: indicator.raw.min[activeLayerIndex],
    max: indicator.raw.max[activeLayerIndex],
    mean: indicator.raw.mean[activeLayerIndex],
    decimals: indicator.raw.decimals,
    highisgood: indicator.raw.highisgood,
    currency: indicator.raw.currency,
    percent: indicator.raw.percent,
    id: indicator.raw.id,
  }
  const rawName = indicator.raw.id
  const rawValue = data[rawName]
  const sdValue = data[indicator.id]

  // is trend line available
  const hasTrend =
    trends[0][String(rawName).replace('_19', '')]

  // if raw and SD values are not available, return early
  if (!hasValue(sdValue) && !hasValue(rawValue)) return null

  return (
    <Summary>
      <SummaryTitle>
        <h3 className="gotham14">
          {i18n.translate(indicator.id)}
        </h3>
        <IndicatorTooltip indicator={indicator} />
        <Button className="knockout12" color="outlined">
          Map
        </Button>
      </SummaryTitle>
      <SummaryBody>
        <IndicatorRawScale
          indicator={rawMetric}
          value={rawValue}
        />
        <IndicatorSdScale
          indicator={indicator}
          value={sdValue}
        />
        {/* Check for trend item, display trend chart */}
        {hasTrend && (
          <IndicatorTrend
            data={trends}
            config={indicator.trend}
          />
        )}
      </SummaryBody>
    </Summary>
  )
}

export default IndicatorSummary
