import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import RiveCanvas from './RiveCanvas'
import { FORCE_JS_COLOR, FRAMER_TWEEN, LineColumn } from './ui'
import useBreakpoint from '../hooks/useBreakpoint'

const CARDS = [
  {
    key: 'latchel',
    logo: '/assets/images/52gP4Zu0Cx4jDCo8NOg5RMqHZQ4.png',
    logoAlt: 'Latchel',
    logoClass: 'w-[114px]',
    imgClass: 'block h-auto w-full',
    rive: { src: '/assets/riv/nuwOJr5hOc5jfJafpbaZpJW64.riv', artboard: 'Mini-Card', fit: 'fill' },
    riveBox: 'left-[-65px] right-[-113px] top-[-121px]',
    // Measured: Latchel's Rive row is pointer-events:none on the original; Lexamica/Rho are live.
    riveInteractive: false,
    quote:
      '“Service at scale only works when insight guides action. Wavelength supports a more deliberate approach—one that strengthens trust and sustains long-term relationships.”',
    name: 'Jennifer Lye',
    role: 'VP Service Operations @ Latchel',
    avatar: '/assets/images/6HfsizF7I1oslgzRCogDe86z9c.jpeg',
  },
  {
    key: 'lexamica',
    logo: '/assets/images/LH4TFynfdvmGBntyW6FWjA2qc.png',
    logoAlt: 'Lexamica',
    logoClass: 'h-6',
    imgClass: 'block h-6 w-auto',
    rive: { src: '/assets/riv/yRKeZFzUisz2JKMHQAOxfJpjg.riv', artboard: 'Mini-Card', fit: 'fill' },
    riveBox: 'left-[-65px] right-[-113px] top-[-121px]',
    riveInteractive: true,
    quote:
      '"Wavelength reflects how we believe client relationships should be managed: with context, continuity, and care. It gives our team the clarity to serve clients thoughtfully as we scale."',
    name: 'Kate Anand',
    role: 'VP of Customer Success @ Lexamica',
    avatar: '/assets/images/NmYHButanta1IQNIWCsoUxoSwnQ.jpeg',
  },
  {
    key: 'rho',
    logo: '/assets/images/z0kB33hEOl5n5YkLPjkR24t40.png',
    logoAlt: 'Rho',
    logoClass: 'h-6',
    imgClass: 'block h-6 w-auto',
    rive: { src: '/assets/riv/wyklSoGLZqeRFqZhABgohz2Cvw.riv', artboard: 'Mini-Card 2', fit: 'fitWidth' },
    riveBox: 'left-[-60px] right-[-121px] top-[-82px]',
    riveInteractive: true,
    quote:
      '“In business banking, post-sales is about trust and timing. Wavelength surfaces the right customer signals at the right moment, allowing our team to engage proactively, strengthen relationships, and grow accounts in a thoughtful, compliant way."',
    name: 'JD Reichenbach',
    role: 'Head of Growth Accounts @ Rho',
    avatar: '/assets/images/32tIMnJWk18CHrA4KATxa0Ei0.jpeg',
  },
]

// Card hover is a Framer variant (tween 0.3s [.33,1,.68,1]). Driven by framer-motion so colours
// mix in squared-RGB like the original (measured bg 144 / quote 214 at ~39ms, not CSS-linear).
// mix-blend-mode on the logo wrapper switches instantly on enter and leave.
const CARD_V = { rest: { backgroundColor: '#262521' }, hover: { backgroundColor: '#ffffff' } }
const TEXT_V = { rest: { color: '#ffffff' }, hover: { color: '#262521' } }
const LOGO_V = { rest: { mixBlendMode: 'normal' }, hover: { mixBlendMode: 'exclusion' } }

