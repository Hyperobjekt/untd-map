import React, { useEffect, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { MdClose } from 'react-icons/md'

import useStore from './../store.js'
import PanelFilterView from './../PanelFilterView/PanelFilterView'
import PanelLayersView from './../PanelLayersView/PanelLayersView'
import PanelInfoView from './../PanelInfoView/PanelInfoView'
import PanelLocationView from './../PanelLocationView'
import { CoreButton } from './../../../core'
import { setFocus } from '../utils.js'

const SlideoutPanel = ({ ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const slideoutPanel = useStore(
    state => state.slideoutPanel,
  )
  const activePanel =
    slideoutPanel.active && slideoutPanel.panel

  const handleLocationClose = event => {
    // clear active location when closing panel
    handleClose(event, { activeFeature: 0 })
  }

  const handleClose = (event, stateChanges = {}) => {
    // Set focus on the clicked button.
    const panelBtnId = '#button_toggle_panel_' + activePanel
    setFocus(panelBtnId)
    // Update store.
    setStoreValues({
      slideoutPanel: { ...slideoutPanel, active: false },
      ...stateChanges,
    })
  }

  const isPanelOpen = panelId =>
    activePanel === panelId && slideoutPanel.active

  // set focus to first button in panel when it opens
  useLayoutEffect(() => {
    if (activePanel) setFocus(`#panel_${activePanel}`)
  }, [activePanel])

  return (
    <div className="map-panel-slideout">
      <PanelFilterView
        id="panel_filters"
        tabindex="-1"
        open={isPanelOpen('filters')}
        onClose={handleClose}
      />
      <PanelLayersView
        id="panel_layers"
        tabindex="-1"
        open={isPanelOpen('layers')}
        onClose={handleClose}
      />
      <PanelLocationView
        id="panel_location"
        tabindex="-1"
        open={isPanelOpen('location')}
        onClose={handleLocationClose}
      />
      <PanelInfoView
        id="panel_info"
        tabindex="-1"
        open={isPanelOpen('info')}
        onClose={handleClose}
      />
    </div>
  )
}

export default SlideoutPanel
