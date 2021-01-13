import React, { useState, useEffect, setState } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { MdCallSplit } from 'react-icons/md'

import useStore from './../store'
import {
  UNTD_LAYERS,
  UNTD_LAYER_GROUPS,
} from './../../../../constants/layers'
import { toSentenceCase } from './../utils'
import LayersInput from './LayersInput'

const PanelLayersView = ({ ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const activeLayers = useStore(state => state.activeLayers)
  const pointTypes = useStore(state => state.pointTypes)
  const activePointTypes = useStore(
    state => state.activePointTypes,
  )

  const getItems = el => {
    switch (el.list) {
      case 'UNTD_LAYERS':
        return UNTD_LAYERS
        break
      case 'pointTypes':
        return pointTypes
        break
      default:
        return UNTD_LAYERS
    }
  }

  const getLayerLabel = (id, items) => {
    const layer = items.find(gr => gr.id === id)
    return layer.label
  }

  const updatePoints = e => {
    console.log('updatePoints, ', e, e.currentTarget.id)
    // If item is checked, if it's not in array, push it into array
    // If item is not checked, if it's in array, remove
    // If the element is an only-one element, reset other only-ones of same name.
    const el = document.getElementById(e.currentTarget.id)
    console.log('el, ', el)
    // Index in immediate set.
    // const index = Number(
    //   String(e.currentTarget.id).replace('layer_', ''),
    // )
    // console.log('index, ', index)
    // All layer inputs.
    const allInputs = Array.prototype.slice.call(
      document.querySelectorAll(
        '.layer-group-layers-points input',
      ),
    )
    console.log('allInputs, ', allInputs)
    // Overall index.
    const allIndex = allInputs.indexOf(el)
    console.log('allIndex, ', allIndex)
    // Dataset of selected item.
    const dataset = el.dataset
    // New activeLayers array to manipulate without
    // messing up the app state.
    let newPointTypes = activePointTypes.slice()
    if (dataset.onlyOne === 'true') {
      // console.log('it is an only-one')
      const name = dataset.onlyOneName
      // Remove all the matching only-ones from the activeLayers array.
      pointTypes.forEach((el, i) => {
        if (
          el.only_one === true &&
          el.only_one_name === name &&
          i !== allIndex
        ) {
          newPointTypes[Number(el.index)] = 0
        }
      })
    }
    newPointTypes[allIndex] =
      newPointTypes[allIndex] === 1 ? 0 : 1
    setStoreValues({
      activePointTypes: newPointTypes,
    })
  }

  const updateLayers = e => {
    // If item is checked, if it's not in array, push it into array
    // If item is not checked, if it's in array, remove
    // If the element is an only-one element, reset other only-ones of same name.
    const el = document.getElementById(e.currentTarget.id)
    // Index in immediate set.
    // const index = Number(
    //   String(e.currentTarget.id).replace('layer_', ''),
    // )
    // All layer inputs.
    const allInputs = Array.prototype.slice.call(
      document.querySelectorAll(
        '.layer-group-layers-geo input',
      ),
    )
    // Overall index.
    const allIndex = allInputs.indexOf(el)
    // Dataset of selected item.
    const dataset = el.dataset
    // New activeLayers array to manipulate without
    // messing up the app state.
    let newLayers = activeLayers.slice()
    if (dataset.onlyOne === 'true') {
      // console.log('it is an only-one')
      const name = dataset.onlyOneName
      // Remove all the matching only-ones from the activeLayers array.
      UNTD_LAYERS.forEach((el, i) => {
        if (
          el.only_one === true &&
          el.only_one_name === name &&
          i !== allIndex
        ) {
          newLayers[Number(el.index)] = 0
        }
      })
    }
    newLayers[allIndex] = newLayers[allIndex] === 1 ? 0 : 1
    setStoreValues({
      activeLayers: newLayers,
    })
  }

  const [layersKey, setLayersKey] = useState(0)
  useEffect(() => {
    // console.log('activeLayers changed')
    setLayersKey(layersKey + 1)
  }, [activeLayers])

  return (
    <div
      className="map-panel-slideout-layers"
      key={layersKey}
    >
      <div className={clsx(`map-layer-toggle-pane`)}>
        <div
          className={clsx('layer-group', 'layer-group-geo')}
          key={'layer-group-geo-' + layersKey}
        >
          <h5 key={'layer-group-header-geo'}>
            {i18n.translate(`UI_MAP_LAYER_0_TITLE`)}
          </h5>
          <div
            key={'layer-group-desc-geo'}
            className="layer-group-desc"
            dangerouslySetInnerHTML={{
              __html: i18n.translate(`UI_MAP_LAYER_0_DESC`),
            }}
          ></div>
          <div
            className={clsx(
              'layer-group',
              'layer-group-layers-geo',
            )}
            key={'layer-group-layers-geo'}
          >
            {UNTD_LAYERS.map((layer, ind) => {
              const isChecked = !!activeLayers[
                ind // Number(layer.index)
              ]
              return (
                <LayersInput
                  key={`layer-input-${layer.id}`}
                  id={`input_${layer.id}_${ind}`}
                  layer={layer}
                  ind={ind}
                  isChecked={isChecked}
                  label={getLayerLabel(
                    layer.id,
                    UNTD_LAYERS,
                  )}
                  tooltip={layer.tooltip}
                  update={updateLayers}
                />
              )
            })}
          </div>
        </div>
        <div className={clsx(`map-layer-toggle-pane`)}>
          <div
            className={clsx(
              'layer-group',
              'layer-group-points',
            )}
            key={'layer-group-points-' + layersKey}
          >
            <h5 key={'layer-group-header-points'}>
              {i18n.translate(`UI_MAP_LAYER_1_TITLE`)}
            </h5>
            <div
              key={'layer-group-desc-points'}
              className="layer-group-desc"
              dangerouslySetInnerHTML={{
                __html: i18n.translate(
                  `UI_MAP_LAYER_1_DESC`,
                ),
              }}
            ></div>
            <div
              className={clsx(
                'layer-group',
                'layer-group-layers-points',
              )}
              key={'layer-group-layers-points'}
            >
              {pointTypes.map((layer, ind) => {
                const isChecked = !!activePointTypes[
                  ind // Number(layer.index)
                ]
                return (
                  <LayersInput
                    key={`layer-input-${layer.id}`}
                    layer={layer}
                    id={`input_${layer.id}_${ind}`}
                    ind={ind}
                    isChecked={isChecked}
                    label={getLayerLabel(
                      layer.id,
                      pointTypes,
                    )}
                    tooltip={layer.tooltip}
                    update={updatePoints}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PanelLayersView
