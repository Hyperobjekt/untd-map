import React, { useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@pureartisan/simple-i18n'
import clsx from 'clsx'
import { Tooltip } from 'reactstrap'
import { CoreButton } from './../../../core'
import TwitterShareBtn from './TwitterShareBtn'
import { FacebookShareBtn } from '.'
import { MailShareBtn } from '.'
import { LinkShareBtn } from '.'

const DesktopUnifiedShareBtn = ({ ...props }) => {
  // to manage tooltip state
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  return (
    <CoreButton
      id="button_d_u_share_link"
      label={i18n.translate(`BUTTON_SHARE_UNIFIED`)}
      color="none"
      className={clsx(
        props.className,
        'button-d-u-share-link',
        'tour-desk-10',
      )}
    >
      {i18n.translate('CONTROL_PANEL_SHARE_TC')}
      <Tooltip
        placement="right-start"
        isOpen={tooltipOpen}
        target="button_d_u_share_link"
        toggle={toggle}
        autohide={false}
        hideArrow={true}
        trigger="hover"
        className="tooltip-share bs-expl"
      >
        <div className="tooltip-custom-content">
          <div className="item w-100">
            <TwitterShareBtn tooltip={false}>
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_TWITTER`)}
              </span>
            </TwitterShareBtn>
          </div>
          <div className="item">
            <FacebookShareBtn tooltip={false}>
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_FACEBOOK`)}
              </span>
            </FacebookShareBtn>
          </div>
          <div className="item">
            <MailShareBtn tooltip={false}>
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_EMAIL`)}
              </span>
            </MailShareBtn>
          </div>
          <div className="item">
            <LinkShareBtn tooltip={false}>
              <span className="btn-label">
                {i18n.translate(`BUTTON_SHARE_LINK`)}
              </span>
            </LinkShareBtn>
          </div>
        </div>
      </Tooltip>
    </CoreButton>
  )
}

export default DesktopUnifiedShareBtn
