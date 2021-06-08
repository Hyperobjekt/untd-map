import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import { Progress } from 'reactstrap'
import clsx from 'clsx'
import * as Papa from 'papaparse'
import shallow from 'zustand/shallow'
import useStore from './../store.js'
import { DATA_FILES, ROUTE_SET } from './../../../../constants/map'
import { UNTD_LAYERS } from './../../../../constants/layers'

const isTruthy = val => {
  return String(val).toLowerCase() === 'yes' || Number(val) === 1
}

/**
 * Adds a minimum and maximum for the trend data for
 * a given geographic shape. This is done so that the
 * y-axis of the trend charts for each metric is relevant
 * to the metric's overall data range for that shape type.
 */
const addMinMaxToIndicators = (indicators, allData, trendData) => {
  // create a copy of indicators
  const localIndicators = indicators.slice()
  return useMemo(() => {
    // Fetch each column in the dataset
    const columns = Object.keys(trendData[0]).filter(item => {
      return (
        indicators.filter(indicator => {
          return (
            `${item}_19_sd` === indicator.id &&
            indicator.display === 1
          )
        }).length > 0
      )
    })
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

    UNTD_LAYERS.forEach((layer, ind) => {
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
        const columnIndicator = localIndicators.find(
          el => el.id === `${col}_19_sd`,
        )
        columnIndicator.trend.min[ind] = min
        columnIndicator.trend.max[ind] = max
      })
    })
    return localIndicators
  })
}

const validateJson = (file, data) => {
  let missingLabel = false
  const issues = []
  // check point features have labels
  if (file.type === 'label') {
    data.features.forEach(d => {
      if (
        !d.properties.label ||
        d.properties.label.length <= 0 ||
        d.properties.label === undefined
      ) {
        missingLabel = true
      }
    })
    if (missingLabel) {
      issues.push(
        `Some label point features in collection <code>${file.id}</code> are missing a label.`,
      )
    }
  }

  // Check that every feature has an ID.
  const missingIds = data.features.filter(d => !Boolean(d.id))
  // points do not need id on the root level, so ignore
  if (missingIds.length > 0 && file.id !== 'points')
    issues.push(
      `Some features in collection <code>${file.id}</code> are missing an id.`,
    )

  // Check that every feature has a GEOID.
  const missingGeoids = data.features.filter(
    d => !Boolean(d.properties.GEOID),
  )
  if (missingGeoids.length > 0)
    issues.push(
      `Some features in collection <code>${file.id}</code> are missing a GEOID.`,
    )
  return issues
}

/**
 * Shapes point JSON data into required format
 * @param {*} data
 * @returns
 */
