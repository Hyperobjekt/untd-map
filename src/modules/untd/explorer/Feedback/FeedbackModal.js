import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import FeedbackContent from './FeedbackContent'
import useFeedbackPanel from './useFeedbackPanel'

/**
 * Layout sets up the basic layout for the explorer.
 * @param Object children Child elements
 * @param Object props    Props passed from parent
 */
const FeedbackModal = ({ children, ...props }) => {
  const {
    toggleFeedback,
    feedbackState: { show },
  } = useFeedbackPanel()

  return (
    <Modal
      isOpen={show}
      toggle={toggleFeedback}
      className={'feedback-modal'}
      backdrop={true}
      keyboard={true}
      autoFocus={true}
      centered={true}
    >
      <ModalHeader toggle={toggleFeedback}></ModalHeader>
      <ModalBody>
        <FeedbackContent />
      </ModalBody>
    </Modal>
  )
}

FeedbackModal.propTypes = {}

export default FeedbackModal
