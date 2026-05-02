import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedCounter({ to, duration = 1, suffix = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (to === 0) {
      setCount(0)
      return
    }

    let start = 0
    const increment = to / (duration * 60) // Divide into frames (60fps assumed)
    const timer = setInterval(() => {
      start += increment
      if (start >= to) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [to, duration])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Math.round(count)}{suffix}
    </motion.span>
  )
}
