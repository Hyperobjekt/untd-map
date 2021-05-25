import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import shallow from 'zustand/shallow'

import useStore from './../store.js'
import { UNTD_LAYERS } from './../../../../constants/layers'
import FilterSeries from './FilterSeries'
import { ButtonGroup, Button } from 'reactstrap'
import Panel from '../../../core/Panel/Panel.js'
import PanelHeader from '../../../core/Panel/PanelHeader.js'
import PanelBody from '../../../core/Panel/PanelBody.js'

const PanelFilterView = ({ onClose, ...props }) => {
  // Generic state setter.
  const [setStoreValues, activeLayers] = useStore(
    state => [state.setStoreValues, state.activeLayers],
    shallow,
  )

  const handleSelect = e => {
    // console.log('layer selected, ', e.currentTarget.id)
    const layerIndex = UNTD_LAYERS.findIndex(
      layer => layer.id === e.currentTarget.value,
    )
    setStoreValues({
      activeLayers: activeLayers.map((layer, index) =>
        index === layerIndex ? 1 : 0,
      ),
    })
  }

  return (
    <Panel
      className="map-panel-slideout-filters"
      {...props}
    >
      <PanelHeader
        onClose={onClose}
        className="flex-column align-items-start"
      >
        <h2 className="gotham18">
          {i18n.translate('UI_MAP_PANEL_HEADING')}
        </h2>
        <label
          htmlFor="geographyGroup"
          className="map-panel-instructions mt-3"
        >
          {i18n.translate(
            'UI_MAP_FILTER_INSTRUCTIONS_UNTD',
          )}
        </label>
        <ButtonGroup id="geographyGroup">
          {UNTD_LAYERS.map((el, i) => (
            <Button
              color="outlined"
              value={el.id}
              active={activeLayers[i] === 1}
              onClick={handleSelect}
            >
              {i18n.translate(el.label)}
            </Button>
          ))}
        </ButtonGroup>
      </PanelHeader>
      <PanelBody>
        <FilterSeries />
      </PanelBody>
    </Panel>
  )
}

export default PanelFilterView
