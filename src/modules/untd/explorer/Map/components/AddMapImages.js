import React, { useEffect } from 'react'
import shallow from 'zustand/shallow'

import useStore from './../../store'
// import { UNTD_LAYERS } from './../../../../../constants/layers'
import TourIcon from './../icons/tour.svg'
import HomeIcon from './../icons/home.png'

/**
 * Component adds images to map for use by
 * symbol layers. Returns null.
 */

const isAPointLayer = layer => {
  return layer.types.indexOf('points') > -1
}

const AddMapImages = ({ map, ...props }) => {
  // console.log('AddMapImages, ', map, props)
  const {
    mapImagesAdded,
    // pointTypes,
    setStoreValues,
  } = useStore(
    state => ({
      mapImagesAdded: state.mapImagesAdded,
      // pointTypes: state.pointTypes,
      setStoreValues: state.setStoreValues,
    }),
    shallow,
  )

  map.on('load', function () {
    // if (!!mapImagesAdded) return
    // pointTypes.forEach(el => {
    //   // console.log(`adding icon for ${el.id}-icon`)
    //   map.loadImage(HomeIcon, function (error, image) {
    //     if (error) throw error
    //     // add image to the active style and make it SDF-enabled
    //     map.addImage(`${el.id}-icon`, image, { sdf: true })
    //   })
    // })
    if (!mapImagesAdded) {
      map.loadImage(HomeIcon, function (error, image) {
        if (error) throw error
        // add image to the active style and make it SDF-enabled
        map.addImage(`home-icon`, image, { sdf: true })
      })
      setStoreValues({
        mapImagesAdded: 1,
      })
    }
  })

  // map.loadImage(HomeIcon, function (error, image) {
  //   if (error) throw error
  //   // add image to the active style and make it SDF-enabled
  //   map.addImage(`home-icon`, image, { sdf: true })
  // })
  // })

  // if (!!mapImagesAdded) return null
  // UNTD_LAYERS.forEach(el => {
  //   console.log(`adding icon for ${el.id}`)
  //   if (isAPointLayer(el) && !!el.icon) {
  //     let img = new Image(20, 20)
  //     img.onload = () => map.addImage(`${el.id}-icon`, img)
  //     img.src = HomeIcon // window[el.icon] // Pipe in matching svgs later.
  //     console.log('img, ', img)
  //   }
  // })
  // setStoreValues({
  //   mapImagesAdded: 1,
  // })
  return null
}

export default AddMapImages
