import React from 'react'
import clsx from 'clsx'
import styled from 'styled-components'
import { animated, useSpring } from 'react-spring'

const StyledPanel = styled(animated.div)`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  min-height: 100%;
  max-height: 100%;
  width: 350px;
  background-color: #fff;
  box-shadow: 1px 1px 2px #ddd;
  display: flex;
  transform: translate3d(-100%, 0, 0);
`

export default function Panel({
  className,
  open,
  ...props
}) {
  const styles = useSpring({
    x: open ? 0 : -350,
  })
  return (
    <StyledPanel
      className={clsx('panel', className)}
      style={{
        ...styles,
        visibility: styles.x.interpolate(x =>
          x > -350 ? 'visible' : 'hidden',
        ),
      }}
      {...props}
    />
  )
}
