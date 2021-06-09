import { useCallback, useMemo } from 'react'
import shallow from 'zustand/shallow'
import useStore from '../store'
import { getGeoFeatureLabel } from '../utils'

/**
 * Provides state and actions for feedback panel
 */
export default function useFeedbackPanel() {
  // pull feedback related items from the store
  const {
    setStoreValues,
    showFeedbackModal,
    feedbackFeature,
    feedbackFeatureType,
    feedbackAddress,
    feedbackLngLat,
  } = useStore(
    ({
      setStoreValues,
      showFeedbackModal,
      feedbackFeature,
      feedbackFeatureType,
      feedbackAddress,
      feedbackLngLat,
    }) => ({
      setStoreValues,
      showFeedbackModal,
      feedbackFeature,
      feedbackFeatureType,
      feedbackAddress,
      feedbackLngLat,
    }),
    shallow,
  )

  /**
   * Shows feedback panel for active choropleth
   */
  const showFeedbackForRegion = useCallback(
    activeFeature => {
      setStoreValues({
        showFeedbackModal: true,
        feedbackFeature: activeFeature,
        feedbackAddress: getGeoFeatureLabel(activeFeature),
        feedbackLngLat: [
          activeFeature.properties.INTPTLAT,
          activeFeature.properties.INTPTLON,
        ],
      })
    },
    [setStoreValues],
  )

  /**
   * Shows feedback panel for specific point feature
   */
  const showFeedbackForPoint = useCallback(
    feature => {
      setStoreValues({
        showFeedbackModal: true,
        feedbackFeature: feature,
        feedbackAddress: `${feature.properties.Name}, ${feature.properties.Address}, ${feature.properties.City}`,
        feedbackLngLat: [
          feature.properties.longitude,
          feature.properties.latitude,
        ],
      })
    },
    [setStoreValues],
  )

  /**
   * Toggles the panel visibility
   */
  const toggleFeedback = useCallback(() => {
    setStoreValues({
      showFeedbackModal: !showFeedbackModal,
    })
  }, [setStoreValues, showFeedbackModal])

  /**
   * Opens the feedback panel
   */
  const openFeedback = useCallback(() => {
    setStoreValues({
      showFeedbackModal: true,
    })
  }, [setStoreValues])

  /** Closes the feedback panel */
  const closeFeedback = useCallback(() => {
    setStoreValues({
      showFeedbackModal: false,
    })
  }, [setStoreValues])

  /**
   * Clears panel values and closes
   */
  const clearFeedback = useCallback(() => {
    setStoreValues({
      showFeedbackModal: false,
      feedbackAddress: '',
      feedbackFeature: 0,
    })
  }, [setStoreValues])

  /**
   * Updates state for feedback modal
   */
  const setFeedbackState = useCallback(
    ({ feature, featureType, address, point, show }) => {
      const updates = {}
      if (feature) updates['feedbackFeature'] = feature
      if (featureType)
        updates['feedbackFeatureType'] = featureType
      if (address) updates['feedbackAddress'] = address
      if (point) updates['feedbackLngLat'] = point
      if (show) updates['showFeedbackModal'] = show
      if (Object.keys(updates).length > 0)
        setStoreValues(updates)
    },
    [setStoreValues],
  )

  /**
   * Contains state for feedback modal
   */
  const feedbackState = useMemo(
    () => ({
      feature: feedbackFeature,
      featureType: feedbackFeatureType,
      address: feedbackAddress,
      point: feedbackLngLat,
      show: showFeedbackModal,
    }),
    [
      feedbackFeature,
      feedbackFeatureType,
      feedbackAddress,
      feedbackLngLat,
      showFeedbackModal,
    ],
  )

  return {
    feedbackState,
    setFeedbackState,
    showFeedbackForRegion,
    showFeedbackForPoint,
    toggleFeedback,
    clearFeedback,
    openFeedback,
    closeFeedback,
  }
}