function TestimonialCard({ c }) {
  return (
    <motion.a
      href={c.href}
      variants={CARD_V}
      initial="rest"
      animate="rest"
      whileHover="hover"
      transition={FRAMER_TWEEN}
      onUpdate={FORCE_JS_COLOR}
      className="relative flex h-[500px] w-full cursor-pointer flex-col items-start justify-start gap-[70px] overflow-hidden rounded-card p-4"
    >
      <div className="relative flex h-px w-full flex-1 flex-col items-start justify-start gap-[60px]">
        <motion.div variants={LOGO_V} transition={{ duration: 0 }} className={`relative shrink-0 overflow-hidden ${c.logoClass}`}>
          <img src={c.logo} alt={c.logoAlt} className={c.imgClass} />
        </motion.div>
        <div className={`${c.riveInteractive ? '' : 'pointer-events-none '}relative flex h-[100px] w-full shrink-0 items-center justify-start gap-4`}>
          <div className={`absolute z-[1] aspect-[1.03226] ${c.riveBox}`}>
            <RiveCanvas src={c.rive.src} artboard={c.rive.artboard} fit={c.rive.fit} alignment="center" />
          </div>
        </div>
        <div className="relative z-[3] flex h-px w-full flex-1 flex-col items-start justify-between">
          <motion.p variants={TEXT_V} transition={FRAMER_TWEEN} className="w-full whitespace-pre-wrap break-words text-body-s">
            {c.quote}
          </motion.p>
          <div className="flex w-full items-center justify-start gap-2">
            <img src={c.avatar} alt={c.name} className="aspect-square h-10 w-10 shrink-0 rounded-avatar object-cover" />
            <div className="flex w-px flex-1 flex-col items-start justify-center">
              <motion.p variants={TEXT_V} transition={FRAMER_TWEEN} className="whitespace-pre text-caption">{c.name}</motion.p>
              <motion.p variants={TEXT_V} transition={FRAMER_TWEEN} className="whitespace-pre text-caption">{c.role}</motion.p>
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  )
}

// 11.6 Slideshow: infinite, no autoplay/drag, spring {stiffness 200, damping 40, mass 1}
const SPRING = { type: 'spring', stiffness: 200, damping: 40, mass: 1 }
// Framer Slideshow arrows: whileTap scale 0.9, transition { duration: 0.15 }. No hover state.
const ARROW_TAP = { whileTap: { scale: 0.9 }, transition: { duration: 0.15 } }
const COPIES = 3
const MIDDLE = Math.floor(COPIES / 2) * CARDS.length

