import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Tooltip,
  Popover,
  PopoverBody,
} from 'reactstrap'
import clsx from 'clsx'

/**
 * CoreButton is a core button for the library.
 *
 * To add contents like text or icons, simply pass them as children inside the `<CoreButton>` component.
 *
 * @param String label      Used as aria-label for button
 * @param String bsColor    Bootstrap color type for button, see https://reactstrap.github.io/components/buttons/
 * @param Function onClick  Click handler for button
 */
const CoreButton = ({
  children,
  className,
  tooltip,
  tooltipAutoHide,
  tooltipClassName,
  label,
  popover,
  ...props
}) => {
  // console.log('CoreButton, ', props)
  // to manage tooltip state
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  // Manage popover state
  const [popoverOpen, setPopoverOpen] = useState(false)
  const togglePopover = () => setPopoverOpen(!popoverOpen)

  return (
    <Button
      aria-label={label}
      className={clsx(className, 'button-core')}
      {...props}
    >
      {children}
      {tooltip && tooltip.length > 0 && (
        <Tooltip
          placement={tooltip}
          isOpen={tooltipOpen}
          target={props.id}
          toggle={toggle}
          autohide={tooltipAutoHide}
          trigger="hover"
          className={tooltipClassName}
        >
          {label}
        </Tooltip>
      )}
      {popover && popover.length > 0 && (
        <Popover
          placement={popover}
          isOpen={popoverOpen}
          target={props.id}
          toggle={togglePopover}
        >
          <PopoverBody
            dangerouslySetInnerHTML={{
              __html: label,
            }}
          ></PopoverBody>
        </Popover>
      )}
    </Button>
  )
}

CoreButton.propTypes = {
  /** Button label */
  label: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func,
  /** Bootstrap button color type */
  color: PropTypes.string,
}

CoreButton.defaultProps = {
  label: ``,
  onClick: null,
  color: `secondary`,
}

export default CoreButton
