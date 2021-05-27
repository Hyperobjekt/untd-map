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
  position: relative;
  padding: 0rem 2rem 2rem;
  transition: opacity 0.4s ease;
  margin-left: -2rem;
  margin-right: -2rem;
  &.active {
    box-shadow: inset 0px 1px 0 #e0e2e5,
      inset 0px -1px 0 #e0e2e5;
    background: #f9fafb;
    .active-icon {
      opacity: 1;
      color: #0a6;
    }
    .btn--activate {
      pointer-events: none;
    }
  }
  .active-icon {
    position: absolute;
    top: 1.8rem;
    left: 2rem;
    opacity: 0.333;
  }
`

const SummaryTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2rem 0rem 2rem 3rem;
  & > * + * {
    margin-left: 0.8rem;
    position: relative;
    z-index: 2;
  }
  h3 {
    pointer-events: none;
  }
  .btn {
    border: 0;
    position: absolute;
    width: calc(100%);
    font-size: 20px;
    line-height: 1;
    top: 0;
    bottom: 0;
    padding-left: 2rem;
    left: 0rem;
    right: 0rem;
    z-index: 1;
    border-radius: 0;
    // background-image: linear-gradient(
    //   rgba(0, 0, 0, 0.05),
    //   transparent 50px
    // );
    background-position: 0 -50px;
    background-repeat: no-repeat;
    transition: background-position 0.2s ease;
    &:hover,
    &:focus {
      background-color: rgba(0, 0, 0, 0.02);
      background-position: 0 0px;
      box-shadow: none;
    }
  }
`

const SummaryBody = styled.div`
  padding: 0rem 0rem 0rem 4rem;
  p.gotham12 {
    max-width: 240px;
  }
`

const IndicatorSummary = ({
  indicator,
  data,
  trends,
  active,
  activeLayerIndex,
  region,
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
      <SummaryTitle>
        <Button
          className="btn--activate knockout12 py-0"
          color="none"
          onClick={e =>
            onActivate && onActivate(indicator, e)
          }
        >
          <MdCheck
            className="active-icon"
            aria-label={
              'activate ' + i18n.translate(indicator.id)
            }
          />
        </Button>
        <h3 className="indicator-name gotham14 w500">
          {i18n.translate(indicator.id)}
        </h3>
        <IndicatorTooltip indicator={indicator} />
      </SummaryTitle>
      <SummaryBody>
        <IndicatorRawScale
          className="mb-4"
          indicator={rawMetric}
          value={rawValue}
          region={region}
        />
        <IndicatorSdScale
          className="my-4"
          indicator={indicator}
          value={sdValue}
          region={region}
        />
        {/* Check for trend item, display trend chart */}
        {hasTrend && (
          <IndicatorTrend
            className="mt-4"
            data={trends}
            config={indicator.trend}
          />
        )}
      </SummaryBody>
    </Summary>
  )
}

export default IndicatorSummary
