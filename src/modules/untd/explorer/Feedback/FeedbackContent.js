import React from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'

import useStore from './../store'
import clsx from 'clsx'

/**
 * Layout sets up the basic layout for the explorer.
 * @param Object children Child elements
 * @param Object props    Props passed from parent
 */
const FeedbackContent = ({ children, ...props }) => {
  // console.log('FeedbackContent')

  const { setStoreValues, feedbackFeature } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      feedbackFeature: state.feedbackFeature,
    }),
    shallow,
  )

  // If there's a feedback feature, pre-populate with
  // the information for that feature.

  // Hidden input for lat lng
  // Hidden honeypot

  return (
    <div className={clsx('feedback-content')}>
      <h2>{i18n.translate(`FEEDBACK_HEADING`)}</h2>
      <p>
        {!!feedbackFeature
          ? i18n.translate(`FEEDBACK_INSTR_WITHFEATURE`)
          : i18n.translate(`FEEDBACK_INSTR`)}
      </p>
      <button>Use my current location</button>
      <p>search for a map feature</p>
      <p>Enter an address</p>
      <p>Firstname</p>
      <p>Lastname</p>
      <p>email</p>
      <p>Feedback</p>
    </div>
  )
}

FeedbackContent.propTypes = {}

export default FeedbackContent
