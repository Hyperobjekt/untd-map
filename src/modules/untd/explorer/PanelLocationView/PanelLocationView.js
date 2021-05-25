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
import useActiveMetric from '../App/hooks/useActiveMetric'
import styled from 'styled-components'
import PanelHeader from '../../../core/Panel/PanelHeader'
import Panel from '../../../core/Panel/Panel'
import PanelBody from '../../../core/Panel/PanelBody'

const PanelLocationView = ({ open, onClose, ...props }) => {
  // Generic store value setter.
  const {
    activeFeature,
    activeLayers,
    trendData,
  } = useStore(
    state => ({
      activeFeature: state.activeFeature,
      activeLayers: state.activeLayers,
      trendData: state.trendData,
    }),
    shallow,
  )
  const [activeMetric, setActiveMetric] = useActiveMetric()
  const categories = useCategorizedIndicators()

  // component is ready to render if there is an active feature
  const isReady = Boolean(activeFeature)

  // get trend data for active feature
  const trends = trendData.filter(
    el =>
      Number(el.GEOID) ===
      Number(activeFeature?.properties?.GEOID),
  )

  // Stores the index of the selected location's layer
  // for fetching min, max, and mean from indicator arrays.
  const activeLayerIndex = activeLayers.indexOf(1)

  const handleActivateIndicator = indicator => {
    console.log('active', activeMetric, indicator.id)
    setActiveMetric(indicator.id)
  }

  return (
    <Panel
      className="map-panel-slideout-location"
      open={open && isReady}
      {...props}
    >
      <PanelHeader onClose={onClose}>
        <h2 className="gotham18">
          {getGeoFeatureLabel(activeFeature)}
        </h2>
      </PanelHeader>
      {activeFeature && (
        <PanelBody>
          <DemographicsPanel
            className="p-4"
            activeFeature={activeFeature}
          />
          {categories.map(({ name, indicators }) => (
            <div className="p-4 border-top" key={name}>
              <h3 className="gotham16 mb-3">{name}</h3>
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
            </div>
          ))}
        </PanelBody>
      )}
    </Panel>
  )
}

export default PanelLocationView
