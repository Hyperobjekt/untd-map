import React, { useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import clsx from 'clsx'

import i18n from '@pureartisan/simple-i18n'
import {
  Button,
  ListGroup,
  ListGroupItem,
  Tooltip,
} from 'reactstrap'

import styled from 'styled-components'

// styled reactstrap button
const IndicatorButton = styled(Button)`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 1.6rem;
  padding: 1rem 2rem;
  svg {
    margin-left: 0.8rem;
    margin-right: -0.8rem;
  }
`

// styled reactstrap list group item
const IndicatorListGroupItem = styled(ListGroupItem)`
  border: none;
  padding: 0;
`

const IndicatorListItem = ({
  indicator,
  showHint = true,
  onSelect,
  activeId,
}) => {
  const handleClick = e => {
    onSelect && onSelect(indicator, e)
  }
  return (
    <IndicatorListGroupItem>
      <IndicatorButton
        onClick={handleClick}
        color="transparent"
        active={indicator.id === activeId}
      >
        {i18n.translate(indicator.id)}
        {showHint && (
          <IndicatorTooltip indicator={indicator} />
        )}
      </IndicatorButton>
    </IndicatorListGroupItem>
  )
}

const IndicatorTooltip = ({ indicator, ...rest }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)
  return (
    <>
      <FiInfo
        className={clsx('indicator-tip')}
        id={'tip_prompt_' + indicator.id}
      />
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={'tip_prompt_' + indicator.id}
        toggle={toggle}
        autohide={false}
        className={'tip-prompt-layer'}
        dangerouslySetInnerHTML={{
          __html: i18n.translate(`${indicator.id}_desc`),
        }}
      ></Tooltip>
    </>
  )
}

/**
 * Renders a list of indicators, with optional hints
 */
const IndicatorList = ({
  indicators,
  showHints = true,
  onSelect,
  activeId,
}) => {
  return (
    <ListGroup>
      {indicators.map(indicator => (
        <IndicatorListItem
          key={indicator.id}
          indicator={indicator}
          showHint={showHints}
          onSelect={onSelect}
          activeId={activeId}
        />
      ))}
    </ListGroup>
  )
}

export default IndicatorList
