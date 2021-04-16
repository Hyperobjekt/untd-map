import React, { useState, useEffect } from 'react'
import i18n from '@pureartisan/simple-i18n'
import shallow from 'zustand/shallow'
import clsx from 'clsx'
import { FiInfo } from 'react-icons/fi'
import { Tooltip } from 'reactstrap'

import useStore from './../store'

const IndicatorTooltip = ({ indicator, ...rest }) => {
  const { interactionsMobile } = useStore(
    state => ({
      interactionsMobile: state.interactionsMobile,
    }),
    shallow,
  )

  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)
  return (
    <>
      <FiInfo
        className={clsx('indicator-tip')}
        id={'tip_prompt_' + indicator.id}
      />
      <Tooltip
        placement={!!interactionsMobile ? 'auto' : 'right'}
        boundariesElement={`window`}
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
