import React from 'react'
import clsx from 'clsx'

/**
 * Canvas is the base container for visible elements not header or footer.
 * @param Object children   Child elements to render
 * @param Object props      Props passed down from parent
 */
const Canvas = ({ className, ...props }) => {
  return (
    <div className={clsx('canvas', className)} {...props} />
  )
}

export default Canvas
