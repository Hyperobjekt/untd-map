import React, { useState } from 'react'
import i18n from '@pureartisan/simple-i18n'
import Autosuggest from 'react-autosuggest'
import { FiSearch } from 'react-icons/fi'
import { MdClose } from 'react-icons/md'
import shallow from 'zustand/shallow'

import { CoreButton } from './../../../core'
import useStore from '../store'
import { DEFAULT_VIEWPORT } from './../../../../constants/map'
import useFeedbackPanel from '../Feedback/useFeedbackPanel'

/**
 * MenuSearch: Autosuggest search input for header.
 */
const GeocodeSearch = ({ ...props }) => {
  const {
    setStoreValues,
    showIntroModal,
    eventGeocodeSearch,
    flyToLatLng,
    flyToBounds,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      showIntroModal: state.showIntroModal,
      eventGeocodeSearch: state.eventGeocodeSearch,
      flyToLatLng: state.flyToLatLng,
      flyToBounds: state.flyToBounds,
    }),
    shallow,
  )

  const { setFeedbackState } = useFeedbackPanel()

  // Tracking autosuggest suggestions
  const [suggestions, setSuggestions] = useState([])
  const [value, setValue] = useState('')

  // Update the UI according to the context.
  const updateUIWithResult = suggestion => {
    // console.log('updateUIWithResult, ', suggestion)
    // If feature has a bounding box, use the
    // bounding box to fly, otherwise treat it
    // like a point.
    if (props.context && props.context === 'feedback') {
      // console.log('context is feedback')
      setFeedbackState({
        address: suggestion.suggestionValue,
        point: suggestion.suggestion.center,
      })
    } else {
      if (!!suggestion.suggestion.bbox) {
        flyToBounds([
          [
            suggestion.suggestion.bbox[0],
            suggestion.suggestion.bbox[1],
          ],
          [
            suggestion.suggestion.bbox[2],
            suggestion.suggestion.bbox[3],
          ],
        ])
      } else {
        // flyToFeature(suggestion.suggestion)
        flyToLatLng(
          suggestion.suggestion.center[1],
          suggestion.suggestion.center[0],
        )
      }
      // If intro panel is dsplayed, hide it.
      if (!!showIntroModal) {
        setStoreValues({ showIntroModal: false })
      }
    }

    handleClear()
    setStoreValues({
      eventGeocodeSearch: eventGeocodeSearch + 1,
    })
  }

  const getSuggestions = value => {
    // console.log('getSuggestions, ', value)
    const inputValue = encodeURIComponent(value)
    // console.log('inputValue, ', inputValue)
    // If not a very long string, just return empty array.
    if (inputValue.length < 3) {
      return setSuggestions([])
    } else {
      // console.log('making query')
      // Construct query path.
      const path = `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputValue}.json?access_token=${
        process.env.GATSBY_MAPBOX_API_TOKEN
      }&cachebuster=${Math.floor(
        Date.now(),
      )}&autocomplete=true&bbox=${
        DEFAULT_VIEWPORT.maxBounds[0][0]
      },${DEFAULT_VIEWPORT.maxBounds[0][1]},${
        DEFAULT_VIEWPORT.maxBounds[1][0]
      },${DEFAULT_VIEWPORT.maxBounds[1][1]}
      }`
      // Get request for autosuggest results.
      fetch(path)
        .then(r => r.json())
        .then(json => {
          setSuggestions(json.features)
        })
    }
  }

  /**
   * Clear the suggestions list.
   */
  const handleClearRequested = () => {
    setSuggestions([])
  }

  /**
   * When item is selected, do something.
   * @param  Object e          Event
   * @param  Object suggestion Object of suggestion nodes
   */
  const handleSelection = (e, suggestion) => {
    // console.log('handleSelection, ', e, suggestion)
    updateUIWithResult(suggestion)
  }

  /**
   * When input value changes, reset value
   * @param  Object e        Event
   * @param  String newValue String value of input
   */
  const handleChange = (e, { newValue }) => {
    // console.log('handleChange, ', e, newValue)
    setValue(newValue)
  }

  const handleBlur = e => {
    // console.log('handleBlur, ', e)
    // setValue('')
    // setSuggestions([])
  }

  const handleFetchRequested = ({ value }) => {
    // console.log('handleFetchRequested()')
    getSuggestions(value)
  }

  const getSuggestionValue = suggestion => {
    // console.log('getSuggestionValue(), ', suggestion)
    return suggestion.place_name
  }

  const handleClear = () => {
    // reset value and suggestions
    setValue('')
    setSuggestions([])
  }

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => {
    // console.log('renderSuggestion, ', suggestion)
    return (
      <div id={suggestion.id} key={suggestion.id}>
        {suggestion.place_name}
      </div>
    )
  }

  const getPrompt = () => {
    return props.prompt
      ? props.prompt
      : i18n.translate(`INPUT_SEARCH`)
  }

  const inputProps = {
    id: 'location_search',
    value: value, // usually comes from the application state
    onChange: handleChange, // called every time the input value changes
    onBlur: handleBlur, // called when the input loses focus, e.g. when user presses Tab
    type: 'search',
    placeholder: getPrompt(),
  }
  return (
    <div className="search-autosuggest input-group tour-desk-9">
      <label htmlFor="location_search" className="sr-only">
        {i18n.translate(`INPUT_SEARCH`)}
      </label>
      <FiSearch
        className="icon-search geocode-search-prompt"
        aria-hidden="true"
      />
      <Autosuggest
        suggestions={suggestions}
        onSuggestionSelected={handleSelection}
        onSuggestionsFetchRequested={handleFetchRequested}
        onSuggestionsClearRequested={handleClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <CoreButton
        id="button_search_clear"
        onClick={handleClear}
        color="none"
        className="button-search-clear"
        style={{ display: !!value ? 'block' : 'none' }}
      >
        <MdClose
          aria-label={i18n.translate(`BUTTON_SEARCH`)}
        />
      </CoreButton>
    </div>
  )
}

GeocodeSearch.propTypes = {}

export default GeocodeSearch
