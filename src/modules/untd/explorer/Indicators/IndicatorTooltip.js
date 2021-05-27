import React, { useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import i18n from '@pureartisan/simple-i18n'
import { Tooltip } from 'reactstrap'

var makeId = function () {
  return '_' + Math.random().toString(36).substr(2, 9)
}

const IndicatorTooltip = ({ indicator }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)
  const [elId] = useState(makeId()) // prevent duplicate ids
  return (
    <>
      <FiInfo className="indicator-tip" id={elId} />
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={elId}
        toggle={toggle}
        autohide={false}
        dangerouslySetInnerHTML={{
          __html: i18n.translate(`${indicator.id}_desc`),
        }}
      ></Tooltip>
    </>
  )
}

export default IndicatorTooltip
