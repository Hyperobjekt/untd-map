import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { MdMyLocation } from 'react-icons/md'
import { Input, Spinner } from 'reactstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'

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

  // Pass the useFormik() hook initial form values and a submit function that will
  // be called when the form is submitted
  const honeypotRef = useRef(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmittedError, setIsSubmittedError] = useState(
    false,
  )
  const encode = data => {
    return Object.keys(data)
      .map(
        key =>
          encodeURIComponent(key) +
          '=' +
          encodeURIComponent(data[key]),
      )
      .join('&')
  }
  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      subject: '',
      message: '',
      signup: false,
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastname: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      subject: Yup.string().required('Required'),
      message: Yup.string().required('Required'),
      signup: Yup.boolean(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      // console.log('onSubmit()', values)
      // For testing form funct locally.
      // setTimeout(() => {
      //   alert(JSON.stringify(values, null, 2));
      //   formik.setSubmitting(false);
      //   // If submission succeeds.
      //   setIsSubmitted(true);
      //   // If submission fails.
      //   // setIsSubmittedError(true);
      // }, 1400);

      values.address = feedbackAddress

      // detect spam with honeypot
      if (honeypotRef.current.value !== '') return

      // Use Netlify forms processing.
      fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
        },
        body: encode({
          'form-name': 'map_feedback',
          ...values,
        }),
      })
        .then(() => {
          console.log('Form submission success!')
          // Turn off submitting state.
          formik.setSubmitting(false)
          // Enable display of submission success message.
          setIsSubmitted(true)
          // Clear form fields
          formik.resetForm()
        })
        .catch(error => {
          // Catch submission errors.
          console.log('Submission error:', error)
          // Turn off submitting state.
          formik.setSubmitting(false)
          // Enable display of submission error message.
          setIsSubmittedError(true)
        })

      const { email, signup } = values

      if (signup) {
        fetch('/.netlify/functions/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email }),
        })
          .then(res => res.text())
          .then(text => {
            console.log('Signup success!', text)
          })
          .catch(error => {
            // Catch submission errors.
            console.log('Signup error:', error)
            setIsSubmittedError(true)
          })
      }

      // e.preventDefault();
    },
  })

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
      <form
        name="map_feedback"
        method="POST"
        onSubmit={formik.handleSubmit}
        className={
          formik.isSubmitting
            ? 'submitting'
            : 'not-submitting'
        }
        netlify-honeypot="bot-field"
        data-netlify="true"
      >
        <input
          type="hidden"
          name="form-name"
          value="map_feedback"
        />

        <p
          className="hidden"
          style={{ visibility: 'hidden', height: 0 }}
        >
          <label>
            Don’t fill this out if you're human:{' '}
            <input name="bot-field" ref={honeypotRef} />
          </label>
        </p>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <Input
            id="address"
            value={feedbackAddress}
            type="text"
            readOnly={true}
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            className={`form-control ${
              formik.touched.firstname &&
              formik.errors.firstname
                ? 'is-invalid'
                : ''
            } ${
              formik.touched.firstname &&
              !formik.errors.firstname
                ? 'is-valid'
                : ''
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstname}
          />
          {formik.touched.firstname &&
          formik.errors.firstname ? (
            <div className="invalid-feedback">
              {formik.errors.firstname}
            </div>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            className={`form-control ${
              formik.touched.lastname &&
              formik.errors.lastname
                ? 'is-invalid'
                : ''
            } ${
              formik.touched.lastname &&
              !formik.errors.lastname
                ? 'is-valid'
                : ''
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastname}
          />
          {formik.touched.lastname &&
          formik.errors.lastname ? (
            <div className="invalid-feedback">
              {formik.errors.lastname}
            </div>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${
              formik.touched.email && formik.errors.email
                ? 'is-invalid'
                : ''
            } ${
              formik.touched.email && !formik.errors.email
                ? 'is-valid'
                : ''
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            type="text"
            className={`form-control ${
              formik.touched.subject &&
              formik.errors.subject
                ? 'is-invalid'
                : ''
            } ${
              formik.touched.subject &&
              !formik.errors.subject
                ? 'is-valid'
                : ''
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.subject}
          />
          {formik.touched.subject &&
          formik.errors.subject ? (
            <div>{formik.errors.subject}</div>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            type="text"
            className={`form-control ${
              formik.touched.message &&
              formik.errors.message
                ? 'is-invalid'
                : ''
            } ${
              formik.touched.message &&
              !formik.errors.message
                ? 'is-valid'
                : ''
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.message}
          />
          {formik.touched.message &&
          formik.errors.message ? (
            <div>{formik.errors.message}</div>
          ) : null}
        </div>
        <div className="form-group">
          <input
            id="signup"
            name="signup"
            type="checkbox"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.signup}
          />
          <label htmlFor="signup">
            Subscribe to email updates
          </label>
        </div>
        <div className="form-group">
          <button
            type="submit"
            className={`btn btn-primary ${
              formik.isSubmitting ? 'is-submitting' : ''
            }`}
            disabled={
              formik.isSubmitting ? 'disabled' : false
            }
          >
            Submit
          </button>
          {formik.isSubmitting ? (
            <div
              className="spinner-border spinner-border-sm ml-2"
              role="status"
            >
              <span className="sr-only">
                {i18n.translate(`FEEDBACK_SUBMITTING`)}
              </span>
            </div>
          ) : null}
          {isSubmitted && !isSubmittedError ? (
            <div
              className="alert alert-success"
              role="alert"
            >
              {i18n.translate(`FEEDBACK_SUCCESS`)}
            </div>
          ) : null}
          {isSubmittedError ? (
            <div
              className="alert alert-danger"
              role="alert"
            >
              {i18n.translate(`FEEDBACK_SUBMIT_FAILURE`, {
                email: i18n.translate(`CONTACT_EMAIL`),
              })}
            </div>
          ) : null}
        </div>
      </form>
    </div>
  )
}

FeedbackContent.propTypes = {}

export default FeedbackContent