const shapePointData = data => {
  const point_types = []
  json.features.forEach(el => {
    if (point_types.indexOf(el.properties.variable) <= -1) {
      point_types.push(el.properties.variable)
    }
  })
  // Add a geo layer for each point type,
  // so that they cluster independently.
  const remoteJson = point_types.reduce((obj, type) => {
    const pointData = {
      features: data.features.filter(
        feature => feature.properties.variable === type,
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
    return obj
  }, {})
  return [point_types, remoteJson]
}

const createTooltipItems = data => {
  return data
    .filter(r => !!r.variable && isTruthy(r.tooltip))
    .map(r => {
      return {
        id: r[el.lang_key] ? r[el.lang_key] : r.variable,
        display: isTruthy(r['display_variable']),
        min: r['min'] ? r['min'] : 0,
        max: r['max'] ? r['max'] : 100,
        range: r['range'] ? r['range'] : null,
        mean: r['mean'] ? r['mean'] : null,
        highisgood: isTruthy(r['highisgood']),
        currency: isTruthy(r['currency']),
        percent: isTruthy(r['percent']),
        decimals: Number(r['decimals']),
        years: r['years'].toLowerCase(),
        placeTypes: r['place']
          .toLowerCase()
          .replace(/ /g, '')
          .split(','),
        order: Number(r['tooltip_order']),
      }
    })
}

const createStrings = data => {
  const strings = {}
  const issues = []
  data.forEach(r => {
    // Build lang string.
    if (r[el.lang_key]) {
      if (r[el.lang_label].length > 0) {
        strings[r[el.lang_key]] = r[el.lang_label]
      } else {
        issues.push(
          `Label not provided for <code>${r.variable}</code> in data dictionary.`,
        )
      }
      if (r[el.lang_desc].length > 0) {
        strings[`${r[el.lang_key]}_desc`] = r[el.lang_desc]
      } else {
        issues.push(
          `Description not provided for <code>${r.variable}</code> in data dictionary.`,
        )
      }
    }
  })
  return [strings, issues]
}

const createPoints = data => {
  const pointTypes = []
  const pointCategories = []
  const issues = []
  // Build point types list
  data
    .filter(r => r.type === 'point' && !!r.variable)
    .forEach(r => {
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
          category: r['category'] ? r['category'] : false,
          subcategory: r['subcategory'] ? r['subcategory'] : false,
          category_order: r['category_order']
            ? r['category_order']
            : 0,
          subcategory_order: r['subcategory_order']
            ? r['subcategory_order']
            : 0,
        })
        if (
          r['category'] &&
          pointCategories.indexOf(r['category']) <= -1
        ) {
          pointCategories.push(r['category'])
        }
        // Check for category and subcategory.
        if (String(r['category_order']).length < 1) {
          issues.push(
            `No <code>category_order</code> set for point type <code>${r.variable}</code>`,
          )
        }
        if (String(r['subcategory_order']).length < 1) {
          issues.push(
            `No <code>subcategory_order</code> set for point type <code>${r.variable}</code>`,
          )
        }
        if (String(r['category']).length < 1) {
          issues.push(
            `No category set for point type <code>${r.variable}</code>`,
          )
        }
        // Check for capital letters in point category
        // Check for spaces in point categoroy
        // Check for special characters in point category
        const capAndSpecCharsRegex = /([\@\!\%\^\&\*\(\)\#\ \.\+\/A-Z])/g
        if (
          r['category'] &&
          r['category'].match(capAndSpecCharsRegex)
        ) {
          issues.push(
            `Category <code>${r['category']}</code> listed for point type <code>${r.variable}</code> has capital letters, spaces, or special characters. The map app will probably still work but cannot make clear assumptions about category names or sorting if the category is not in the format of a category ID.`,
          )
        }
      } else {
        issues.push(
          `Duplicate point type <code>${r.variable}</code> in data dictionary.`,
        )
      }
    })
  return [pointTypes, pointCategories, issues]
}

/** Create indicators for the store */
const createIndicators = data => {
  const indicators = []
  const issues = []
  data
    .filter(r => r.type === 'sd')
    .forEach(r => {
      // Build indicator list, array of objects.
      const exists =
        indicators.length === 0
          ? false
          : !!indicators.find(item => {
              return item.id === r[el.lang_key]
            })
      // If it already exists, flag duplicate.
      if (!!exists) {
        issues.push(
          `Duplicate indicator <code>${
            r[el.lang_key] ? r[el.lang_key] : r.variable
          }</code> in data dictionary.`,
        )
      }
      // If it does not yet exist in indicators array
      // And it is to be displayed, add to indicators array.
      if (
        !exists &&
        r[el.ind_key] === el.ind_flag &&
        Number(r['display_variable']) === 1
      ) {
        // console.log('adding an indicator')
        indicators.push({
          id: r[el.lang_key] ? r[el.lang_key] : r.variable,
          display: isTruthy(r['display_variable']) ? 1 : 0,
          highisgood: isTruthy(r['highisgood']) ? 1 : 0,
          min: Number(r['min']),
          max: Number(r['min']),
          currency: Number(r['currency']),
          percent: Number(r['percent']),
          decimals: Number(r['decimals']),
          category: r['category'].toLowerCase().replace(/ /g, ''),
          subcategory: r['subcategory'],
          categoryOrder: r['category_order'],
          subcategoryOrder: r['subcategory_order'],
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
          r['category'].match(capAndSpecCharsRegex)
        ) {
          issues.push(
            `Category <code>${
              r['category']
            }</code> listed for indicator <code>${
              r[el.lang_key] ? r[el.lang_key] : r.variable
            }</code> has capital letters, spaces, or special characters. The map app will probably still work but cannot make clear assumptions about category names or sorting if the category is not in the format of a category ID.`,
          )
        }
      }
    })
  return [indicators, issues]
}

/** Validates all indicators and points have a category */
const validateCategories = (strings, indicators) => {
  // Check that each category assigned to a point or indicator
  // has a language pack entry.
  const missingIndicatorCategories = []
  indicators.forEach(i => {
    if (!strings[i.category]) {
      if (missingIndicatorCategories.indexOf(i.category) < 0) {
        missingIndicatorCategories.push(i.category)
        issues.push(
          `Missing entry for category <code>${i.category}</code> detected when checking indicator category entries in data dictionary. Please add a row with varable <code>${i.category}</code> that contains a label and description.`,
        )
      }
    }
  })
  // pointTypes
  const missingPointCategories = []
  pointTypes.forEach(p => {
    if (!strings[p.category]) {
      if (missingPointCategories.indexOf(p.category) < 0) {
        missingPointCategories.push()
        issues.push(
          `Missing entry for category <code>${p.category}</code> detected when checking point type categories  in data dictionary. Please add a row with varable <code>${p.category}</code> that contains a label and description.`,
        )
      }
    }
  })
  return issues
}

/** Shapes the dictionary data */
const shapeDictData = data => {
  const [strings, stringIssues] = createStrings(data)
  const tooltipItems = createTooltipItems(data)
  const [pointTypes, pointCategories, pointIssues] = createPoints(
    data,
  )
  const [indicators, indicatorIssues] = createIndicators(data)
  const categoryIssues = validateCategories(strings, indicators)
  const allIssues = stringIssues
    .concat(pointIssues)
    .concat(indicatorIssues)
    .concat(categoryIssues)

  return {
    strings,
    pointTypes,
    pointCategories,
    tooltipItems,
    issues: allIssues,
    data,
  }
}

/** Loads the point JSON data */
const loadPointJson = (json, file) => {
  if (file.type !== 'point') return
  const issues = validateJson(file, json)
  if (issues) console.warn(issues)
  // Make a list of point types.
  return shapePointData(json)
  // setStoreValues({ pointTypeLayers })
  // setRemoteJson(remoteJson)
}

const loadCsvData = (file, data) => {
  return new Promise((resolve, reject) => {
    Papa.parse(data, {
      header: true,
      complete: result => {
        if (file.type === 'dict')
          return resolve(shapeDictData(result.data))
        return reject('received non-dict csv data')
      },
    })
  })
}

const loadDataFile = file => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const path = `${process.env.GATSBY_DATA_ENDPOINT}/${process.env.GATSBY_DATA_BRANCH}/${file.filename}.${file.ext}.gz`
    // console.log('path, ', path)
    xhr.open('GET', path, true)
    xhr.onload = function (e) {
      // early exit, not ready
      if (xhr.readyState !== 4) return reject('non-ready status')
      // early exit, something failed
      if (xhr.status !== 200) return reject('non-200 status')
      // load point json
      if (file.ext === 'json' || file.ext === 'geojson') {
        resolve(
          loadPointJson(JSON.parse(xhr.responseText), file, xhr),
        )
      }
      // load dict csv
      if (file.ext === 'csv') {
        return loadCsvData(file, xhr.responseText).then(result =>
          resolve(result),
        )
      }
    }
    xhr.onerror = function (e) {
      // Flag something failed.
      reject(xhr.statusText)
    }
    xhr.send(null)
  })
}

const useDataLoader = () => {
  // Fetch each file, and update the objects you need to update.
  const files = DATA_FILES
  useEffect(() => {
    const loadedCount = 0
    files.forEach((file, i) => {
      loadDataFile(file).then(result => {
        const stateChanges = {}
        if (file.type === 'point') {
          // add state changes
        }
        if (file.type === 'dict') {
          // add state changes
        }
        loadedCount++
        stateChanges['dataLoadedPercent'] =
          (loadedCount / files.length) * 100
        stateChanges['allDataLoaded'] = loadedCount === files.length
        setStoreValues(stateChanges)
      })
    })
  }, [])
}

export default useDataLoader
