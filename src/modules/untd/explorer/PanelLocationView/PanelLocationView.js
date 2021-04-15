import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { FiInfo } from 'react-icons/fi'
import { Tooltip } from 'reactstrap'

import useStore from './../store'
import { CoreButton } from './../../../core'
import {
  getGeoFeatureLabel,
  setActiveQuintile,
  getActiveLayerIndex,
  getRoundedValue,
} from './../utils'
import NonInteractiveScale from './../NonInteractiveScale'
import LinearScale from './../LinearScale'
import TrendChart from './TrendChart'
import { CRI_COLORS } from './../../../../constants/colors'
import { UNTD_LAYERS } from './../../../../constants/layers'

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
    activeLayers,
    trendData,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      activeFeature: state.activeFeature,
      indicators: state.indicators,
      interactionsMobile: state.interactionsMobile,
      allData: state.allData,
      activeLayers: state.activeLayers,
      trendData: state.trendData,
    }),
    shallow,
  )

  console.log(
    'panelLocationView, ',
    indicators,
    trendData,
    activeFeature,
  )

  const validTrendRows = !!activeFeature
    ? trendData.filter(
        el =>
          Number(el.GEOID) ===
          Number(activeFeature.properties.GEOID),
      )
    : false
  console.log('validTrendRows, ', validTrendRows)

  // Stores the index of the selected location's layer
  // for fetching min, max, and mean from indicator arrays.
  const activeLayerIndex = activeLayers.indexOf(1)

  const handleFeedback = () => {
    console.log('handleFeedback')
    setStoreValues({
      showFeedbackModal: true,
      feedbackFeature: activeFeature,
      feedbackAddress: getGeoFeatureLabel(activeFeature),
      feedbackLngLat: [
        activeFeature.properties.INTPTLAT,
        activeFeature.properties.INTPTLON,
      ],
    })
  }

  if (!!activeFeature) {
    const demographics = Object.keys(
      activeFeature.properties,
    )
      .filter(el => {
        return (
          el.indexOf('_sd') < 0 && el.indexOf('popE') > -1
        )
      })
      .map(el => {
        return {
          id: el,
          value: activeFeature.properties[el],
        }
      })
    const demoTotal = demographics.find(
      el => el.id.indexOf('tot') > -1,
    )
    // console.log('demographics, ', demographics)
    return (
      <div className={clsx('map-panel-slideout-location')}>
        <div className={clsx('panel-sticky')}>
          <h5>{getGeoFeatureLabel(activeFeature)}</h5>
        </div>
        {/* Demographics */}
        <div className={clsx('panel-demographics')}>
          <h6>{i18n.translate(`PANEL_LOCATION_DEMO`)}</h6>
          <div
            className={clsx(
              'demo-total-group',
              'demo-group',
            )}
          >
            <span className={clsx('demo-label')}>
              {i18n.translate(demoTotal.id)}
            </span>
            {`: `}
            <span className={clsx('demo-value')}>
              {getRoundedValue(demoTotal.value)}
            </span>
          </div>
          {demographics
            .filter(el => el.id.indexOf('tot') < 0)
            .sort((a, b) => b.value - a.value)
            .map(d => (
              <div
                className={clsx('demo-group')}
                key={`demo-${d.id}`}
              >
                <span className={clsx('demo-label')}>
                  {i18n.translate(d.id)}
                </span>
                {`: `}
                <span className={clsx('demo-value')}>
                  {getRoundedValue(d.value)}
                </span>
              </div>
            ))}
        </div>
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
              const rawMetric = allData.find(d => {
                return (
                  d.variable ===
                  indicator.id.replace('_sd', '')
                )
              })
              // console.log('rawMetric: ', rawMetric)
              const sdMetric = allData.find(d => {
                return d.variable === indicator.id
              })
              // const valueLabel = i18n.translate(
              //   rawMetric.variable,
              // )
              // Min, max, and mean are calculated and stored in the indicator
              rawMetric.min =
                indicator.min[activeLayerIndex]
              rawMetric.max =
                indicator.max[activeLayerIndex]
              rawMetric.mean =
                indicator.mean[activeLayerIndex]
              rawMetric.decimals =
                indicator.decimals[activeLayerIndex]
              // const high_is_good = rawMetric.highisgood
              const rawName = String(indicator.id).replace(
                '_sd',
                '',
              )
              // console.log('rawMetric, ', rawMetric)
              // Is there a raw value available for the metric on the feature?
              const rawValue =
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
              // console.log('rawValue, ', rawValue)
              if (!!hasSdValue || !!rawValue) {
                return (
                  <div
                    className={clsx(
                      'indicator-group',
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
                    {!!rawValue && !!rawMetric && (
                      <LinearScale
                        indicator={rawMetric}
                        value={rawValue}
                      />
                    )}
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
                        min={sdMetric.min}
                        max={sdMetric.max}
                      />
                    )}
                    {/* Check for trend item */}
                    {!!validTrendRows[0][
                      String(rawName).replace('_19', '')
                    ] && (
                      <TrendChart
                        data={validTrendRows}
                        metric={String(rawName).replace(
                          '_19',
                          '',
                        )}
                      />
                    )}
                  </div>
                )
              } else {
                return ''
              }
            })}
        </div>
        {/* Feedback panel */}
        <div className={clsx('panel-bottom-sticky')}>
          <h5>
            {i18n.translate(
              `UI_PANEL_LOCATION_FEEDBACK_HEADING`,
            )}
          </h5>
          <CoreButton
            id="button_location_feedback"
            label={i18n.translate(
              `UI_PANEL_LOCATION_FEEDBACK_PROMPT`,
            )}
            onClick={handleFeedback}
            color="link"
            className={clsx(
              'button-panel-location-feedback',
            )}
          >
            {i18n.translate(
              `UI_PANEL_LOCATION_FEEDBACK_PROMPT`,
            )}
          </CoreButton>
        </div>
      </div>
    )
  } else {
    return ''
  }
}

export default PanelLocationView
