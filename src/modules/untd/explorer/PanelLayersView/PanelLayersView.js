import React, { useState } from 'react'
import i18n from '@pureartisan/simple-i18n'
import { Button } from 'reactstrap'
import PointLayerCategory from './PointLayerCategory'
import MapLayerToggle from './MapLayerToggle'
import Panel from '../../../core/Panel/Panel'
import PanelHeader from '../../../core/Panel/PanelHeader'
import PanelBody from '../../../core/Panel/PanelBody'
import usePointLayers from './usePointLayers'

const PanelLayersView = ({ onClose, ...props }) => {
  const {
    pointLayers,
    resetAll,
    togglePointLayer,
  } = usePointLayers()

  if (!pointLayers) return null
  return (
    <Panel
      className="map-panel-slideout-layers tour-desk-8"
      {...props}
    >
      <PanelHeader onClose={onClose}>
        <h2 className="gotham18">
          {i18n.translate(`UI_MAP_POINTS_OVERLAYS`)}
        </h2>
        <Button
          onClick={resetAll}
          color="outlined"
          className="knockout12"
        >
          {i18n.translate('BUTTON_RESET_POINTS')}
        </Button>
      </PanelHeader>
      <PanelBody>
        <div className="points-group-parent">
          <h3 className="gotham16">
            {i18n.translate(`UI_MAP_POINTS`)}
          </h3>
          <div
            className="gotham14 grey2 mt-4 mb-4"
            dangerouslySetInnerHTML={{
              __html: i18n.translate(`UI_MAP_LAYER_1_DESC`),
            }}
          ></div>
          <div className="layer-group">
            {pointLayers.map((cat, i) => (
              <PointLayerCategory
                key={cat.id}
                defaultOpen={i === 0}
                {...cat}
                onChange={togglePointLayer}
              />
            ))}
          </div>
        </div>
        <hr />
        <div className="map-static-layer-toggle">
          <h3 className="gotham16">
            {i18n.translate(`UI_MAP_LAYERS_STATIC_TITLE`)}
          </h3>
          <div
            className="gotham14 grey2 mt-4 mb-4"
            dangerouslySetInnerHTML={{
              __html: i18n.translate(
                `UI_MAP_LAYER_STATIC_DESC`,
              ),
            }}
          ></div>
          <MapLayerToggle />
        </div>
      </PanelBody>
    </Panel>
  )
}

export default PanelLayersView
