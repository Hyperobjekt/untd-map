import useCategories from './useCategories'
import useActiveIndicators from './useActiveIndicators'

/**
 * Returns an array of categories, where each has a
 * `name` and `indicator` prop containing indicators that
 * belong to that category.
 */
export default function useCategorizedIndicators() {
  const categories = useCategories()
  const indicators = useActiveIndicators()
  return categories
    .map(({ id, display_name }) => ({
      id: id,
      name: display_name,
      indicators: indicators.filter(
        ind => ind.category === id,
      ),
    }))
    .filter(({ indicators }) => indicators.length > 0)
}
