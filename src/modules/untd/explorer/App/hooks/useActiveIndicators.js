import { UNTD_LAYERS } from '../../../../../constants/layers'
import useStore from '../../store'
import { getActiveLayerIndex } from '../../utils'
import shallow from 'zustand/shallow'

/**
 * Returns an array of active indicators based on
 * the active layers
 */
export default function useActiveIndicators() {
  const { activeLayers, indicators } = useStore(
    ({ activeLayers, indicators }) => ({
      activeLayers,
      indicators,
    }),
    shallow,
  )

  const layerObj =
    UNTD_LAYERS[getActiveLayerIndex(activeLayers)]

  return (
    indicators
      // filter out indicators that are not displayed
      // and do not belong to this place type
      .filter(
        el =>
          el.display === 1 &&
          el.placeTypes.indexOf(layerObj.id) > -1,
      )
      // sort by order prop
      .sort((a, b) => a.order - b.order)
  )
}
