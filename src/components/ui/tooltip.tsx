import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  id?: string
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
}

export function Tooltip({
  children,
  content,
  id,
  position = "top",
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  const handleFocus = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(true)
  }

  const handleBlur = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Position class names
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2 pb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2 pt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-2 pr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-2 pl-1.5",
  }

  const arrowClasses = {
    top: "bottom-0.5 left-1/2 -translate-x-1/2 border-t-bg-paper border-x-transparent border-b-transparent",
    bottom: "top-0.5 left-1/2 -translate-x-1/2 border-b-bg-paper border-x-transparent border-t-transparent",
    left: "right-0.5 top-1/2 -translate-y-1/2 border-l-bg-paper border-y-transparent border-r-transparent",
    right: "left-0.5 top-1/2 -translate-y-1/2 border-r-bg-paper border-y-transparent border-l-transparent",
  }

  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: position === "top" ? 3 : position === "bottom" ? -3 : 0,
      x: position === "left" ? 3 : position === "right" ? -3 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 24,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  }

  return (
    <div
      id={id}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <div
            className={`absolute z-50 pointer-events-none w-max max-w-xs ${positionClasses[position]}`}
            role="tooltip"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animationVariants}
              className="relative px-3 py-2 text-[10px] md:text-[11px] font-medium leading-relaxed font-sans text-cream bg-bg-paper border border-rule/70 rounded shadow-2xl backdrop-blur-md"
            >
              {content}
              <div
                className={`absolute w-0 h-0 border-4 border-solid ${arrowClasses[position]}`}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
