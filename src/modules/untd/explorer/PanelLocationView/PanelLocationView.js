import React from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'

import useStore from './../store'
import { getGeoFeatureLabel } from './../utils'
import DemographicsPanel from './DemographicsPanel'
import IndicatorSummary from '../Indicators/IndicatorSummary'
import useCategorizedIndicators from '../App/hooks/useCategorizedIndicators'
import styled from 'styled-components'
import PanelHeader from '../../../core/Panel/PanelHeader'
import Panel from '../../../core/Panel/Panel'
import PanelBody from '../../../core/Panel/PanelBody'

const CategoryWrapper = styled.div`
  padding: 0 2rem;
`

const PanelLocationView = ({ ...props }) => {
  // Generic store value setter.
  const {
    activeFeature,
    activeMetric,
    activeLayers,
    trendData,
  } = useStore(
    state => ({
      activeFeature: state.activeFeature,
      activeMetric: state.activeMetric,
      activeLayers: state.activeLayers,
      trendData: state.trendData,
    }),
    shallow,
  )
  const categories = useCategorizedIndicators()

  // early exit if there is no active feature
  if (!activeFeature) return null

  // get trend data for active feature
  const trends = trendData.filter(
    el =>
      Number(el.GEOID) ===
      Number(activeFeature.properties.GEOID),
  )

  // Stores the index of the selected location's layer
  // for fetching min, max, and mean from indicator arrays.
  const activeLayerIndex = activeLayers.indexOf(1)

  const handleActivateIndicator = e => {
    console.log(e)
  }

  return (
    <Panel className="map-panel-slideout-location">
      <PanelHeader>
        <h2 className="gotham18">
          {getGeoFeatureLabel(activeFeature)}
        </h2>
      </PanelHeader>
      <PanelBody>
        <DemographicsPanel activeFeature={activeFeature} />
        <div className={clsx('panel-indicators')}>
          {categories.map(({ name, indicators }) => (
            <CategoryWrapper key={name}>
              <h3 className="gotham16">{name}</h3>
              {indicators.map(indicator => (
                <IndicatorSummary
                  key={indicator.id}
                  indicator={indicator}
                  data={activeFeature.properties}
                  trends={trends}
                  active={activeMetric === indicator.id}
                  onActivate={handleActivateIndicator}
                  activeLayerIndex={activeLayerIndex}
                />
              ))}
            </CategoryWrapper>
          ))}
        </div>
      </PanelBody>
    </Panel>
  )
}

export default PanelLocationView
