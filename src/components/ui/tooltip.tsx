import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { createPortal } from "react-dom"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
  id?: string
  position?: "top" | "bottom" | "left" | "right"
  delay?: number
  className?: string
}

export function Tooltip({
  children,
  content,
  id,
  position = "top",
  delay = 200,
  className = "inline-block",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })
        setIsVisible(true)
      }
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  const handleFocus = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      })
      setIsVisible(true)
    }
  }

  const handleBlur = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    if (!isVisible) return

    const updateCoords = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        setCoords({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })
      }
    }

    // Capture scrolling in scrollable containers like sidebars or card views
    window.addEventListener("scroll", updateCoords, true)
    window.addEventListener("resize", updateCoords)

    return () => {
      window.removeEventListener("scroll", updateCoords, true)
      window.removeEventListener("resize", updateCoords)
    }
  }, [isVisible])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Calculate fixed position styles relative to the trigger's viewport location
  const getStyle = () => {
    if (!coords) return {}

    switch (position) {
      case "top":
        return {
          top: coords.top - 6,
          left: coords.left + coords.width / 2,
          transform: "translate(-50%, -100%)",
        }
      case "bottom":
        return {
          top: coords.top + coords.height + 6,
          left: coords.left + coords.width / 2,
          transform: "translate(-50%, 0)",
        }
      case "left":
        return {
          top: coords.top + coords.height / 2,
          left: coords.left - 6,
          transform: "translate(-100%, -50%)",
        }
      case "right":
        return {
          top: coords.top + coords.height / 2,
          left: coords.left + coords.width + 6,
          transform: "translate(0, -50%)",
        }
    }
  }

  const arrowClasses = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-bg-paper border-x-transparent border-b-transparent",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-bg-paper border-x-transparent border-t-transparent",
    left: "right-[-4px] top-1/2 -translate-y-1/2 border-l-bg-paper border-y-transparent border-r-transparent",
    right: "left-[-4px] top-1/2 -translate-y-1/2 border-r-bg-paper border-y-transparent border-l-transparent",
  }

  const animationVariants = {
    hidden: {
      opacity: 0,
      scale: 0.96,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 450,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: {
        duration: 0.08,
      },
    },
  }

  return (
    <>
      <div
        ref={triggerRef}
        id={id}
        className={`relative ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </div>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isVisible && content && coords && (
            <div
              style={{
                position: "fixed",
                zIndex: 99999,
                pointerEvents: "none",
                ...getStyle(),
              }}
              role="tooltip"
            >
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={animationVariants}
                className="relative px-2.5 py-1.5 text-[10px] md:text-[11px] font-medium leading-normal font-sans text-cream bg-bg-paper border border-rule rounded shadow-2xl backdrop-blur-sm max-w-[200px] text-center"
              >
                {content}
                <div
                  className={`absolute w-0 h-0 border-4 border-solid ${arrowClasses[position]}`}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
