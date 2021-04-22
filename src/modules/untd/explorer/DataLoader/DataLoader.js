import React, { useEffect, useState } from 'react'
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
import { UNTD_LAYERS } from './../../../../constants/layers'

const isTruthy = val => {
  return (
    String(val).toLowerCase() === 'yes' || Number(val) === 1
  )
}

const GenerateMinMaxes = () => {
  // console.log('GenerateMinMaxes')

  const {
    allDataLoaded,
    remoteJson,
    indicators,
    setStoreValues,
    indicatorRangesSet,
    allData,
    trendData,
    trendMinMaxSet,
  } = useStore(state => ({
    allDataLoaded: state.allDataLoaded,
    remoteJson: state.remoteJson,
    indicators: state.indicators,
    setStoreValues: state.setStoreValues,
    indicatorRangesSet: state.indicatorRangesSet,
    allData: state.allData,
    trendData: state.trendData,
    trendMinMaxSet: state.trendMinMaxSet,
  }))

  // console.log('GenerateMinMaxes, allData: ', allData)

  const localIndicators = indicators.slice()
  useEffect(() => {
    /**
     * Stores a minimum and maximum for the trend data for
     * a given geographic shape. This is done so that the
     * y-axis of the trend charts for each metric is relevant
     * to the metric's overall data range for that shape type.
     */
    if (!!allDataLoaded && !trendMinMaxSet) {
      // console.log('calculating trend minmaxes')
      // Fetch each column in the dataset
      const columns = Object.keys(trendData[0]).filter(
        item => {
          return (
            indicators.filter(indicator => {
              return (
                `${item}_19_sd` === indicator.id &&
                indicator.display === 1
              )
            }).length > 0
          )
        },
      )
      columns.forEach(col => {
        // console.log('col: ', col, `${col}_19_sd`)
        const metric = allData.find(el => {
          return el.variable === `${col}_19`
        })
        // console.log(`metric for ${col}: `, metric)
        // Adds some general number format information
        // about the metric from the data dictionary.
        localIndicators.find(el => {
          return el.id === `${col}_19_sd`
        }).trend = {
          id: col,
          min: [undefined, undefined, undefined],
          max: [undefined, undefined, undefined],
          decimals: Number(metric.decimals),
          highisgood: Number(metric.highisgood),
          currency: Number(metric.currency),
          percent: Number(metric.percent),
        }
      })
      // console.log('columns = ', columns)
      // console.log('trendData = ', trendData)
      UNTD_LAYERS.forEach((layer, ind) => {
        // console.log('layer, ', layer)
        // Store an entry with min and max for each shape type
        // Filter the data to get the right shape.
        const shapeSet = trendData.filter(el => {
          return String(el.type).toLowerCase() === layer.id
        })
        // console.log('shapeSet: ', shapeSet)
        // For each column, for each shape type,
        // store the min and the max.
        columns.forEach(col => {
          const metricSet = shapeSet.map(i => {
            return Number(i[col])
          })
          const min = Math.min(...metricSet)
          const max = Math.max(...metricSet)
          localIndicators.find(el => {
            return el.id === `${col}_19_sd`
          }).trend.min[ind] = min
          localIndicators.find(el => {
            return el.id === `${col}_19_sd`
          }).trend.max[ind] = max
        })
      })
      setStoreValues({
        trendMinMaxSet: true,
        indicators: localIndicators,
        // indicatorRangesSet: true,
      })
    }
  }, [allDataLoaded])
  // Returns nothing
  return ''
}

