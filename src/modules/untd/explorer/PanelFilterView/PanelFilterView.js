import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { css, cx } from 'emotion'
import {
  FiFilter,
  FiMap,
  FiList,
  FiMenu,
} from 'react-icons/fi'
import { MdRefresh } from 'react-icons/md'

import { CoreButton, Select } from './../../../core'
import useStore from './../store.js'
import { UNTD_LAYERS } from './../../../../constants/layers'
import FilterSeries from './FilterSeries'
import { toSentenceCase } from './../utils'

const PanelFilterView = ({ ...props }) => {
  // Generic state setter.
  const {
    setStoreValues,
    defaultMetric,
    activeMetric,
    activeLayers,
    indicators,
  } = useStore(state => ({
    setStoreValues: state.setStoreValues,
    defaultMetric: state.defaultMetric,
    activeMetric: state.activeMetric,
    activeLayers: state.activeLayers,
    indicators: state.indicators,
  }))

  const getLayerId = () => {
    let layer = ''
    for (var i = 1; i < 4; i++) {
      if (activeLayers[i] === 1) {
        layer = UNTD_LAYERS[i].id
      }
      break
    }
    return layer
  }

  const handleSelect = e => {
    // console.log('layer selected, ', e.currentTarget.id)
    const layerId = e.currentTarget.id
    const layerIndex = UNTD_LAYERS.map(function (el) {
      return el.id
    }).indexOf(layerId)
    const layersCopy = activeLayers.slice().map(el => {
      return 0
    })
    layersCopy[layerIndex] = 1
    // console.log('layersCopy, ', layersCopy)
    setStoreValues({
      activeLayers: layersCopy,
      // activeMetric: default_metric, // TODO: Set metric using first indicator in tab list.
      activeQuintiles: [1, 1, 1, 1, 1],
    })
  }

  const handleResetClick = () => {
    // console.log('handleResetClick()')
    setStoreValues({
      // activeFilterTab: defaultFilterTab,
      activeMetric: defaultMetric,
      activeQuintiles: [1, 1, 1, 1, 1],
    })
  }

  const getActiveLayerTitle = () => {
    // Return the title of the active layer.
    const activeLayerIndex = activeLayers.indexOf(1)
    return toSentenceCase(
      i18n.translate(UNTD_LAYERS[activeLayerIndex].label),
    )
  }

  return (
    <div className={clsx('map-panel-slideout-filters')}>
      <h3>{i18n.translate('UI_MAP_PANEL_HEADING')}</h3>
      <div
        className="map-panel-instructions"
        dangerouslySetInnerHTML={{
          __html: i18n.translate(
            'UI_MAP_FILTER_INSTRUCTIONS_UNTD',
          ),
        }}
      ></div>
      <Select
        items={UNTD_LAYERS.map((el, i) => {
          return {
            id: el.id,
            label: el.label,
            active: activeLayers[i] === 1,
          }
        })}
        label={
          getActiveLayerTitle()
            ? getActiveLayerTitle()
            : i18n.translate('MAP_FILTERS_SELECT_LAYER')
        }
        handleSelect={handleSelect}
      />
      <div className={clsx('filters-panel-parent')}>
        <FilterSeries />
      </div>
    </div>
  )
}

export default PanelFilterView
