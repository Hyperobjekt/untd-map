import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { Collapse, Button } from 'reactstrap'
import { FiChevronRight } from 'react-icons/fi'
import { GrPowerReset } from 'react-icons/gr'

import useStore from './../store'
import { POINT_CATEGORIES } from './../../../../constants/layers'
import LayersInput from './LayersInput'
import CoreButton from './../../../core/CoreButton'
import MapLayerToggle from './MapLayerToggle'

const getPointIndex = (collection, id) => {
  return collection
    .map(type => {
      return type.id
    })
    .indexOf(id)
}

const PanelLayersView = ({ ...props }) => {
  // Generic store value setter.
  const {
    setStoreValues,
    pointTypes,
    activePointTypes,
  } = useStore(
    state => ({
      setStoreValues: state.setStoreValues,
      pointTypes: state.pointTypes,
      activePointTypes: state.activePointTypes,
    }),
    shallow,
  )

  // console.log('panelLayersView, pointTypes: ', pointTypes)

  const getLayerLabel = (id, items) => {
    const layer = items.find(gr => gr.id === id)
    return layer.label
  }

  const updatePoints = e => {
    // console.log(
    //   'updatePoints, ',
    //   e,
    //   e.currentTarget.id,
    //   // pointTypes,
    //   // activePointTypes,
    // )
    // If item is checked, if it's not in array, push it into array
    // If item is not checked, if it's in array, remove
    // If the element is an only-one element, reset other only-ones of same name.
    const id = e.currentTarget.id.replace(/input_/g, '')
    // Get index in indicator set.
    const index = getPointIndex(pointTypes, id)
    let newPointTypes = activePointTypes.slice()
    newPointTypes[index] =
      newPointTypes[index] === 1 ? 0 : 1
    setStoreValues({
      activePointTypes: newPointTypes,
    })
  }

  const toggleAll = () => {
    setStoreValues({
      activePointTypes: activePointTypes
        .slice()
        .map(val => {
          return 0
        }),
    })
  }

  const toggleCat = () => {}
  // console.log('pointTypes, ', pointTypes)

  return (
    <div className={clsx('map-panel-slideout-layers')}>
      <div className={clsx('panel-sticky')}>
        <h5>{i18n.translate(`UI_MAP_POINTS_OVERLAYS`)}</h5>
      </div>
      <div className={clsx(`map-layer-toggle-pane`)}>
        <div className={clsx('points-group-parent')}>
          <h6>{i18n.translate(`UI_MAP_POINTS`)}</h6>
          <div
            key={'layer-group-desc-points'}
            className="layer-group-desc"
            dangerouslySetInnerHTML={{
              __html: i18n.translate(`UI_MAP_LAYER_1_DESC`),
            }}
          ></div>
          <CoreButton
            onClick={toggleAll}
            label={i18n.translate('BUTTON_RESET_POINTS')}
            color="primary"
            id="button_toggle_all_points"
            tooltip={`right`}
            className={clsx(`button-all-toggle`)}
          >
            <GrPowerReset />
            <span>
              {i18n.translate('BUTTON_RESET_POINTS')}
            </span>
          </CoreButton>
          <div
            className={clsx(
              'layer-group',
              'layer-group-layers-points',
            )}
            key={'layer-group-layers-points'}
          >
            {POINT_CATEGORIES.map((cat, i) => {
              const [isOpen, setIsOpen] = useState(() => {
                return i === 0
              })
              const toggle = e => {
                // console.log(e.currentTarget)
                const button = document.getElementById(
                  e.currentTarget.id,
                )
                button.classList.toggle('open')
                setIsOpen(!isOpen)
              }

              return (
                <div key={`point-cat-${cat.id}`}>
                  <Button
                    id={`show-${cat.id}`}
                    color="link"
                    onClick={toggle}
                    className={clsx(
                      'points-cat-toggle',
                      isOpen ? 'open' : '',
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
                    <div
                      className={clsx(
                        'cat-color-indicator',
                        `color-${cat.id}`,
                      )}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '8px',
                        marginBottom: '-2px',
                        marginRight: '4px',
                        display: 'inline-block',
                        backgroundColor: cat.color,
                      }}
                    ></div>
                    {i18n.translate(cat.id)}
                  </Button>
                  <Collapse isOpen={isOpen}>
                    {/* Points for categories with no subcategory */}
                    {!!(cat.subcategories.length <= 0) &&
                      pointTypes
                        .filter(point => {
                          return point.category === cat.id
                        })
                        .sort((a, b) => {
                          return (
                            a.category_order -
                            b.category_order
                          )
                        })
                        .map(point => {
                          const pointIndex = getPointIndex(
                            pointTypes,
                            point.id,
                          )
                          const isChecked = !!activePointTypes[
                            pointIndex
                          ]
                          return (
                            <LayersInput
                              key={`layer-input-group-${point.id}`}
                              layer={point}
                              id={`input_${point.id}`}
                              ind={pointIndex}
                              isChecked={isChecked}
                              label={getLayerLabel(
                                point.id,
                                pointTypes,
                              )}
                              tooltip={point.tooltip}
                              update={updatePoints}
                              className={clsx()}
                            />
                          )
                          // }
                        })}

                    {/* Point types with category but not subcategory */}
                    {!!(cat.subcategories.length > 0) &&
                      pointTypes
                        .filter(point => {
                          return (
                            point.category === cat.id &&
                            !!(
                              point.subcategory ===
                                undefined ||
                              point.subcategory ===
                                'undefined' ||
                              point.subcategory === 'NA' ||
                              point.subcategory === '' ||
                              point.subcategory === false
                            )
                          )
                        })
                        .map((point, ind) => {
                          // console.log(
                          //   'point, ',
                          //   point,
                          //   cat.id,
                          // )
                          const pointIndex = getPointIndex(
                            pointTypes,
                            point.id,
                          )
                          const isChecked = !!activePointTypes[
                            pointIndex
                          ]
                          return (
                            <LayersInput
                              key={`layer-input-group-${point.id}-${ind}`}
                              layer={point}
                              id={`input_${point.id}`}
                              ind={pointIndex}
                              isChecked={isChecked}
                              label={getLayerLabel(
                                point.id,
                                pointTypes,
                              )}
                              tooltip={point.tooltip}
                              update={updatePoints}
                              className={clsx()}
                            />
                          )
                        })}

                    {/* Points for categories with a subcategory */}
                    {!!(cat.subcategories.length > 0) &&
                      // Uncomment this to restore subcategory processing.
                      cat.subcategories.map((sub, i) => {
                        // console.log(
                        //   'processing subcat, ',
                        //   sub,
                        // )
                        const [
                          isOpen,
                          setIsOpen,
                        ] = useState(i === 0)
                        const toggle = () =>
                          setIsOpen(!isOpen)

                        return (
                          <div
                            key={`subcat-parent-${sub}`}
                            className={clsx(
                              'subcat-parent',
                            )}
                          >
                            <Button
                              id={`show-${sub}`}
                              color="link"
                              onClick={toggle}
                              className={clsx(
                                'points-cat-toggle',
                                'subcategory',
                                isOpen ? 'open' : '',
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
                              {i18n.translate(sub)}
                            </Button>
                            <Collapse isOpen={isOpen}>
                              {/* Point type within subcategory */}
                              {pointTypes
                                .filter(point => {
                                  return (
                                    point.category ===
                                      cat.id &&
                                    point.subcategory ===
                                      sub
                                  )
                                })
                                .sort((a, b) => {
                                  return (
                                    a.subcategory_order -
                                    b.subcategory_order
                                  )
                                })
                                .map((point, ind) => {
                                  // console.log(
                                  //   'point, ',
                                  //   point,
                                  //   cat.id,
                                  //   sub,
                                  // )
                                  const pointIndex = getPointIndex(
                                    pointTypes,
                                    point.id,
                                  )
                                  const isChecked = !!activePointTypes[
                                    pointIndex
                                  ]
                                  return (
                                    <LayersInput
                                      key={`layer-input-group-${point.id}-${ind}`}
                                      layer={point}
                                      id={`input_${point.id}`}
                                      ind={pointIndex}
                                      isChecked={isChecked}
                                      label={getLayerLabel(
                                        point.id,
                                        pointTypes,
                                      )}
                                      tooltip={
                                        point.tooltip
                                      }
                                      update={updatePoints}
                                      className={clsx()}
                                    />
                                  )
                                })}
                            </Collapse>
                          </div>
                        )
                      })}
                  </Collapse>
                </div>
              )
            })}
          </div>
        </div>
        <hr />
        <div className={clsx('map-static-layer-toggle')}>
          <h6>
            {i18n.translate(`UI_MAP_LAYERS_STATIC_TITLE`)}
          </h6>
          <div
            key={'layer-group-desc-static'}
            className="layer-group-desc"
            dangerouslySetInnerHTML={{
              __html: i18n.translate(
                `UI_MAP_LAYER_STATIC_DESC`,
              ),
            }}
          ></div>
          <MapLayerToggle />
        </div>
      </div>
    </div>
  )
}

export default PanelLayersView
