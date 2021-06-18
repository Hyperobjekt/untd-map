import { useCallback, useEffect } from 'react'
import shallow from 'zustand/shallow'
import useStore from '../../store'
import { usePrevious } from '../../utils'

/**
 * This hook updates features on the map with hovered
 * or selected states.
 * @param {*} map
 */
export default function useMapFeatureStates(map, loaded) {
  const {
    hoveredId,
    hoveredType,
    activeFeature,
  } = useStore(
    state => ({
      hoveredId: state.hoveredID,
      hoveredType: state.hoveredType,
      hoveredFeature: state.hoveredFeature,
      activeFeature: state.activeFeature,
    }),
    shallow,
  )

  // store previous hover / selected IDs
  const prev = usePrevious({
    hoveredId,
    hoveredType,
    activeFeature,
  })

  const prevHoverId = prev && prev.hoveredId
  const prevHoverSource = prev && prev.hoveredType
  const prevActiveFeature = prev && prev.activeFeature

  const setFeatureState = useCallback(
    (id, source, state) => {
      if (
        !id ||
        !map ||
        !map.setFeatureState ||
        !source ||
        source === 'points' ||
        !loaded
      )
        return
      map.setFeatureState(
        {
          source,
          id,
        },
        state,
      )
    },
    [map, loaded],
  )

  // update selected state when active feature changes
  useEffect(() => {
    if (prevActiveFeature)
      setFeatureState(
        prevActiveFeature.id,
        prevActiveFeature.source,
        {
          selected: false,
        },
      )
    if (activeFeature)
      setFeatureState(
        activeFeature.id,
        activeFeature.source,
        {
          selected: true,
        },
      )
  }, [activeFeature, setFeatureState, prevActiveFeature])

  // set hovered feature state when hovered feature changes
  useEffect(() => {
    if (prevHoverId && prevHoverSource) {
      // Set state for unhovered school.
      setFeatureState(prevHoverId, prevHoverSource, {
        hover: false,
      })
    }
    if (hoveredId) {
      setFeatureState(hoveredId, hoveredType, {
        hover: true,
      })
    }
  }, [
    hoveredId,
    hoveredType,
    setFeatureState,
    prevHoverId,
    prevHoverSource,
  ]) // update only when hovered id changes
}
