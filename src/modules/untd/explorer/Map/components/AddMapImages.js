import { useEffect } from 'react'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import { POINT_ICON_MAP } from './../../../../../constants/layers'

/**
 * Component adds images to map for use by
 * symbol layers. Returns null.
 *
 * To update what icons are loaded, edit the
 * POINT_ICON_MAP array in ./src/constants/layers.js
 */
const AddMapImages = ({ map, loaded, ...props }) => {
  // console.log('AddMapImages, ', map, props)

  const { mapImages, setStoreValues } = useStore(
    state => ({
      mapImages: state.mapImages,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )

  useEffect(() => {
    if (!!loaded) {
      POINT_ICON_MAP.forEach(el => {
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
            })
          })
        }
      })
    }
  }, [loaded])

  return null
}

export default AddMapImages
