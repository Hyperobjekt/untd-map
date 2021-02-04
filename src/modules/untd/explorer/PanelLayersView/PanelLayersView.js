import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import {
  FormGroup,
  Label,
  Input,
  Collapse,
  Button,
  CustomInput,
} from 'reactstrap'
import { css, cx } from 'emotion'
import { FiChevronRight } from 'react-icons/fi'

import useStore from './../store'
import {
  UNTD_LAYERS,
  UNTD_LAYER_GROUPS,
  POINT_CATEGORIES,
} from './../../../../constants/layers'
import { TURTLE_GREEN } from './../../../../constants/colors'
import { toSentenceCase } from './../utils'
import LayersInput from './LayersInput'

const filterParentStyles = css`
  height: 100%;
  overflow-y: scroll;
`

const mapPanelStyles = css`
  height: 100%;
`

const layerGroupStyles = css`
  height: 100%;
`

const scrollPaneStyles = css`
  margin-bottom: 12rem;
`

const toggleButtonStyles = css`
  border: 0;
  box-shadow: 0;
  text-decoration: none !important;
  font-size: 1.6rem !important;
  color: ${TURTLE_GREEN} !important;
  padding: 0.375rem 0 0 !important;
  &:focus,
  &:active {
    outline: 0;
    box-shadow: none !important;
    text-decoration: none !important;
  }
  svg {
    margin-top: -2px;
    margin-right: 0.6rem;
  }
`

