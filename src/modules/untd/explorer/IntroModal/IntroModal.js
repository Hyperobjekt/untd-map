import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { FiMap } from 'react-icons/fi'

import useStore from './../store'
import { CoreButton, TourIcon } from './../../../core'
import { GeocodeSearch } from './../GeocodeSearch'

/**
 * Layout sets up the basic layout for the explorer.
 * @param Object children Child elements
 * @param Object props    Props passed from parent
 */
const IntroModal = ({ children, ...props }) => {
  // console.log('introModal')

  const {
    setStoreValues,
    showIntroModal,
    enableTour,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      showIntroModal: state.showIntroModal,
      enableTour: state.enableTour,
    }),
    shallow,
  )

  const toggleIntroModal = () =>
    setStoreValues({ showIntroModal: !showIntroModal })

  /**
   * Close the intro panel and start the tour
   */
  const handleStartTour = () => {
    // console.log('handleStartTour()')
    toggleIntroModal()
    setStoreValues({ runTour: true })
  }

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
      isOpen={showIntroModal}
      toggle={toggleIntroModal}
      className="intro-modal bs-expl"
      backdrop={true}
      keyboard={true}
      autoFocus={true}
      centered={true}
    >
      <ModalHeader toggle={toggleIntroModal}></ModalHeader>
      <ModalBody>
        <h2>
          <div className={clsx('site-title')}>
            {i18n.translate('SITE_TITLE')}
          </div>
          <div
            className={clsx('cpal-logo')}
            role="image"
            aria-label="CPAL logo"
          ></div>
          <div className="logo"></div>
        </h2>
        <p>{i18n.translate('UI_MAP_INTRO_MODAL_INTRO')}</p>
        {!!enableTour && (
          <div className="intro-modal-option">
            <p className="cta">
              {i18n.translate('UI_MAP_INTRO_MODAL_TOUR')}
            </p>
            <CoreButton
              color="light"
              label={i18n.translate(
                'UI_MAP_INTRO_MODAL_TOUR_BTN',
              )}
              onClick={handleStartTour}
            >
              <TourIcon />
              {i18n.translate(
                'UI_MAP_INTRO_MODAL_TOUR_BTN',
              )}
            </CoreButton>
          </div>
        )}
        <div className="intro-modal-option">
          <p className="cta">
            {i18n.translate('UI_MAP_INTRO_MODAL_SEARCH')}
          </p>
          <GeocodeSearch />
        </div>
        {/*
        <div className="intro-modal-option">
          <p className="cta">
            {i18n.translate('UI_MAP_INTRO_MODAL_FAQ')}
          </p>
          <CoreButton
            color="light"
            label={i18n.translate('UI_MAP_INTRO_MODAL_FAQ')}
            onClick={handleGoToFAQ}
          >
            <FaQuestion />
            {i18n.translate('UI_MAP_INTRO_MODAL_FAQ_BTN')}
          </CoreButton>
        </div>
        */}
        <div className="intro-modal-option">
          <p className="cta">
            {i18n.translate('UI_MAP_INTRO_MODAL_MAP')}
          </p>
          <CoreButton
            color="light"
            label={i18n.translate(
              'UI_MAP_INTRO_MODAL_MAP_BTN',
            )}
            onClick={toggleIntroModal}
          >
            <FiMap />
            {i18n.translate('UI_MAP_INTRO_MODAL_MAP_BTN')}
          </CoreButton>
        </div>
      </ModalBody>
    </Modal>
  )
}

IntroModal.propTypes = {}

export default IntroModal
