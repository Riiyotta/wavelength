import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue } from 'framer-motion'
import manifest from '../../PAGES_ASSET_MANIFEST.json'
import { FORCE_JS_COLOR, FRAMER_TWEEN } from '../components/ui'
import { HeroBg, RIV } from '../components/sub/shared'
import { JOIN_COPY, JOIN_PAD, JoinCta } from '../components/sub/Ctas'
import { CARD_TWEEN, appear, reveal } from '../components/sub/motion'
import useBreakpoint from '../hooks/useBreakpoint'

const IMG = '/assets/images/'

// ---------------------------------------------------------------------------------------------
// 5.1 Hero icon cluster
// ---------------------------------------------------------------------------------------------

// Base (untransformed) positions inside the 840-wide cluster. The spec's D positions were sampled
// mid-loop; subtracting the measured translateX gives these round values (e.g. Gmail 110.5 - 38.5).
const HERO_ICONS = [
  { name: 'Gmail', img: '7B7ZrreucQrygOVcmetA7S0dc.png', x: 72, y: -8, ring: '#f9720d', dx: 120 },
  { name: 'Hubspot', img: '8r7sztvIXadESA8pCpk8slX4XTc.png', x: 296, y: -8, ring: '#f9720d', dx: 120 },
  { name: 'Intercom', img: 'S3RKtEYSzUUuSahluNIMk9GLeA.png', x: 672, y: -8, ring: '#f9720d', dx: -80 },
  { name: 'Salesforce', img: 'CzSofVwEgTZxiejLbyBAGwUpyX8.png', x: 0, y: 59, ring: '#f677fd', dx: 80 },
  { name: 'Slack', img: 'gCGFzFGCt80Cbr9gMxJX3CEgM.png', x: 200, y: 59, ring: '#f677fd', dx: 80 },
  { name: 'Linear', img: 'UfTrFPCijebpj5IFlfRkLKLacOI.png', x: 522, y: 59, ring: '#f677fd', dx: 80 },
]
const LOOP_TWEEN = { type: 'tween', duration: 3, ease: [0.5, 0, 0.5, 1] }

/**
 * Framer Loop effect (tween 3s [.5,0,.5,1], mirror, no phase offsets), gated on viewport visibility
 * like the original (measured 2026-09-24): it only starts while the icon intersects the viewport;
 * when it leaves, the running half-cycle finishes, then x snaps to 0 and the loop stops; it
 * restarts forward from 0 on re-entry. So at 390 the off-screen Gmail/Salesforce never move.
 */
function useViewportLoop(ref, dx) {
  const x = useMotionValue(0)
  const inView = useInView(ref)
  const state = useRef({ inView: false, running: false, cancelled: false, controls: null })
  state.current.inView = inView

  // Declared first so a remount (StrictMode) resets the flags before the loop effect runs.
  useEffect(() => {
    const st = state.current
    st.cancelled = false
    return () => {
      st.cancelled = true
      st.running = false
      st.controls?.stop()
    }
  }, [])

  useEffect(() => {
    const st = state.current
    if (!inView || st.running) return
    st.running = true
    let forward = true
    const step = () => {
      if (st.cancelled) return
      if (!st.inView) {
        x.set(0)
        st.running = false
        return
      }
      st.controls = animate(x, forward ? dx : 0, LOOP_TWEEN)
      st.controls.then(() => {
        forward = !forward
        step()
      })
    }
    step()
  }, [inView, dx, x])

  return x
}

function HeroIcon({ icon }) {
  const ref = useRef(null)
  const x = useViewportLoop(ref, icon.dx)
  return (
    <motion.div ref={ref} className="absolute z-[1] h-12 w-12" style={{ left: icon.x, top: icon.y, x }}>
      {/* Source: the image fills the 48 box; the 4px #262521 border is an overlay (Framer
          ::after) that covers the image edge, with the 6px ring as a box-shadow. */}
      <div className="relative h-full w-full rounded-card" style={{ boxShadow: `0 0 0 6px ${icon.ring}` }}>
        <img src={`${IMG}${icon.img}`} alt={icon.name} className="block h-full w-full rounded-card object-contain" />
        <span className="pointer-events-none absolute inset-0 rounded-card border-4 border-solid border-ink" />
      </div>
    </motion.div>
  )
}

/**
 * The cluster is always the desktop geometry (840 wide, 48px icons). T and P render it at
 * scale 0.75 from the bottom edge: T box 840x140 -> 630x105 visible, P 840x120 -> 630x90
 * (matches the measured T/P rects, where icon positions are exactly D x 0.75).
 */
