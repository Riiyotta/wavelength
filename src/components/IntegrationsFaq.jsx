import { useRef, useState } from 'react'
import RiveCanvas from './RiveCanvas'
import { PrimaryButton } from './ui'
import useBreakpoint from '../hooks/useBreakpoint'

export const FAQS = [
  {
    q: 'How does Wavelength integrate with our existing tools?',
    a: 'Wavelength connects with Salesforce, Email, and your internal systems (support, calls, usage) so all customer conversations and data flow into one place without changing your workflows.',
  },
  {
    q: 'Is Wavelength secure for enterprise use?',
    a: "Wavelength has worked with some of the largest enterprises in the most regulated industries in the world. It's been designed with the highest grade security standards. It is also compliant with SOC II and GDPR.",
  },
  {
    q: 'Can we customize workflows for our team?',
    a: "Wavelength's dynamic workflow system is completly customizable for individual organzations, teams and even contributors. Simply specify the workspace the workflow will live in!",
  },
  {
    q: 'How does Wavelength help Account Management teams?',
    a: 'Wavelength allows modern AM teams to automatically prioritize their accounts, get insights instantly, and act within a single system, without the hassle of table lookups and constant context switching.',
  },
  {
    q: 'Does Wavelength support large-scale customer operations?',
    a: "Some of Wavelength's customers support 10s of thousands of customers across the globe. They use our system to scale customer experiences without a hitch.",
  },
]

// 8.1 per-breakpoint Rive layout
const INTEGRATIONS_LAYOUT = {
  desktop: { fit: 'cover', alignment: 'topLeft' },
  tablet: { fit: 'fitHeight', alignment: 'bottomLeft' },
  phone: { fit: 'scaleDown', alignment: 'bottomLeft' },
}

export function FaqItem({ q, a, bg = 'bg-mist', qClass = 'text-faq-q-p tablet:text-faq-q' }) {
  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState(0)
  const bodyRef = useRef(null)
  // Answer region animates height 0 <-> scrollHeight (300ms ease-in-out).
  const toggle = () => {
    setHeight(bodyRef.current.scrollHeight)
    setOpen((o) => !o)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          toggle()
        }
      }}
      className={`w-full cursor-pointer select-none overflow-hidden rounded-card border border-solid border-[rgba(230,230,230,0)] ${bg} transition-[border-color] duration-300 ease-in-out hover:border-[rgba(204,204,204,0)]`}
    >
      <div className="flex items-center justify-between gap-4 p-3 transition-[background-color] duration-300 ease-in-out hover:bg-transparent">
        <span className={`flex-1 text-ink ${qClass}`}>{q}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#262521"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 transition-transform duration-300 ease-in-out"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>
      <div
        ref={bodyRef}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: open ? height : 0 }}
      >
        <div className="px-3 pb-3 text-faq-a text-faq-answer">{a}</div>
      </div>
    </div>
  )
}

export default function IntegrationsFaq() {
  const bp = useBreakpoint()
  const layout = INTEGRATIONS_LAYOUT[bp]

  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-[60px] overflow-visible bg-white px-5 pb-20 pt-[60px] tablet:gap-20 tablet:p-20 desktop:px-40">
      {/* 8.1 Integrations banner */}
      <div className="relative z-[3] flex w-full max-w-container flex-col items-start justify-start gap-[30px] overflow-clip rounded-card bg-ink tablet:gap-[50px]">
        <div className="pointer-events-none relative flex w-full items-center justify-start gap-[21px] overflow-clip tablet:justify-center">
          <div className="relative h-[320px] w-[130%] shrink-0 tablet:aspect-[1.625] tablet:h-auto tablet:w-px tablet:flex-1 desktop:aspect-[2.31579]">
            <div className="absolute inset-0">
              <RiveCanvas
                src="/assets/riv/5yxLzQ8vf9c0NeoyQOZgJlGUv0.riv"
                artboard="Explore our integrations 2"
                fit={layout.fit}
                alignment={layout.alignment}
              />
            </div>
          </div>
        </div>
        <div className="absolute left-5 right-5 top-5 flex items-center justify-start gap-[21px] overflow-clip">
          <div className="relative z-[1] flex w-px max-w-[340px] flex-1 flex-col items-start justify-start gap-3 tablet:max-w-[300px] tablet:gap-6 desktop:max-w-[340px]">
            <h3 className="text-balance text-h3-p text-white tablet:text-h3-t desktop:text-h3">Explore our Integrations</h3>
            <p className="w-full max-w-[440px] whitespace-pre-wrap break-words text-body-s text-white desktop:text-body-l">
              With over 40+ integrations to streamline your workflow, from Slack to Zendesk, supercharge your team in
              just a few clicks!
            </p>
            <PrimaryButton variant="light" href="/integrations">
              Explore Integrations
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* 8.2 FAQ */}
      <div className="relative z-[3] flex w-full max-w-container flex-col items-start justify-start gap-[30px] overflow-clip tablet:gap-[50px]">
        <div className="flex w-full flex-col items-start justify-start gap-[30px] tablet:gap-10 desktop:flex-row desktop:gap-0">
          <div className="flex w-full flex-col items-start justify-start gap-[21px] desktop:w-px desktop:flex-1">
            <h3 className="w-full max-w-[320px] whitespace-pre-wrap break-words text-h3-p text-ink tablet:text-h3-t desktop:text-h3">
              Frequently Asked
            </h3>
            <p className="w-full max-w-[320px] whitespace-pre-wrap break-words text-body-s text-ink opacity-60">
              The First AI-Native CRM purpose built for post-sales teams to track your customers’ journey from the moment
              they onboard till the day they expand.
            </p>
          </div>
          <div className="flex w-full flex-col items-start justify-start gap-[10px] desktop:w-px desktop:flex-1">
            <div className="flex w-full flex-col items-start justify-center gap-[10px]">
              {FAQS.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
