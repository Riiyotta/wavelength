import { motion } from 'framer-motion'
import RiveCanvas from '../RiveCanvas'
import { CALENDLY, PrimaryButton } from '../ui'
import useBreakpoint from '../../hooks/useBreakpoint'
import { reveal, revealTween } from './motion'

// ---------------------------------------------------------------------------------------------
// 1.5 CTA card "Join The Wave" (framer-vPhyq)
// ---------------------------------------------------------------------------------------------

const CTA_RIVE = {
  right: { src: '/assets/riv/Aw54OYkSRnZlmjRkUd6iNyKjco.riv', artboard: 'Demo 4', alignment: 'bottomRight' },
  left: { src: '/assets/riv/nhu0tRmUpWwEoH2Ln6s62J1x1Y.riv', artboard: 'Demo 5', alignment: 'bottomLeft' },
  top: { src: '/assets/riv/OInirLcETOKEtorAiFhBgAGxqU.riv', artboard: 'Demo 3', alignment: 'topRight' },
}

// Per-breakpoint boxes of the three aspect-ratio layers (1.5 table)
const CTA_LAYERS = {
  desktop: {
    right: { width: 1105, aspectRatio: '2.90789', bottom: 0, right: 0 },
    left: { width: 1117, aspectRatio: '2.82785', bottom: 0, left: 0 },
    top: { width: 1192, aspectRatio: '2.85916', top: -11, right: 0 },
  },
  tablet: {
    right: { width: 919, aspectRatio: '2.90789', bottom: 0, right: 0 },
    left: { width: 819, aspectRatio: '2.82785', bottom: 0, left: 0 },
    top: { width: 849, aspectRatio: '2.85916', top: 0, right: -9 },
  },
  // Phone: width comes from left/right, height from the aspect ratio (measured 655x225.2 / 656x229.4).
  phone: {
    right: { aspectRatio: '2.90789', bottom: 0, right: 0, left: -305 },
    top: { aspectRatio: '2.85916', top: 0, left: -153, right: -153 },
  },
}

// Section padding per page (1.5 last bullet)
export const JOIN_PAD = {
  about: 'px-5 py-[60px] tablet:px-20 desktop:px-40',
  list: 'px-5 py-[60px] tablet:px-20 tablet:pb-[60px] tablet:pt-10 desktop:px-40',
  article: 'px-5 py-[60px] tablet:px-20 tablet:pb-[60px] tablet:pt-20 desktop:px-40 desktop:pt-[120px]',
}

export function JoinCta({ title, body, pad }) {
  const bp = useBreakpoint()
  const layers = CTA_LAYERS[bp]

  return (
    <section className={`relative flex w-full flex-col items-center justify-center gap-4 overflow-clip bg-white ${pad}`}>
      <div className="relative flex w-full max-w-container flex-col items-center gap-[50px] overflow-clip">
        <div className="relative flex w-full max-w-[1400px] flex-col items-center justify-center gap-10 overflow-clip rounded-card bg-ink tablet:px-5 tablet:py-[100px] desktop:py-24">
          {Object.entries(layers).map(([k, style]) => (
            <div key={`${bp}-${k}`} className="pointer-events-none absolute z-0" style={style}>
              <RiveCanvas src={CTA_RIVE[k].src} artboard={CTA_RIVE[k].artboard} fit="contain" alignment={CTA_RIVE[k].alignment} />
            </div>
          ))}
          <div className="relative z-[1] flex w-full max-w-[680px] flex-col items-center gap-5 px-5 py-[120px] tablet:max-w-[560px] tablet:p-0 desktop:max-w-[680px]">
            <motion.h3 {...reveal({ y: 12, amount: 0.5 })} className="w-full text-balance text-center text-h3-p text-white tablet:text-h3-t desktop:text-h3">
              {title}
            </motion.h3>
            {/* Wrapper carries the reveal so the paragraph keeps its 0.64 opacity */}
            <motion.div {...reveal({ y: 12, amount: 0.5, delay: 0.05 })} className="w-full">
              <p className="w-full text-balance text-center text-body-s text-white opacity-[0.64]">{body}</p>
            </motion.div>
            <motion.div {...reveal({ y: 12, amount: 0.5, delay: 0.1 })}>
              <PrimaryButton variant="light" href={CALENDLY} target="_blank">
                Schedule Demo
              </PrimaryButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const JOIN_COPY = {
  about: { title: 'Join The Wave', body: 'The first integrated platform for all customer work has arrived' },
  blogs: {
    title: 'On the Same Wavelength',
    body: 'Finally, the first AI-Native platform for all customer teams is here. Why wait to start now',
  },
  integrations: {
    title: 'Find your Frequency',
    body: 'All customer conversations and feedback flow into one system, reducing noise and improving decision-making.',
  },
  article: {
    title: 'The only customer platform you will ever need',
    body: 'All customer conversations and feedback flow into one system, reducing noise and improving decision-making.',
  },
}

// ---------------------------------------------------------------------------------------------
// 1.6 "Customer Intelligence without complexity" CTA (framer-uZkp6)
// ---------------------------------------------------------------------------------------------

const STRIP = '/assets/images/PhOrHsyRPTwVeC99j0wnf9Q4Pk.png'

export function CiCta() {
  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 py-[60px] tablet:px-20 tablet:pb-[60px] tablet:pt-10 desktop:px-40">
      <div className="relative flex w-full max-w-container overflow-clip">
        <div className="relative flex w-full flex-col items-stretch justify-center gap-[30px] overflow-clip rounded-card bg-ink px-5 pb-5 pt-[100px] tablet:items-center tablet:gap-10 tablet:px-[60px] tablet:py-10 desktop:items-end desktop:py-20 desktop:pl-5 desktop:pr-20">
          {/* Decorative vertical tracks, clipped by the card. P: rotated 90deg across the top. */}
          {/* T/D: top -133 / bottom -150, so the strip's height follows the card and its width
              follows the image aspect (D 239.8x531, T 222.8x493.4 at 810, 206.9x458.2 at 1199). */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[71px] top-[-242px] z-[1] h-[560.2px] w-[253px] rotate-90 tablet:bottom-[-150px] tablet:left-[-97px] tablet:top-[-133px] tablet:h-auto tablet:w-auto tablet:rotate-0 tablet:aspect-[1420/3144] desktop:left-[-83px]"
          >
            <img src={STRIP} alt="" className="block h-full w-full object-cover" />
          </div>
          <div className="relative z-[2] flex w-full flex-col items-start gap-6 tablet:max-w-[70%] desktop:max-w-[85%] desktop:flex-row desktop:items-center">
            <motion.h3 {...revealTween(0)} className="w-full text-balance text-h3-p text-white tablet:text-h3-t desktop:w-px desktop:flex-1 desktop:text-h3">
              Customer Intelligence without complexity
            </motion.h3>
            <div className="flex items-center gap-[10px] desktop:justify-end">
              <motion.div {...revealTween(0.1)}>
                <PrimaryButton variant="light" href="/integrations">
                  See How It Works
                </PrimaryButton>
              </motion.div>
              <motion.div {...revealTween(0.2)}>
                <PrimaryButton variant="noicon" href="/contact">
                  Contact Us
                </PrimaryButton>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
