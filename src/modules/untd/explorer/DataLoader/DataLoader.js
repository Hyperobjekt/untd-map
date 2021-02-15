import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { css, cx } from 'emotion'
import { Progress } from 'reactstrap'
import clsx from 'clsx'
import * as Papa from 'papaparse'
import shallow from 'zustand/shallow'

import useStore from './../store.js'
import {
  DATA_FILES,
  ROUTE_SET,
} from './../../../../constants/map'
import { variables } from './../theme'

// TODO:
// - Error notification
// - Hide animation
// - Why is the percent thing running twice?

const DataLoaderContent = ({ ...props }) => {
  // console.log('DataLoaderContent, ', variables)

  const { dataLoadedPercent, allDataLoaded } = useStore(
    state => ({
      dataLoadedPercent: state.dataLoadedPercent,
      allDataLoaded: state.allDataLoaded,
    }),
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
  const {
    setStoreValues,
    setRemoteJson,
    setLang,
    incrementLangUpdates,
    addIndicators,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      setRemoteJson: state.setRemoteJson,
      setLang: state.setLang,
      incrementLangUpdates: state.incrementLangUpdates,
      addIndicators: state.addIndicators,
    }),
    shallow,
  )

  // Fetch each file, and update the objects you need to update.
  const files = DATA_FILES
  // Counter for loaded files.
  let loadedCount = 0

  // Load each file.
  // Set each file to the store.
  // Update loaded percent.
  // Update overall loading tracking.
  useEffect(() => {
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
            if (el.type !== 'dict') {
              const _data = JSON.parse(xhr.responseText)
              if (el.type !== 'point') {
                let obj = {}
                obj[el.id] = {
                  type: `geojson`,
                  data: _data,
                }
                setRemoteJson(obj)
              }
              if (el.type === 'point') {
                // Make a list of point types.
                const point_types = []
                _data.features.forEach(el => {
                  if (
                    point_types.indexOf(
                      el.properties.variable,
                    ) <= -1
                  ) {
                    point_types.push(el.properties.variable)
                  }
                })
                // Add a geo layer for each point type,
                // so that they cluster independently.
                point_types.forEach(type => {
                  const obj = {}
                  const pointData = {
                    features: _data.features.filter(
                      feature =>
                        feature.properties.variable ===
                        type,
                    ),
                    type: 'FeatureCollection',
                  }
                  obj[`points_${type}`] = {
                    type: `geojson`,
                    data: pointData,
                    cluster: true,
                    // clusterRadius: 50,
                    clusterProperties: {
                      sum: ['+', ['get', 'scalerank']],
                    },
                  }
                  setRemoteJson(obj)
                })
                setStoreValues({
                  pointTypeLayers: point_types,
                })
              }
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
                  const pointTypes = []
                  const pointCategories = []
                  result.data.forEach(r => {
                    // Build lang string.
                    if (r[el.lang_key]) {
                      // console.log(
                      //   'Lang strings present, adding, ',
                      //   r[el.lang_value],
                      // )
                      strings[r[el.lang_key]] =
                        r[el.lang_label].length > 0
                          ? r[el.lang_label]
                          : `${
                              r[el.lang_key]
                            } label not provided`
                      strings[`${r[el.lang_key]}_desc`] =
                        r[el.lang_desc].length > 0
                          ? r[el.lang_desc]
                          : `${
                              r[el.lang_key]
                            } description not provided`
                    }

                    // Build point types list
                    if (
                      r.type === 'point' &&
                      !!r.variable
                    ) {
                      pointTypes.push({
                        id: r.variable,
                        label: r.variable,
                        types: [`points`],
                        tooltip: `${r.variable}_desc`,
                        only_one: false,
                        group: 1,
                        index: pointTypes.length,
                        icon: `${r.variable}-icon`,
                        category: r['category']
                          ? r['category']
                          : false,
                        subcategory: r['subcategory']
                          ? r['subcategory']
                          : false,
                      })
                      if (
                        r['category'] &&
                        pointCategories.indexOf(
                          r['category'],
                        ) <= -1
                      ) {
                        pointCategories.push(r['category'])
                      }
                    }
                    // Build indicator list, array of objects.
                    const exists =
                      indicators.length === 0
                        ? false
                        : !!indicators.find(item => {
                            return (
                              item.id === r[el.lang_key]
                            )
                          })
                    // console.log(
                    //   'exists: ',
                    //   exists,
                    //   indicators,
                    //   r,
                    // )
                    if (
                      !exists &&
                      r[el.ind_key] === el.ind_flag
                    ) {
                      // console.log('adding an indicator')
                      indicators.push({
                        id: r[el.lang_key]
                          ? r[el.lang_key]
                          : r.variable,
                        // TODO: REDO THIS LATER.
                        display:
                          String(r.variable).indexOf('18') >
                          0
                            ? 1
                            : 0,
                        // r['display_variable'] === 'Yes'
                        //   ? 1
                        //   : 0,
                        min: r['min'] ? r['min'] : 0,
                        max: r['max'] ? r['max'] : 100,
                        range: r['range']
                          ? r['range']
                          : null,
                        mean: r['mean'] ? r['mean'] : null,
                        highisgood:
                          r['highisgood'] === 'Yes' ? 1 : 0,
                        iscurrency: r['currency'],
                        ispercent: r['percent'],
                        decimals: r['decimals'],
                        years: r['years']
                          .toLowerCase()
                          .replace(/ /g, '')
                          .split(','),
                        placeTypes: r['place']
                          .toLowerCase()
                          .replace(/ /g, '')
                          .split(',')
                          .map(type => {
                            return `${type}s`
                          }),
                      })
                    }
                  })
                  // Save strings to string list.
                  // console.log('strings, ', strings)
                  setLang('en_US', strings)
                  incrementLangUpdates()
                  // Save indicators to indicator list.
                  // console.log('indicators, ', indicators)
                  addIndicators(indicators)
                  const indicatorKeys = indicators.map(
                    el => {
                      return el.id
                    },
                  )
                  const routeSet = ROUTE_SET
                  // console.log('routeSet, ', routeSet)
                  const metricIndex = routeSet
                    .map(el => {
                      return el.id
                    })
                    .indexOf('metric')
                  // console.log('metricIndex, ', metricIndex)
                  routeSet[
                    metricIndex
                  ].options = indicatorKeys
                  // console.log('routeSet, ', routeSet)
                  // Save point types to point type list
                  const activePointTypes = pointTypes.map(
                    el => {
                      return 0
                    },
                  )
                  // console.log('result.data, ', result.data)
                  setStoreValues({
                    routeSet: routeSet,
                    pointTypes: pointTypes,
                    activePointTypes: activePointTypes,
                    allData: result.data,
                  })
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
  }, [])

  return <DataLoaderContent />
}

export default DataLoader
