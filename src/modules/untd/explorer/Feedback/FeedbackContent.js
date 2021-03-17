import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { MdMyLocation } from 'react-icons/md'
import { Input, Spinner } from 'reactstrap'

import useStore from './../store'
import { CoreButton } from './../../../core'
import { GeocodeSearch } from './../GeocodeSearch'

/**
 * Layout sets up the basic layout for the explorer.
 * @param Object children Child elements
 * @param Object props    Props passed from parent
 */
const FeedbackContent = ({ children, ...props }) => {
  // console.log('FeedbackContent')

  const {
    setStoreValues,
    feedbackFeature,
    feedbackAddress,
    feedbackLatLng,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      feedbackFeature: state.feedbackFeature,
      feedbackAddress: state.feedbackAddress,
      feedbackLatLng: state.feedbackLatLng,
    }),
    shallow,
  )

  // If there's a feedback feature, pre-populate with
  // the information for that feature.

  // Hidden input for lat lng
  // Hidden honeypot

  const [position, setPosition] = useState(null)

  useEffect(() => {
    // Store the user's location when the app loads, to save time.
    if (
      'geolocation' in navigator &&
      navigator.permissions &&
      navigator.permissions.query({ name: 'geolocation' })
    ) {
      // console.log('loaded. setting position.')
      navigator.geolocation.getCurrentPosition(
        position => {
          setPosition(position)
        },
        error => {
          setPosition(false)
        },
      )
    }
  }, [])

  /**
   * Submit the form to netlify forms
   */
  const submitForm = () => {}

  const useCurrentLocation = () => {
    console.log('useCurrentLocation(), ', position)
    // Get current location from coords.
    const path = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
      position.coords.longitude
    },${position.coords.latitude}.json?access_token=${
      process.env.GATSBY_MAPBOX_API_TOKEN
    }&types=address,poi&cachebuster=${Math.floor(
      Date.now(),
    )}`
    // Get request for autosuggest results.
    fetch(path)
      .then(r => r.json())
      .then(json => {
        console.log('response, ', json)
        // setSuggestions(json.features)
        const addresses = json.features.filter(
          el =>
            el.place_type.indexOf('address') > -1 ||
            el.place_type.indexOf('poi') > -1,
        )
        setStoreValues({
          feedbackLatLng: [
            position.coords.latitude,
            position.coords.longitude,
          ],
          feedbackAddress: addresses[0].place_name,
        })
      })
  }

  return (
    <div className={clsx('feedback-content')}>
      <h2>{i18n.translate(`FEEDBACK_HEADING`)}</h2>
      <p>
        {!!feedbackFeature
          ? i18n.translate(`FEEDBACK_INSTR_WITHFEATURE`)
          : i18n.translate(`FEEDBACK_INSTR`)}
      </p>
      {!!position && (
        <CoreButton
          id="button_use_current_loc"
          label={i18n.translate(`FEEDBACK_USE_CURRENT_LOC`)}
          onClick={useCurrentLocation}
          color="none"
          className={clsx('feedback-use-my')}
        >
          <MdMyLocation />
          {i18n.translate(`FEEDBACK_USE_CURRENT_LOC`)}
        </CoreButton>
      )}
      <GeocodeSearch context="feedback" />
      <label>
        Address
        <Input
          id="address"
          value={feedbackAddress}
          type="text"
        />
      </label>
      <label>
        Firstname
        <Input id="firstname" type="text" />
      </label>
      <label>
        Lastname
        <Input id="lastname" type="text" />
      </label>
      <label>
        Email
        <Input id="email" type="text" />
      </label>
      <label>
        Feedback
        <Input id="feedback" type="textarea" />
      </label>
      <CoreButton
        id="button_use_current_loc"
        label={i18n.translate(`FEEDBACK_SUBMIT`)}
        onClick={useCurrentLocation}
        color="none"
        className={clsx('feedback-use-my')}
      >
        {i18n.translate(`FEEDBACK_SUBMIT`)}
        <Spinner color="primary" />
      </CoreButton>
    </div>
  )
}

FeedbackContent.propTypes = {}

export default FeedbackContent
