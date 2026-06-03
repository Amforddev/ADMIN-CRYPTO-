import React, { useState, useEffect, useRef } from "react"
import { ChevronDown, Check, Filter } from "lucide-react"

export interface DoubleOption {
  value: string
  label: string
  color?: string     // Brand main hex color
  bgColor?: string   // Brand light tint background
  hoverColor?: string // Hover text element color
}

interface CustomSelectProps {
  id: string
  value: string
  onChange: (val: string) => void
  options: DoubleOption[]
  placeholder?: string
  icon?: React.ReactNode
  brandThemeMap?: Record<string, { color: string; bgColor: string }>
}

export default function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select...",
  icon,
  brandThemeMap
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Find currently selected option
  const selectedOption = options.find(opt => opt.value === value) || options[0]

  // Dynamic brand colors depending on the active selection
  let activeColor = "var(--color-lime)"
  let activeBg = "rgba(132, 204, 22, 0.1)" // lime-tint

  if (selectedOption) {
    if (selectedOption.color) {
      activeColor = selectedOption.color
    } else if (brandThemeMap && brandThemeMap[selectedOption.value]) {
      activeColor = brandThemeMap[selectedOption.value].color
    }

    if (selectedOption.bgColor) {
      activeBg = selectedOption.bgColor
    } else if (brandThemeMap && brandThemeMap[selectedOption.value]) {
      activeBg = brandThemeMap[selectedOption.value].bgColor
    }
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div 
      className="relative inline-block font-sans select-none" 
      ref={containerRef}
      id={`container-${id}`}
    >
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          border: isOpen ? `1px solid ${activeColor}` : "1px solid var(--color-rule)",
          boxShadow: isOpen ? `0 0 4px ${activeColor}30` : "none"
        }}
        className="flex items-center justify-between gap-1.5 bg-bg-base hover:bg-bg-elev/40 rounded px-2.5 h-7 cursor-pointer transition-all duration-150 text-cream text-[10px] pr-2 w-full min-w-[110px]"
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon || <Filter className="w-2.5 h-2.5 text-stone shrink-0" />}
          <span 
            className="font-medium truncate transition-colors"
            style={{ color: value !== "All" && selectedOption ? activeColor : "var(--color-cream)" }}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`w-3 h-3 text-stone shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: isOpen ? activeColor : "var(--color-stone)" }}
        />
      </button>

      {/* Options Panel Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute left-0 mt-1 z-50 min-w-[135px] max-h-60 overflow-y-auto bg-bg-elev border border-rule-strong rounded-md shadow-2xl py-1 animate-in fade-in slide-in-from-top-1 duration-100"
          style={{ width: "max-content", maxWidth: "220px" }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            // Custom item brand aesthetics
            const optColor = opt.color || (brandThemeMap && brandThemeMap[opt.value]?.color) || "var(--color-lime)"
            const optBg = opt.bgColor || (brandThemeMap && brandThemeMap[opt.value]?.bgColor) || "rgba(132, 204, 22, 0.08)"

            return (
              <button
                key={opt.value}
                id={`opt-${id}-${opt.value}`}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`flex items-center justify-between gap-2 px-3 py-1.5 w-full text-left text-[10px] font-sans font-medium transition-all ${
                  isSelected 
                    ? "text-cream" 
                    : "text-stone hover:text-cream"
                }`}
                style={{
                  backgroundColor: isSelected ? optBg : "transparent",
                  borderLeft: isSelected ? `2.5px solid ${optColor}` : "2.5px solid transparent"
                }}
              >
                <div className="flex items-center gap-2 truncate">
                  {/* Brand Color bullet dot indicators */}
                  {optColor && opt.value !== "All" && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full shrink-0" 
                      style={{ backgroundColor: optColor }}
                    />
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-2.5 h-2.5 shrink-0" style={{ color: optColor }} />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
