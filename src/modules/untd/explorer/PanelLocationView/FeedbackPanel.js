import React from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import useStore from './../store'
import { CoreButton } from './../../../core'
import useFeedbackPanel from '../Feedback/useFeedbackPanel'

const FeedbackPanel = ({ ...props }) => {
  const activeFeature = useStore(
    state => state.activeFeature,
  )

  const { showFeedbackForRegion } = useFeedbackPanel()

  const handleFeedback = () =>
    showFeedbackForRegion(activeFeature)

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
