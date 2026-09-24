import { useEffect, useState } from 'react'

// CLONE_SPEC 0.1: desktop >=1200, tablet 810-1199.98, phone <=809.98
const DESKTOP = '(min-width: 1200px)'
const TABLET = '(min-width: 810px) and (max-width: 1199.98px)'

function read() {
  if (typeof window === 'undefined') return 'desktop'
  if (window.matchMedia(DESKTOP).matches) return 'desktop'
  if (window.matchMedia(TABLET).matches) return 'tablet'
  return 'phone'
}

export default function useBreakpoint() {
  const [bp, setBp] = useState(read)
  useEffect(() => {
    const mqs = [window.matchMedia(DESKTOP), window.matchMedia(TABLET)]
    const onChange = () => setBp(read())
    mqs.forEach((m) => m.addEventListener('change', onChange))
    return () => mqs.forEach((m) => m.removeEventListener('change', onChange))
  }, [])
  return bp
}
