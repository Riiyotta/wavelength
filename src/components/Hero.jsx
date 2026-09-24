import { motion } from 'framer-motion'
import RiveCanvas from './RiveCanvas'
import { CALENDLY, PrimaryButton } from './ui'
import useBreakpoint from '../hooks/useBreakpoint'

// 11.1 Appear animation: spring 0.5 / bounce 0, delays 0 / 0.05 / 0.1.
// The original runs these as WAAPI animations (opacity + transform, 500ms, spring-sampled
// linear keyframes). Animating a `transform` string (not `y`) lets framer-motion hand the
// transform to WAAPI too, so both properties run off the main thread like the original.
const appear = (delay) => ({
  initial: { opacity: 0.001, transform: 'translateY(12px)' },
  animate: { opacity: 1, transform: 'translateY(0px)' },
  transition: { type: 'spring', duration: 0.5, bounce: 0, delay },
})

export default function Hero() {
  const bp = useBreakpoint()

  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-ink px-5 pt-[140px] tablet:px-20 tablet:pt-[160px] desktop:px-40">
      {/* Background Rive */}
      <div className="pointer-events-none absolute left-0 top-20 flex h-[923px] w-full items-center justify-center overflow-clip tablet:top-[88px]">
        <div className="relative z-0 h-full w-full overflow-clip bg-ink tablet:max-w-[1500px]">
          <div className="absolute left-[-10%] top-0 h-full w-[120%] tablet:left-0 tablet:right-0 tablet:h-auto tablet:w-auto tablet:aspect-[0.877573] desktop:aspect-auto desktop:h-[923px]">
            <RiveCanvas
              src="/assets/riv/iMN1EoReEqPtnF1pvfm2DCDbAto.riv"
              artboard="Cover"
              fit="layout"
              alignment="center"
              layoutScaleFactor={bp === 'desktop' ? 1 : 0.75}
            />
          </div>
        </div>
      </div>

      <div className="relative flex w-px max-w-container flex-1 flex-col items-center justify-center gap-10 tablet:gap-[60px] desktop:gap-20">
        {/* Edge hairlines */}
        <div className="absolute bottom-0 left-0 z-[1] h-[150%] w-px overflow-clip bg-mist opacity-10" />
        <div className="absolute bottom-0 right-0 z-[1] h-[150%] w-px overflow-clip bg-mist opacity-10" />

        <div className="relative flex w-full max-w-[780px] flex-col items-center gap-5 px-5 tablet:px-0">
          <motion.div className="relative w-full" {...appear(0)}>
            <h1 className="text-balance text-center text-h1-p text-white tablet:text-h1-t desktop:text-h1">
              Welcome to Customer SuperIntelligence
            </h1>
          </motion.div>
          <motion.div className="relative w-full max-w-[440px]" {...appear(0.05)}>
            <p className="whitespace-pre-wrap break-words text-center text-body-s text-white desktop:text-body-l">
              Finally, an AI-native platform where modern GTM teams can access, analyze, and act on revenue data in a
              single platform
            </p>
          </motion.div>
          <motion.div className="relative" {...appear(0.1)}>
            <PrimaryButton variant="light" href={CALENDLY} target="_blank">
              Schedule Demo
            </PrimaryButton>
          </motion.div>
        </div>

        <div className="relative flex h-[200px] w-full items-start justify-start gap-4 overflow-visible tablet:h-[360px] tablet:justify-center tablet:overflow-clip desktop:h-[500px]">
          <div className="relative w-px flex-1">
            <img
              src="/assets/images/8YfN5DvRoONMgkbgb2Y8Y5iOw.png"
              alt="Wavelength accounts table"
              className="block aspect-[1.624387] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
