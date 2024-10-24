import React, { forwardRef } from "react"

interface BorderProps {
  width?: number
  borderColor?: string
  borderStyle?: string
  borderWidth?: number
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>
  children: React.ReactNode
}

const Border = forwardRef<HTMLDivElement, BorderProps>((props, ref) => {
  const {
    width = 200,
    borderColor = "#ccc",
    borderStyle = "solid",
    borderWidth = 1,
    onMouseDown,
    children
  } = props

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      className="relative rounded-full shadow-sm box-border"
      style={{
        width: `${width}px`,
        height: `${width}px`,
        border: `${borderWidth}px ${borderStyle} ${borderColor}`
      }}>
      {children}
    </div>
  )
})

Border.displayName = "Border"

export default Border