const DataLoaderContent = ({ ...props }) => {
  // console.log('DataLoaderContent, ', variables)

  const {
    dataLoadedPercent,
    allDataLoaded,
    dataIssuesLog,
  } = useStore(state => ({
    dataLoadedPercent: state.dataLoadedPercent,
    allDataLoaded: state.allDataLoaded,
    dataIssuesLog: state.dataIssuesLog,
  }))

  const showDataIssues = Number(
    process.env.GATSBY_SHOW_DATA_ISSUES,
  )
  const gitBranch = process.env.GATSBY_DATA_BRANCH

  const [renderDataIssues, setRenderDataIssues] = useState(
    false,
  )

  useEffect(() => {
    // console.log('allDataLoaded changed, ', allDataLoaded)
    if (!!allDataLoaded && dataLoadedPercent === 100) {
      // console.log('All data loaded.')
      if (dataIssuesLog.length > 0) {
        if (!!showDataIssues) {
          setRenderDataIssues(true)
        } else {
          console.error(
            `${dataIssuesLog.length} issues with remote data sources on branch ${gitBranch} detected:`,
            dataIssuesLog,
          )
        }
      }
    }
  }, [allDataLoaded, dataLoadedPercent])

  return (
    <div
      className={clsx(
        'data-loader',
        !!allDataLoaded && !renderDataIssues
          ? 'all-loaded'
          : '',
      )}
    >
      <div className="center">
        {!renderDataIssues && (
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
        {!!renderDataIssues && (
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
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      setRemoteJson: state.setRemoteJson,
      setLang: state.setLang,
      incrementLangUpdates: state.incrementLangUpdates,
      addIndicators: state.addIndicators,
      addTooltipItems: state.addTooltipItems,
      addDataIssuesLog: state.addDataIssuesLog,
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
            if (el.ext === 'json' || el.ext === 'geojson') {
              const _data = JSON.parse(xhr.responseText)
              if (
                el.type !== 'point' &&
                el.type !== 'data'
              ) {
                // Add ids to every feature.
                _data.features = _data.features.map(
                  feature => {
                    feature.id = Math.round(
                      Math.random() * 1000000000000,
                    )
                    return feature
                  },
                )

                // Create an object to save to the store.
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
                _data.features.forEach(d => {
                  if (
                    !d.properties.label ||
                    d.properties.label.length <= 0 ||
                    d.properties.label === undefined
                  ) {
                    missingLabel = true
                  }
                })
                if (!!missingLabel) {
                  addDataIssuesLog([
                    `Some label point features in collection <code>${el.id}</code> are missing a label.`,
                  ])
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
                addDataIssuesLog([
                  `Some features in collection <code>${el.id}</code> are missing an id.`,
                ])
              }
              if (!!missingId) {
                addDataIssuesLog([
                  `Some features in collection <code>${el.id}</code> are missing a GEOID.`,
                ])
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
                    // generateId: true,
                    promoteId: 'GEOID',
                  }
                  setRemoteJson(obj)
                })
                setStoreValues({
                  pointTypeLayers: point_types,
                })
              }
            }
            if (el.ext === 'csv') {
              // Parse the file and merge with lang file.
              const parse = Papa.parse(xhr.responseText, {
                header: true,
                complete: result => {
                  if (el.type === 'data') {
                    setStoreValues({
                      [el.storeTarget]: result.data,
                    })
                  }

                  if (el.type === 'dict') {
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
                          addDataIssuesLog([
                            `Label not provided for <code>${r.variable}</code> in data dictionary.`,
                          ])
                        }
                        if (r[el.lang_desc].length > 0) {
                          strings[
                            `${r[el.lang_key]}_desc`
                          ] =
                            r[el.lang_desc].length > 0
                              ? r[el.lang_desc]
                              : `${
                                  r[el.lang_key]
                                } description not provided`
                        } else {
                          addDataIssuesLog([
                            `Description not provided for <code>${r.variable}</code> in data dictionary.`,
                          ])
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
                          mean: r['mean']
                            ? r['mean']
                            : null,
                          highisgood: isTruthy(
                            r['highisgood'],
                          ),
                          currency: isTruthy(r['currency']),
                          percent: isTruthy(r['percent']),
                          decimals: Number(r['decimals']),
                          years: r['years'].toLowerCase(),
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
                                return (
                                  item.id === r.variable
                                )
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
                          // Check for category and subcategory.
                          if (
                            String(r['category_order'])
                              .length < 1
                          ) {
                            addDataIssuesLog([
                              `No <code>category_order</code> set for point type <code>${r.variable}</code>`,
                            ])
                          }
                          if (
                            String(r['subcategory_order'])
                              .length < 1
                          ) {
                            addDataIssuesLog([
                              `No <code>subcategory_order</code> set for point type <code>${r.variable}</code>`,
                            ])
                          }
                          if (
                            String(r['category']).length < 1
                          ) {
                            addDataIssuesLog([
                              `No category set for point type <code>${r.variable}</code>`,
                            ])
                          }
                          // Check for capital letters in point category
                          // Check for spaces in point categoroy
                          // Check for special characters in point category
                          const capAndSpecCharsRegex = /([\@\!\%\^\&\*\(\)\#\ \.\+\/A-Z])/g
                          if (
                            r['category'] &&
                            r['category'].match(
                              capAndSpecCharsRegex,
                            )
                          ) {
                            addDataIssuesLog([
                              `Category <code>${r['category']}</code> listed for point type <code>${r.variable}</code> has capital letters, spaces, or special characters. The map app will probably still work but cannot make clear assumptions about category names or sorting if the category is not in the format of a category ID.`,
                            ])
                          }
                        } else {
                          addDataIssuesLog([
                            `Duplicate point type <code>${r.variable}</code> in data dictionary.`,
                          ])
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
                        // If it already exists, flag duplicate.
                        if (!!exists) {
                          addDataIssuesLog([
                            `Duplicate indicator <code>${
                              r[el.lang_key]
                                ? r[el.lang_key]
                                : r.variable
                            }</code> in data dictionary.`,
                          ])
                        }
                        // If it does not yet exist in indicators array
                        // And it is to be displayed, add to indicators array.
                        if (
                          !exists &&
                          r[el.ind_key] === el.ind_flag &&
                          Number(r['display_variable']) ===
                            1
                        ) {
                          // console.log('adding an indicator')
                          indicators.push({
                            id: r[el.lang_key]
                              ? r[el.lang_key]
                              : r.variable,
                            display: isTruthy(
                              r['display_variable'],
                            )
                              ? 1
                              : 0,
                            highisgood: isTruthy(
                              r['highisgood'],
                            )
                              ? 1
                              : 0,
                            min: Number(r['min']),
                            max: Number(r['min']),
                            currency: Number(r['currency']),
                            percent: Number(r['percent']),
                            decimals: Number(r['decimals']),
                            category: r['category']
                              .toLowerCase()
                              .replace(/ /g, ''),
                            years: r['years'].toLowerCase(),
                            placeTypes: r['place']
                              .toLowerCase()
                              .replace(/ /g, '')
                              .split(','),
                            order: r['indicator_order'],
                          })
                          // Check for capital letters in point category
                          // Check for spaces in point categoroy
                          // Check for special characters in point category
                          const capAndSpecCharsRegex = /([\@\!\%\^\&\*\(\)\#\ \.\+\/A-Z])/g
                          if (
                            r['category'] &&
                            r['category'].match(
                              capAndSpecCharsRegex,
                            )
                          ) {
                            addDataIssuesLog([
                              `Category <code>${
                                r['category']
                              }</code> listed for indicator <code>${
                                r[el.lang_key]
                                  ? r[el.lang_key]
                                  : r.variable
                              }</code> has capital letters, spaces, or special characters. The map app will probably still work but cannot make clear assumptions about category names or sorting if the category is not in the format of a category ID.`,
                            ])
                          }
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
                    missingIndicatorCategories.forEach(
                      el => {
                        addDataIssuesLog([
                          `Missing entry for category <code>${el}</code> detected when checking indicator category entries in data dictionary. Please add a row with varable <code>${el}</code> that contains a label and description.`,
                        ])
                      },
                    )
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
                      addDataIssuesLog([
                        `Missing entry for category <code>${el}</code> detected when checking point type categories  in data dictionary. Please add a row with varable <code>${el}</code> that contains a label and description.`,
                      ])
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
                    // console.log(
                    //   'indicators array from data dict, ',
                    //   indicators,
                    // )
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
                  }
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

  return (
    <>
      <DataLoaderContent />
      <GenerateMinMaxes />
    </>
  )
}

export default DataLoader
