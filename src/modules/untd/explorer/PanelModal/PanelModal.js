import React from 'react'
import clsx from 'clsx'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import useStore from './../store'
import PanelFilterView from './../PanelFilterView/PanelFilterView'
import PanelLayersView from './../PanelLayersView/PanelLayersView'
import PanelInfoView from './../PanelInfoView/PanelInfoView'

const PanelModal = ({ children, ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Track and update intro modal display
  const showPanelModal = useStore(
    state => state.showPanelModal,
  )
  // Toggle panel modal display state.
  const togglePanelModal = () => {
    setStoreValues({ showPanelModal: !showPanelModal })
  }

  const slideoutPanel = useStore(
    state => state.slideoutPanel,
  )
  return (
    <Modal
      isOpen={showPanelModal}
      toggle={togglePanelModal}
      className={clsx(
        'panel-modal',
        slideoutPanel.panel.length > 0
          ? 'panel-view-' + slideoutPanel.panel
          : 'panel-view-none',
      )}
      backdrop={true}
      keyboard={true}
      autoFocus={true}
      centered={true}
      height={'65vh'}
      width={'90%'}
    >
      <ModalHeader toggle={togglePanelModal}></ModalHeader>
      <ModalBody>
        <PanelFilterView />
        <PanelLayersView />
        <PanelInfoView />
      </ModalBody>
    </Modal>
  )
}

PanelModal.propTypes = {}

export default PanelModal
