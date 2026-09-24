import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import RiveCanvas from './RiveCanvas'
import useBreakpoint from '../hooks/useBreakpoint'

const LOGOS = [
  'CI07VkDq5EjaI9fvzZtWqszrs0.png',
  'cCVpgYDbMKapsGtJzx5rYRflvDc.png',
  'p2a7xf2NHWUddtC1UUKF6kFc1U.png',
  'gk8YtN5h1vJH6aWTLDjzSpqPug.png',
  'F0FLW1PAMhbHm15NSJ1ewW4mth8.png',
  'Q3mf5wgQRU3zYSsoxk7VcG5OPo.png',
  '9ijWiHUZbGLncQ8WTFxcZ68OCOM.png',
  'lXx0FqHe7GzJQrDE55lQoqtsxo.png',
  'wN2i3YcL35ip6tE2nlvg8M9zJE.png',
].map((f) => `/assets/images/${f}`)

// 11.3 Logo rotator props
const COLUMNS = 4
const ANIM = 0.5
const DISPLAY = 1.5
const STAGGER = 0.2
const BATCHES = LOGOS.length / gcd(LOGOS.length, COLUMNS) // 9
const CYCLE_MS = (ANIM + STAGGER * (COLUMNS - 1) + DISPLAY + ANIM + STAGGER * (COLUMNS - 1)) * 1000 // 3.7s

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b)
}

/**
 * Desktop/Tablet grid mode. Reproduces the Framer "Logo" component, which wraps all 4 cells in
 * ONE AnimatePresence mode="wait" keyed `${batch}-${n}`: on a batch change every cell exits
 * (staggered n*0.2s, 0.5s easeOut, all gone at 1.1s), only then the new batch mounts and enters
 * (same stagger, done at 2.2s), and the next batch change fires 3.7s after the previous change.
 * Measured on the original: exits start t=0/0.2/0.4/0.6, DOM swap at 1.1s, next change at +3.7s.
 * Implemented as an explicit exit -> swap state machine (same timeline) because framer-motion
 * warns on every render about multiple children under mode="wait".
 */
function LogoGrid() {
  const [target, setTarget] = useState(0) // Framer's batch index F (changes every 3.7s)
  const [shown, setShown] = useState(0) // batch currently mounted
  const exiting = shown !== target

  useEffect(() => {
    const t = setTimeout(() => setTarget((b) => (b + 1) % BATCHES), CYCLE_MS)
    return () => clearTimeout(t)
  }, [target])

  return (
    <div className="grid w-full grid-cols-4 items-center justify-items-center gap-0 p-0">
      {Array.from({ length: COLUMNS }, (_, n) => (
        <motion.div
          key={`${shown}-${n}`}
          className="flex h-5 w-full items-center justify-center desktop:h-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={exiting ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
          transition={{ duration: ANIM, delay: n * STAGGER, ease: 'easeOut' }}
          onAnimationComplete={n === COLUMNS - 1 && exiting ? () => setShown(target) : undefined}
        >
          <img
            src={LOGOS[(shown * COLUMNS + n) % LOGOS.length]}
            alt=""
            className="block h-5 w-auto object-contain brightness-0 desktop:h-6"
          />
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Phone ticker mode (11.4). Matches the Framer component exactly:
 * - track animates x: 0 -> -groupWidth, linear, 20s, infinite, only while in view (amount 0.1);
 *   out of view it returns to x=0, so it restarts from 0 on re-entry;
 * - groupWidth is the group's offsetWidth (margin-right NOT included), so the loop point
 *   shifts content by the 40px margin, as on the original (1051px / 20s = 52.55px/s at 390);
 * - groups rendered = max(4, ceil(containerWidth*2 / groupWidth) + 2);
 * - no hover pause.
 */
function LogoTicker() {
  const wrapRef = useRef(null)
  const groupRef = useRef(null)
  const inView = useInView(wrapRef, { amount: 0.1 })
  const [distance, setDistance] = useState(0)
  const [copies, setCopies] = useState(4)

  useLayoutEffect(() => {
    const measure = () => {
      if (!groupRef.current || !wrapRef.current) return
      const groupW = groupRef.current.offsetWidth
      const containerW = wrapRef.current.offsetWidth
      setDistance(groupW)
      setCopies(groupW > 0 && containerW > 0 ? Math.max(4, Math.ceil((containerW * 2) / groupW) + 2) : 4)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(groupRef.current)
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const running = inView && distance > 0

  return (
    <div ref={wrapRef} className="w-full overflow-hidden">
      <div
        className="flex w-max"
        style={{
          '--ticker-distance': `${distance}px`,
          animation: running ? 'ticker 20s linear infinite' : 'none',
        }}
      >
        {Array.from({ length: copies }, (_, c) => (
          <div
            key={c}
            ref={c === 0 ? groupRef : undefined}
            aria-hidden={c > 0}
            className="mr-10 flex shrink-0 items-center gap-10"
          >
            {LOGOS.map((src) => (
              <img key={src} src={src} alt="" className="block h-5 w-auto shrink-0 object-contain brightness-0" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LogoStrip() {
  const bp = useBreakpoint()

  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-4 overflow-clip bg-mist px-5 tablet:px-[79px] desktop:px-40">
      {bp === 'desktop' && (
        <div className="absolute bottom-[-1px] left-[10px] right-[10px] z-0 h-[101%]">
          <RiveCanvas
            src="/assets/riv/NyWiQDmsS9ebggZxNFRg5HfL4.riv"
            artboard="Trusted By"
            fit="layout"
            alignment="center"
          />
        </div>
      )}
      <div className="relative flex w-full max-w-container flex-col items-center justify-center gap-5 px-3 py-10 after:pointer-events-none after:absolute after:inset-0 after:border-x after:border-solid after:border-logo-border after:content-[''] tablet:px-0">
        <p className="w-full text-balance text-left text-body-s text-ink opacity-60 tablet:w-auto tablet:whitespace-pre tablet:text-center">
          Trusted by Hundreds of Customer Obsessed Companies:
        </p>
        {bp === 'phone' ? <LogoTicker /> : <LogoGrid />}
      </div>
    </section>
  )
}
