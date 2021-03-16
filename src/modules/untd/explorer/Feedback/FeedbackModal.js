import React from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

import useStore from './../store'
import FeedbackContent from './FeedbackContent'

/**
 * Layout sets up the basic layout for the explorer.
 * @param Object children Child elements
 * @param Object props    Props passed from parent
 */
const FeedbackModal = ({ children, ...props }) => {
  // console.log('FeedbackModal')

  const { setStoreValues, showFeedbackModal } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      showFeedbackModal: state.showFeedbackModal,
    }),
    shallow,
  )

  const toggleFeedbackModal = () =>
    setStoreValues({
      showFeedbackModal: !showFeedbackModal,
    })

  /**
   * Navigate to FAQ page.
   */
  const handleGoToFAQ = () => {
    if (!!window) {
      const href = window.location.origin + '/faq/'
      window.location.href = href
    }
  }

  return (
    <Modal
      isOpen={showFeedbackModal}
      toggle={toggleFeedbackModal}
      className={'feedback-modal'}
      backdrop={true}
      keyboard={true}
      autoFocus={true}
      centered={true}
    >
      <ModalHeader
        toggle={toggleFeedbackModal}
      ></ModalHeader>
      <ModalBody>
        <FeedbackContent />
      </ModalBody>
    </Modal>
  )
}

FeedbackModal.propTypes = {}

export default FeedbackModal
