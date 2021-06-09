import React, { useState } from 'react'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { Collapse, Button } from 'reactstrap'
import { FiChevronRight } from 'react-icons/fi'
import LayersInput from './LayersInput'
import styled from 'styled-components'

const Container = styled.div`
  position: relative;
`

const CategoryButton = styled(Button)`
  display: flex;
  width: calc(100% + 4rem);
  align-items: center;
  padding: 1.5rem 2rem;
  margin-left: -2rem;
  margin-right: -2rem;
  border-radius: 0;
  &.btn.btn--depth0 {
    box-shadow: inset 0 -1px 0 #e0e2e5;
    &:not(:disabled):not(.disabled):hover,
    &:not(:disabled):not(.disabled):focus {
      box-shadow: inset 0 -1px 0 #e0e2e5;
    }
  }
  &.btn.btn--depth1 {
    box-shadow: none;
    margin-top: 1rem;
    padding: 1rem 2rem;
  }
  span + span {
    margin-right: auto;
  }
`

const ButtonGroup = styled.div`
  position: absolute;
  right: 3.2rem;
  top: 1.35rem;
`

const CategoryMarker = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  margin-right: 1.5rem;
  display: block;
`

const PointLayerCategory = ({
  id,
  depth = 0,
  pointLayers,
  subcategories,
  color,
  onChange,
  onChangeAll,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const toggleCategory = e => {
    setIsOpen(!isOpen)
  }
  const handleToggleAll = e => {
    onChangeAll && onChangeAll(id, true, e)
  }
  const handleToggleNone = e => {
    onChangeAll && onChangeAll(id, false, e)
  }
  return (
    <Container>
      <CategoryButton
        color="transparent"
        onClick={toggleCategory}
        className={clsx(
          isOpen && 'open',
          `btn--depth${depth}`,
        )}
      >
        <CategoryMarker
          style={{
            backgroundColor: color,
          }}
        />
        <span className="gotham14 w500">
          {i18n.translate(id)}
        </span>
        <FiChevronRight
          style={{
            transform: isOpen
              ? 'rotate(90deg)'
              : 'rotate(0deg)',
            transition: 'transform 200ms linear',
            fontSize: 20,
          }}
        />
      </CategoryButton>
      <ButtonGroup>
        <Button
          color="transparent"
          className="knockout12"
          onClick={handleToggleAll}
        >
          All
        </Button>
        <Button
          color="transparent"
          className="knockout12"
          onClick={handleToggleNone}
        >
          None
        </Button>
      </ButtonGroup>

      <Collapse isOpen={isOpen}>
        {pointLayers.map(point => {
          return (
            <LayersInput
              key={`layer-input-group-${point.id}`}
              layer={point}
              id={`input_${point.id}`}
              ind={point.pointIndex}
              isChecked={point.isChecked}
              label={point.label}
              tooltip={point.tooltip}
              onChange={e => onChange && onChange(point, e)}
            />
          )
        })}
        {subcategories &&
          subcategories.map(sub => (
            <PointLayerCategory
              key={sub.id}
              depth={depth + 1}
              onChange={onChange}
              {...sub}
            />
          ))}
      </Collapse>
    </Container>
  )
}

export default PointLayerCategory
