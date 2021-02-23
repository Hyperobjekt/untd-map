import React from 'react'

const comhel = ({ ...props }) => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="18.4"
        y="15"
        width="3.2"
        height="16"
        fill="black"
      />
      <rect
        x="28"
        y="21.4"
        width="3.2"
        height="16"
        transform="rotate(90 28 21.4)"
        fill="black"
      />
      <path
        d="M1 39V10.4815L20 1.11491L39 10.4815V39H1Z"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  )
}

export default comhel
