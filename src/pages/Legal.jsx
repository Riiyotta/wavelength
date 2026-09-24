import { motion } from 'framer-motion'
import { HeroBg, RIV } from '../components/sub/shared'
import { appear } from '../components/sub/motion'
import { heading, phrase, words } from '../lib/placeholder'
import { PRIVACY, TERMS } from '../data/legal'

// 9.2 rich-text styles; block spacing = margin-top (first block 0)
const P = 'text-body-s desktop:text-body-l'
const HEAD = {
  h4: 'mt-10 first:mt-0 text-h4-p tablet:text-h4-t desktop:text-h4',
  h5: 'mt-10 first:mt-0 text-h5-t desktop:text-h5',
  h6: 'mt-10 first:mt-0 text-h6-p tablet:text-h6',
}
const UL = `mt-[11px] first:mt-0 list-disc pl-[17px] desktop:pl-[19.5px] ${P}`
const LINK = 'text-ink underline underline-offset-4'
const PLACEHOLDER_EMAIL = 'hello@example.com'

/** Placeholder rich text from measured runs (see data/legal.js): same words/chars/<br>s as the source. */
function Runs({ r, seed }) {
  return r.map((run, i) => {
    if (run[0] === 'br') return <br key={i} />
    const [kind, w, c] = run
    const prev = r[i - 1]
    const sep = i > 0 && prev[0] !== 'br' ? ' ' : ''
    if (!w) return sep || ' '
    const chars = Math.max(w, c - sep.length)
    const s = seed + i * 7
    if (kind === 'a')
      return (
        <span key={i}>
          {sep}
          <a className={`cursor-pointer ${LINK}`}>
            {w === 1 ? PLACEHOLDER_EMAIL : phrase(w, s, chars)}
          </a>
        </span>
      )
    if (kind === 'b')
      return (
        <span key={i}>
          {sep}
          <strong>{heading(w, s, chars)}</strong>
        </span>
      )
    // A 1-word run of <= 2 chars is the definition-list bullet
    const text = w === 1 && chars <= 2 ? '•' : w >= 3 ? words(w, s, chars) : phrase(w, s, chars)
    return sep + text
  })
}

function Li({ item, seed }) {
  return (
    <li>
      <Runs r={item.r} seed={seed} />
      {item.sub && (
        <ul className="list-disc pl-[17px] desktop:pl-[19.5px]">
          {item.sub.map((s, j) => (
            <Li key={j} item={s} seed={seed + j + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

function Block({ b, i }) {
  const seed = i * 13
  if (b.t === 'h4')
    return (
      <h4 className={HEAD.h4}>
        {b.r[0]?.[0] === 'br' && <br />}
        {b.text}
      </h4>
    )
  if (b.t === 'h5' || b.t === 'h6') {
    const Tag = b.t
    return (
      <Tag className={HEAD[b.t]}>
        <Runs r={b.r} seed={seed} />
      </Tag>
    )
  }
  if (b.t === 'ul')
    return (
      <ul className={UL}>
        {b.items.map((it, j) => (
          <Li key={j} item={it} seed={seed + j * 3} />
        ))}
      </ul>
    )
  return (
    <p className={P}>
      <Runs r={b.r} seed={seed} />
    </p>
  )
}

/** Section 9: /legals/terms-conditions and /legals/privacy-policy (placeholder copy). */
export default function Legal({ kind }) {
  const doc = kind === 'privacy' ? PRIVACY : TERMS

  return (
    <>
      {/* 9.1 Hero (dark) */}
      <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-10 pt-[120px] tablet:px-20 tablet:pb-20 tablet:pt-[140px] desktop:px-40">
        <HeroBg color="bg-ink" desktop={RIV.darkD} tablet={RIV.darkT} className="top-0 tablet:top-20" />
        <div className="relative z-[3] flex w-full max-w-container flex-col items-center">
          <div className="flex w-full max-w-[600px] flex-col items-start gap-3 tablet:gap-5">
            <motion.p {...appear(0)} className="text-body-s text-white desktop:text-body-l">
              {doc.updated}
            </motion.p>
            <motion.h1 {...appear(0.05)} className="text-balance text-title-p text-white tablet:text-title-t desktop:text-title">
              {doc.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* 9.2 Body */}
      <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-20 pt-10 tablet:px-20 desktop:px-40">
        <motion.div {...appear(0.1)} className="flex w-full max-w-[600px] flex-col text-ink">
          {doc.blocks.map((b, i) => (
            <Block key={i} b={b} i={i} />
          ))}
        </motion.div>
      </section>
    </>
  )
}
