import { useEffect } from 'react'
import shallow from 'zustand/shallow'

import useStore from '../../store'
import * as Icons from '../../PointIcons'

/**
 * A hook that loads icon images for all point types
 */
const useMapImageLoader = ({ map, loaded }) => {
  const [mapImages, setStoreValues, pointTypes] = useStore(
    state => [
      state.mapImages,
      state.setStoreValues,
      state.pointTypes,
    ],
    shallow,
  )

  /**
   * Loads the icon for a given pointID
   * @param {*} pointId
   * @param {*} map
   * @returns {Promise}
   */
  const loadPointIcon = (pointId, map) => {
    return new Promise((resolve, reject) => {
      const iconId = `${pointId}-icon`
      if (mapImages.indexOf(iconId) > -1)
        return reject(`icon already added: ${iconId}`)
      // Load the icon from Icons component collection.
      const pointIcon = Icons[pointId] || Icons['default']
      map.loadImage(pointIcon, function (error, image) {
        if (error) return reject(error)
        // add image to the active style and make it SDF-enabled
        map.addImage(iconId, image, {
          sdf: true,
        })
        return resolve(iconId)
      })
    })
  }

  useEffect(() => {
    // only execute if the map is loaded
    if (!loaded || !Array.isArray(mapImages) || !map) return
    // get the icon IDs that have not yet been loaded
    const iconsToLoad = pointTypes.filter(
      p => mapImages.indexOf(`${p.id}-icon`) === -1,
    )
    // map iconsToLoad into promises
    Promise.all(
      iconsToLoad.map(p => loadPointIcon(p.id, map)),
    )
      // add to store once all promises resolve
      .then(ids => {
        // no need to add new images if none were loaded
        if (!ids || ids.length === 0) return
        // add new icon ids to mapImages store
        const newLoaded = [...mapImages, ...ids]
        setStoreValues({
          mapImages: newLoaded,
          mapImagesAdded:
            newLoaded.length === pointTypes.length,
        })
      })
      .catch(err => console.error(err))
  }, [loaded, map, mapImages])
}

export default useMapImageLoader
