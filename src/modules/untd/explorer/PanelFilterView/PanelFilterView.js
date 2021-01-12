import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import {
  FiFilter,
  FiMap,
  FiList,
  FiMenu,
} from 'react-icons/fi'
import { MdRefresh } from 'react-icons/md'

import { CoreButton, Select } from './../../../core'
import useStore from './../store.js'
import {
  // CPAL_METRICS,
  // CPAL_FILTER_TABS,
  DEFAULT_CATEGORIES,
} from './../../../../constants/metrics'
import { UNTD_LAYERS } from './../../../../constants/layers'
// import TabSeries from './TabSeries'
import FilterSeries from './FilterSeries'

const PanelFilterView = ({ ...props }) => {
  // Generic state setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Default filter tab
  const defaultFilterTab = useStore(
    state => state.defaultFilterTab,
  )
  // Active filter tab
  const activeFilterTab = useStore(
    state => state.activeFilterTab,
  )
  // Default metric
  const defaultMetric = useStore(
    state => state.defaultMetric,
  )
  // Active metric
  const activeMetric = useStore(state => state.activeMetric)
  // Active layers
  const activeLayers = useStore(state => state.activeLayers)
  // Indicators
  const indicators = useStore(state => state.indicators)

  // Generate tabs for every metric with tab_level set to 0
  const tabs = []
  indicators.forEach(el => {
    if (el.tab_level === 0) {
      tabs.push(el.id)
    }
  })

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

  /** Process select items for tabs **/
  const selectItems = []
  DEFAULT_CATEGORIES.forEach(el => {
    // const item = indicators.find(i => {
    //   return i.id === el
    // })
    selectItems.push({
      id: el.id,
      label: el.title, // getTabTitle(item.tab),
      active: el.id === activeFilterTab ? true : false,
    })
  })

  const handleSelect = e => {
    // console.log('category selected, ', e.currentTarget.id)
    // const tabId = indicators.find(i => {
    //   return i.id === e.currentTarget.id
    // }).tab
    const tabId = e.currentTarget.id
    // const default_metric = DEFAULT_CATEGORIES.find(
    //   el => el.id === tabId,
    // ).default_metric
    // console.log('default_metric, ', default_metric)
    setStoreValues({
      activeFilterTab: tabId,
      // activeMetric: default_metric, // TODO: Set metric using first indicator in tab list.
      activeQuintiles: [1, 1, 1, 1, 1],
    })
  }

  const handleResetClick = () => {
    // console.log('handleResetClick()')
    setStoreValues({
      activeFilterTab: defaultFilterTab,
      activeMetric: defaultMetric,
      activeQuintiles: [1, 1, 1, 1, 1],
    })
  }

  const getSelectLabel = () => {
    // console.log('getSelectLabel')
    const tab = DEFAULT_CATEGORIES.find(
      el => el.id === activeFilterTab,
    )
    // console.log('tab, ', tab)
    return tab ? i18n.translate(tab.title) : null
  }

  return (
    <div
      className={clsx(
        'map-panel-slideout-filters',
        activeFilterTab
          ? 'active-tab-' + activeFilterTab
          : 'active-tab-default',
      )}
    >
      <h3>{i18n.translate('UI_MAP_PANEL_HEADING')}</h3>
      <div
        className="map-panel-instructions"
        dangerouslySetInnerHTML={{
          __html: i18n.translate(
            'UI_MAP_FILTER_INSTRUCTIONS_UNTD',
            {
              shapeType: i18n.translate(
                String(
                  `UI_MAP_LAYERS_${getLayerId()}`,
                ).toUpperCase(),
              ),
            },
          ),
        }}
      ></div>
      <div className="filters-panel-parent">
        <FilterSeries tab={'cri'} metrics={indicators} />
      </div>
    </div>
  )
}

export default PanelFilterView
