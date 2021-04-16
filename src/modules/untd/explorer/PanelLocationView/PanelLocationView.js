import React from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'

import useStore from './../store'
import {
  getGeoFeatureLabel,
  setActiveQuintile,
  getActiveLayerIndex,
} from './../utils'
import NonInteractiveScale from './../NonInteractiveScale'
import LinearScale from './../LinearScale'
import TrendChart from './TrendChart'
import IndicatorButton from './IndicatorButton'
import DemographicsPanel from './DemographicsPanel'
import FeedbackPanel from './FeedbackPanel'
import { CRI_COLORS } from './../../../../constants/colors'
import { UNTD_LAYERS } from './../../../../constants/layers'

const PanelLocationView = ({ ...props }) => {
  // Generic store value setter.
  const {
    activeFeature,
    indicators,
    activeLayers,
    trendData,
  } = useStore(
    state => ({
      activeFeature: state.activeFeature,
      indicators: state.indicators,
      activeLayers: state.activeLayers,
      trendData: state.trendData,
    }),
    shallow,
  )

  console.log(
    'panelLocationView, ',
    indicators,
    // trendData,
    // activeFeature,
  )

  const validTrendRows = !!activeFeature
    ? trendData.filter(
        el =>
          Number(el.GEOID) ===
          Number(activeFeature.properties.GEOID),
      )
    : false
  // console.log('validTrendRows, ', validTrendRows)

  // Stores the index of the selected location's layer
  // for fetching min, max, and mean from indicator arrays.
  const activeLayerIndex = activeLayers.indexOf(1)

  if (!!activeFeature) {
    return (
      <div className={clsx('map-panel-slideout-location')}>
        <div className={clsx('panel-sticky')}>
          <h5>{getGeoFeatureLabel(activeFeature)}</h5>
        </div>
        <DemographicsPanel activeFeature={activeFeature} />
        {/* Indicators */}
        <div className={clsx('panel-indicators')}>
          {indicators
            .filter(el => {
              return el.display === 1
            })
            .filter((el, i) => {
              return (
                el.placeTypes.indexOf(
                  UNTD_LAYERS[
                    getActiveLayerIndex(activeLayers)
                  ].id,
                ) > -1
              )
            })
            .sort((a, b) => {
              return a.order - b.order
            })
            .map(indicator => {
              // console.log('indicator, ', indicator)

              // Set up object to pass to linear scale.
              const rawMetric = {
                min: indicator.raw.min[activeLayerIndex],
                max: indicator.raw.max[activeLayerIndex],
                mean: indicator.raw.mean[activeLayerIndex],
                decimals: indicator.raw.decimals,
                highisgood: indicator.raw.highisgood,
                currency: indicator.raw.currency,
                percent: indicator.raw.percent,
              }

              // Is there a raw value available for the metric on the feature?
              const rawName = indicator.raw.id
              const hasRawValue =
                activeFeature.properties[rawName] &&
                activeFeature.properties[rawName] !==
                  undefined &&
                activeFeature.properties[rawName] !== 'NA'
                  ? activeFeature.properties[rawName]
                  : false

              // Is there an sd value available for the metric on the feature?
              const hasSdValue =
                String(
                  activeFeature.properties[indicator.id],
                ).length > 0 &&
                activeFeature.properties[indicator.id] !==
                  undefined &&
                activeFeature.properties[indicator.id] !==
                  'NA'
                  ? true
                  : false

              // console.log('hasRawValue, ', hasRawValue)
              if (!!hasSdValue || !!hasRawValue) {
                return (
                  <div
                    className={clsx(
                      'indicator-group',
                      `layer-order-${indicator.order}`,
                    )}
                    key={indicator.id}
                  >
                    {/* Metric title and button to switch metrics. */}
                    <IndicatorButton
                      indicator={indicator}
                    />
                    <div
                      className={clsx('charts-subgroup')}
                    >
                      {/* Linear scale */}
                      {!!hasRawValue && !!rawMetric && (
                        <LinearScale
                          indicator={rawMetric}
                          value={hasRawValue}
                        />
                      )}
                      {/* Standard deviation scale */}
                      {!!hasSdValue && (
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
                          min={0}
                          max={4}
                        />
                      )}
                      {/* Check for trend item, display trend chart */}
                      {!!validTrendRows[0][
                        String(rawName).replace('_19', '')
                      ] && (
                        <TrendChart
                          data={validTrendRows}
                          config={indicator.trend}
                        />
                      )}
                    </div>
                  </div>
                )
              } else {
                return ''
              }
            })}
        </div>
        {/* Feedback panel */}
        <FeedbackPanel />
      </div>
    )
  } else {
    return ''
  }
}

export default PanelLocationView
