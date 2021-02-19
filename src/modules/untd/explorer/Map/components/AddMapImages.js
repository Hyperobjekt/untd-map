import { useEffect } from 'react'
import shallow from 'zustand/shallow'

import useStore from './../../store'

/**
 * Component adds images to map for use by
 * symbol layers. Returns null.
 */
const AddMapImages = ({ map, loaded, ...props }) => {
  // console.log('AddMapImages, ', map, props)

  const {
    mapImages,
    setStoreValues,
    pointTypes,
  } = useStore(
    state => ({
      mapImages: state.mapImages,
      setStoreValues: state.setStoreValues,
      pointTypes: state.pointTypes,
    }),
    shallow,
  )

  useEffect(() => {
    if (!!loaded) {
      pointTypes.forEach(el => {
        // If it's not been loaded yet, load it.
        if (mapImages.indexOf(`${el.id}-icon`) < 0) {
          // Load the icon from path.
          const src = require(`./../../point-icons/png/${el.id}.png`)
            .default
          // Load the image into the map. Listen for errors.
          map.loadImage(src, function (error, image) {
            if (error) throw error
            // add image to the active style and make it SDF-enabled
            map.addImage(`${el.id}-icon`, image, {
              sdf: true,
            })
            setStoreValues({
              mapImages: mapImages.push(`${el.id}-icon`),
              mapImagesAdded:
                mapImages.length === pointTypes.length,
            })
          })
        }
      })
    }
  }, [loaded])

  return null
}

export default AddMapImages
