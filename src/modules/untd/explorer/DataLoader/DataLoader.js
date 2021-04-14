import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { Progress } from 'reactstrap'
import clsx from 'clsx'
import * as Papa from 'papaparse'
import * as Turf from '@turf/turf'
import shallow from 'zustand/shallow'

import useStore from './../store.js'
import {
  DATA_FILES,
  ROUTE_SET,
} from './../../../../constants/map'

const isTruthy = val => {
  return (
    String(val).toLowerCase() === 'yes' || Number(val) === 1
  )
}

const DataLoaderContent = ({ ...props }) => {
  // console.log('DataLoaderContent, ', variables)

  const {
    dataLoadedPercent,
    allDataLoaded,
    dataIssues,
    dataIssuesLog,
  } = useStore(state => ({
    dataLoadedPercent: state.dataLoadedPercent,
    allDataLoaded: state.allDataLoaded,
    dataIssues: state.dataIssues,
    dataIssuesLog: state.dataIssuesLog,
  }))

  const showDataIssues = Number(
    process.env.GATSBY_SHOW_DATA_ISSUES,
  )
  const gitBranch = process.env.GATSBY_DATA_BRANCH

  return (
    <div
      className={clsx(
        'data-loader',
        !!allDataLoaded && !dataIssues && !showDataIssues
          ? 'all-loaded'
          : '',
      )}
    >
      <div className="center">
        {!dataIssues && (
          <>
            <h2>
              {i18n.translate(`LOADING_DATA`)}
              <span className={clsx('loading-dot')}>.</span>
              <span className={clsx('loading-dot')}>.</span>
              <span className={clsx('loading-dot')}>.</span>
            </h2>
            <Progress value={dataLoadedPercent} />
          </>
        )}
        {!!dataIssues && !!showDataIssues && (
          <>
            <h2
              dangerouslySetInnerHTML={{
                __html: `${dataIssuesLog.length} issues with remote data sources on branch <code>${gitBranch}</code> detected:`,
              }}
            ></h2>
            <ul className={clsx('data-issues-list')}>
              {dataIssuesLog.map((item, ind) => (
                <li
                  key={`data-issue-${ind}`}
                  dangerouslySetInnerHTML={{
                    __html: item,
                  }}
                ></li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

const DataLoader = ({ ...props }) => {
  const {
    setStoreValues,
    setRemoteJson,
    setLang,
    incrementLangUpdates,
    addIndicators,
    addTooltipItems,
    addDataIssuesLog,
    allDataLoaded,
    dataLoadedPercent,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      setRemoteJson: state.setRemoteJson,
      setLang: state.setLang,
      incrementLangUpdates: state.incrementLangUpdates,
      addIndicators: state.addIndicators,
      addTooltipItems: state.addTooltipItems,
      addDataIssuesLog: state.addDataIssuesLog,
      allDataLoaded: state.allDataLoaded,
      dataLoadedPercent: state.dataLoadedPercent,
    }),
    shallow,
  )

  // console.log(
  //   'DataLoader: process.env.GATSBY_SHOW_DATA_ISSUES, ',
  //   process.env.GATSBY_SHOW_DATA_ISSUES,
  // )

  const showDataIssues = Number(
    process.env.GATSBY_SHOW_DATA_ISSUES,
  )
  const gitBranch = process.env.GATSBY_DATA_BRANCH

  // Fetch each file, and update the objects you need to update.
  const files = DATA_FILES
  // Counter for loaded files.
  let loadedCount = 0
  // Track whether data issues are detected.
  let hasDataIssues = false
  // const dataIssuesLog = []

  // Load each file.
  // Set each file to the store.
  // Update loaded percent.
  // Update overall loading tracking.
  useEffect(() => {
    files.forEach((el, i) => {
      const xhr = new XMLHttpRequest()
      const path = `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/${el.filename}.${el.ext}.gz`
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
            //   el.id,
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
                // console.log('setting remote json, ', el.id)
                setRemoteJson(obj)
              }

              let missingLabel = false
              if (el.type === 'label') {
                console.log('type is label, ', _data)
                _data.features.forEach(d => {
                  // console.log(
                  //   d.properties.GEOID,
                  //   d.properties.label,
                  //   d.properties.label === undefined,
                  //   !d.properties.label ||
                  //     d.properties.label.length <= 0 ||
                  //     d.properties.label === undefined,
                  // )
                  if (
                    !d.properties.label ||
                    d.properties.label.length <= 0 ||
                    d.properties.label === undefined
                  ) {
                    missingLabel = true
                  }
                })
                if (!!missingLabel) {
                  hasDataIssues = true
                  dataIssuesLog.push(
                    `Some label point features in collection <code>${el.id}</code> are missing a label.`,
                  )
                }
              }

              // Check that every feature has an ID.
              // Check that every feature has a GEOID.
              let missingGeoid = false
              let missingId = false
              _data.features.forEach(d => {
                if (
                  !d.properties.GEOID ||
                  d.properties.GEOID.length <= 0 ||
                  d.properties.GEOID === undefined
                ) {
                  missingGeoid = true
                }
                if (!d.id || d.id === undefined) {
                  missingId = true
                }
              })
              if (!!missingGeoid) {
                hasDataIssues = true
                dataIssuesLog.push(
                  `Some some features in collection <code>${el.id}</code> are missing an id.`,
                )
              }
              if (!!missingId) {
                hasDataIssues = true
                dataIssuesLog.push(
                  `Some some features in collection <code>${el.id}</code> are missing a GEOID.`,
                )
              }

              console.log(
                'dataIssuesLog line 220, ',
                dataIssuesLog,
              )

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
                  const tooltipItems = []

                  result.data.forEach(r => {
                    // Build lang string.
                    if (r[el.lang_key]) {
                      // console.log(
                      //   'Lang strings present, adding, ',
                      //   r,
                      // )
                      // if (r.variable === 'ALAND') {
                      //   console.log(
                      //     'aland, ',
                      //     r[el.lang_desc],
                      //     r[el.lang_desc].length,
                      //   )
                      // }

                      if (r[el.lang_label].length > 0) {
                        strings[r[el.lang_key]] =
                          r[el.lang_label].length > 0
                            ? r[el.lang_label]
                            : `${
                                r[el.lang_key]
                              } label not provided`
                      } else {
                        hasDataIssues = true
                        dataIssuesLog.push(
                          `Label not provided for <code>${r.variable}</code> in data dictionary.`,
                        )
                      }
                      if (r[el.lang_desc].length > 0) {
                        strings[`${r[el.lang_key]}_desc`] =
                          r[el.lang_desc].length > 0
                            ? r[el.lang_desc]
                            : `${
                                r[el.lang_key]
                              } description not provided`
                      } else {
                        hasDataIssues = true
                        dataIssuesLog.push(
                          `Description not provided for <code>${r.variable}</code> in data dictionary.`,
                        )
                      }
                    }

                    // Build list of tooltip items
                    if (
                      !!r.variable &&
                      isTruthy(r.tooltip)
                    ) {
                      // TODO: ADD CHECK FOR DUPLICATE tooltip items.
                      // console.log('tooltip item, ', r)
                      tooltipItems.push({
                        id: r[el.lang_key]
                          ? r[el.lang_key]
                          : r.variable,
                        display: isTruthy(
                          r['display_variable'],
                        ),
                        min: r['min'] ? r['min'] : 0,
                        max: r['max'] ? r['max'] : 100,
                        range: r['range']
                          ? r['range']
                          : null,
                        mean: r['mean'] ? r['mean'] : null,
                        highisgood: isTruthy(
                          r['highisgood'],
                        ),
                        currency: isTruthy(r['currency']),
                        percent: isTruthy(r['percent']),
                        decimals: Number(r['decimals']),
                        years: r['years']
                          .toLowerCase()
                          .replace(/ /g, '')
                          .split(','),
                        placeTypes: r['place']
                          .toLowerCase()
                          .replace(/ /g, '')
                          .split(','),
                        order: Number(r['tooltip_order']),
                      })
                    }

                    // Build point types list
                    if (
                      r.type === 'point' &&
                      !!r.variable
                    ) {
                      const pointAlreadyExists =
                        pointTypes.length === 0
                          ? false
                          : !!pointTypes.find(item => {
                              return item.id === r.variable
                            })
                      if (!pointAlreadyExists) {
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
                          category_order: r[
                            'category_order'
                          ]
                            ? r['category_order']
                            : 0,
                          subcategory_order: r[
                            'subcategory_order'
                          ]
                            ? r['subcategory_order']
                            : 0,
                        })
                        if (
                          r['category'] &&
                          pointCategories.indexOf(
                            r['category'],
                          ) <= -1
                        ) {
                          pointCategories.push(
                            r['category'],
                          )
                        }
                      } else {
                        hasDataIssues = true
                        dataIssuesLog.push(
                          `Duplicate point type <code>${r.variable}</code> in data dictionary.`,
                        )
                      }
                    }

                    if (r.type === 'sd') {
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
                          display:
                            // String(r.variable).indexOf('18') >
                            // 0
                            //   ? 1
                            //   : 0,
                            isTruthy(r['display_variable'])
                              ? 1
                              : 0,
                          min: r['min']
                            ? Number(r['min'])
                            : 0,
                          max: r['max']
                            ? Number(r['max'])
                            : 100,
                          range: r['range']
                            ? Number(r['range'])
                            : null,
                          mean: r['mean']
                            ? Number(r['mean'])
                            : null,
                          highisgood:
                            // String(
                            //   r['highisgood'],
                            // ).toLowerCase() === 'yes'
                            isTruthy(r['highisgood'])
                              ? 1
                              : 0,
                          iscurrency: Number(r['currency']),
                          ispercent: Number(r['percent']),
                          decimals: Number(r['decimals']),
                          category: r['category']
                            .toLowerCase()
                            .replace(/ /g, ''),
                          years: r['years']
                            .toLowerCase()
                            .replace(/ /g, '')
                            .split(','),
                          placeTypes: r['place']
                            .toLowerCase()
                            .replace(/ /g, '')
                            .split(','),
                          order: r['indicator_order'],
                        })
                      } else {
                        hasDataIssues = true
                        dataIssuesLog.push(
                          `Duplicate indicator <code>${
                            r[el.lang_key]
                              ? r[el.lang_key]
                              : r.variable
                          }</code> in data dictionary.`,
                        )
                      }
                    }
                  })

                  // Check that each category assigned to a point or indicator
                  // has a language pack entry.
                  const missingIndicatorCategories = []
                  indicators.forEach(i => {
                    if (!strings[i.category]) {
                      if (
                        missingIndicatorCategories.indexOf(
                          i.category,
                        ) < 0
                      ) {
                        missingIndicatorCategories.push(
                          i.category,
                        )
                      }
                    }
                  })
                  missingIndicatorCategories.forEach(el => {
                    hasDataIssues = true
                    dataIssuesLog.push(
                      `Missing entry for category <code>${el}</code> detected when checking indicator category entries in data dictionary. Please add a row with varable <code>${el}</code> that contains a label and description.`,
                    )
                  })
                  // pointTypes
                  const missingPointCategories = []
                  pointTypes.forEach(p => {
                    if (!strings[p.category]) {
                      if (
                        missingPointCategories.indexOf(
                          p.category,
                        ) < 0
                      ) {
                        missingPointCategories.push(
                          p.category,
                        )
                      }
                    }
                  })
                  missingPointCategories.forEach(el => {
                    hasDataIssues = true
                    dataIssuesLog.push(
                      `Missing entry for category <code>${el}</code> detected when checking point type categories  in data dictionary. Please add a row with varable <code>${el}</code> that contains a label and description.`,
                    )
                  })

                  // Save strings to string list.
                  // console.log('strings, ', strings)
                  setLang('en_US', strings)
                  incrementLangUpdates()
                  // console.log(
                  //   'tooltipItems, ',
                  //   tooltipItems,
                  // )
                  addTooltipItems(tooltipItems)
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

  // useEffect(() => {
  //   console.log('allDataLoaded changed, ', allDataLoaded)
  //   console.log('dataIssuesLog, ', dataIssuesLog)
  //   console.log('hasDataIssues, ', hasDataIssues)
  //   if (!!allDataLoaded && dataLoadedPercent === 100) {
  //     console.log('All data loaded.')
  //     console.log('dataIssuesLog, ', dataIssuesLog)
  //     console.log('hasDataIssues, ', hasDataIssues)

  //     if (!!hasDataIssues) {
  //       if (!!showDataIssues) {
  //         setStoreValues({ dataIssues: true })
  //         addDataIssuesLog(dataIssuesLog)
  //       } else {
  //         console.error(
  //           `${dataIssuesLog.length} issues with remote data sources on branch ${gitBranch} detected:`,
  //           dataIssuesLog,
  //         )
  //       }
  //     }
  //   }
  // }, [allDataLoaded, dataLoadedPercent])

  return <DataLoaderContent />
}

export default DataLoader
