import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import blogs from '../data/blogs.json'
import { HeroBg, RIV } from '../components/sub/shared'
import { CiCta, JOIN_COPY, JOIN_PAD, JoinCta } from '../components/sub/Ctas'
import { Article, BlogFaq } from '../components/sub/Article'
import { appear } from '../components/sub/motion'
import NotFound from './NotFound'

/** Section 7: /blogs/:slug. Body copy is placeholder text rendered from the recorded structure. */
export default function BlogPost() {
  const { slug } = useParams()
  const post = blogs.items.find((b) => b.slug === slug)
  if (!post) return <NotFound />

  return (
    <>
      {/* 7.1 Hero: fixed height, the art is clipped at the section's bottom edge */}
      <section className="relative flex h-[510px] w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pt-[150px] tablet:h-[660px] tablet:px-20 tablet:pt-[140px] desktop:h-[740px] desktop:px-40">
        <HeroBg color="bg-stone" desktop={RIV.blogD} tablet={RIV.blogT} className="top-0 tablet:top-20" />
        <div className="relative z-[3] flex h-full w-full max-w-container flex-col items-center gap-[30px] overflow-clip px-[10px] tablet:gap-[50px] tablet:px-5">
          <div className="flex w-full max-w-[800px] flex-col items-center gap-3 tablet:gap-5">
            <motion.div {...appear(0)} className="flex items-center justify-center gap-[10px]">
              <p className="whitespace-pre text-caption text-ink">{post.author}</p>
              <span className="block h-[6px] w-[6px] rounded-full bg-[rgba(38,37,33,0.06)]" />
              <p className="whitespace-pre text-caption text-ink">{post.date}</p>
            </motion.div>
            <motion.h1 {...appear(0.05)} className="w-full text-center text-balance text-title-p text-ink tablet:text-title-t desktop:text-title">
              {post.title}
            </motion.h1>
            <motion.p {...appear(0.1)} className="w-full max-w-[600px] text-center text-body-s text-ink desktop:text-body-l">
              {post.excerpt}
            </motion.p>
          </div>
          <motion.img
            {...appear(0.15)}
            src={post.heroArt.svg}
            alt=""
            className="block aspect-[779/483] w-full shrink-0 object-fill tablet:w-[90%]"
          />
        </div>
      </section>

      <Article toc={post.toc} body={post.body} />
      <CiCta />
      <BlogFaq />
      <JoinCta {...JOIN_COPY.article} pad={JOIN_PAD.article} />
    </>
  )
}