function Slideshow({ bp }) {
  const perView = bp === 'tablet' ? 2 : 1
  const gap = bp === 'tablet' ? 20 : 10
  const viewRef = useRef(null)
  const [width, setWidth] = useState(0)
  const index = useRef(0)
  const x = useMotionValue(0)
  const controls = useRef(null)

  const itemW = width ? (width - gap * (perView - 1)) / perView : 0
  const pitch = itemW + gap

  useLayoutEffect(() => {
    const el = viewRef.current
    const measure = () => setWidth(el.offsetWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Keep the track aligned to the current slide when the size changes.
  useLayoutEffect(() => {
    controls.current?.stop()
    x.set(-(MIDDLE + index.current) * pitch)
  }, [pitch, x])

  const go = useCallback(
    (dir) => {
      if (!pitch) return
      controls.current?.stop()
      // Clones are identical, so re-centre on the middle copy (shifting x by whole
      // loops) before moving. This keeps index within [-1, n] and 3 copies enough.
      const n = CARDS.length
      const wrapped = ((index.current % n) + n) % n
      if (wrapped !== index.current) {
        x.set(x.get() + (index.current - wrapped) * pitch)
        index.current = wrapped
      }
      index.current += dir
      controls.current = animate(x, -(MIDDLE + index.current) * pitch, {
        ...SPRING,
        onComplete: () => {
          // Wrap back into the middle copy so the loop never runs out of clones.
          const n = CARDS.length
          const wrapped = ((index.current % n) + n) % n
          if (wrapped !== index.current) {
            index.current = wrapped
            x.set(-(MIDDLE + wrapped) * pitch)
          }
        },
      })
    },
    [pitch, x],
  )

  const slides = Array.from({ length: COPIES }, () => CARDS).flat()

  return (
    <div ref={viewRef} className="relative h-[510px] w-px flex-1">
      <motion.div className="absolute left-0 top-0 flex h-full" style={{ x, gap }}>
        {slides.map((c, i) => (
          <div key={i} className="h-[500px] shrink-0" style={{ width: itemW }} aria-hidden={i < MIDDLE || i >= MIDDLE + CARDS.length}>
            <TestimonialCard c={c} />
          </div>
        ))}
      </motion.div>
      <div className="absolute bottom-[-60px] left-0 z-[2] flex gap-[10px]">
        <motion.button {...ARROW_TAP} type="button" aria-label="Previous" onClick={() => go(-1)} className="h-10 w-10 cursor-pointer overflow-hidden rounded-card bg-black/20">
          <img src="/assets/images/XS3VZuCeUlMKgTQN5czLqhz4j4.png" alt="" className="block h-full w-full" />
        </motion.button>
        <motion.button {...ARROW_TAP} type="button" aria-label="Next" onClick={() => go(1)} className="h-10 w-10 cursor-pointer overflow-hidden rounded-card bg-black/20">
          <img src="/assets/images/wdBglVmblpgQZGWAyYchtgCRwA.png" alt="" className="block h-full w-full" />
        </motion.button>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const bp = useBreakpoint()

  return (
    <section className="relative flex w-full items-center justify-center gap-4 overflow-clip bg-white px-5 pb-20 pt-[60px] tablet:p-20 desktop:px-40">
      {/* Bg panel with line columns */}
      <div className="absolute inset-0 z-0 overflow-clip bg-mist tablet:inset-5 tablet:rounded-card">
        <LineColumn className="bottom-[-20px] left-[-20px] top-[-20px]" />
        <LineColumn className="bottom-0 right-[-20px] top-[-19px] tablet:bottom-[-20px] tablet:top-[-20px]" />
      </div>

      <div className="relative z-[3] flex w-px max-w-container flex-1 flex-col items-center justify-center gap-[30px] overflow-visible tablet:gap-[50px] desktop:overflow-clip">
        <div className="flex w-full flex-col items-start justify-start gap-3 tablet:gap-5">
          <h3 className="w-full text-balance text-h3-p text-ink tablet:text-h3-t desktop:text-h3">
            Customer success metrics on track.
          </h3>
          <p className="w-full max-w-[600px] text-balance text-body-s text-ink opacity-60 desktop:text-body-l">
            Your revenue, your customers, finally speaking clearly.
          </p>
        </div>

        {bp === 'desktop' ? (
          <div className="flex w-full items-start justify-start gap-[10px]">
            <div className="grid w-px flex-1 grid-cols-[repeat(3,minmax(50px,1fr))] justify-center gap-5">
              {CARDS.map((c) => (
                <div key={c.key} className="relative h-[500px] w-full self-start">
                  <TestimonialCard c={c} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative flex w-full items-center justify-center gap-4 pb-[60px]">
            <Slideshow key={bp} bp={bp} />
          </div>
        )}
      </div>

      {/* Tablet-only 20px white edge masks (framer-x18jsb / framer-17rfq54) */}
      <div className="absolute bottom-0 right-0 top-0 z-[3] hidden w-5 overflow-clip bg-white tablet:block desktop:hidden" />
      {/* Source quirk: this mask is right: 790px, so it sits at x=0 only at exactly 810 and drifts right on wider tablets. */}
      <div className="absolute bottom-0 right-[790px] top-0 z-[3] hidden w-5 overflow-clip bg-white tablet:block desktop:hidden" />
    </section>
  )
}
