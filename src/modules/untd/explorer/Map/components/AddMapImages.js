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
    activePointTypesKey,
    setStoreValues,
  } = useStore(
    state => ({
      mapImagesAdded: state.mapImagesAdded,
      activePointTypesKey: state.activePointTypesKey,
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
  //

  // const addImages = () => {
  // if (!!mapImagesAdded) return null
  //   activePointTypesKey.forEach(el => {
  //     console.log(`adding icon for ${el}-icon`)
  //     // if (isAPointLayer(el) && !!el.icon) {
  //     // let img = new Image(20, 20)
  //     // img.onload = () => map.addImage(`${el}-icon`, img)
  //     // img.src = HomeIcon // window[el.icon] // Pipe in matching svgs later.
  //     // console.log('img, ', img)
  //     // }
  //     map.loadImage(HomeIcon, function (error, image) {
  //       if (error) throw error
  //       // add image to the active style and make it SDF-enabled
  //       map.addImage(`${el}-icon`, image, { sdf: true })
  //     })
  //   })
  //   setStoreValues({
  //     mapImagesAdded: 1,
  //   })
  // }

  // useEffect(() => {
  //   console.log('activePointTypesKey changed.')
  //   addImages()
  // }, [activePointTypesKey])

  map.on('load', function () {
    if (!!mapImagesAdded) return null
    activePointTypesKey.forEach(el => {
      console.log(`adding icon for ${el}-icon`)
      // if (isAPointLayer(el) && !!el.icon) {
      // let img = new Image(20, 20)
      // img.onload = () => map.addImage(`${el}-icon`, img)
      // img.src = HomeIcon // window[el.icon] // Pipe in matching svgs later.
      // console.log('img, ', img)
      // }
      map.loadImage(HomeIcon, function (error, image) {
        if (error) throw error
        // add image to the active style and make it SDF-enabled
        map.addImage(`${el}-icon`, image, { sdf: true })
      })
    })
    setStoreValues({
      mapImagesAdded: 1,
    })
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
