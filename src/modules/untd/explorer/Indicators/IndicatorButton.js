import React, { useState } from 'react'
import clsx from 'clsx'
import i18n from '@pureartisan/simple-i18n'
import { Button } from 'reactstrap'
import styled from 'styled-components'
import IndicatorTooltip from './IndicatorTooltip'

// styled reactstrap button
const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 1.4rem;
  padding: 1rem 2rem;
  svg {
    margin-left: 0.8rem;
    margin-right: -0.8rem;
  }
`

const IndicatorButton = ({
  indicator,
  showHint,
  className,
  ...props
}) => {
  return (
    <StyledButton
      className={clsx('gotham14', className)}
      color="transparent"
      {...props}
    >
      {i18n.translate(indicator.id)}
      {showHint && (
        <IndicatorTooltip indicator={indicator} />
      )}
    </StyledButton>
  )
}

export default IndicatorButton
