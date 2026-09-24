import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import caseStudies from '../data/case-studies.json'
import { FORCE_JS_COLOR, MotionLink } from '../components/ui'
import { HeroBg, RIV, UnderlineLabel } from '../components/sub/shared'
import { CiCta, JOIN_COPY, JOIN_PAD, JoinCta } from '../components/sub/Ctas'
import { Article } from '../components/sub/Article'
import { CARD_TWEEN, appear } from '../components/sub/motion'
import NotFound from './NotFound'

const ITEMS = caseStudies.items

/** 8.4 selection rule (holds for all 18 on the source): collection order, skip current, then [2, 5). */
export function relatedFor(slug) {
  return ITEMS.filter((i) => i.slug !== slug).slice(2, 5)
}

const CARD_VARIANTS = {
  rest: { backgroundColor: '#f4f2f0', color: '#262521' },
  hover: { backgroundColor: '#262521', color: '#ffffff' },
}

function RelatedCard({ item, className = '' }) {
  return (
    <MotionLink
      to={`/case-study/${item.slug}`}
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={CARD_VARIANTS}
      transition={CARD_TWEEN}
      onUpdate={FORCE_JS_COLOR}
      className={`flex w-full flex-col items-start gap-5 overflow-clip p-5 ${className}`}
    >
      <h5 className="w-full text-balance text-h5-t desktop:text-h5">{item.title}</h5>
      <p className="w-full text-body-s opacity-80">{item.excerpt}</p>
      <img src={item.coverImage} alt="" className="block aspect-[1848/1120] w-full rounded-card object-cover" />
      <UnderlineLabel>Read More</UnderlineLabel>
    </MotionLink>
  )
}

/** Section 8: /case-study/:slug. Body copy is placeholder text rendered from the recorded structure. */
export default function CaseStudy() {
  const { slug } = useParams()
  const cs = ITEMS.find((c) => c.slug === slug)
  if (!cs) return <NotFound />
  const related = relatedFor(slug)

  return (
    <>
      {/* 8.1 Hero (dark) */}
      <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-5 pt-[150px] tablet:px-20 tablet:pt-[140px] desktop:px-40">
        <HeroBg color="bg-ink" desktop={RIV.darkD} tablet={RIV.darkT} className="top-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-20 z-[1] overflow-clip">
          {/* Anchored to the panel's sides and bottom (P 0 / -10, T 60 / -20, D 130 / -20); height from the aspect */}
          <div className="absolute inset-x-0 bottom-[-10px] aspect-[5308/801] tablet:inset-x-[60px] tablet:bottom-[-20px] desktop:inset-x-[130px]">
            <img src={cs.heroTrackImage} alt="" className="block h-full w-full object-cover" />
          </div>
        </div>
        <div className="relative z-[3] flex w-full max-w-container flex-col items-center gap-[30px] overflow-clip px-[10px] pb-[30px] tablet:gap-[50px] tablet:px-0 tablet:pb-[70px] desktop:pb-[100px]">
          <div className="flex w-full max-w-[800px] flex-col items-center gap-3 tablet:gap-5">
            <motion.h1 {...appear(0)} className="w-full text-center text-balance text-title-p text-white tablet:text-title-t desktop:text-title">
              {cs.title}
            </motion.h1>
            <motion.p {...appear(0.05)} className="w-full max-w-[440px] text-balance text-center text-body-s text-white desktop:text-body-l">
              {cs.excerpt}
            </motion.p>
          </div>
          <motion.img
            {...appear(0.1)}
            src={cs.coverImage}
            alt=""
            className="block aspect-[1.65] w-[95%] max-w-[400px] rounded-card object-cover tablet:aspect-auto tablet:h-[216px] tablet:w-[400px] desktop:h-[242.4px]"
          />
        </div>
      </section>

      <Article toc={cs.toc} body={cs.body} />
      <CiCta />

      {/* 8.4 Related Case Studies */}
      <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pt-[60px] tablet:px-20 tablet:pt-[120px] desktop:px-40">
        <div className="relative flex w-full max-w-container flex-col gap-[30px] overflow-clip">
          <h3 className="w-full text-center text-h3-p text-ink tablet:text-h3-t desktop:text-h3">Related Case Studies</h3>
          <div className="grid w-full grid-cols-1 items-start gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
            {related.map((r, i) => (
              <RelatedCard key={r.slug} item={r} className={i === 2 ? 'tablet:hidden desktop:flex' : ''} />
            ))}
          </div>
        </div>
      </section>

      <JoinCta {...JOIN_COPY.article} pad={JOIN_PAD.article} />
    </>
  )
}
