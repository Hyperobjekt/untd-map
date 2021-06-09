import i18n from '@pureartisan/simple-i18n'
import useStore from '../../store.js'
import { UNTD_LAYERS } from '../../../../../constants/layers.js'
export default function useActiveRegion() {
  const activeLayers = useStore(state => state.activeLayers)
  const { label } = UNTD_LAYERS.find(
    (el, i) => activeLayers[i] === 1,
  )
  return label ? i18n.translate(label) : 'none'
}
