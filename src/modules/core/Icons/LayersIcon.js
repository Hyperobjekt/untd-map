import React from 'react'

const LayersIcon = ({ ...props }) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0)">
        <path
          d="M2 4.68555L9 1.1272L16 4.68555L9 8.24389L2 4.68555Z"
          stroke="#626B77"
          stroke-width="1.5"
        />
        <path
          d="M6.375 6.79557L5.5 7.24036L2 9.01953L9 12.5779L16 9.01953L12.5 7.24036L11.625 6.79557"
          stroke="#626B77"
          stroke-width="1.5"
        />
        <path
          d="M11.625 11.1286L12.5 11.5734L16 13.3525L9 16.9109L2 13.3525L5.5 11.5734L6.375 11.1286"
          stroke="#626B77"
          stroke-width="1.5"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default LayersIcon
