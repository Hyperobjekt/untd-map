import React from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'

import useStore from './../store'
import { CoreButton } from './../../../core'
import { getGeoFeatureLabel } from './../utils'

const FeedbackPanel = ({ ...props }) => {
  const { setStoreValues, activeFeature } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      activeFeature: state.activeFeature,
    }),
    shallow,
  )

  const handleFeedback = () => {
    // console.log('handleFeedback')
    setStoreValues({
      showFeedbackModal: true,
      feedbackFeature: activeFeature,
      feedbackAddress: getGeoFeatureLabel(activeFeature),
      feedbackLngLat: [
        activeFeature.properties.INTPTLAT,
        activeFeature.properties.INTPTLON,
      ],
    })
  }

  return (
    <div className={clsx('panel-bottom-sticky')}>
      <h5>
        {i18n.translate(
          `UI_PANEL_LOCATION_FEEDBACK_HEADING`,
        )}
      </h5>
      <CoreButton
        id="button_location_feedback"
        label={i18n.translate(
          `UI_PANEL_LOCATION_FEEDBACK_PROMPT`,
        )}
        onClick={handleFeedback}
        color="link"
        className={clsx('button-panel-location-feedback')}
      >
        {i18n.translate(
          `UI_PANEL_LOCATION_FEEDBACK_PROMPT`,
        )}
      </CoreButton>
    </div>
  )
}

export default FeedbackPanel
