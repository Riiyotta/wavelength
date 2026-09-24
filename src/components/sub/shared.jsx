import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import RiveCanvas from '../RiveCanvas'
import useBreakpoint from '../../hooks/useBreakpoint'

// Rive files (PAGES_ASSET_MANIFEST.json -> rive)
export const RIV = {
  aboutD: '/assets/riv/HlJWhQXKLiwPA8cob7OjHpIwjhU.riv',
  aboutT: '/assets/riv/CUIzkbzcTG52R1qzdAuoh60Fo.riv',
  darkD: '/assets/riv/Uq3YeQEEX0UsPfhU8yFnHzkJZlU.riv',
  darkT: '/assets/riv/8ubTz5jBPfH05evDGWznRfB74M.riv',
  blogD: '/assets/riv/HSuPIw4chuDb29eAOVt30CnWew.riv',
  blogT: '/assets/riv/DnAJJnDxUqf6TDdmrNTHXZ5JA.riv',
}

/** Scroll to top on pathname change (hash-only changes are left to the browser). */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  // Deep link with a hash (e.g. /about#career): jump once the target exists.
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (el) el.scrollIntoView()
  }, [pathname, hash])
  return null
}

/**
 * Subpage overlay lines (Framer component `framer-EqcnT`, z-index 9, pointer-events none). Two 1px
 * lines (#262521 at opacity 0.05), `padding: 0 140px` (tablet `0 65px`), inner max-width 1240,
 * justify space-between. Not in PAGES_SPEC; measured live 2026-09-24:
 * - fixed to the viewport on /integrations, /blogs, /blogs/*, /case-study/*, /404;
 * - absolute inside the hero section only on /about and /contact (`absolute` prop);
 * - absent on /legals/* and on home; hidden on phone everywhere.
 */
export const FIXED_LINE_ROUTES = (pathname) =>
  pathname !== '/' && pathname !== '/about' && pathname !== '/contact' && !pathname.startsWith('/legals/')

export function PageLines({ absolute = false }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${absolute ? 'absolute' : 'fixed'} inset-0 z-[9] hidden tablet:block`}>
      <div className="flex h-full w-full items-center justify-center px-[65px] desktop:px-[140px]">
        <div className="flex h-full w-px max-w-[1240px] flex-1 items-center justify-between overflow-clip">
          <div className="h-full w-px bg-line-5" />
          <div className="h-full w-px bg-line-5" />
        </div>
      </div>
    </div>
  )
}

/** Rive that swaps file per breakpoint (D "About" artboard / T "About_Break Point"); none on phone. */
export function BpRive({ desktop, tablet, artboardD = 'About', artboardT = 'About_Break Point', fit = 'layout', alignment = 'center' }) {
  const bp = useBreakpoint()
  if (bp === 'phone') return null
  const src = bp === 'desktop' ? desktop : tablet
  return (
    <div key={src} className="absolute inset-0">
      <RiveCanvas src={src} artboard={bp === 'desktop' ? artboardD : artboardT} fit={fit} alignment={alignment} />
    </div>
  )
}

/**
 * 1.4 hero `bg` panel: absolutely positioned behind the hero, coloured, with the D/T Rive inside.
 * `className` sets the vertical extent (e.g. `top-20` or `top-0 tablet:top-20`).
 */
export function HeroBg({ color, desktop, tablet, className = 'top-20' }) {
  return (
    <div className={`pointer-events-auto absolute inset-x-0 bottom-0 z-0 overflow-clip ${color} ${className}`}>
      <BpRive desktop={desktop} tablet={tablet} />
    </div>
  )
}

/**
 * Framer "Underline" link visual ("Read More →", "Learn More →"): 14/18.2, label + arrow in one
 * 1px underline at offset 4. Rendered as a span because it sits inside a card-wide link.
 */
export function UnderlineLabel({ children }) {
  return (
    <span className="flex w-fit items-center gap-2 whitespace-pre text-link">
      <span className="underline decoration-current decoration-1 underline-offset-4">{children}</span>
      <span className="underline decoration-current decoration-1 underline-offset-4">→</span>
    </span>
  )
}
