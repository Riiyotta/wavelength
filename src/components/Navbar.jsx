import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, NavLink } from 'react-router-dom'
import { CALENDLY, FRAMER_TWEEN, PrimaryButton, Wordmark } from './ui'

const LINKS = [
  { label: 'Integrations', href: '/integrations' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'About us', href: '/about' },
]

// PAGES_SPEC 1.1: the current top-level page's link is underlined (1px, offset 4, #262521), no
// colour/weight change. `end` keeps /blogs/:slug from matching "Blogs".
const ACTIVE = 'underline decoration-ink decoration-1 underline-offset-4'

/** 1.1 Announcement banner */
export function AnnouncementBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex h-[35.6px] items-center justify-center gap-[10px] bg-ink p-2">
      <p className="whitespace-pre text-body-s text-white">Assembly is now Wavelength!</p>
      <Link
        to="/blogs/assembly-is-now-wavelength"
        className="whitespace-pre text-link text-white opacity-60 transition-opacity duration-300 ease-framer hover:opacity-100"
      >
        Read More
      </Link>
    </div>
  )
}

/** 1.2 Nav bar (desktop/tablet + phone with hamburger menu) */
export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop / Tablet */}
      <nav className="fixed inset-x-0 top-[35px] z-10 hidden h-[52px] justify-center bg-paper px-5 py-2 after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-solid after:border-hairline after:content-[''] tablet:flex">
        <div className="flex w-full max-w-container items-center gap-4">
          <div className="flex w-px flex-1 items-center justify-start gap-4">
            <Link to="/" aria-label="Wavelength home" className="flex w-full">
              <Wordmark className="h-6 w-[144px] bg-ink" />
            </Link>
          </div>
          <div className="flex w-px flex-1 items-center justify-center gap-4">
            {LINKS.map((l) => (
              <NavLink
                key={l.label}
                to={l.href}
                end
                className={({ isActive }) =>
                  `select-none whitespace-pre text-link text-ink transition-opacity duration-300 ease-framer hover:opacity-60 ${isActive ? ACTIVE : ''}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          <div className="flex w-px flex-1 items-center justify-end gap-4">
            <PrimaryButton variant="black" href={CALENDLY} target="_blank">
              Schedule Demo
            </PrimaryButton>
          </div>
        </div>
      </nav>

      {/* Phone */}
      <motion.nav
        className="fixed inset-x-0 top-[35px] z-10 flex flex-col gap-10 overflow-hidden bg-paper after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-solid after:border-hairline after:content-[''] tablet:hidden"
        initial={false}
        animate={{ height: open ? 321.8 : 48 }}
        transition={FRAMER_TWEEN}
      >
        <div className="flex w-full shrink-0 items-center justify-between gap-4 px-5 py-3">
          <Link to="/" aria-label="Wavelength home" className="flex w-px flex-1" onClick={() => setOpen(false)}>
            <Wordmark className="h-6 w-[144px] bg-ink" />
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="relative h-6 w-6 cursor-pointer"
          >
            <motion.span
              className="absolute left-0 block h-px w-6 bg-black/80"
              initial={false}
              animate={{ top: open ? 12 : 9, rotate: open ? -45 : 0 }}
              transition={FRAMER_TWEEN}
            />
            <motion.span
              className="absolute left-0 block h-px w-6 bg-black/80"
              initial={false}
              animate={{ top: open ? 12 : 14, rotate: open ? 45 : 0 }}
              transition={FRAMER_TWEEN}
            />
          </button>
        </div>
        {/* Original: menu content mounts instantly on open (revealed by the growing box) and
            unmounts instantly on close while the box shrinks. visibility mirrors that without
            changing layout. */}
        <div className="flex w-full shrink-0 flex-col items-start gap-4 px-5" style={{ visibility: open ? 'visible' : 'hidden' }}>
          {LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.href}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `select-none whitespace-pre text-h4-p text-ink transition-opacity duration-300 ease-framer hover:opacity-60 ${isActive ? ACTIVE : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex w-full shrink-0 justify-start px-5 pb-10" style={{ visibility: open ? 'visible' : 'hidden' }}>
          <PrimaryButton variant="black" href={CALENDLY} target="_blank">
            Schedule Demo
          </PrimaryButton>
        </div>
      </motion.nav>
    </>
  )
}
