import { useCallback, useMemo } from 'react'
import shallow from 'zustand/shallow'
import { POINT_CATEGORIES } from '../../../../constants/layers'
import useStore from '../store'

/**
 * Gets point layers for a given category or subcategory
 * @param {*} pointLayers all available point layers
 * @param {*} value category name or "category|subcategory"
 * @param {string} type (category or subcategory)
 * @param {string} activePointTypes array of active point layers
 */
const getPointLayers = (
  pointLayers,
  value,
  type = 'category',
  activePointTypes,
) => {
  if (!pointLayers) return []
  return (
    pointLayers
      // filter layers that belong to the category
      .filter(point => {
        if (type === 'category')
          return (
            point.category === value && !point.subcategory
          )
        if (type === 'subcategory') {
          return (
            point.category === value.split('|')[0] &&
            point.subcategory === value.split('|')[1]
          )
        }
      })
      // sort by order prop
      .sort((a, b) => {
        if (type === 'category')
          return a.category_order - b.category_order
        if (type === 'subcategory')
          return a.subcategory_order - b.subcategory_order
      })
      // add point index and checked status
      .map(point => {
        // not sure if necessary, seems like you could use point.index?
        const pointIndex = getPointIndex(
          pointLayers,
          point.id,
        )
        const isChecked = activePointTypes[pointIndex]
        return { ...point, pointIndex, isChecked }
      })
  )
}

/**
 * Helper function to get index of the provided point ID
 */
const getPointIndex = (collection, id) =>
  collection.findIndex(point => point.id === id)

/**
 * Returns state and actions for displaying and toggling point layers
 */
export default function usePointLayers() {
  const {
    setStoreValues,
    pointTypes,
    activePointTypes,
  } = useStore(
    ({ setStoreValues, pointTypes, activePointTypes }) => ({
      setStoreValues,
      pointTypes,
      activePointTypes,
    }),
    shallow,
  )

  /**
   * Resets all point layers
   */
  const resetAll = useCallback(() => {
    setStoreValues({
      activePointTypes: activePointTypes.map(val => 0),
    })
  }, [setStoreValues, activePointTypes])

  /**
   * Toggles a provided point layer on or off
   */
  const togglePointLayer = useCallback(
    (point, e) => {
      const index = getPointIndex(pointTypes, point.id)
      setStoreValues({
        activePointTypes: activePointTypes.map((val, i) =>
          index === i ? (val ? 0 : 1) : val,
        ),
      })
    },
    [pointTypes, activePointTypes],
  )

  /** Toggles all point layers in a category */
  const toggleCategoryPointLayers = useCallback(
    (category, on, event) => {
      // get the point layer indexes that belong to this category
      const categoryIndexes = pointTypes.reduce(
        (indexes, current, i) => {
          if (current.category === category) indexes.push(i)
          return indexes
        },
        [],
      )
      // update the value of indexes that belong to this category
      const newActivePoints = activePointTypes.map(
        (p, i) => {
          if (categoryIndexes.indexOf(i) > -1)
            return Number(on)
          return p
        },
      )
      setStoreValues({
        activePointTypes: newActivePoints,
      })
    },
    [pointTypes, activePointTypes],
  )

  /**
   * Provides point layer state, with categories and subcategories
   */
  const pointLayers = useMemo(
    () =>
      POINT_CATEGORIES.map((cat, i) => ({
        ...cat,
        pointLayers: getPointLayers(
          pointTypes,
          cat.id,
          'category',
          activePointTypes,
        ),
        subcategories: cat.subcategories.map(sub => {
          return {
            id: sub,
            pointLayers: getPointLayers(
              pointTypes,
              `${cat.id}|${sub}`,
              'subcategory',
              activePointTypes,
            ),
          }
        }),
      })),
    [activePointTypes, pointTypes],
  )

  return {
    pointLayers,
    resetAll,
    togglePointLayer,
    toggleCategoryPointLayers,
  }
}