const PanelLayersView = ({ ...props }) => {
  // Generic store value setter.
  const {
    setStoreValues,
    activeLayers,
    pointTypes,
    activePointTypes,
  } = useStore(state => ({
    setStoreValues: state.setStoreValues,
    activeLayers: state.activeLayers,
    pointTypes: state.pointTypes,
    activePointTypes: state.activePointTypes,
  }))

  const getLayerLabel = (id, items) => {
    const layer = items.find(gr => gr.id === id)
    return layer.label
  }

  const updatePoints = e => {
    console.log('updatePoints, ', e, e.currentTarget.id)
    // If item is checked, if it's not in array, push it into array
    // If item is not checked, if it's in array, remove
    // If the element is an only-one element, reset other only-ones of same name.
    const id = e.currentTarget.id.replace(/input_/g, '')
    console.log('id, ', id)
    // Get index in indicator set.
    const index = pointTypes
      .map(type => {
        return type.id
      })
      .indexOf(id)
    let newPointTypes = activePointTypes.slice()
    newPointTypes[index] =
      newPointTypes[index] === 1 ? 0 : 1
    setStoreValues({
      activePointTypes: newPointTypes,
    })
  }

  // const [layersKey, setLayersKey] = useState(0)
  // useEffect(() => {
  //   // console.log('activeLayers changed')
  //   setLayersKey(layersKey + 1)
  // }, [activeLayers])

  console.log('pointTypes, ', pointTypes)

  return (
    <div
      className={clsx(
        'map-panel-slideout-layers',
        cx(mapPanelStyles),
      )}
    >
      <div
        className={clsx(
          `map-layer-toggle-pane`,
          cx(layerGroupStyles),
        )}
      >
        <div
          className={clsx(
            'layer-group',
            'layer-group-points',
            cx(layerGroupStyles),
          )}
        >
          <h5>{i18n.translate(`UI_MAP_LAYER_1_TITLE`)}</h5>
          <div
            key={'layer-group-desc-points'}
            className="layer-group-desc"
            dangerouslySetInnerHTML={{
              __html: i18n.translate(`UI_MAP_LAYER_1_DESC`),
            }}
          ></div>
          <div
            className={clsx(
              'points-group-parent',
              cx(filterParentStyles),
            )}
          >
            <div
              className={clsx(
                'layer-group',
                'layer-group-layers-points',
                cx(scrollPaneStyles),
              )}
              key={'layer-group-layers-points'}
            >
              {POINT_CATEGORIES.map((cat, i) => {
                const [isOpen, setIsOpen] = useState(() => {
                  return i === 0
                })
                const toggle = e => {
                  console.log(e.currentTarget)
                  const button = document.getElementById(
                    e.currentTarget.id,
                  )
                  button.classList.toggle('open')
                  setIsOpen(!isOpen)
                }

                return (
                  <div>
                    <Button
                      id={`show-${cat.id}`}
                      color="link"
                      onClick={toggle}
                      className={clsx(
                        'points-cat-toggle',
                        isOpen ? 'open' : '',
                        cx(toggleButtonStyles),
                      )}
                    >
                      <FiChevronRight
                        style={{
                          transform: isOpen
                            ? 'rotate(90deg)'
                            : 'rotate(0deg)',
                          transition:
                            'transform 200ms linear',
                        }}
                      />
                      {i18n.translate(cat.id)}
                    </Button>
                    <Collapse isOpen={isOpen}>
                      {pointTypes.map((point, ind) => {
                        // console.log('point, ', point, cat)
                        if (
                          point.category === cat.id
                          // &&
                          // cat.subcategories.length <= 0
                        ) {
                          // console.log(
                          //   'category match: ',
                          //   point.category,
                          // )
                          const isChecked = !!activePointTypes[
                            ind // Number(layer.index)
                          ]
                          return (
                            <LayersInput
                              key={`layer-input-group-${point.id}`}
                              layer={point}
                              id={`input_${point.id}`}
                              ind={ind}
                              isChecked={isChecked}
                              label={getLayerLabel(
                                point.id,
                                pointTypes,
                              )}
                              tooltip={point.tooltip}
                              update={updatePoints}
                            />
                          )
                        }
                      })}
                      {
                        // Uncomment this to restore subcategory processing.
                        //   cat.subcategories.map(sub => {
                        //   console.log(
                        //     'processing subcat, ',
                        //     sub,
                        //   )
                        //   const [
                        //     isOpen,
                        //     setIsOpen,
                        //   ] = useState(false)
                        //   const toggle = () =>
                        //     setIsOpen(!isOpen)
                        //
                        //   return (
                        //     <div>
                        //       <Button
                        //         color="primary"
                        //         onClick={toggle}
                        //         className={clsx(
                        //   'points-cat-toggle',
                        //   'subcategory',
                        //   cx(toggleButtonStyles),
                        // )}
                        //       >
                        //         {i18n.translate(sub)}
                        //       </Button>
                        //       <Collapse isOpen={isOpen}>
                        //         {pointTypes.map(
                        //           (point, ind) => {
                        //             // console.log(
                        //             //   'point, ',
                        //             //   point,
                        //             //   cat.id,
                        //             //   sub,
                        //             // )
                        //             if (
                        //               point.category ===
                        //                 cat.id &&
                        //               !!point.subcategory &&
                        //               point.subcategory ===
                        //                 sub
                        //             ) {
                        //               // console.log(
                        //               //   'subcategory match: ',
                        //               //   point,
                        //               // )
                        //               const isChecked = !!activePointTypes[
                        //                 ind // Number(layer.index)
                        //               ]
                        //               return (
                        //                 <LayersInput
                        //                   key={`layer-input-group-${point.id}`}
                        //                   layer={point}
                        //                   id={`input_${point.id}_${ind}`}
                        //                   ind={ind}
                        //                   isChecked={
                        //                     isChecked
                        //                   }
                        //                   label={getLayerLabel(
                        //                     point.id,
                        //                     pointTypes,
                        //                   )}
                        //                   tooltip={
                        //                     point.tooltip
                        //                   }
                        //                   update={
                        //                     updatePoints
                        //                   }
                        //                 />
                        //               )
                        //             }
                        //           },
                        //         )}
                        //       </Collapse>
                        //     </div>
                        //   )
                        // })
                      }
                    </Collapse>
                  </div>
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
