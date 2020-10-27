import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { css, cx } from 'emotion'
import { Progress } from 'reactstrap'
import clsx from 'clsx'

import useStore from './../store.js'
import { DATA_FILES } from './../../../../constants/map'
import { variables } from './../theme'

// TODO:
// - Error notification
// - Hide animation
// - Why is the percent thing running twice?

const DataLoaderContent = ({ ...props }) => {
  // console.log('variables, ', variables)
  //
  const dataLoadedPercent = useStore(
    state => state.dataLoadedPercent,
  )

  const dataLoaderStyles = css`
    position: absolute;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    background-color: ${variables.colors.white};
    z-index: 5000;
    display: flex;
    justify-content: center;
    align-items: center;
  `
  const dataLoaderContentStyles = css`
    width: 90%;
    @media (min-width: ${variables.breakpoints[2]}px) {
      width: 60%;
    }
  `
  const dataLoaderDotStyles = css`
    @keyframes opacity {
      0% {
        filter: opacity(0);
        opacity: 0;
      }
      100% {
        filter: opacity(100);
        opacity: 1;
      }
    }
    animation-name: opacity;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  `

  return (
    <div
      className={clsx('data-loader', cx(dataLoaderStyles))}
    >
      <div
        className="center"
        className={clsx(cx(dataLoaderContentStyles))}
      >
        <h2>
          {i18n.translate(`LOADING_DATA`)}
          <span
            className={clsx(
              'loading-dot',
              cx(dataLoaderDotStyles),
            )}
          >
            .
          </span>
          <span
            className={clsx(
              'loading-dot',
              cx(
                dataLoaderDotStyles,
                css`
                  animation-delay: 200ms;
                `,
              ),
            )}
          >
            .
          </span>
          <span
            className={clsx(
              'loading-dot',
              cx(
                dataLoaderDotStyles,
                css`
                  animation-delay: 400ms;
                `,
              ),
            )}
          >
            .
          </span>
        </h2>
        <Progress value={dataLoadedPercent} />
      </div>
    </div>
  )
}

const DataLoader = ({ ...props }) => {
  // console.log("Hey, it's the DataLoader!!!!!!")
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

  return <DataLoaderContent />
}

export default DataLoader
