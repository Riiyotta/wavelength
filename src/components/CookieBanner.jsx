import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const STORAGE_KEY = 'wavelength-cookie-consent'
const SPRING = { type: 'spring', stiffness: 500, damping: 60, mass: 1 }

function readConsent() {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/** 12. Cookie banner (Framer Cookie Banner, EU "medium" mode). GTM loading is out of scope. */
export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !readConsent())

  const choose = (value) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      /* storage unavailable: just dismiss */
    }
    setVisible(false)
  }

  // Framer cookie buttons are motion inputs: whileHover opacity 0.6, whileTap 0.4, with motion's
  // default opacity tween (measured 0.3s, 0.99 -> 0.93 -> 0.85 -> 0.77 -> 0.70 at 17/50/83/116/150ms).
  const btn = 'flex-1 cursor-pointer rounded-card p-[10px] text-[14px] leading-[14px] [font-family:sans-serif]'
  const btnMotion = { whileHover: { opacity: 0.6 }, whileTap: { opacity: 0.4 } }

  return (
    <AnimatePresence>
      {visible && (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-10 flex justify-end p-5">
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={SPRING}
            role="dialog"
            aria-label="Cookie Settings"
            className="pointer-events-auto w-full rounded-cookie bg-white font-inter shadow-cookie max-w-[360px]"
          >
            <div className="p-5">
              <p className="mb-[10px] text-[14px] font-[700] leading-[normal] text-ink">Cookie Settings</p>
              <p className="text-[14px] leading-[1.5] text-ink">
                We use cookies to enhance your experience, analyze site traffic and deliver personalized content. Read
                our{' '}
                <a className="cursor-pointer text-link-blue no-underline">
                  Cookie Policy
                </a>
                .
              </p>
              <div className="mt-4 flex gap-[10px]">
                <motion.button {...btnMotion} type="button" onClick={() => choose('rejected')} className={`${btn} bg-mist text-ink`}>
                  Reject
                </motion.button>
                <motion.button {...btnMotion} type="button" onClick={() => choose('accepted')} className={`${btn} bg-ink text-white`}>
                  Accept
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
