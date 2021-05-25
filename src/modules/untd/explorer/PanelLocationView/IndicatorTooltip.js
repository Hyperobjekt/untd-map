import React, { useState, useEffect } from 'react'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import clsx from 'clsx'
import { FiInfo } from 'react-icons/fi'
import { Tooltip } from 'reactstrap'

import useStore from './../store'

const IndicatorTooltip = ({
  indicator,
  size = 16,
  ...rest
}) => {
  const interactionsMobile = useStore(
    state => state.interactionsMobile,
  )
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  return (
    <>
      <FiInfo
        className={'indicator-tip'}
        style={{ fontSize: size }}
        id={'tip_prompt_' + indicator.id}
      />
      <Tooltip
        placement={!!interactionsMobile ? 'auto' : 'top'}
        isOpen={tooltipOpen}
        target={'tip_prompt_' + indicator.id}
        toggle={toggle}
        autohide={false}
        className={'tip-prompt-layer'}
        dangerouslySetInnerHTML={{
          __html: i18n.translate(`LOCATION_SELECT_METRIC`, {
            desc: i18n.translate(`${indicator.id}_desc`),
          }),
        }}
      ></Tooltip>
    </>
  )
}

export default IndicatorTooltip
