import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { words } from '../../lib/placeholder'
import RiveCanvas from '../RiveCanvas'
import { FAQS, FaqItem } from '../IntegrationsFaq'
import useBreakpoint from '../../hooks/useBreakpoint'
import { RIV } from './shared'
import { FORCE_JS_COLOR } from '../ui'

const TOC_TWEEN = { type: 'tween', duration: 0.5, ease: [0.33, 1, 0.68, 1] }
// Scroll-spy line = the viewport top. Re-measured on the source (50px scroll steps): an item turns
// active once its section's top reaches the viewport top (e.g. The Challenge at top 1016 flips
// between scrollY 1000 and 1050; clicking it lands at scrollY 1016 and is active immediately).
const SPY_OFFSET = 0

// The TOC component is built for the 5-section case-study list; each item deactivates when the
// *next section in this list* reaches the spy line.
const TOC_ORDER = ['overview', 'the-challenge', 'the-approach', 'the-impact', 'why-it-matters']

/**
 * 7.3 TOC active logic, replicating the source's state rule (measured 2026-09-24 at 1440, 25px
 * steps, scrolling both down and up): item i is active when its section's top is at/above the
 * viewport top (the first item counts as reached from the start) AND the next section in
 * TOC_ORDER has not reached it. On blog posts "the-impact" doesn't exist, so "The Approach" never
 * deactivates and shows together with "Why It Matters" from that section to the page end
 * (source: `..AA` at scrollY 2150-5000; case studies never double-activate).
 */
