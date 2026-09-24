import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'

// Shared components from CLONE_SPEC 0.7 / 0.8 / 0.9.

// "Schedule Demo" goes to the local contact page (the clone keeps no links to other domains).
export const CALENDLY = '/contact'

/** Only same-site hrefs ("/route", "#anchor") survive; anything off-site renders without a link. */
export const localHref = (href) => (typeof href === 'string' && /^[/#]/.test(href) ? href : undefined)

// Framer tween used by every variant hover: 0.3s cubic-bezier(.33,1,.68,1)
export const FRAMER_TWEEN = { type: 'tween', duration: 0.3, ease: [0.33, 1, 0.68, 1] }

// framer-motion 13 hands backgroundColor to WAAPI, which interpolates colours linearly. Framer's
// runtime animates it in JS with squared-RGB mixing (measured). Any onUpdate prop disables the
// WAAPI path, so pass this no-op to motion elements that animate backgroundColor.
export const FORCE_JS_COLOR = () => {}

/** Router <Link> as a motion component (for internal hrefs starting with "/"). */
export const MotionLink = motion.create(Link)
export const isInternal = (href) => typeof href === 'string' && href.startsWith('/')

/** SVG used as a CSS mask; colour comes from the bg-* class. */
export function MaskIcon({ src, className = '' }) {
  const mask = `url("${src}") no-repeat center / contain`
  return <div aria-hidden="true" className={className} style={{ WebkitMask: mask, mask }} />
}

export function Wordmark({ className = '' }) {
  return <MaskIcon src="/assets/svg/wavelength-logo.svg" className={className} />
}

// Border colour per variant (static). Bg/text hover colours are animated with framer-motion
// (not CSS transitions) because Framer mixes colours in squared-RGB space: measured mid-hover
// values on the original only match motion's mixColor, CSS interpolates linearly and reads darker.
const BUTTON_BORDER = {
  light: 'after:border-white',
  black: 'after:border-ink',
  noicon: 'after:border-transparent',
}

const BUTTON_COLORS = {
  light: { rest: { backgroundColor: '#fdfcfb', color: '#262521' }, hover: { backgroundColor: '#262521', color: '#ffffff' } },
  black: { rest: { backgroundColor: '#262521', color: '#ffffff' }, hover: { backgroundColor: '#fdfcfb', color: '#262521' } },
  noicon: {
    rest: { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff' },
    hover: { backgroundColor: 'rgba(255, 255, 255, 0.22)', color: '#ffffff' },
  },
}

/** Framer "Primary" button (0.9). Hover: tween 0.3s [.33,1,.68,1] on bg + text colour. */
export function PrimaryButton({ variant = 'light', href: rawHref, target: rawTarget, children }) {
  const href = localHref(rawHref)
  const target = href === CALENDLY ? undefined : href ? rawTarget : undefined
  // Internal routes ("/...") render a router Link; everything else stays a plain anchor.
  const Comp = isInternal(href) ? MotionLink : motion.a
  const linkProps = isInternal(href) ? { to: href } : { href }
  return (
    <Comp
      {...linkProps}
      target={target}
      rel={target === '_blank' ? 'noopener' : undefined}
      variants={BUTTON_COLORS[variant]}
      initial="rest"
      animate="rest"
      whileHover="hover"
      transition={FRAMER_TWEEN}
      onUpdate={FORCE_JS_COLOR}
      className={`relative flex h-9 w-fit shrink-0 cursor-pointer select-none items-center justify-end gap-2 overflow-hidden whitespace-pre rounded-card p-[10px] text-button after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-solid after:content-[''] ${BUTTON_BORDER[variant]}`}
    >
      <span>{children}</span>
      {variant !== 'noicon' && <span>→</span>}
    </Comp>
  )
}

/** Text link "Schedule Demo →" (framer-Ouudo). */
export function TextLink({ href: rawHref = CALENDLY, target: rawTarget = '_blank', children = 'Schedule Demo' }) {
  const href = localHref(rawHref)
  const target = href === CALENDLY ? undefined : href ? rawTarget : undefined
  const Comp = isInternal(href) ? Link : 'a'
  const linkProps = isInternal(href) ? { to: href } : { href }
  return (
    <Comp
      {...linkProps}
      target={target}
      rel={target ? 'noopener' : undefined}
      className="group flex w-fit shrink-0 cursor-pointer select-none items-center gap-2 whitespace-pre text-link text-ink"
    >
      <span className="transition-opacity duration-300 ease-framer group-hover:opacity-60">{children}</span>
      <span className="transition-opacity duration-300 ease-framer group-hover:opacity-60">→</span>
    </Comp>
  )
}

/** Label icon tile (framer-z65He): 32px (28px on phone), accent bg, 18px icon (14px on phone). */
export function IconTile({ icon, accent }) {
  return (
    <div className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-card after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-solid after:border-ink after:content-[''] tablet:h-8 tablet:w-8 ${accent}`}>
      <MaskIcon src={icon} className="h-[14px] w-[14px] bg-ink tablet:h-[18px] tablet:w-[18px]" />
    </div>
  )
}

/** Number badge (framer-6HQhX). */
export function NumberBadge({ children }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-[10px] rounded-badge bg-badge p-[14px] tablet:h-10 tablet:w-10">
      <p className="whitespace-pre font-mono text-mono-s font-medium uppercase text-white opacity-80 desktop:text-mono">
        {children}
      </p>
    </div>
  )
}

function Bars({ count }) {
  return Array.from({ length: count }, (_, i) => <div key={i} className="h-[2073px] w-px shrink-0 bg-line-5" />)
}

/**
 * Decorative "Line" column (0.7). Position it with className (left-0 / right-0, top, bottom).
 * Desktop 160px / 15 bars (padding 0 20px), tablet 60px / 13 bars, phone 20px / 8 bars.
 */
export function LineColumn({ className = '' }) {
  return (
    <div className={`absolute z-[1] overflow-clip ${className}`}>
      <div className="flex h-full w-5 items-start justify-between tablet:hidden">
        <Bars count={8} />
      </div>
      <div className="hidden h-full w-[60px] items-start justify-between tablet:flex desktop:hidden">
        <Bars count={13} />
      </div>
      <div className="hidden h-full w-[160px] items-start justify-between px-5 desktop:flex">
        <Bars count={15} />
      </div>
    </div>
  )
}

/**
 * Framer Video component in "on-viewport" autoplay mode (measured on the original):
 * - not autoplaying / preload="none" until it scrolls into view;
 * - preload becomes "metadata" once within a 10% margin of the viewport (once);
 * - plays whenever any pixel is in view (useInView default), preload="auto" from then on;
 * - pauses (keeping currentTime) when it leaves the viewport or the tab is hidden, resumes on return.
 */
export function LoopVideo({ src, poster, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref)
  const near = useInView(ref, { margin: '10%', once: true })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (inView) {
      v.preload = 'auto'
      setStarted(true)
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [inView])

  useEffect(() => {
    const onVis = () => {
      const v = ref.current
      if (!v) return
      if (document.hidden) v.pause()
      else if (inView) v.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [inView])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay={started || inView}
      loop
      muted
      playsInline
      preload={started ? 'auto' : near ? 'metadata' : 'none'}
      className={`object-cover ${className}`}
    />
  )
}
