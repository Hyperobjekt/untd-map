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

function countDecimals(decimal) {
  var num = parseFloat(decimal) // First convert to number to check if whole

  if (Number.isInteger(num) === true) {
    return 0
  }

  var text = num.toString() // Convert back to string and check for "1e-8" numbers

  if (text.indexOf('e-') > -1) {
    var [base, trail] = text.split('e-')
    var deg = parseInt(trail, 10)
    return deg
  } else {
    var index = text.indexOf('.')
    return text.length - index - 1 // Otherwise use simple string function to count
  }
}

const getMinimumPresentableDecimals = (min, max) => {
  let divisor = 1
  if (min < 0) {
    min = min * -1
  }
  if (max < 0) {
    max = max * -1
  }
  while (min / divisor < 1 || max / divisor < 1) {
    divisor = divisor / 10
  }
  // console.log('divisor: ', divisor)
  return countDecimals(divisor)
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
  } = useStore(state => ({
    allDataLoaded: state.allDataLoaded,
    remoteJson: state.remoteJson,
    indicators: state.indicators,
    setStoreValues: state.setStoreValues,
    indicatorRangesSet: state.indicatorRangesSet,
    allData: state.allData,
  }))

  const localIndicators = indicators.slice()

  useEffect(() => {
    // When all data is loaded, iterate through all feature sets
    if (!!allDataLoaded && !indicatorRangesSet) {
      // And set a min, max, and mean for each shape type
      // console.log(
      //   'entering indicators update, ',
      //   indicators,
      // )
      indicators.forEach((i, index) => {
        // Get raw metric from sd in indicator id
        const rawMetric = i.id.replace('_sd', '')
        // Get decimals for raw metric.
        // const decimals = allData.find(el => {
        //   return el.variable === rawMetric
        // }).decimals
        // console.log(
        //   `decimals for raw metric ${rawMetric} = ${decimals}`,
        // )
        // Create placeholders for the values to be calculated.
        i.min = [undefined, undefined, undefined]
        i.max = [undefined, undefined, undefined]
        i.mean = [undefined, undefined, undefined]
        i.decimals = [undefined, undefined, undefined]
        // Iterate through each layer.
        UNTD_LAYERS.forEach((layer, ind) => {
          if (!!layer.calculate_scale_params) {
            // Get feature set from remoteJson
            const featureSet = remoteJson[
              layer.id
            ].data.features
              .filter(item => {
                // Filter out items without this value.
                return (
                  !!item.properties[rawMetric] &&
                  item.properties[rawMetric] !==
                    'undefined' &&
                  item.properties[rawMetric] !== 'NA'
                )
              })
              // Create an array of only these values.
              .map(item => {
                return item.properties[rawMetric]
              })
            // console.log(
            //   `featureSet for layer index ${ind} = `,
            //   featureSet,
            // )
            // Set min, max, and mean to the indicator for the shape
            if (featureSet.length > 0) {
              const min = Math.min(...featureSet)
              const max = Math.max(...featureSet)
              const avg =
                featureSet.reduce(
                  (acc, curr) => acc + curr,
                ) / featureSet.length
              const minimumPresentableDecimals = getMinimumPresentableDecimals(
                min,
                max,
              )
              // console.log(
              //   'minimumPresentableDecimals: ',
              //   minimumPresentableDecimals,
              // )
              const roundBy = Math.pow(
                10,
                minimumPresentableDecimals,
              ) // 1 * minimumPresentableDecimals
              // console.log('roundBy: ', roundBy)
              i.decimals[ind] = minimumPresentableDecimals
              i.min[ind] =
                min < 0
                  ? (Math.round(min * -1 * roundBy) /
                      roundBy) *
                    -1
                  : Math.round(min * roundBy) / roundBy
              i.max[ind] =
                Math.round(max * roundBy) / roundBy
              i.mean[ind] =
                Math.round(avg * roundBy) / roundBy
            }
          }
        })
        // console.log(`completed indicator ${i.id}: `, i)
        // Replace original indicator value with this one.
        localIndicators[index] = i
      })
      // console.log(
      //   'Indicators update complete: ',
      //   indicators,
      // )
      setStoreValues({
        indicators: localIndicators,
        indicatorRangesSet: true,
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
                  `Some some features in collection <code>${el.id}</code> are missing an id.`,
                ])
              }
              if (!!missingId) {
                addDataIssuesLog([
                  `Some some features in collection <code>${el.id}</code> are missing a GEOID.`,
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
                        addDataIssuesLog([
                          `Label not provided for <code>${r.variable}</code> in data dictionary.`,
                        ])
                      }
                      if (r[el.lang_desc].length > 0) {
                        strings[`${r[el.lang_key]}_desc`] =
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

                    // Check for properly formatted years column
                    if (r['years']) {
                      const lettersAndSpecialChars = /([\@\!\%\^\&\*\(\)\#\ \.\+\/a-zA-Z])/g
                      if (
                        r['years'] &&
                        r['years'].match(
                          lettersAndSpecialChars,
                        )
                      ) {
                        addDataIssuesLog([
                          `Years column for row <code>${r.variable}</code> has characters other than ',' and numbes in it. Please compose this column as a comma-delineated list of years.`,
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
                      } else {
                        addDataIssuesLog([
                          `Duplicate indicator <code>${
                            r[el.lang_key]
                              ? r[el.lang_key]
                              : r.variable
                          }</code> in data dictionary.`,
                        ])
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
                    addDataIssuesLog([
                      `Missing entry for category <code>${el}</code> detected when checking indicator category entries in data dictionary. Please add a row with varable <code>${el}</code> that contains a label and description.`,
                    ])
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

  return (
    <>
      <DataLoaderContent />
      <GenerateMinMaxes />
    </>
  )
}

export default DataLoader
