import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { FiInfo } from 'react-icons/fi'
import { Label, Input, Tooltip } from 'reactstrap'

import { toSentenceCase } from './../utils'

const LayersInput = ({ ...props }) => {
  // to manage tooltip state
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

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
        {toSentenceCase(i18n.translate(props.label))}
        {!!props.tooltip && props.tooltip.length > 0 && (
          <FiInfo id={'tip_prompt_' + props.layer.id} />
        )}
      </label>
      {!!props.tooltip && props.tooltip.length > 0 && (
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
