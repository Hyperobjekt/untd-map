import React, { useEffect } from 'react'
import shallow from 'zustand/shallow'

import useStore from './../../store'

import homeIcon from './../icons/home.png'
import bankIcon from './../icons/bank.png'
import bookIcon from './../icons/book.png'
import carrotIcon from './../icons/carrot.png'
import cartIcon from './../icons/cart.png'
import childcareIcon from './../icons/childcare.png'
import communityIcon from './../icons/community.png'
import healthIcon from './../icons/health.png'
import recIcon from './../icons/rec.png'
import wicIcon from './../icons/wic.png'
import publicIcon from './../icons/public.png'
import privateIcon from './../icons/private.png'
import charterIcon from './../icons/charter.png'

/**
 * Component adds images to map for use by
 * symbol layers. Returns null.
 */

const isAPointLayer = layer => {
  return layer.types.indexOf('points') > -1
}

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
      if (mapImages.indexOf('home-icon') < 0) {
        map.loadImage(homeIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`home-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('home-icon'),
          })
        })
      }

      if (mapImages.indexOf('home-icon') < 0) {
        map.loadImage(bankIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`bank-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('bank-icon'),
          })
        })
      }

      if (mapImages.indexOf('book-icon') < 0) {
        map.loadImage(bookIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`book-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('book-icon'),
          })
        })
      }

      if (mapImages.indexOf('carrot-icon') < 0) {
        map.loadImage(carrotIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`carrot-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('carrot-icon'),
          })
        })
      }

      if (mapImages.indexOf('cart-icon') < 0) {
        map.loadImage(cartIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`cart-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('cart-icon'),
          })
        })
      }

      if (mapImages.indexOf('childcare-icon') < 0) {
        map.loadImage(
          childcareIcon,
          function (error, image) {
            if (error) throw error
            // add image to the active style and make it SDF-enabled
            map.addImage(`childcare-icon`, image, {
              sdf: true,
            })
            setStoreValues({
              mapImages: mapImages.push('childcare-icon'),
            })
          },
        )
      }

      if (mapImages.indexOf('community-icon') < 0) {
        map.loadImage(
          communityIcon,
          function (error, image) {
            if (error) throw error
            // add image to the active style and make it SDF-enabled
            map.addImage(`community-icon`, image, {
              sdf: true,
            })
            setStoreValues({
              mapImages: mapImages.push('community-icon'),
            })
          },
        )
      }

      if (mapImages.indexOf('health-icon') < 0) {
        map.loadImage(healthIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`health-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('health-icon'),
          })
        })
      }

      if (mapImages.indexOf('rec-icon') < 0) {
        map.loadImage(recIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`rec-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('rec-icon'),
          })
        })
      }

      if (mapImages.indexOf('wic-icon') < 0) {
        map.loadImage(wicIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`wic-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('wic-icon'),
          })
        })
      }

      if (mapImages.indexOf('public-icon') < 0) {
        map.loadImage(publicIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`public-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('public-icon'),
          })
        })
      }

      if (mapImages.indexOf('private-icon') < 0) {
        map.loadImage(privateIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`private-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('private-icon'),
          })
        })
      }

      if (mapImages.indexOf('charter-icon') < 0) {
        map.loadImage(charterIcon, function (error, image) {
          if (error) throw error
          // add image to the active style and make it SDF-enabled
          map.addImage(`charter-icon`, image, { sdf: true })
          setStoreValues({
            mapImages: mapImages.push('charter-icon'),
          })
        })
      }

      setStoreValues({
        mapImagesAdded: 1,
      })
    }
  }, [loaded])

  return null
}

export default AddMapImages
