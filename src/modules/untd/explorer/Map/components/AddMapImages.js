import React from 'react'
import shallow from 'zustand/shallow'

import useStore from './../../store'
import { UNTD_LAYERS } from './../../../../../constants/layers'
import TourIcon from './../icons/tour.svg'

/**
 * Component adds images to map for use by
 * symbol layers. Returns null.
 */

const isAPointLayer = layer => {
  return layer.types.indexOf('points') > -1
}

const AddMapImages = ({ map, ...props }) => {
  // console.log('AddMapImages, ', map, props)
  const { mapImagesAdded, setStoreValues } = useStore(
    state => ({
      mapImagesAdded: state.mapImagesAdded,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )
  // const mapImagesAdded = useStore(
  //   store => store.mapImagesAdded,
  // )
  // const setStoreValues = useStore(
  //   store => store.setStoreValues,
  // )
  if (!!mapImagesAdded) return null
  UNTD_LAYERS.forEach(el => {
    console.log(`adding icon for ${el.id}`)
    if (isAPointLayer(el) && !!el.icon) {
      let img = new Image(20, 20)
      img.onload = () => map.addImage(`${el.id}-icon`, img)
      img.src = TourIcon // window[el.icon] // Pipe in matching svgs later.
      console.log('img, ', img)
    }
  })
  setStoreValues({
    mapImagesAdded: 1,
  })
  return null
}

export default AddMapImages
