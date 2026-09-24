// Subpage motion presets (PAGES_SPEC 10). Same implementation as the home hero appear (11.1):
// animating a `transform` string lets framer-motion hand it to WAAPI like the original.

export const SPRING_05 = { type: 'spring', duration: 0.5, bounce: 0 }

/** Hero load appear: opacity .001, y 12 -> 1, 0; spring 0.5 / bounce 0. `extra` appends e.g. scale(0.75). */
export const appear = (delay = 0, extra = '') => ({
  initial: { opacity: 0.001, transform: `translateY(12px) ${extra}`.trim() },
  animate: { opacity: 1, transform: `translateY(0px) ${extra}`.trim() },
  transition: { ...SPRING_05, delay },
})

/** Scroll reveal, plays once. `y` 0 = fade only. `amount` = IntersectionObserver threshold. */
// `y` is written as a transform string (not the `y` motion value) so framer-motion runs opacity and
// transform in the same WAAPI animation frame; with `y` the translate trailed opacity by ~1 frame,
// while the original moves both in lockstep (rAF-sampled 2026-09-24).
export const reveal = ({ delay = 0, y = 0, amount = 0, duration = 0.5 } = {}) => ({
  initial: y ? { opacity: 0, transform: `translateY(${y}px)` } : { opacity: 0 },
  whileInView: y ? { opacity: 1, transform: 'translateY(0px)' } : { opacity: 1 },
  viewport: { once: true, amount },
  transition: { type: 'spring', duration, bounce: 0, delay },
})

/** 1.6 CI CTA reveal: opacity 0, y 24 -> 1, 0; tween 0.4s [.33,1,.68,1]; threshold .5, once. */
export const revealTween = (delay = 0) => ({
  initial: { opacity: 0, transform: 'translateY(24px)' },
  whileInView: { opacity: 1, transform: 'translateY(0px)' },
  viewport: { once: true, amount: 0.5 },
  transition: { type: 'tween', duration: 0.4, ease: [0.33, 1, 0.68, 1], delay },
})

/**
 * Card hovers (measured on the original 2026-09-24): the background layers tween, but text colour
 * is a variant CSS class on the source, so it flips instantly on hover and unhover (0ms).
 */
export const CARD_TWEEN = { type: 'tween', duration: 0.3, ease: [0.33, 1, 0.68, 1], color: { duration: 0 } }
/** Featured blog card: its variant root sits in MotionConfig {type: spring, duration .4, bounce .2}. */
export const FEATURED_SPRING = { type: 'spring', duration: 0.4, bounce: 0.2, color: { duration: 0 } }

export const PHOTO_EASE = { type: 'tween', duration: 0.5, ease: [0.22, 0.9, 0.32, 1] }
