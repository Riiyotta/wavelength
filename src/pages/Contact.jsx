import { useState } from 'react'
import { motion } from 'framer-motion'
import { FORCE_JS_COLOR } from '../components/ui'
import { HeroBg, PageLines, RIV } from '../components/sub/shared'
import { appear } from '../components/sub/motion'

// 3.2 field wrapper: #f0f0ee, radius 6, 1px #262521 focus ring via ::after on :focus-within
const FIELD =
  "relative flex w-full items-center rounded-[6px] bg-mist transition-[background,box-shadow] after:pointer-events-none after:absolute after:inset-0 after:hidden after:rounded-[inherit] after:border after:border-solid after:border-ink after:content-[''] focus-within:after:block"
const INPUT_BASE =
  'w-full border-0 bg-transparent font-sans text-[16px] leading-[1.2em] tracking-normal text-ink outline-none placeholder:text-[rgba(38,37,33,0.6)] focus-visible:outline-none'
const INPUT = `${INPUT_BASE} p-0`

const BTN_TWEEN = { type: 'tween', duration: 0.2, ease: [0.44, 0, 0.56, 1] }
const BTN_BG = {
  idle: '#262521',
  hover: 'rgba(51, 51, 51, 0.85)',
  pressed: 'rgb(51, 51, 51)',
  loading: '#262521',
  success: '#262521',
  error: 'rgba(255, 34, 68, 0.15)',
}

/**
 * Local stand-in for Framer's form backend: nothing is posted anywhere. Resolves after a short
 * delay so the Loading -> Success variants play. (Rejecting would drive the Error variant.)
 */
function submitLocally() {
  return new Promise((resolve) => setTimeout(resolve, 1200))
}

function Spinner() {
  const mask = 'url("/assets/svg/form-spinner-mask.svg") no-repeat center / contain'
  return (
    <motion.span
      aria-hidden="true"
      className="block h-5 w-5"
      style={{
        background: 'conic-gradient(from 0deg, rgba(255,255,255,0) 7.2deg, #fff 342deg)',
        WebkitMask: mask,
        mask,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
    />
  )
}

function SubmitButton({ status }) {
  const [pointer, setPointer] = useState('idle') // idle | hover | pressed
  const interactive = status === 'idle'
  const bg = interactive ? BTN_BG[pointer] : BTN_BG[status]

  return (
    <motion.button
      type="submit"
      disabled={status === 'loading'}
      aria-live="polite"
      onHoverStart={() => setPointer('hover')}
      onHoverEnd={() => setPointer('idle')}
      onPointerDown={() => setPointer('pressed')}
      onPointerUp={() => setPointer('hover')}
      initial={false}
      animate={{ backgroundColor: bg }}
      transition={BTN_TWEEN}
      onUpdate={FORCE_JS_COLOR}
      className="flex w-fit cursor-pointer items-center gap-[10px] rounded-[6px] p-[10px] text-button text-white"
    >
      {status === 'loading' && <Spinner />}
      {status === 'idle' && (
        <>
          <span>Submit message</span>
          <span>→</span>
        </>
      )}
      {status === 'success' && <span>Thank you</span>}
      {status === 'error' && <span className="text-red">Something went wrong</span>}
    </motion.button>
  )
}

/** Section 3: /contact */
export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  // Native HTML validation runs first (noValidate is false); onSubmit only fires for valid forms.
  const onSubmit = (e) => {
    e.preventDefault()
    if (status === 'loading') return
    const data = new FormData(e.currentTarget)
    setStatus('loading')
    if (data.get('website')) return setTimeout(() => setStatus('success'), 1200) // honeypot: pretend
    submitLocally()
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }
  // Editing after a result returns the button to its default variant.
  const onChange = () => {
    if (status === 'success' || status === 'error') setStatus('idle')
  }

  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-[60px] pt-[150px] tablet:px-20 tablet:pb-[220px] tablet:pt-[160px] desktop:p-40">
      <HeroBg color="bg-yellow" desktop={RIV.aboutD} tablet={RIV.aboutT} className="top-20 tablet:top-0" />
      <PageLines absolute />
      <div className="relative z-[3] flex w-full max-w-container flex-col items-center gap-[30px] tablet:gap-[50px] tablet:px-5">
        <div className="flex w-full flex-col items-start gap-4 tablet:max-w-[480px] tablet:gap-5">
          <motion.h1 {...appear(0)} className="text-balance text-title-p text-ink tablet:text-title-t desktop:text-title">
            Contact Us
          </motion.h1>
          <motion.p {...appear(0.05)} className="w-full max-w-[440px] text-body-s text-ink desktop:text-body-l">
            Reach out for support, inquiries, or to learn more about how Assembly can elevate your customer experience.
          </motion.p>
          <form onSubmit={onSubmit} onChange={onChange} className="flex w-full flex-col gap-5 overflow-hidden">
            {/* Single honeypot (Framer renders 10); hidden from users and assistive tech */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="one-time-code"
              aria-hidden="true"
              className="absolute h-0 w-0 overflow-hidden border-0 p-0 opacity-0"
            />
            <label className={`${FIELD} h-11 p-[10px]`}>
              <input type="text" name="Name" placeholder="Name" className={INPUT} />
            </label>
            <label className={`${FIELD} h-11 p-[10px]`}>
              <input type="email" name="Email Address" placeholder="Email Address" required className={INPUT} />
            </label>
            <label className={`${FIELD} h-11 p-[10px]`}>
              <input type="text" name="Subject" placeholder="Subject" className={INPUT} />
            </label>
            <label className={FIELD}>
              <textarea name="Message" placeholder="Message" className={`${INPUT_BASE} block h-40 min-h-[160px] resize-y p-[10px]`} />
            </label>
            <SubmitButton status={status} />
          </form>
        </div>
      </div>
    </section>
  )
}
