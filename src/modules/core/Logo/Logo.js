import React, { useState } from 'react'
import PropTypes from 'prop-types'

/**
 * Renders site logo with image and site name as screen-reader only h1 content.
 * @param String siteName Site name text string, read by screen readers
 * @param String homeHref Site root href, defaults to '/'
 * @param String logoSrc  SVG string for logo
 */
const Logo = ({ children, ...props }) => {
  // console.log('Logo')
  return (
    <h1>
      <a href={props.siteHref}>
        {!!props.siteName && (
          <span className="logo-sitename">
            {props.siteName}
          </span>
        )}
        {!!props.logoSrc && (
          <div
            className="logo"
            dangerouslySetInnerHTML={{
              __html: props.logoSrc,
            }}
            role="img"
            aria-label={props.ariaLabel}
          ></div>
        )}
      </a>
      {children}
    </h1>
  )
}

Logo.propTypes = {
  /** Site name string */
  siteName: PropTypes.string,
  /** Href for home link */
  homeHref: PropTypes.string,
  /** Image source for site logo */
  logoSrc: PropTypes.string,
}

Logo.defaultProps = {
  siteHref: `/`,
}

export default Logo
