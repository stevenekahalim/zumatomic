"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  size?: "sm" | "md" | "lg"
  color?: "primary" | "success" | "warning" | "error" | "gradient"
  showValue?: boolean
  animate?: boolean
  className?: string
}

const sizes = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
}

const colors = {
  primary: "bg-atomic-purple",
  success: "bg-atomic-green",
  warning: "bg-atomic-yellow",
  error: "bg-red-500",
  gradient: "bg-gradient-to-r from-atomic-purple via-atomic-pink to-atomic-cyan",
}

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color = "primary",
  showValue = false,
  animate = true,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn("w-full", className)}>
      {showValue && (
        <div className="flex justify-between mb-1 text-xs text-[var(--text-secondary)]">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-dark-border overflow-hidden",
          sizes[size]
        )}
      >
        <motion.div
          className={cn("h-full rounded-full", colors[color])}
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

// Circular progress (for stats, etc.)
interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: "primary" | "success" | "warning" | "error"
  showValue?: boolean
  className?: string
  children?: React.ReactNode
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  color = "primary",
  showValue = true,
  className,
  children,
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const strokeColors = {
    primary: "stroke-atomic-purple",
    success: "stroke-atomic-green",
    warning: "stroke-atomic-yellow",
    error: "stroke-red-500",
  }

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-dark-border"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={strokeColors[color]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <span className="text-lg font-bold">{Math.round(percentage)}%</span>
        ))}
      </div>
    </div>
  )
}

// MMR Progress (shows progress to next tier)
interface MMRProgressProps {
  currentMMR: number
  tierMin: number
  tierMax: number
  tierName: string
  nextTierName?: string
  className?: string
}

export function MMRProgress({
  currentMMR,
  tierMin,
  tierMax,
  tierName,
  nextTierName,
  className,
}: MMRProgressProps) {
  const progress = ((currentMMR - tierMin) / (tierMax - tierMin)) * 100

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-secondary)]">{tierName}</span>
        {nextTierName && (
          <span className="text-[var(--text-secondary)]">{nextTierName}</span>
        )}
      </div>
      <ProgressBar value={progress} color="gradient" />
      <div className="flex justify-between text-xs text-[var(--text-secondary)]">
        <span>{tierMin} MMR</span>
        <span className="font-semibold text-white">{currentMMR} MMR</span>
        <span>{tierMax} MMR</span>
      </div>
    </div>
  )
}

// Step Progress (for multi-step flows)
interface StepProgressProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function StepProgress({
  steps,
  currentStep,
  className,
}: StepProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="relative mb-4">
        <div className="h-1 bg-dark-border rounded-full">
          <motion.div
            className="h-full bg-atomic-purple rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step dots */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                scale: currentStep === index ? 1.2 : 1,
                backgroundColor:
                  index <= currentStep ? "var(--atomic-purple)" : "var(--dark-border)",
              }}
              className={cn(
                "w-4 h-4 rounded-full border-2 border-dark-bg",
                index <= currentStep ? "bg-atomic-purple" : "bg-dark-border"
              )}
            />
          ))}
        </div>
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <span
            key={index}
            className={cn(
              "text-xs text-center max-w-[80px]",
              index <= currentStep
                ? "text-white font-medium"
                : "text-[var(--text-secondary)]"
            )}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

// Countdown timer progress
interface CountdownProgressProps {
  seconds: number
  totalSeconds: number
  label?: string
  className?: string
}

export function CountdownProgress({
  seconds,
  totalSeconds,
  label,
  className,
}: CountdownProgressProps) {
  const percentage = (seconds / totalSeconds) * 100
  const isWarning = percentage < 30
  const isDanger = percentage < 10

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">{label}</span>
          <span
            className={cn(
              "font-mono font-medium",
              isDanger
                ? "text-red-500"
                : isWarning
                ? "text-atomic-yellow"
                : "text-white"
            )}
          >
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
          </span>
        </div>
      )}
      <ProgressBar
        value={percentage}
        color={isDanger ? "error" : isWarning ? "warning" : "primary"}
        animate={false}
      />
    </div>
  )
}
