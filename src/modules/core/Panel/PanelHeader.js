import React from 'react'
import clsx from 'clsx'
import styled from 'styled-components'
import { MdClose } from 'react-icons/md'
import { Button } from 'reactstrap'

const HeaderWrapper = styled.div`
  min-width: 100%;
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 2rem 6rem 2rem 2rem;
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

const CloseButton = styled(Button)`
  position: absolute;
  top: 1.8rem;
  right: 1.6rem;
  svg {
    font-size: 24px;
  }
`

const PanelHeader = ({
  className,
  children,
  onClose,
  ...props
}) => {
  return (
    <HeaderWrapper
      className={clsx(
        'panel__header sticky-top',
        className,
      )}
      {...props}
    >
      {children}
      {onClose && (
        <CloseButton color="none" onClick={onClose}>
          <MdClose aria-label="close panel" />
        </CloseButton>
      )}
    </HeaderWrapper>
  )
}

export default PanelHeader
