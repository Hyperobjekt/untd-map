import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import shallow from 'zustand/shallow'
import i18n from '@pureartisan/simple-i18n'
import { FiInfo } from 'react-icons/fi'
import { Tooltip } from 'reactstrap'

import { toSentenceCase } from './../utils'
import * as Icons from './../../../core/Icons'
import useStore from './../store'

const LayersInput = ({ ...props }) => {
  const {
    pointTypes,
    interactionsMobile,
    mapImagesAdded,
  } = useStore(
    state => ({
      pointTypes: state.pointTypes,
      interactionsMobile: state.interactionsMobile,
      mapImagesAdded: state.mapImagesAdded,
    }),
    shallow,
  )

  // to manage tooltip state
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  // Fetch the icon object from point types.
  const icon = pointTypes.find(point => {
    return point.id.indexOf(props.layer.id) > -1
  })

  const ThisIcon = Icons[props.layer.id]
    ? Icons[props.layer.id]
    : Icons['FeaturesIcon']

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
          className={props.isChecked ? 'checked' : ''}
          checked={props.isChecked}
          readOnly={true}
          onClick={props.update}
        />
        <div className={clsx('checkmark')}></div>
        <div
          className={clsx(
            'icon',
            `icon-${icon.id}`,
            `color-${icon.category}`,
          )}
        >
          <ThisIcon />
        </div>
        {toSentenceCase(i18n.translate(props.label))}
        {!!props.tooltip &&
          props.tooltip.length > 0 &&
          !interactionsMobile && (
            <FiInfo
              className="icon-info"
              id={'tip_prompt_' + props.layer.id}
            />
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
