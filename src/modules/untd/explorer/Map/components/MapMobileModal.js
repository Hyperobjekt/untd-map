import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import useStore from './../../store'
import PopupContent from './PopupContent'

/**
 * Layout sets up the basic layout for the explorer.
 * @param Object children Child elements
 * @param Object props    Props passed from parent
 */
const MapMobileModal = ({ children, ...props }) => {
  // Generic state updates for store.
  // Accepts an object of values to update.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Tracks whether or not to display map mobile modal
  const showMapModal = useStore(state => state.showMapModal)
  // Closes modal.
  const toggleMapModal = () => {
    setStoreValues({ showMapModal: !showMapModal })
  }

  return (
    <Modal
      isOpen={props.hoveredFeature && showMapModal}
      toggle={toggleMapModal}
      className={'map-modal'}
      backdrop={true}
      keyboard={true}
      autoFocus={true}
      centered={true}
    >
      <ModalHeader toggle={toggleMapModal}></ModalHeader>
      <ModalBody>
        <PopupContent feature={props.hoveredFeature} />
      </ModalBody>
    </Modal>
  )
}

MapMobileModal.propTypes = {}

export default MapMobileModal
