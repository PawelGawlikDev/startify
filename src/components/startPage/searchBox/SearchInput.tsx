import { AnimatePresence, motion } from "framer-motion"
import React, { useCallback, useEffect, useRef, useState } from "react"

import type { Engine } from "~types"
import { calculateAnimationDuration } from "~utils/calculateTimeout"
import { cn } from "~utils/cn"

type PixelData = {
  x: number
  y: number
  r: number
  color: string
}

type NewData = {
  x: number
  y: number
  color: number[]
}

export default function SearchInput({
  placeholders,
  onChange,
  onSubmit,
  suggestions,
  skipAnimation,
  engine
}: {
  placeholders: string[]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  suggestions: string[]
  skipAnimation: boolean
  engine: Engine
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  let maxX: number

  const [active, setActive] = useState(false)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
    }, 3000)
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    } else if (document.visibilityState === "visible") {
      startAnimation()
    }
  }

  useEffect(() => {
    startAnimation()
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [placeholders])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const newDataRef = useRef<PixelData[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")
  const [animating, setAnimating] = useState(false)

  const draw = useCallback(() => {
    if (!inputRef.current) return

    const canvas = canvasRef.current

    if (!canvas) return

    const ctx = canvas.getContext("2d", { willReadFrequently: true })

    if (!ctx) return

    canvas.width = 800
    canvas.height = 800
    ctx.clearRect(0, 0, 800, 800)

    const computedStyles = getComputedStyle(inputRef.current)

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"))

    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`
    ctx.fillStyle = "#FFF"
    ctx.fillText(value, 16, 40)

    const imageData = ctx.getImageData(0, 0, 800, 800)
    const pixelData = imageData.data
    const newData: NewData[] = []

    for (let t = 0; t < 800; t++) {
      const i = 4 * t * 800

      for (let n = 0; n < 800; n++) {
        const e = i + 4 * n

        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3]
            ]
          })
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
    }))
  }, [value])

  useEffect(() => {
    draw()
  }, [value, draw])

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = []

        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i]

          if (current.x < pos) {
            newArr.push(current)
          } else {
            if (current.r <= 0) {
              current.r = 0
              continue
            }

            current.x += Math.random() > 0.5 ? 1 : -1
            current.y += Math.random() > 0.5 ? 1 : -1
            current.r -= 0.05 * Math.random()
            newArr.push(current)
          }
        }
        newDataRef.current = newArr

        const ctx = canvasRef.current?.getContext("2d")

        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800)
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t

            if (n > pos) {
              ctx.beginPath()
              ctx.rect(n, i, s, s)
              ctx.fillStyle = color
              ctx.strokeStyle = color
              ctx.stroke()
            }
          })
        }

        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8)
        } else {
          setValue("")
          setAnimating(false)
        }
      })
    }

    animateFrame(start)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !animating) {
      if (!skipAnimation) {
        vanishAndSubmit()
      }
    }
  }

  const vanishAndSubmit = () => {
    setAnimating(true)
    draw()

    const value = inputRef.current?.value || ""

    if (value && inputRef.current) {
      maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      )
      animate(maxX)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!skipAnimation) {
      vanishAndSubmit()
    }

    setTimeout(
      () => {
        if (onSubmit) {
          onSubmit(e)
        }
      },
      calculateAnimationDuration(skipAnimation ? 0 : maxX)
    )
  }

  return (
    <div className="w-full" data-testid="SearchInput">
      <form
        className={cn(
          `hover:scale-105 w-full relative max-w-2xl mx-auto bg-white  h-16 rounded-full rounded-b-full overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200`,
          value && "bg-gray-50",
          `${active ? "scale-105" : ""}`
        )}
        onSubmit={handleSubmit}>
        <canvas
          className={cn(
            "absolute pointer-events-none  text-base transform scale-50 top-[30%] left-2 sm:left-10 origin-top-left filter invert pr-20",
            !animating ? "opacity-0" : "opacity-100"
          )}
          ref={canvasRef}
        />
        <div className="absolute inset-0 w-10 h-full top-0 bottom-0 right-0 left-0 flex justify-center items-center">
          <img
            src={engine?.favicon}
            className="h-8 pl-2 rounded-full z-40 cursor-pointer"
            alt={engine?.name}
          />
        </div>
        <input
          onFocus={() => {
            setActive(true)
          }}
          onBlur={() => {
            setActive(false)
          }}
          onChange={(e) => {
            if (!animating) {
              setValue(e.target.value)

              if (onChange) {
                onChange(e)
              }
            }
          }}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          value={value}
          id="SearchBox"
          type="text"
          className={cn(
            "w-full relative text-sm sm:text-base z-50 border-none  bg-transparent text-black h-full rounded-full focus:outline-none focus:ring-0 pl-6 sm:pl-12 pr-20",
            animating && "text-transparent"
          )}
        />

        <button
          disabled={!value}
          type="submit"
          className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-8 w-8 rounded-full disabled:bg-gray-100 bg-black  transition duration-200 flex items-center justify-center">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-300 h-4 w-4">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <motion.path
              d="M5 12l14 0"
              initial={{
                strokeDasharray: "50%",
                strokeDashoffset: "50%"
              }}
              animate={{
                strokeDashoffset: value ? 0 : "50%"
              }}
              transition={{
                duration: 0.3,
                ease: "linear"
              }}
            />
            <path d="M13 18l6 -6" />
            <path d="M13 6l6 6" />
          </motion.svg>
        </button>

        <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
          <AnimatePresence mode="wait">
            {!value && (
              <motion.p
                initial={{
                  y: 5,
                  opacity: 0
                }}
                key={`current-placeholder-${currentPlaceholder}`}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                exit={{
                  y: -15,
                  opacity: 0
                }}
                transition={{
                  duration: 0.3,
                  ease: "linear"
                }}
                className="text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate">
                {placeholders[currentPlaceholder]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </form>
      {suggestions.length > 0 && (
        <AnimatePresence>
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", overflow: "hidden" }}
            exit={{
              opacity: 0,
              height: 0,
              overflow: "hidden",
              transform: "scaleY(0.95)"
            }}
            transition={{
              opacity: { duration: 0.2 },
              height: { duration: 0.3, ease: "easeInOut" },
              transform: { duration: 0.3 }
            }}
            className="absolute right-0 z-40 left-0 w-full max-w-2xl mx-auto bg-white  border border-gray-300  rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                onClick={() => {
                  setValue(suggestion)
                  setAnimating(false)
                  inputRef.current?.focus()
                }}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 ">
                {suggestion}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}
    </div>
  )
}
