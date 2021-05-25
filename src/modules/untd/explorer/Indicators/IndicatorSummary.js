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
import { MdCheck } from 'react-icons/md'

const Summary = styled.div`
  padding: 0rem 0rem 2rem;
`

const SummaryTitle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 0rem 1rem 3rem;
  & > * + * {
    margin-left: 0.8rem;
    position: relative;
    z-index: 2;
  }
  h3 {
    pointer-events: none;
  }
  button {
    position: absolute;
    width: calc(100% + 4rem);
    font-size: 20px;
    line-height: 1;
    top: 0;
    bottom: 0;
    padding-left: 2rem;
    left: -2rem;
    right: -2rem;
    z-index: 1;
    border-radius: 0;
  }
`

const SummaryBody = styled.div`
  padding: 0rem 0rem 0rem 4rem;
`

const MapButton = styled(Button)`
  text-align: left;
`

const IndicatorSummary = ({
  indicator,
  data,
  trends,
  active,
  activeLayerIndex,
  onActivate,
}) => {
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
    <Summary className={clsx({ active: active })}>
      <SummaryTitle className="mb-5">
        <MapButton
          className="knockout12 py-0"
          color="transparent"
          onClick={e =>
            onActivate && onActivate(indicator, e)
          }
        >
          <MdCheck
            aria-label={
              'activate ' + i18n.translate(indicator.id)
            }
          />
        </MapButton>
        <h3 className="gotham14 w600">
          {i18n.translate(indicator.id)}
        </h3>
        <IndicatorTooltip indicator={indicator} />
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
