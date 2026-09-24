import { motion } from 'framer-motion'
import { PrimaryButton } from '../components/ui'
import { HeroBg, RIV } from '../components/sub/shared'
import { appear } from '../components/sub/motion'

/**
 * Section 4: /404 and every unknown URL. The source answers unknown URLs with HTTP 404; a static
 * SPA fallback serves index.html with 200, so only the page content matches.
 */
export default function NotFound() {
  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-clip bg-white px-5 pb-10 pt-[120px] tablet:px-20 tablet:pb-20 tablet:pt-[140px] desktop:px-40">
      <HeroBg color="bg-mist" desktop={RIV.aboutD} tablet={RIV.aboutT} className="top-0" />
      <div className="relative z-[3] flex w-full max-w-container flex-col items-center justify-center px-[10px] tablet:px-5">
        <div className="flex w-full flex-col items-center justify-center gap-3 tablet:gap-5">
          <motion.h1 {...appear(0)} className="text-center text-balance text-title-p text-ink tablet:text-title-t desktop:text-title">
            Page not found
          </motion.h1>
          <motion.p {...appear(0.05)} className="w-full max-w-[440px] text-center text-body-s text-ink desktop:text-body-l">
            We can’t find the page you were looking for.
          </motion.p>
          <motion.div {...appear(0.1)}>
            <PrimaryButton variant="black" href="/">
              Return Home
            </PrimaryButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
