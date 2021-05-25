import React from 'react'
import clsx from 'clsx'
import styled from 'styled-components'

const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  min-height: 100%;
  max-height: 100%;
`

export default function Panel({ className, ...props }) {
  return (
    <StyledPanel
      className={clsx('panel', className)}
      {...props}
    />
  )
}
