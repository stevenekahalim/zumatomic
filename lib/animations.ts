import { Variants, Transition } from "framer-motion"

// Easing presets
export const easings = {
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.65, 0, 0.35, 1],
  spring: { type: "spring", stiffness: 400, damping: 30 },
  springBouncy: { type: "spring", stiffness: 500, damping: 25 },
  springSmooth: { type: "spring", stiffness: 300, damping: 40 },
} as const

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: easings.easeInOut,
    },
  },
}

// Slide from right (for detail pages)
export const slideRightVariants: Variants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
    },
  },
}

// Fade variants
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

// Scale variants (for modals)
export const scaleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: easings.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
}

// Slide up variants (for bottom sheets)
export const slideUpVariants: Variants = {
  initial: {
    y: "100%",
  },
  enter: {
    y: 0,
    transition: easings.springSmooth,
  },
  exit: {
    y: "100%",
    transition: { duration: 0.2 },
  },
}

// Stagger container for lists
export const staggerContainerVariants: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

// Stagger item
export const staggerItemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
}

// Button press animation
export const buttonTapVariants = {
  tap: { scale: 0.97 },
  hover: { scale: 1.02 },
}

// Toast variants
export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: easings.spring,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
}

// Shake animation (for errors)
export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
}

// Pulse animation
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
}

// Number count up animation config
export const countUpConfig = {
  duration: 1,
  ease: easings.easeOut,
}

// Confetti animation particles
export const confettiConfig = {
  particleCount: 50,
  spread: 70,
  origin: { y: 0.6 },
  colors: ["#8B5CF6", "#EC4899", "#06B6D4", "#FBBF24", "#10B981"],
}

// Fire flicker animation
export const fireFlickerVariants: Variants = {
  flicker: {
    scale: [1, 1.1, 0.95, 1.05, 1],
    rotate: [-2, 2, -1, 1, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
}

// Badge unlock animation
export const badgeUnlockVariants: Variants = {
  initial: {
    scale: 0,
    rotate: -180,
  },
  enter: {
    scale: [0, 1.2, 1],
    rotate: [180, 0, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.6, 1],
    },
  },
}

// Glow pulse animation (for tier effects)
export const glowPulseVariants: Variants = {
  pulse: {
    boxShadow: [
      "0 0 20px rgba(139, 92, 246, 0.4)",
      "0 0 40px rgba(139, 92, 246, 0.6)",
      "0 0 20px rgba(139, 92, 246, 0.4)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
}

// Ripple effect helper
export const createRipple = (
  event: React.MouseEvent<HTMLElement>,
  color = "rgba(255, 255, 255, 0.3)"
) => {
  const button = event.currentTarget
  const ripple = document.createElement("span")
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: ${color};
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
  `

  button.style.position = "relative"
  button.style.overflow = "hidden"
  button.appendChild(ripple)

  setTimeout(() => ripple.remove(), 600)
}