function useActiveAnchors(anchorList) {
  const key = anchorList.join('|')
  const [active, setActive] = useState(() => new Set([anchorList[0]]))
  useEffect(() => {
    const anchors = key.split('|')
    const reached = (a) => {
      const el = document.getElementById(a)
      return !!el && el.getBoundingClientRect().top <= SPY_OFFSET + 1
    }
    const onScroll = () => {
      const next = new Set()
      anchors.forEach((a, i) => {
        const k = TOC_ORDER.indexOf(a)
        const after = k >= 0 ? TOC_ORDER[k + 1] : anchors[i + 1]
        if ((i === 0 || reached(a)) && !(after && reached(after))) next.add(a)
      })
      setActive((prev) => (prev.size === next.size && [...next].every((a) => prev.has(a)) ? prev : next))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [key])
  return active
}

function TocItem({ label, anchor, active }) {
  const [hover, setHover] = useState(false)
  return (
    // Instant jump (no smooth scroll) + location.hash update, as on the source.
    <a
      href={`#${anchor}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex h-[22px] items-center gap-3"
    >
      <span className="relative block h-[22px] w-2 shrink-0">
        <motion.span
          className="absolute inset-0 block rounded-[29px]"
          initial={false}
          animate={{ backgroundColor: active || hover ? '#262521' : '#d9d9d9' }}
          transition={TOC_TWEEN}
          onUpdate={FORCE_JS_COLOR}
        />
        <motion.span
          className="absolute left-[2px] top-0 block h-1 w-1 rounded-full bg-paper"
          initial={false}
          animate={{ y: active ? 16 : 2 }}
          transition={TOC_TWEEN}
        />
      </span>
      <span className="whitespace-pre text-body-s text-ink">{label}</span>
    </a>
  )
}

function Toc({ items }) {
  const active = useActiveAnchors(items.map((i) => i.anchor))
  return (
    <nav aria-label="Table of contents" className="sticky top-[120px] z-[1] hidden w-[112px] shrink-0 flex-col items-start gap-[6px] tablet:flex">
      {items.map((i) => (
        <TocItem key={i.anchor} label={i.label} anchor={i.anchor} active={active.has(i.anchor)} />
      ))}
    </nav>
  )
}

const P_CLASS = 'text-body-s text-ink desktop:text-body-l'
// `size: "l"` blocks stay 16/22.4 at every breakpoint (source quirk, see case-studies.json note)
const pClass = (b) => (b.size === 'l' ? 'text-body-l text-ink' : P_CLASS)

/** Rich-text blocks from blogs.json / case-studies.json `body`, with placeholder copy. */
function Blocks({ blocks, seed }) {
  return (
    <div className="flex w-full flex-col">
      {blocks.map((b, i) =>
        b.type === 'spacer' ? (
          <p key={i} className={pClass(b)}>
            <br />
          </p>
        ) : (
          <p key={i} className={pClass(b)}>
            {words(b.words, seed + i, b.chars)}
          </p>
        ),
      )}
    </div>
  )
}

function BodyItem({ item, index }) {
  if (item.kind === 'image')
    return (
      <div className="w-full overflow-hidden rounded-card">
        <img src={item.src} alt="" className="block aspect-[4/3] w-full rounded-card object-cover" />
      </div>
    )
  if (item.kind === 'imagePlaceholder') return <div className="h-[460px] w-full overflow-hidden rounded-card bg-stone" />
  const [h, ...rest] = item.blocks
  return (
    <div id={item.anchor} className="flex w-full flex-col gap-4 overflow-clip">
      <h6 className="text-h6-p text-ink tablet:text-h6">{h.text}</h6>
      <Blocks blocks={rest} seed={index * 11} />
    </div>
  )
}

/** 7.2 / 8.2 article: sticky TOC, content column, invisible 112px balancing spacer (D only). */
export function Article({ toc, body }) {
  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 py-10 tablet:px-20 tablet:pb-10 tablet:pt-[100px] desktop:px-40">
      <div className="relative flex w-full max-w-container flex-col items-start justify-center gap-[30px] tablet:flex-row tablet:gap-20">
        <Toc items={toc} />
        <div className="flex w-full flex-col gap-8 tablet:w-px tablet:flex-1 tablet:gap-12">
          {body.map((item, i) => (
            <BodyItem key={i} item={item} index={i} />
          ))}
        </div>
        <div aria-hidden="true" className="hidden w-[112px] shrink-0 desktop:block" />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// 7.5 Blog-post FAQ: home FAQ inside a grey panel with Blog.riv, items on #fbfaf9
// ---------------------------------------------------------------------------------------------

export function BlogFaq() {
  const bp = useBreakpoint()
  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 py-[60px] tablet:p-20 desktop:px-40">
      <div className="absolute inset-0 overflow-clip bg-mist tablet:inset-5 tablet:rounded-card">
        {bp !== 'phone' && (
          <div key={bp} className="pointer-events-auto absolute inset-y-0 left-0 right-0 tablet:left-[-22px] tablet:right-[-22px] desktop:left-0 desktop:right-0">
            <RiveCanvas src={bp === 'desktop' ? RIV.blogD : RIV.blogT} artboard={bp === 'desktop' ? 'About' : 'About_Break Point'} fit="layout" alignment="center" />
          </div>
        )}
      </div>
      <div className="relative z-[1] flex w-full max-w-container flex-col gap-[50px] overflow-clip">
        <div className="flex w-full flex-col items-start gap-[30px] tablet:gap-10 desktop:flex-row desktop:gap-0">
          <div className="flex w-full flex-col items-start gap-[21px] desktop:w-px desktop:flex-1">
            <h3 className="w-full max-w-[320px] text-h3-p text-ink tablet:text-h3-t desktop:text-h3">Frequently Asked</h3>
            <p className="w-full max-w-[320px] text-body-s text-ink opacity-60">
              The First AI-Native CRM purpose built for post-sales teams to track your customers’ journey from the moment
              they onboard till the day they expand.
            </p>
          </div>
          <div className="flex w-full flex-col items-start gap-[10px] desktop:w-px desktop:flex-1">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} bg="bg-[#fbfaf9]" qClass="text-faq-q-link tablet:text-faq-q" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