// Cluster appear per breakpoint (measured WAAPI keyframes on the original, 2026-09-24):
// D translateY(12px) -> none; T translateY(12px) -> scale(0.75) (it shrinks while it fades in);
// P translateY(12px) scale(0.75) -> scale(0.75). Spring 0.5 / bounce 0, delay 0.1 in all cases.
const CLUSTER_APPEAR = {
  desktop: appear(0.1),
  tablet: {
    ...appear(0.1),
    initial: { opacity: 0.001, transform: 'translateY(12px) scale(1)' },
    animate: { opacity: 1, transform: 'translateY(0px) scale(0.75)' },
  },
  phone: appear(0.1, 'scale(0.75)'),
}

function IconCluster() {
  const bp = useBreakpoint()
  return (
    <div className="relative flex h-[120px] w-full justify-center tablet:h-[140px] desktop:h-[180px]">
      <motion.div
        {...CLUSTER_APPEAR[bp]}
        key={bp}
        // Clip only the bottom: the top-row icons sit at y=-8 and their 6px rings (and Salesforce's
        // ring at x=0) must overflow the box, as on the source.
        style={{ transformOrigin: '50% 100%', clipPath: 'inset(-20px -20px 0 -20px)' }}
        className="relative h-full w-[840px] shrink-0 bg-ink"
      >
        <img
          src="/assets/svg/integrations-hero-tracks.svg"
          alt=""
          className="absolute left-[-12.6px] top-0 h-[433.3px] w-[865.2px] max-w-none"
        />
        {HERO_ICONS.map((i) => (
          <HeroIcon key={i.name} icon={i} />
        ))}
      </motion.div>
    </div>
  )
}

