import React, { useEffect } from 'react'
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

const SlideoutPanel = ({ ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const slideoutPanel = useStore(
    state => state.slideoutPanel,
  )

  const handleClose = () => {
    // Set focus on the clicked button.
    const panelBtnId =
      'button_toggle_panel_' + slideoutPanel.panel
    const panelBtn = document.getElementById(panelBtnId)
    panelBtn.focus()
    // Update store.
    setStoreValues({
      slideoutPanel: { ...slideoutPanel, active: false },
    })
  }

  const isPanelOpen = panelId =>
    slideoutPanel.panel === panelId && slideoutPanel.active

  return (
    <div className="map-panel-slideout">
      <PanelFilterView
        open={isPanelOpen('filters')}
        onClose={handleClose}
      />
      <PanelLayersView
        open={isPanelOpen('layers')}
        onClose={handleClose}
      />
      <PanelLocationView
        open={isPanelOpen('location')}
        onClose={handleClose}
      />
      <PanelInfoView
        open={isPanelOpen('info')}
        onClose={handleClose}
      />
    </div>
  )
}

export default SlideoutPanel
