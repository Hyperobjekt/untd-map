import { useEffect } from 'react'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import * as Icons from './../../PointIcons'

/**
 * Component adds images to map for use by
 * symbol layers. Returns null.
 */
const AddMapImages = ({ map, loaded, ...props }) => {
  // console.log('AddMapImages, ', map, props, Icons)

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
          // Load the icon from Icons component collection.
          // console.log(`Loading image for ${el.id}.`)
          const ThisImage = Icons[el.id]
            ? Icons[el.id]
            : Icons['default']
          map.loadImage(ThisImage, function (error, image) {
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
