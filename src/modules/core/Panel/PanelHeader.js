import React from 'react'
import clsx from 'clsx'
import styled from 'styled-components'

const HeaderWrapper = styled.div`
  min-width: 100%;
  min-height: 6rem;
  display: flex;
  align-items: center;
  background-color: #fff;
  z-index: 501;
  // push others right
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-right: auto;
  }
`

const PanelHeader = ({ className, children, ...props }) => {
  return (
    <HeaderWrapper
      className={clsx(
        'panel__header sticky-top p-4',
        className,
      )}
      {...props}
    >
      {children}
    </HeaderWrapper>
  )
}

export default PanelHeader
