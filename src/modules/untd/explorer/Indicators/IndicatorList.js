import React from 'react'

import { ListGroup } from 'reactstrap'

import IndicatorListItem from './IndicatorListItem'

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
