import React from 'react'
import clsx from 'clsx'
import { ListGroupItem } from 'reactstrap'
import styled from 'styled-components'
import IndicatorButton from './IndicatorButton'

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
  children,
}) => {
  const handleClick = e => {
    onSelect && onSelect(indicator, e)
  }
  return (
    <IndicatorListGroupItem>
      <IndicatorButton
        indicator={indicator}
        showHint={showHint}
        onClick={handleClick}
        active={indicator.id === activeId}
      />
      {children}
    </IndicatorListGroupItem>
  )
}

export default IndicatorListItem
