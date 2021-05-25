import React, { useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import i18n from '@pureartisan/simple-i18n'
import { Tooltip } from 'reactstrap'

const IndicatorTooltip = ({ indicator }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)
  return (
    <>
      <FiInfo
        className="indicator-tip"
        id={'tip_prompt_' + indicator.id}
      />
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={'tip_prompt_' + indicator.id}
        toggle={toggle}
        autohide={false}
        className="tip-prompt-layer"
        dangerouslySetInnerHTML={{
          __html: i18n.translate(`${indicator.id}_desc`),
        }}
      ></Tooltip>
    </>
  )
}

export default IndicatorTooltip
