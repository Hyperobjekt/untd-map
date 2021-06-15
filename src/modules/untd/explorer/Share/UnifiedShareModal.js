/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { useEffect, useState } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap'
import i18n from '@pureartisan/simple-i18n'
import { FaCopy } from 'react-icons/fa'
import copy from 'copy-to-clipboard'

import useStore from './../store'
import TwitterShareBtn from './TwitterShareBtn'
import FacebookShareBtn from './FacebookShareBtn'
import MailShareBtn from './MailShareBtn'
import clsx from 'clsx'

const UnifiedShareModal = ({ className, ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const unifiedShareModal = useStore(
    state => state.unifiedShareModal,
  )
  const toggle = () => {
    setStoreValues({
      unifiedShareModal: !unifiedShareModal,
    })
  }
  const defaultRoute = useStore(state => state.defaultRoute)
  const shareHash = useStore(state => state.shareHash)
  const eventShareLink = useStore(
    state => state.eventShareLink,
  )

  const onCopy = () => {
    // console.log('oncopy')
    copy(location)
    setStoreValues({
      eventShareLink: eventShareLink + 1,
    })
  }

  // Update value for share link only when window object exists.
  const [shareLinkValue, setShareLinkValue] = useState('')
  useEffect(() => {
    setShareLinkValue(
      !!shareHash
        ? window.location.origin +
            window.location.pathname +
            shareHash
        : window.location.origin +
            window.location.pathname +
            defaultRoute,
    )
  }, [shareHash])

  return (
    <div>
      <Modal
        isOpen={!!unifiedShareModal}
        toggle={toggle}
        className={clsx(className, 'bs-expl')}
        backdrop={true}
        keyboard={true}
        autoFocus={true}
        centered={true}
      >
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <h3>{i18n.translate('MODAL_SHARE_LINK_HEAD')}</h3>
          <TwitterShareBtn />
          <FacebookShareBtn />
          <MailShareBtn />

          <div className={clsx('input-group-parent')}>
            <p>
              {i18n.translate('MODAL_SHARE_LINK_INSTR')}
            </p>
            <label id="share_input_label">
              {i18n.translate('MODAL_SHARE_LINK_INPUT')}
            </label>
            <InputGroup>
              <Input
                value={shareLinkValue}
                readOnly={true}
                aria-labelledby={'share_input_label'}
              />
              <InputGroupAddon addonType="append">
                <Button color="secondary" onClick={onCopy}>
                  <FaCopy />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default UnifiedShareModal
