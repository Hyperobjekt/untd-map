import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import styled from 'styled-components'
import { Button } from 'reactstrap'
import i18n from '@pureartisan/simple-i18n'
import {
  CHORO_COLORS,
  CHORO_STROKE,
} from '../../../../constants/colors'
import shallow from 'zustand/shallow'

/**
 * Button group container
 */
const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  padding-top: 32px;
  & > .btn + .btn {
    margin-left: 4px;
  }
`

/**
 * Button element for each choropleth
 */
const ChoroplethToggle = styled(Button)`
  border: 1px solid;
  flex: 1;
  position: relative;
  height: 24px;
  background: #eee;
  border-color: #ddd;
  // larger width for middle item
  &:nth-child(3) {
    flex: 3;
  }
  // labels
  & > span {
    position: absolute;
    bottom: 32px;
    text-align: center;
    line-height: 1;
    left: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  // line indicator above buttons
  &:before {
    content: ' ';
    position: absolute;
    display: block;
    width: 100%;
    height: 4px;
    box-shadow: 1px -1px 0 #8c95a1, -1px -1px 0 #8c95a1;
    left: 0;
    top: -6px;
    right: 0;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  // first label
  &:nth-child(1) > span {
    text-align: left;
    width: 72px;
  }
  // middle label
  &:nth-child(3) > span {
    margin: auto;
    width: 56px;
  }
  // last label
  &:nth-child(5) > span {
    text-align: right;
    width: 72px;
    left: auto;
    right: 0;
  }
  // up the opacity when showing the label
  &.show-label {
    &:before {
      opacity: 1;
    }
    & > span {
      opacity: 1;
    }
  }
  // add colors for "on" state
  &.on {
    &:nth-child(1) {
      background-color: ${CHORO_COLORS[0]};
      border-color: ${CHORO_STROKE[0]};
      &:hover {
        background-color: ${CHORO_STROKE[0]};
      }
    }
    &:nth-child(2) {
      background-color: ${CHORO_COLORS[1]};
      border-color: ${CHORO_STROKE[1]};
      &:hover {
        background-color: ${CHORO_STROKE[1]};
      }
    }
    &:nth-child(3) {
      background-color: ${CHORO_COLORS[2]};
      border-color: ${CHORO_STROKE[2]};
      &:hover {
        background-color: ${CHORO_STROKE[2]};
      }
    }
    &:nth-child(4) {
      background-color: ${CHORO_COLORS[3]};
      border-color: ${CHORO_STROKE[3]};
      &:hover {
        background-color: ${CHORO_STROKE[3]};
      }
    }
    &:nth-child(5) {
      background-color: ${CHORO_COLORS[4]};
      border-color: ${CHORO_STROKE[4]};
      &:hover {
        background-color: ${CHORO_STROKE[4]};
      }
    }
  }
`

const ChoroplethLegend = ({
  classes,
  className,
  interactive,
  activeIndexes: defaultActiveIndexes = [0, 1, 2, 3, 4],
  labelIndexes: defaultLabelIndexes = [0, 2, 4],
  onClick,
  onHover,
  ...props
}) => {
  const hoverRef = useRef()
  const [labelIndexes, setLabelIndexes] = useState(
    defaultLabelIndexes,
  )
  const [activeIndexes, setActiveIndexes] = useState(
    defaultActiveIndexes,
  )

  // update local state if new label indexes are provided
  useEffect(() => {
    if (
      !shallow(defaultLabelIndexes, labelIndexes) &&
      !hoverRef.current
    ) {
      setLabelIndexes(defaultLabelIndexes)
    }
  }, [defaultLabelIndexes, labelIndexes, setLabelIndexes])

  // update local state if new active indexes are provided
  useEffect(() => {
    if (
      !shallow(defaultActiveIndexes, activeIndexes) &&
      !hoverRef.current
    ) {
      setLabelIndexes(defaultActiveIndexes)
    }
  }, [
    defaultActiveIndexes,
    activeIndexes,
    setActiveIndexes,
  ])

  /** Update the labels when hovering */
  const handleToggleEnter = event => {
    if (!interactive) return
    hoverRef.current = labelIndexes
    setLabelIndexes([Number(event.target.value)])
    onHover && onHover(event)
  }

  /** Restore the label state when done hovering */
  const handleToggleLeave = event => {
    if (!interactive) return
    setLabelIndexes(hoverRef.current)
    hoverRef.current = null
    onHover && onHover(event)
  }

  /** Trigger event when clicking */
  const handleToggleClick = event => {
    if (!interactive) return
    onClick && onClick(event)
  }

  /** Text for each toggle */
  const toggles = [
    i18n.translate(`UI_MAP_LEGEND_FEWER`),
    'Below Average',
    i18n.translate(`UI_MAP_LEGEND_AVG`),
    'Above Average',
    i18n.translate(`UI_MAP_LEGEND_MORE`),
  ]

  return (
    <ToggleGroup
      onMouseLeave={handleToggleLeave}
      role="group"
      {...props}
    >
      {toggles.map((toggle, i) => (
        <ChoroplethToggle
          key={toggle}
          color="none"
          value={i}
          className={clsx('knockout12', 'grey2', {
            'show-label': labelIndexes.includes(i),
            on: activeIndexes.includes(i),
          })}
          onMouseEnter={handleToggleEnter}
          onClick={handleToggleClick}
          aria-label={`toggle ${toggle}`}
        >
          <span>{toggle}</span>
        </ChoroplethToggle>
      ))}
    </ToggleGroup>
  )
}

ChoroplethLegend.propTypes = {}

export default ChoroplethLegend
