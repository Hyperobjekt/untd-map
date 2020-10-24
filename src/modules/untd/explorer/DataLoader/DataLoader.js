import React from 'react'

import useStore from './../store.js'
import { DATA_FILES } from './../../../../constants/map'

const DataLoader = ({ ...props }) => {
  console.log("Hey, it's the DataLoader!!!!!!")
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Special setter to merge loaded json into existing obj.
  const setRemoteJson = useStore(
    state => state.setRemoteJson,
  )
  const s3Path = useStore(state => state.s3Path)

  // Fetch each file, and update the objects you need to update.
  const files = DATA_FILES
  // Counter for loaded files.
  let loadedCount = 0

  // Load each file.
  // Set each file to the store.
  // Update loaded percent.
  // Update overall loading tracking.
  files.forEach((el, i) => {
    const xhr = new XMLHttpRequest()
    const path =
      s3Path + process.env.NODE_ENV + '/' + el + '.json'
    // console.log('path, ', path)
    xhr.open('GET', path, true)
    xhr.onload = function (e) {
      // console.log('loaded, ', xhr)
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Increment counter for loaded files.
          loadedCount++
          let obj = {}
          obj[el] = JSON.parse(xhr.responseText)
          setRemoteJson(obj)
          setStoreValues({
            dataLoadedPercent: (i + 1 / files.length) * 100,
            allDataLoaded:
              i + 1 === files.length ? true : false,
          })
        } else {
          // console.error(xhr.statusText)
          // Flag something failed.
          setStoreValues({
            dataLoaderFailed: true,
          })
        }
      }
    }
    xhr.onerror = function (e) {
      console.error(xhr.statusText)
      // Flag something failed.
      setStoreValues({
        dataLoaderFailed: true,
      })
    }
    xhr.send(null)
  })

  // Nothing is returned by this component.
  // It just loads data and sets flags to indicate
  // that data loading is complete.
  return null
}

export default DataLoader
