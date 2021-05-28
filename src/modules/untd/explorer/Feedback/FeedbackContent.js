import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { MdMyLocation } from 'react-icons/md'
import { Input, Col, Row } from 'reactstrap'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import useStore from './../store'
import { CoreButton } from './../../../core'
import { GeocodeSearch } from './../GeocodeSearch'
import useFeedbackPanel from './useFeedbackPanel'

/**
 * Layout sets up the basic layout for the explorer.
 * @param Object children Child elements
 * @param Object props    Props passed from parent
 */
const FeedbackContent = ({ children, ...props }) => {
  // console.log('FeedbackContent')

  const { breakpoint, currentLocation } = useStore(
    ({ breakpoint, currentLocation }) => ({
      breakpoint,
      currentLocation,
    }),
    shallow,
  )

  const hasCurrentLocation = currentLocation.length === 2

  const {
    clearFeedback,
    feedbackState,
    setFeedbackState,
  } = useFeedbackPanel()

  /**
   * Submit the form to netlify forms
   */
  const submitForm = () => {}

  const handleUseCurrentLocation = () => {
    // console.log('useCurrentLocation(), ', currentLocation)
    // Get current location from coords.
    const path = `https://api.mapbox.com/geocoding/v5/mapbox.places/${
      currentLocation[0]
    },${currentLocation[1]}.json?access_token=${
      process.env.GATSBY_MAPBOX_API_TOKEN
    }&types=address,poi&cachebuster=${Math.floor(
      Date.now(),
    )}`
    // Get request for autosuggest results.
    fetch(path)
      .then(r => r.json())
      .then(json => {
        // console.log('response, ', json)
        const addresses = json.features.filter(
          el =>
            el.place_type.indexOf('address') > -1 ||
            el.place_type.indexOf('poi') > -1,
        )
        setFeedbackState({
          point: [currentLocation[0], currentLocation[1]],
          address: addresses[0].place_name,
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
      message: '',
      signup: false,
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      lastname: Yup.string()
        .max(60, 'Must be 60 characters or less')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      message: Yup.string().required('Required'),
      signup: Yup.boolean(),
    }),
    onSubmit: (values, { setSubmitting }) => {
      values.address = feedbackState.address
      values.longitude = feedbackState.point[0]
      values.latitude = feedbackState.point[1]

      console.log('onSubmit()', values)

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
      }).then(response => {
        // console.log('response', response)
        if (!!response.ok) {
          // console.log('Form submission success!')
          // Turn off submitting state.
          formik.setSubmitting(false)
          // Enable display of submission success message.
          setIsSubmitted(true)
          // Clear form fields
          formik.resetForm()
        } else {
          // Turn off submitting state.
          formik.setSubmitting(false)
          // Enable display of submission error message.
          setIsSubmittedError(true)
        }
      })

      const { email, signup } = values

      if (signup) {
        fetch('/.netlify/functions/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email }),
        }).then(response => {
          // console.log('response signup, ', response)
          if (!!response.ok) {
            // console.log('Signup submission success!')
          } else {
            // Catch submission errors.
            // console.log(
            //   'Signup submission error:',
            //   response.status,
            //   response.statusText,
            // )
            // Enable display of submission error message.
            setIsSubmittedError(true)
          }
        })
      }
    },
  })

  /**
   * Returns instructions text.
   * @returns String
   */
  const getInstructions = () => {
    return !!feedbackState.feature
      ? i18n.translate(`FEEDBACK_INSTR_WITHFEATURE`)
      : i18n.translate(`FEEDBACK_INSTR`)
  }

  const handleCancel = () => {
    // console.log('handleCancel()')
    clearFeedback()
    formik.resetForm()
  }

  return (
    <div className={clsx('feedback-content')}>
      <Row>
        <Col>
          <h2>{i18n.translate(`FEEDBACK_HEADING`)}</h2>
        </Col>
      </Row>
      <Row className={clsx('row-instructions')}>
        <Col
          xs="12"
          md="9"
          dangerouslySetInnerHTML={{
            __html: getInstructions(),
          }}
        ></Col>
      </Row>
      {!feedbackState.feature && (
        <Row className={clsx('row-location')}>
          <Col
            xs="12"
            md={6}
            className={clsx(
              breakpoint !== 'xs' && breakpoint !== 'sm'
                ? 'pr-0'
                : '',
            )}
          >
            <GeocodeSearch context="feedback" />
          </Col>

          <Col
            xs="12"
            md="1"
            className={clsx(
              'col-or',
              breakpoint !== 'xs' &&
                breakpoint !== 'sm' &&
                'pl-0 pr-0',
            )}
          >
            {i18n.translate(`OR`)}
          </Col>
          <Col
            xs="12"
            md="5"
            className={clsx(
              breakpoint !== 'xs' &&
                breakpoint !== 'sm' &&
                'pl-0 ',
            )}
          >
            <CoreButton
              id="button_use_current_loc"
              disabled={!hasCurrentLocation}
              onClick={handleUseCurrentLocation}
              color="none"
              className="feedback-use-my"
            >
              <MdMyLocation />
              <span>
                {i18n.translate(
                  hasCurrentLocation
                    ? `FEEDBACK_USE_CURRENT_LOC`
                    : `FEEDBACK_LOC_UNAVAILABLE`,
                )}
              </span>
            </CoreButton>
          </Col>
        </Row>
      )}
      <form
        name="map_feedback"
        // method="POST"
        // onSubmit={formik.handleSubmit}
        className={
          formik.isSubmitting
            ? 'submitting'
            : 'not-submitting'
        }
        // netlify-honeypot="bot-field"
        // data-netlify="true"
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
        <Row>
          <Col
            xs="12"
            md="6"
            className={clsx(
              breakpoint !== 'xs' && breakpoint !== 'sm'
                ? 'pr-0'
                : '',
            )}
          >
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <Input
                id="address"
                value={feedbackState.address}
                type="text"
                readOnly={true}
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          </Col>
          <Col xs="12" md="6">
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
          </Col>
        </Row>
        <Row>
          <Col
            xs="12"
            md="6"
            className={clsx(
              breakpoint !== 'xs' && breakpoint !== 'sm'
                ? 'pr-0'
                : '',
            )}
          >
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
          </Col>
          <Col xs="12" md="6">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-control ${
                  formik.touched.email &&
                  formik.errors.email
                    ? 'is-invalid'
                    : ''
                } ${
                  formik.touched.email &&
                  !formik.errors.email
                    ? 'is-valid'
                    : ''
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email &&
              formik.errors.email ? (
                <div className="invalid-feedback">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
          </Col>
        </Row>
        <Row className="row-message">
          <Col>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                type="text"
                rows="4"
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
                <div className="invalid-feedback">
                  {formik.errors.message}
                </div>
              ) : null}
            </div>
          </Col>
        </Row>
        <Row className="row-subscribe">
          <Col>
            <div className="form-group subscribe">
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
          </Col>
        </Row>
        <Row className="row-submit">
          <Col>
            <div className="form-group">
              <CoreButton
                id="button_cancel"
                label={i18n.translate(`FEEDBACK_CANCEL`)}
                onClick={handleCancel}
                color="secondary"
                className={clsx('feedback-cancel')}
              >
                <span>
                  {i18n.translate(`FEEDBACK_CANCEL`)}
                </span>
              </CoreButton>
              <button
                type="submit"
                id="button_submit"
                className={`btn btn-primary feedback-submit ${
                  formik.isSubmitting ? 'is-submitting' : ''
                }`}
                disabled={
                  formik.isSubmitting ||
                  feedbackState.address.length === 0 ||
                  feedbackState.point.length < 2
                }
                label={i18n.translate(`FEEDBACK_SUBMIT`)}
                color="primary"
                onClick={formik.handleSubmit}
              >
                <span>
                  {i18n.translate(`FEEDBACK_SUBMIT`)}
                </span>
                {formik.isSubmitting ? (
                  <div
                    className="spinner-border spinner-border-sm ml-2"
                    role="status"
                  >
                    <span className="sr-only">
                      {i18n.translate(
                        `FEEDBACK_SUBMITTING`,
                      )}
                    </span>
                  </div>
                ) : null}
              </button>
            </div>
          </Col>
        </Row>
        <Row className={clsx('row-alert')}>
          <Col>
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
                dangerouslySetInnerHTML={{
                  __html: i18n.translate(
                    `FEEDBACK_SUBMIT_FAILURE`,
                    {
                      email: i18n.translate(
                        `CONTACT_EMAIL`,
                      ),
                    },
                  ),
                }}
              ></div>
            ) : null}
          </Col>
        </Row>
      </form>
    </div>
  )
}

FeedbackContent.propTypes = {}

export default FeedbackContent
