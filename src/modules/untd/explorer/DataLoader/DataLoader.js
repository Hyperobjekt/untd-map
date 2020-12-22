import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { css, cx } from 'emotion'
import { Progress } from 'reactstrap'
import clsx from 'clsx'
import * as Papa from 'papaparse'

import useStore from './../store.js'
import { DATA_FILES } from './../../../../constants/map'
import { variables } from './../theme'

// TODO:
// - Error notification
// - Hide animation
// - Why is the percent thing running twice?

const DataLoaderContent = ({ ...props }) => {
  // console.log('DataLoaderContent, ', variables)
  //
  const dataLoadedPercent = useStore(
    state => state.dataLoadedPercent,
  )
  const allDataLoaded = useStore(
    state => state.allDataLoaded,
  )

  const allDataLoadedStyles = css`
    top: -100vh;
  `

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
    transition: top 1000ms ease-in-out 1500ms;
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
      className={clsx(
        'data-loader',
        cx(
          dataLoaderStyles,
          !!allDataLoaded ? allDataLoadedStyles : '',
        ),
      )}
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
  // Set one lang locale object
  const setLang = useStore(state => state.setLang)
  // Counter for language pack updates.
  const incrementLangUpdates = useStore(
    state => state.incrementLangUpdates,
  )
  // Push an array of indicators to indicators array in store.
  const addIndicators = useStore(
    state => state.addIndicators,
  )
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
    const path = `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/${el.filename}.${el.ext}`
    // console.log('path, ', path)
    xhr.open('GET', path, true)
    xhr.onload = function (e) {
      // console.log('loaded, ', xhr)
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Increment counter for loaded files.
          loadedCount++
          // console.log(
          //   'file loaded ',
          //   i,
          //   (loadedCount / files.length) * 100,
          // )
          // obj[el.id] = JSON.parse(xhr.responseText)
          if (el.type !== 'dict') {
            let obj = {}
            obj[el.id] = {
              type: `geojson`,
              data: JSON.parse(xhr.responseText),
            }
            setRemoteJson(obj)
          } else {
            // Parse the file and merge with lang file.
            const lang = Papa.parse(xhr.responseText, {
              header: true,
              complete: result => {
                // console.log(
                //   'parse done, result: ',
                //   result.data,
                // )
                const strings = {}
                const indicators = []
                result.data.forEach(r => {
                  // Build lang string.
                  if (r[el.lang_key] && r[el.lang_value]) {
                    // console.log(
                    //   'Lang strings present, adding.',
                    // )
                    strings[r[el.lang_key]] =
                      r[el.lang_value]
                  }
                  // Build indicator list, array of objects.
                  if (r[el.ind_key] === el.ind_flag) {
                    indicators.push({
                      id: r[el.lang_key],
                      title: r[el.lang_value],
                      min: r['Min'],
                      max: r['Max'],
                      placeTypes: r['Place']
                        .toLowerCase()
                        .replace(/ /g, '')
                        .split(','),
                    })
                  }
                })
                // Save strings to string list.
                setLang('en_US', strings)
                incrementLangUpdates()
                // Save indicators to indicator list.
                addIndicators(indicators)
              },
            })
          }
          setStoreValues({
            dataLoadedPercent:
              (loadedCount / files.length) * 100,
            allDataLoaded:
              loadedCount === files.length ? true : false,
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
