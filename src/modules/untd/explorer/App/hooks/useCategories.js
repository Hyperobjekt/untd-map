import useStore from '../../store'

/**
 * Returns categories for indicators, along with order.
 */
export default function useCategories() {
  const allData = useStore(state => state.allData)
  const categories = allData
    .filter(d => d['type'] === 'category')
    .map(({ variable, display_name }) => ({
      id: variable,
      display_name,
    }))
  return categories
}
