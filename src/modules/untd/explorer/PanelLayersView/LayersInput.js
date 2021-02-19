import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { FiInfo } from 'react-icons/fi'
import { Label, Input, Tooltip } from 'reactstrap'

import { toSentenceCase } from './../utils'
import { POINT_ICON_SVGS } from './../../../../constants/layers'
import useStore from './../store'

const LayersInput = ({ ...props }) => {
  const {
    pointTypes,
    interactionsMobile,
    mapImagesAdded,
  } = useStore(state => ({
    pointTypes: state.pointTypes,
    interactionsMobile: state.interactionsMobile,
    mapImagesAdded: state.mapImagesAdded,
  }))

  console.log('mapImagesAdded, ', mapImagesAdded)
  console.log('pointTypes, ', pointTypes)

  // to manage tooltip state
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  const icon = pointTypes.find(point => {
    return point.id.indexOf(props.layer.id) > -1
  })

  // const getIcon = () => {
  //   return pointTypes.find(point => {
  //     return point.id.indexOf(props.layer.id) > -1
  //   })
  // }

  // const src = require(`./../point-icons/svg/${
  //   getIcon().id
  // }.svg`).default

  const svg = POINT_ICON_SVGS.find(el => {
    return el.id === props.layer.id
  }).svg

  console.log('icon is, ', icon)

  if (!mapImagesAdded) {
    return ''
  } else {
    return (
      <div
        className="layer"
        key={`layer-wrapper-${props.layer.id}`}
        id={`layer-${props.layer.id}`}
      >
        <label
          key={`label-${props.layer.id}`}
          id={`label-${props.layer.id}`}
        >
          <input
            type="checkbox"
            id={props.id}
            name="scales"
            key={'layer-input-' + props.layer.id}
            data-only-one={props.layer.only_one}
            data-only-one-name={props.layer.only_one_name}
            checked={props.isChecked}
            readOnly={true}
            onClick={e => {
              props.update(e)
            }}
          />
          <div className="checkmark"></div>
          {!!mapImagesAdded && !!svg && (
            <div
              className={clsx(
                'icon',
                `icon-${icon.id}`,
                `color-${icon.category}`,
              )}
              dangerouslySetInnerHTML={{
                __html: svg ? svg : null,
              }}
            ></div>
          )}
          {toSentenceCase(i18n.translate(props.label))}
          {!!props.tooltip &&
            props.tooltip.length > 0 &&
            !interactionsMobile && (
              <FiInfo id={'tip_prompt_' + props.layer.id} />
            )}
        </label>
        {!!props.tooltip &&
          props.tooltip.length > 0 &&
          !interactionsMobile && (
            <Tooltip
              placement="top"
              isOpen={tooltipOpen}
              target={'tip_prompt_' + props.layer.id}
              toggle={toggle}
              autohide={false}
              className={'tip-prompt-layer'}
              dangerouslySetInnerHTML={{
                __html: i18n.translate(props.tooltip),
              }}
            ></Tooltip>
          )}
      </div>
    )
  }
}

LayersInput.propTypes = {
  tooltip: PropTypes.string,
  update: PropTypes.func,
  layer: PropTypes.object,
  isChecked: PropTypes.bool,
  label: PropTypes.string,
  tooltip: PropTypes.string,
  id: PropTypes.string,
}

export default LayersInput
