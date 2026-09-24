import { Fragment } from 'react'
import RiveCanvas from './RiveCanvas'
import { CALENDLY, NumberBadge, PrimaryButton } from './ui'
import useBreakpoint from '../hooks/useBreakpoint'

const ITEMS = [
  {
    n: '01',
    title: 'Enterprise-Ready',
    body: 'Built to handle high-volume teams with reliable performance, robust security, and seamless scaling.',
  },
  {
    n: '02',
    title: 'Aligned Teams',
    body: 'All customer data flows into one system, reducing noise and improving decision-making.',
  },
  {
    n: '03',
    title: 'Secure by Design',
    body: 'Data controls, privacy standards, and protected workflows ensure enterprise-grade safety end-to-end.',
  },
]

function DashedLine() {
  return (
    <div className="relative h-px w-full shrink-0 overflow-clip opacity-10 after:pointer-events-none after:absolute after:inset-0 after:border after:border-dashed after:border-white after:content-[''] tablet:h-auto tablet:w-px tablet:self-stretch" />
  )
}

export default function Enterprise() {
  const bp = useBreakpoint()

  return (
    <section className="relative flex w-full items-center justify-center gap-4 overflow-clip bg-white px-5 py-[60px] tablet:p-20 desktop:px-40">
      {/* Dark bg panel */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-clip bg-ink tablet:bottom-5 tablet:left-5 tablet:right-5 tablet:top-0 tablet:rounded-card">
        {bp === 'desktop' && (
          <div className="pointer-events-auto absolute left-0 top-0 h-full w-full">
            <RiveCanvas
              src="/assets/riv/RTuHhUc6vCjz6u1I1ErEuoSwL7U.riv"
              artboard="Enterprise Scale_Part 1"
              fit="layout"
              alignment="center"
            />
          </div>
        )}
        <div className="pointer-events-none absolute left-0 top-[calc(50.073%-342px)] h-[684px] w-full">
          <RiveCanvas
            src="/assets/riv/0dp7iGHbAf4prIHv9XhuKEgZs.riv"
            artboard="Enterprise Scale_Part 2"
            fit={bp === 'desktop' ? 'fill' : 'cover'}
            alignment="center"
          />
        </div>
      </div>

      <div className="relative z-[1] flex w-px max-w-container flex-1 flex-col items-center justify-center gap-[30px] overflow-clip tablet:gap-[50px]">
        <div className="flex w-full flex-col items-center justify-start gap-3 tablet:gap-6">
          <h3 className="text-balance text-h3-p text-white tablet:text-h3-t desktop:text-h3">Built for Enterprise Scale</h3>
          <p className="w-full max-w-[440px] whitespace-pre-wrap break-words text-center text-body-s text-white desktop:text-body-l">
            The first Customer Happiness Platform purpose built for post-sales teams to track your customers’ journey
            from the moment they onboard till the day they expand.
          </p>
          <PrimaryButton variant="light" href={CALENDLY} target="_blank">
            Schedule Demo
          </PrimaryButton>
        </div>

        <div className="relative flex w-full flex-col items-start justify-start gap-[10px] rounded-panel bg-ink-2 p-5 tablet:px-[38px] tablet:py-[28px] desktop:rounded-panel-lg">
          <div className="flex w-full flex-col items-center justify-start gap-8 tablet:flex-row tablet:gap-10">
            {ITEMS.map((it, i) => (
              <Fragment key={it.n}>
                {i > 0 && <DashedLine />}
                <div className="flex w-full flex-col items-start justify-start gap-6 tablet:w-px tablet:flex-1 tablet:gap-20">
                  <NumberBadge>{it.n}</NumberBadge>
                  <div className="flex w-full flex-col items-start justify-start gap-4 tablet:min-h-[180px] desktop:min-h-0">
                    <h5 className="whitespace-pre-wrap text-h5-t text-white desktop:text-h5">{it.title}</h5>
                    <p className="w-full whitespace-pre-wrap break-words text-body-s text-white opacity-60 tablet:min-h-[80px]">
                      {it.body}
                    </p>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
