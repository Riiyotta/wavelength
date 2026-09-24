import { motion } from 'framer-motion'
import blogs from '../data/blogs.json'
import { FORCE_JS_COLOR, MotionLink } from '../components/ui'
import { HeroBg, RIV, UnderlineLabel } from '../components/sub/shared'
import { JOIN_COPY, JOIN_PAD, JoinCta } from '../components/sub/Ctas'
import { CARD_TWEEN, FEATURED_SPRING, appear, reveal } from '../components/sub/motion'
import useBreakpoint from '../hooks/useBreakpoint'

const STRIP = '/assets/images/PhOrHsyRPTwVeC99j0wnf9Q4Pk.png'
// Only CMS items flagged as listed are shown (1 of 21 on the source; spec 0 / 12.2).
const LISTED = blogs.items.filter((b) => b.listedOnIndex)

const FEATURED_VARIANTS = {
  rest: { backgroundColor: '#fdfcfb', color: '#262521' },
  hover: { backgroundColor: '#262521', color: '#ffffff' },
}
const CARD_VARIANTS = {
  rest: { backgroundColor: '#f4f2f0', color: '#262521' },
  hover: { backgroundColor: '#34332e', color: '#ffffff' },
}
const hoverProps = (variants, transition = CARD_TWEEN) => ({
  initial: 'rest',
  animate: 'rest',
  whileHover: 'hover',
  variants,
  transition,
  onUpdate: FORCE_JS_COLOR,
})

function FeaturedCard({ post }) {
  return (
    <motion.div {...appear(0.1)} className="flex w-full justify-center">
      <MotionLink
        to={`/blogs/${post.slug}`}
        {...hoverProps(FEATURED_VARIANTS, FEATURED_SPRING)}
        className="flex w-full max-w-[900px] flex-col gap-5 overflow-clip rounded-card p-5 tablet:h-[320px] tablet:flex-row"
      >
        <div className="order-2 flex w-full flex-col justify-between gap-6 tablet:order-none tablet:w-px tablet:flex-1 tablet:gap-0">
          <div className="flex w-full flex-col gap-3 tablet:gap-5">
            <h4 className="text-balance text-h4-p tablet:text-h4-t desktop:text-h4">{post.title}</h4>
            <p className="max-w-[240px] text-body-s opacity-80">{post.excerpt}</p>
          </div>
          <UnderlineLabel>Read More</UnderlineLabel>
        </div>
        <img
          src={post.coverImage}
          alt=""
          className="order-1 block aspect-[4/3] w-full rounded-card object-cover tablet:order-none tablet:aspect-auto tablet:h-full tablet:w-px tablet:flex-1"
        />
      </MotionLink>
    </motion.div>
  )
}

function PostCard({ post, index, bp }) {
  const delay = (index % (bp === 'phone' ? 10 : 9)) * 0.05
  return (
    <motion.div {...reveal({ delay })} className="w-full">
      <MotionLink
        to={`/blogs/${post.slug}`}
        {...hoverProps(CARD_VARIANTS)}
        className="relative flex h-[309.8px] w-full flex-col overflow-clip tablet:h-[440px]"
      >
        <img
          src={STRIP}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[calc(50%-150px)] top-[-59.4px] h-[664.2px] w-[300px] max-w-none rotate-90 object-cover tablet:top-[70.8px]"
        />
        <div className="relative flex h-12 w-full items-center px-5">
          <p className="text-body-s">{post.indexCardDate}</p>
        </div>
        <div className="relative flex w-full flex-col gap-5 overflow-hidden rounded-b-card px-5 py-[30px]">
          <div className="flex w-full flex-col gap-5">
            <h5 className="text-balance text-h5-t desktop:text-h5">{post.title}</h5>
            <p className="text-body-s opacity-80">{post.excerpt}</p>
            <UnderlineLabel>Read More</UnderlineLabel>
          </div>
        </div>
      </MotionLink>
    </motion.div>
  )
}

/** Section 6: /blogs */
export default function Blogs() {
  const bp = useBreakpoint()
  return (
    <>
      <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-5 pt-[150px] tablet:px-20 tablet:pb-[60px] tablet:pt-[140px] desktop:px-40 desktop:pb-20">
        <HeroBg color="bg-violet" desktop={RIV.blogD} tablet={RIV.blogT} className="top-20" />
        <div className="relative z-[3] flex w-full max-w-container flex-col items-center gap-[30px] tablet:gap-[50px]">
          <div className="flex w-full flex-col items-center gap-3 tablet:gap-5">
            <motion.h1 {...appear(0)} className="text-center text-balance text-title-p text-ink tablet:text-title-t desktop:text-title">
              Blog
            </motion.h1>
            <motion.p {...appear(0.05)} className="w-full max-w-[440px] text-balance text-center text-body-s text-ink desktop:text-body-l">
              Discover how modern GTM teams have changed their work with Wavelength
            </motion.p>
          </div>
          {LISTED[0] && <FeaturedCard post={LISTED[0]} />}
        </div>
      </section>

      <section className="relative flex w-full flex-col items-center gap-20 overflow-clip bg-white px-5 pb-20 pt-[60px] tablet:px-20 tablet:pt-10 desktop:px-40">
        <div className="grid w-full max-w-container grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
          {LISTED.map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} bp={bp} />
          ))}
        </div>
      </section>

      <JoinCta {...JOIN_COPY.blogs} pad={JOIN_PAD.list} />
    </>
  )
}
