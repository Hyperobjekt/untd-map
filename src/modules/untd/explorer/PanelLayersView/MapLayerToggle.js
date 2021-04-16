import React, { useState } from 'react'
import i18n from '@pureartisan/simple-i18n'
import { Tooltip } from 'reactstrap'
import clsx from 'clsx'
import { FiInfo } from 'react-icons/fi'

import useStore from '../store'
import { UNTD_STATIC_LAYERS } from './../../../../constants/layers'
import { ROUTE_SET } from './../../../../constants/map'

/**
 * Provides toggle functionality for provided array of layer objects
 */
const MapLayerToggle = ({ ...props }) => {
  // Generic state updates for store.
  // Accepts an object of values to update.
  const setStoreValues = useStore(
    state => state.setStoreValues,
  )
  const activeStaticLayers = useStore(
    state => state.activeStaticLayers,
  )
  // console.log('activeStaticLayers, ', activeStaticLayers)

  const getLayerLabel = id => {
    const layer = UNTD_STATIC_LAYERS.find(
      gr => gr.id === id,
    )
    return layer.label
  }

  const updateLayers = e => {
    // console.log('updateLayers, ', e.currentTarget)
    // Get index of control
    const index = Number(
      String(e.currentTarget.id).replace(
        'layer_static_',
        '',
      ),
    )
    // console.log('index: ', index)
    const newStaticLayers = activeStaticLayers
      .slice()
      .map((el, i) => {
        if (i === index) {
          // return el == 1 ? 0 : 1
          return 1
        } else {
          return 0
        }
      })
    setStoreValues({
      activeStaticLayers: newStaticLayers,
    })
  }

  return (
    <div className="map-layer-toggle">
      {UNTD_STATIC_LAYERS.map((el, i) => {
        // to manage tooltip state
        const [tooltipOpen, setTooltipOpen] = useState(
          false,
        )
        const toggle = () => setTooltipOpen(!tooltipOpen)
        return (
          <div className="layer" key={`layer-${el.id}`}>
            <label
              key={`label-${el.id}`}
              id={`label-${el.id}`}
            >
              <input
                type="radio"
                id={'layer_static_' + i}
                name="scales"
                key={el.id}
                data-only-one={el.only_one}
                data-only-one-name={el.only_one_name}
                checked={
                  activeStaticLayers[i] === 1 ? true : false
                }
                readOnly={true}
                onClick={e => {
                  updateLayers(e)
                }}
              />
              <span>
                {i18n.translate(getLayerLabel(el.id))}
              </span>
              {!!el.tooltip && el.tooltip.length > 0 && (
                <FiInfo id={'tip_prompt_' + el.id} />
              )}
            </label>
            {!!el.tooltip && el.tooltip.length > 0 && (
              <Tooltip
                placement="top"
                isOpen={tooltipOpen}
                target={'tip_prompt_' + el.id}
                toggle={toggle}
                autohide={false}
                className={'tip-prompt-layer'}
                dangerouslySetInnerHTML={{
                  __html: i18n.translate(
                    `STATIC_LAYER_TIP`,
                    {
                      type: el.tooltip,
                    },
                  ),
                }}
              ></Tooltip>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MapLayerToggle
