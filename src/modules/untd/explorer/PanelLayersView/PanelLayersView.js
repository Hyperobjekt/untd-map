import React, { useState, useEffect, setState } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import { Button, Label, Input, Tooltip } from 'reactstrap'
import clsx from 'clsx'
import {
  FiFilter,
  FiMap,
  FiList,
  FiMenu,
  FiInfo,
} from 'react-icons/fi'
import { MdCallSplit } from 'react-icons/md'

import useStore from './../store'
import {
  UNTD_LAYERS,
  UNTD_LAYER_GROUPS,
} from './../../../../constants/layers'
import { toSentenceCase } from './../utils'

const PanelLayersView = ({ ...props }) => {
  // Generic store value setter.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  // Active layers
  const activeLayers = useStore(
    state => [...state.activeLayers],
    shallow,
  )

  const getLayerLabel = id => {
    const layer = UNTD_LAYERS.find(gr => gr.id === id)
    return layer.label
  }

  const updateLayers = e => {
    // If item is checked, if it's not in array, push it into array
    // If item is not checked, if it's in array, remove
    // If the element is an only-one element, reset other only-ones of same name.
    const el = document.getElementById(e.currentTarget.id)
    // Index in immediate set.
    const index = Number(
      String(e.currentTarget.id).replace('layer_', ''),
    )
    // All layer inputs.
    const allInputs = Array.prototype.slice.call(
      document.querySelectorAll('.layer-group input'),
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
        {UNTD_LAYER_GROUPS.map((el, i) => {
          return (
            <div
              className={clsx(
                'layer-group',
                'layer-group-' + i,
              )}
              key={'layer-group-' + i + '-' + layersKey}
            >
              <h5 key={'layer-group-header-' + i}>
                {i18n.translate(el.title)}
              </h5>
              <div
                key={'layer-group-desc-' + i}
                className="layer-group-desc"
                dangerouslySetInnerHTML={{
                  __html: i18n.translate(el.desc),
                }}
              ></div>
              <div
                className={clsx(
                  'layer-group',
                  'layer-group-layers-' + i,
                )}
                key={'layer-group-layers-' + i}
              >
                {UNTD_LAYERS.map((layer, ind) => {
                  if (layer.group === el.id) {
                    // to manage tooltip state
                    const [
                      tooltipOpen,
                      setTooltipOpen,
                    ] = useState(false)
                    const toggle = () =>
                      setTooltipOpen(!tooltipOpen)
                    // console.log(
                    //   'rendering layer checkbox, ',
                    //   activeLayers,
                    // )
                    const isChecked = !!activeLayers[
                      ind // Number(layer.index)
                    ]
                    return (
                      <div
                        className="layer"
                        key={`layer-${layer.id}`}
                        id={`layer-${layer.id}`}
                      >
                        <label
                          key={`label-${layer.id}`}
                          id={`label-${layer.id}`}
                        >
                          <input
                            type="checkbox"
                            id={`layer_${i}_${layer.index}`}
                            name="scales"
                            key={'layer-input-' + layer.id}
                            data-only-one={layer.only_one}
                            data-only-one-name={
                              layer.only_one_name
                            }
                            data-item-index={2}
                            checked={isChecked}
                            readOnly={true}
                            onClick={e => {
                              updateLayers(e)
                            }}
                          />
                          <div className="checkmark"></div>
                          {toSentenceCase(
                            i18n.translate(
                              getLayerLabel(layer.id),
                            ),
                          )}
                          {!!el.tooltip &&
                            el.tooltip.length > 0 && (
                              <FiInfo
                                id={
                                  'tip_prompt_' + layer.id
                                }
                              />
                            )}
                        </label>
                        {!!el.tooltip &&
                          el.tooltip.length > 0 && (
                            <Tooltip
                              placement="top"
                              isOpen={tooltipOpen}
                              target={
                                'tip_prompt_' + layer.id
                              }
                              toggle={toggle}
                              autohide={false}
                              className={'tip-prompt-layer'}
                              dangerouslySetInnerHTML={{
                                __html: i18n.translate(
                                  layer.tooltip,
                                ),
                              }}
                            ></Tooltip>
                          )}
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PanelLayersView
