import { UNTD_LAYERS } from '../../../../../constants/layers'
import useStore from '../../store'
import i18n from '@pureartisan/simple-i18n'

import { getActiveLayerIndex } from '../../utils'
import useCategories from './useCategories'
import shallow from 'zustand/shallow'

/**
 * Returns an array of categories, where each has a
 * `name` and `indicator` prop containing indicators that
 * belong to that category.
 */
export default function useCategorizedIndicators() {
  const { activeLayers, indicators } = useStore(
    ({ activeLayers, indicators }) => ({
      activeLayers,
      indicators,
    }),
    shallow,
  )

  const categories = useCategories()

  const layerObj =
    UNTD_LAYERS[getActiveLayerIndex(activeLayers)]

  const layerIndicators = indicators
    // filter out indicators that are not displayed
    // and do not belong to this place type
    .filter(
      el =>
        el.display === 1 &&
        el.placeTypes.indexOf(layerObj.id) > -1,
    )
    // sort by order prop
    .sort((a, b) => a.order - b.order)

  return categories
    .map(({ id, display_name }) => ({
      id: id,
      name: display_name,
      indicators: layerIndicators.filter(
        ind => ind.category === id,
      ),
    }))
    .filter(({ indicators }) => indicators.length > 0)
}