function IntegrationsHero() {
  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-[30px] pt-[150px] tablet:px-20 tablet:pb-0 tablet:pt-[140px] desktop:px-40">
      <HeroBg color="bg-ink" desktop={RIV.darkD} tablet={RIV.darkT} className="top-0 tablet:top-20" />
      <div className="relative z-[3] flex w-full max-w-container flex-col items-center gap-5 tablet:gap-[30px] desktop:gap-20">
        <div className="flex w-full flex-col items-center gap-3 tablet:gap-5">
          <motion.h1 {...appear(0)} className="text-center text-balance text-title-p text-white tablet:text-title-t desktop:text-title">
            <span className="block">Connect With Your</span>
            <span className="block">Tools{' '}Seamlessly</span>
          </motion.h1>
          <motion.p {...appear(0.05)} className="w-full max-w-[440px] text-balance text-center text-body-s text-white desktop:text-body-l">
            Explore over 40+ integrations to streamline your workflow, from Slack to Zendesk, and supercharge your team’s
            efficiency in just a few clicks!
          </motion.p>
        </div>
        <IconCluster />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// 5.2 List
// ---------------------------------------------------------------------------------------------

const RANDOM_COLORS = ['#f677fd', '#a184fa', '#63f6b5', '#ffdd03', '#f9720d', '#678efd']
const SEGMENT_HOVER = ['#ffdd03', '#f677fd', '#f9720d', '#f677fd']

function Dots() {
  return (
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[10px]">
      {[0, 1, 2].map((d) => (
        <div key={d} className="h-3 w-3 overflow-clip rounded-[50px] border-2 border-solid border-ink bg-stone" />
      ))}
    </div>
  )
}

function Segment({ index }) {
  // "Random colour" code component: one colour per segment, picked at mount.
  const fill = useMemo(() => RANDOM_COLORS[Math.floor(Math.random() * 6)], [])
  return (
    <motion.div
      className={`relative h-[39px] w-px flex-1 ${index > 0 ? 'border-l border-solid border-black' : ''}`}
      variants={{ rest: { backgroundColor: '#a7a7a7' }, hover: { backgroundColor: SEGMENT_HOVER[index] } }}
      transition={FRAMER_TWEEN}
      onUpdate={FORCE_JS_COLOR}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        variants={{ rest: { backgroundColor: '#a7a7a7' }, hover: { backgroundColor: fill } }}
        // The random-colour code component swaps its fill instantly (0ms) on the source
        transition={{ duration: 0 }}
      />
      {(index === 1 || index === 3) && <Dots />}
    </motion.div>
  )
}

const CARD_VARIANTS = {
  rest: { backgroundColor: '#f4f2f0', color: '#262521' },
  hover: { backgroundColor: '#262521', color: '#ffffff' },
}

function IntegrationCard({ item, index }) {
  return (
    <motion.div {...reveal({ y: 12, delay: index * 0.05 })} className="w-full">
      <motion.a
        initial="rest"
        animate="rest"
        whileHover="hover"
        variants={CARD_VARIANTS}
        transition={CARD_TWEEN}
        onUpdate={FORCE_JS_COLOR}
        className="flex w-full flex-col items-center justify-center gap-6 overflow-clip rounded-card py-5 tablet:h-[240px] tablet:py-6"
      >
        <div className="relative flex h-12 w-full items-center gap-4 pl-5 tablet:pl-6">
          {/* Track strip */}
          <motion.div
            className="absolute inset-x-0 top-[4.5px] z-0 flex h-[39px] items-center justify-center overflow-clip"
            variants={{ rest: { opacity: 0.1 }, hover: { opacity: 1 } }}
            transition={FRAMER_TWEEN}
          >
            <div className="absolute inset-0 border-y-[6px] border-solid border-black" />
            <div className="absolute inset-x-0 top-[6px] z-[1] flex h-[27px] items-center justify-center overflow-clip">
              {[0, 1, 2, 3].map((s) => (
                <Segment key={s} index={s} />
              ))}
            </div>
          </motion.div>
          {/* Icon tile */}
          <motion.div
            className="relative z-[1] flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-card p-[6px]"
            variants={{
              rest: { backgroundColor: '#f4f2f0', boxShadow: '0 0 0 2px #dcdad8' },
              hover: { backgroundColor: '#000000', boxShadow: '0 0 0 2px #171717' },
            }}
            transition={FRAMER_TWEEN}
            onUpdate={FORCE_JS_COLOR}
          >
            <img src={item.icon} alt="" className="block h-12 w-12 rounded-card object-cover" />
          </motion.div>
        </div>
        <div className="flex w-full flex-col items-start gap-4 px-5 tablet:px-6">
          <h6 className="text-h6-p tablet:text-h6">{item.name}</h6>
          <p className="text-body-s opacity-80 desktop:text-body-l">{item.description}</p>
        </div>
      </motion.a>
    </motion.div>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#262521" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-50" aria-hidden="true">
      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
      <path d="M21 21l-6 -6" />
    </svg>
  )
}

function IntegrationsList() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  // Case-insensitive substring match on the name (descriptions not searched; see spec 12.8).
  const items = manifest.integrations.filter((i) => i.name.toLowerCase().includes(q))

  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-20 pt-[60px] tablet:p-20 desktop:px-40 desktop:pt-[100px]">
      <div className="relative flex w-full max-w-container flex-col gap-10 tablet:gap-x-5 tablet:gap-y-12">
        <h4 className="text-h4-p text-ink tablet:text-h4-t desktop:text-h4">Integrations</h4>
        <label className="relative flex w-full cursor-text items-center gap-[10px] overflow-hidden rounded-card bg-stone p-[10px] tablet:w-[440px] max-w-[440px]">
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search integrations"
            aria-label="Search integrations"
            className="peer h-[24.4px] w-full border-0 bg-transparent p-0 font-sans text-[16px] leading-[1.4em] text-ink outline-none placeholder:text-[rgba(38,37,33,0.5)]"
          />
          <span className="pointer-events-none absolute inset-0 hidden rounded-[inherit] border border-solid border-ink peer-focus:block" />
        </label>
        {items.length ? (
          <div className="grid w-full grid-cols-1 gap-[10px] tablet:grid-cols-2 tablet:gap-3 desktop:grid-cols-3">
            {items.map((item, i) => (
              <IntegrationCard key={item.name} item={item} index={i} />
            ))}
          </div>
        ) : (
          // Superfields empty state: 189-tall box, padding 40, centred column (gap 10) with a 48px
          // "no results" glyph (inline sprite on the source) above the message.
          <div className="flex h-[189px] w-full flex-col items-center justify-center gap-[10px] p-10">
            <svg viewBox="0 0 48 48" className="block h-12 w-12 shrink-0" aria-hidden="true">
              <path
                d="M 16 8 L 18 8 C 19.105 8 20 8.895 20 10 L 20 12 M 19.42 19.408 C 19.045 19.787 18.533 20 18 20 L 10 20 C 8.895 20 8 19.105 8 18 L 8 10 C 8 9.448 8.222 8.95 8.584 8.588 M 36 28 L 38 28 C 39.105 28 40 28.895 40 30 L 40 32 M 39.42 39.408 C 39.045 39.787 38.533 40 38 40 L 30 40 C 28.895 40 28 39.105 28 38 L 28 30 C 28 29.448 28.222 28.95 28.584 28.588 M 8 30 C 8 28.895 8.895 28 10 28 L 18 28 C 19.105 28 20 28.895 20 30 L 20 38 C 20 39.105 19.105 40 18 40 L 10 40 C 8.895 40 8 39.105 8 38 Z M 28 10 C 28 8.895 28.895 8 30 8 L 38 8 C 39.105 8 40 8.895 40 10 L 40 18 C 40 19.105 39.105 20 38 20 L 30 20 C 28.895 20 28 19.105 28 18 Z M 6 6 L 42 42"
                fill="none"
                stroke="#262521"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="w-full text-center text-body-s text-ink desktop:text-body-l">No items matching filters</p>
          </div>
        )}
      </div>
    </section>
  )
}

/** Section 5: /integrations */
export default function Integrations() {
  return (
    <>
      <IntegrationsHero />
      <IntegrationsList />
      <JoinCta {...JOIN_COPY.integrations} pad={JOIN_PAD.list} />
    </>
  )
}

