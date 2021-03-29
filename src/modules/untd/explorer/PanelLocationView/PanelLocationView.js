import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { FiInfo } from 'react-icons/fi'
import { Tooltip } from 'reactstrap'

import useStore from './../store'
import {
  getGeoFeatureLabel,
  setActiveQuintile,
} from './../utils'
import NonInteractiveScale from './../NonInteractiveScale'
import { CRI_COLORS } from './../../../../constants/colors'

const IndicatorTooltip = ({ indicator, ...rest }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)
  return (
    <>
      <FiInfo
        className={clsx('indicator-tip')}
        id={'tip_prompt_' + indicator.id}
      />
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={'tip_prompt_' + indicator.id}
        toggle={toggle}
        autohide={false}
        className={'tip-prompt-layer'}
        dangerouslySetInnerHTML={{
          __html: i18n.translate(`${indicator.id}_desc`),
        }}
      ></Tooltip>
    </>
  )
}

const PanelLocationView = ({ ...props }) => {
  // Generic store value setter.
  const {
    setStoreValues,
    activeFeature,
    indicators,
    interactionsMobile,
    allData,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      activeFeature: state.activeFeature,
      indicators: state.indicators,
      interactionsMobile: state.interactionsMobile,
      allData: state.allData,
    }),
    shallow,
  )

  if (!!activeFeature) {
    return (
      <div className={clsx('map-panel-slideout-location')}>
        <div className={clsx('panel-sticky')}>
          <h5>{getGeoFeatureLabel(activeFeature)}</h5>
        </div>
        {/* Demographics */}
        <div className={clsx('panel-demographics')}>
          <h6>{i18n.translate(`PANEL_LOCATION_DEMO`)}</h6>
        </div>
        {/* Indicators */}
        <div className={clsx('panel-indicators')}>
          {indicators
            .filter(el => {
              return el.display === 1
            })
            .sort((a, b) => {
              return a.order - b.order
            })
            .map(indicator => {
              console.log('indicator, ', indicator)
              // const metric = indicators.find(item => {
              //   return item.id === activeMetric
              // })
              const rawMetric = allData.find(d => {
                return (
                  d.variable ===
                  indicator.id.replace('_sd', '')
                )
              })
              const valueLabel = i18n.translate(
                rawMetric.variable,
              )
              const min = rawMetric.min
              const max = rawMetric.max
              const high_is_good = rawMetric.highisgood
              return (
                <div
                  className={clsx(
                    'filter',
                    `layer-order-${indicator.order}`,
                  )}
                  key={indicator.id}
                >
                  <h6 className={clsx('indicator')}>
                    {i18n.translate(indicator.id)}
                    {!interactionsMobile && (
                      <IndicatorTooltip
                        indicator={indicator}
                      />
                    )}
                  </h6>
                  <NonInteractiveScale
                    metric={indicator.id}
                    showHash={false}
                    quintiles={setActiveQuintile(
                      Number(
                        activeFeature.properties[
                          indicator.id
                        ],
                      ),
                    )}
                    colors={CRI_COLORS}
                    showMinMax={false}
                    min={min}
                    max={max}
                  />
                </div>
              )
            })}
        </div>
      </div>
    )
  } else {
    return ''
  }
}

export default PanelLocationView
