import { motion } from "framer-motion"
import React, { useEffect, useState } from "react"

export default function DigitalTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")

    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <motion.div
      data-testid="DigitalTime"
      className="inline-block px-5 py-2  text-white text-5xl rounded-lg font-mono"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}>
      {formatTime(time)}
    </motion.div>
  )
}
