import React from 'react'

const MetricsIcon = ({ ...props }) => {
  return (
    <svg
      width="14"
      height="11"
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 5.49872L8 5.50262" stroke="#626B77" />
      <path d="M13 1.50128L6 1.49737" stroke="#626B77" />
      <path d="M13 9.50128L6 9.49737" stroke="#626B77" />
      <path d="M9.5 5.49738L13 5.50128" stroke="#626B77" />
      <path d="M4.5 1.50262L1 1.49872" stroke="#626B77" />
      <path d="M4.5 9.50262L1 9.49872" stroke="#626B77" />
      <circle cx="8.5" cy="5.5" r="1" stroke="#626B77" />
      <circle
        cx="5.5"
        cy="1.5"
        r="1"
        transform="rotate(-180 5.5 1.5)"
        stroke="#626B77"
      />
      <circle
        cx="5.5"
        cy="9.5"
        r="1"
        transform="rotate(-180 5.5 9.5)"
        stroke="#626B77"
      />
    </svg>
  )
}

export default MetricsIcon
