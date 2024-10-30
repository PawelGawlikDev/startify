import React, { useEffect, useRef, useState } from "react"

import { type Point } from "~types"

import Border from "./Border"
import Circle from "./Circle"
import { BORDER_WIDTH, CIRCLE_WIDTH, WIDTH } from "./constant"
import { getCenter, getStartPoint, radianToAngle } from "./service"

interface PickerProps {
  borderColor?: string
  pointerColor?: string
  pointerWidth?: number
  width?: number
  value?: number
  borderStyle?: string
  borderWidth?: number
  onChange?: (newValue: number) => void
  onAfterChange?: (interactiveValue: number) => void
  preventDefault?: boolean
}

const AnglePicker: React.FC<PickerProps> = ({
  borderColor,
  pointerColor,
  pointerWidth = CIRCLE_WIDTH,
  width = WIDTH,
  value = 0,
  borderStyle,
  borderWidth = BORDER_WIDTH,
  onChange,
  onAfterChange,
  preventDefault = false
}) => {
  const [angle, setAngle] = useState(value)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setAngle(value)
  }, [value])

  const getCenterPosition = (): Point => getCenter(width, borderWidth)

  const getStartPointPosition = () =>
    getStartPoint(width, pointerWidth, borderWidth)

  const getRotatedPosition = (angle: number): Point => {
    const center = getCenterPosition()
    const startPoint = getStartPointPosition()
    const theta = (angle / 180) * Math.PI

    const x =
      (startPoint.x - center.x) * Math.cos(theta) -
      (startPoint.y - center.y) * Math.sin(theta) +
      center.x
    const y =
      (startPoint.x - center.x) * Math.sin(theta) +
      (startPoint.y - center.y) * Math.cos(theta) +
      center.y

    return { x, y }
  }

  const getNewAngleByEvent = (
    e: MouseEvent | React.MouseEvent
  ): number | null => {
    const wrapperEl = wrapperRef.current

    if (e && wrapperEl) {
      const center = getCenterPosition()
      const { clientX, clientY } = e
      const rect = wrapperEl.getBoundingClientRect()
      const { left, top } = rect
      const centerP = { x: left + center.x, y: top + center.y }
      const nx = clientX - centerP.x
      const ny = clientY - centerP.y
      const radian = Math.atan2(ny, nx)

      return radianToAngle(radian)
    }

    return null
  }

  const mousedown = (e: React.MouseEvent<HTMLDivElement>) => {
    const newAngle = getNewAngleByEvent(e)

    if (newAngle !== null) {
      setAngle(newAngle)
      onChange?.(newAngle)
      addMouseListeners()
    }
  }

  const mousemove = (e: MouseEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }

    const newAngle = getNewAngleByEvent(e)

    if (newAngle !== null) {
      setAngle(newAngle)
      onChange?.(newAngle)
    }
  }

  const mouseup = (e: MouseEvent) => {
    if (preventDefault) {
      e.preventDefault()
    }

    removeMouseListeners()

    const newAngle = getNewAngleByEvent(e)

    if (newAngle !== null) {
      setAngle(newAngle)
      onAfterChange?.(newAngle)
    }
  }

  const addMouseListeners = () => {
    document.addEventListener("mousemove", mousemove)
    document.addEventListener("mouseup", mouseup)
  }

  const removeMouseListeners = () => {
    document.removeEventListener("mousemove", mousemove)
    document.removeEventListener("mouseup", mouseup)
  }

  const rotatedPosition = getRotatedPosition(angle)

  return (
    <Border
      ref={wrapperRef}
      onMouseDown={mousedown}
      width={width}
      borderColor={borderColor}
      borderStyle={borderStyle}
      borderWidth={borderWidth}>
      <Circle
        x={rotatedPosition.x}
        y={rotatedPosition.y}
        color={pointerColor}
        width={pointerWidth}
      />
    </Border>
  )
}

export default AnglePicker
