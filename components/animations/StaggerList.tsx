"use client"

import { ReactNode, Children, cloneElement, isValidElement } from "react"
import { motion, Variants } from "framer-motion"
import { staggerContainerVariants, staggerItemVariants } from "@/lib/animations"

interface StaggerListProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
}

export function StaggerList({
  children,
  className,
  staggerDelay = 0.05,
  initialDelay = 0,
}: StaggerListProps) {
  const containerVariants: Variants = {
    initial: {},
    enter: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay,
      },
    },
    exit: {
      transition: {
        staggerChildren: staggerDelay / 2,
        staggerDirection: -1,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child

        return (
          <motion.div
            key={index}
            variants={staggerItemVariants}
          >
            {child}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// Stagger grid (for card grids)
interface StaggerGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  gap?: number
  className?: string
  staggerDelay?: number
}

export function StaggerGrid({
  children,
  columns = 2,
  gap = 4,
  className,
  staggerDelay = 0.05,
}: StaggerGridProps) {
  const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }

  const gapClasses = {
    2: "gap-2",
    3: "gap-3",
    4: "gap-4",
    6: "gap-6",
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className={`grid ${columnClasses[columns]} ${gapClasses[gap as keyof typeof gapClasses] || `gap-${gap}`} ${className || ""}`}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child

        return (
          <motion.div
            key={index}
            variants={staggerItemVariants}
            custom={index}
          >
            {child}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

// Animated list item (for individual control)
interface AnimatedListItemProps {
  children: ReactNode
  index?: number
  className?: string
  onClick?: () => void
}

export function AnimatedListItem({
  children,
  index = 0,
  className,
  onClick,
}: AnimatedListItemProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      custom={index}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// For adding/removing items with animation
interface AnimatedListProps<T> {
  items: T[]
  keyExtractor: (item: T, index: number) => string
  renderItem: (item: T, index: number) => ReactNode
  className?: string
  itemClassName?: string
}

export function AnimatedList<T>({
  items,
  keyExtractor,
  renderItem,
  className,
  itemClassName,
}: AnimatedListProps<T>) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className={className}
    >
      {items.map((item, index) => (
        <motion.div
          key={keyExtractor(item, index)}
          variants={staggerItemVariants}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className={itemClassName}
        >
          {renderItem(item, index)}
        </motion.div>
      ))}
    </motion.div>
  )
}
