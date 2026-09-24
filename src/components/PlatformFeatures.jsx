import { IconTile, LineColumn, LoopVideo, TextLink } from './ui'

const FEATURES = [
  {
    accent: 'bg-violet',
    icon: '/assets/svg/icon-ask-ai.svg',
    label: 'Ask AI',
    title: 'Fields and Tables are Dead',
    body: "Modern GTM teams can't spend hours looking through CRM tables for one field to act. They use our AI to speak directly with their revenue data.",
    video: '/assets/videos/Feature_A.mp4',
    spacer: false,
    mockupClass: 'aspect-[1.25833] p-5 tablet:aspect-[1.41364] tablet:p-[30px] desktop:p-0',
    textFirst: false,
  },
  {
    accent: 'bg-pink',
    icon: '/assets/svg/icon-account-prioritization-agent-builder.svg',
    label: 'Account Prioritzation',
    title: 'Customer needs - your priorities: on the same wave',
    body: 'Wavelength’s powerful revenue AI agents automagically prioritize your accounts based on customer signals from across your data stack.',
    video: '/assets/videos/Feature_B.mp4',
    spacer: true,
    mockupClass: 'aspect-[1.37273] p-5 tablet:aspect-[1.41364] tablet:p-[30px] desktop:pb-0 desktop:pl-[52px] desktop:pr-[52px] desktop:pt-[60px]',
    textFirst: true,
  },
  {
    accent: 'bg-yellow',
    icon: '/assets/svg/icon-account-prioritization-agent-builder.svg',
    label: 'Agent Builder',
    title: 'Revenue Signals meet instant scalable action',
    body: 'Gone are the days of pasting the same message 100 times in Gmail. Welcome to instantly scalable personalized outreach based on customer signals, with a single click.',
    video: '/assets/videos/Feature_C.mp4',
    spacer: true,
    mockupClass: 'aspect-[1.25833] p-5 tablet:aspect-[1.41364] tablet:p-0',
    textFirst: false,
  },
]

function FeatureCard({ f }) {
  const mockup = (
    <div
      className={`relative flex w-full shrink-0 flex-col items-center justify-center overflow-hidden rounded-card desktop:h-full desktop:w-[65%] desktop:max-w-[640px] desktop:aspect-auto ${f.accent} ${f.mockupClass}`}
    >
      <LoopVideo src={f.video} className="absolute inset-0 z-[1] h-full w-full" />
    </div>
  )

  const text = (
    <div
      className={`relative flex w-full flex-col items-start justify-center gap-6 tablet:gap-8 tablet:px-5 tablet:pb-5 tablet:pt-10 desktop:h-full desktop:w-px desktop:flex-1 desktop:justify-between desktop:gap-0 desktop:px-5 desktop:py-10 ${
        f.textFirst ? 'order-1 desktop:order-none' : ''
      }`}
    >
      <div className="relative flex w-full flex-col items-start justify-center gap-5 tablet:h-[152px] desktop:h-px desktop:flex-1">
        <div className="flex items-center justify-center gap-2">
          <IconTile icon={f.icon} accent={f.accent} />
          <p className="whitespace-pre text-body-s text-ink">{f.label}</p>
          {f.spacer && <div className="aspect-square w-5 shrink-0 overflow-hidden" />}
        </div>
        <h4 className="w-full whitespace-pre-wrap break-words text-h4-p text-ink tablet:text-h4-t desktop:text-h4">
          {f.title}
        </h4>
        <p className="w-full whitespace-pre-wrap break-words text-body-s text-ink opacity-60">{f.body}</p>
      </div>
      <TextLink />
    </div>
  )

  return (
    <div className="relative flex w-full flex-col justify-center gap-5 rounded-card bg-mist p-[14px] tablet:gap-0 desktop:h-[508px] desktop:flex-row desktop:items-center desktop:justify-start desktop:gap-5">
      {f.textFirst ? (
        <>
          {text}
          {mockup}
        </>
      ) : (
        <>
          {mockup}
          {text}
        </>
      )}
    </div>
  )
}

export default function PlatformFeatures() {
  return (
    <section className="relative flex w-full items-center justify-center gap-4 overflow-clip bg-white px-5 pt-[60px] tablet:px-20 tablet:pt-[120px] desktop:px-40">
      <LineColumn className="bottom-0 left-0 top-0" />
      <LineColumn className="bottom-0 right-0 top-0" />
      <div className="relative flex w-px max-w-container flex-1 flex-col items-center justify-center gap-[50px] overflow-clip">
        <div className="flex w-full flex-col items-start gap-5">
          <h3 className="w-full text-balance text-h3-p text-ink tablet:text-h3-t desktop:text-h3">
            The AI-native Customer Intelligence Platform <strong>purpose</strong> built for{' '}
            <strong>post sales</strong> teams
          </h3>
          <p className="w-full max-w-[600px] text-body-s text-ink desktop:text-body-l">
            Wavelength brings your entire customer data stack into one place - with powerful AI agents that uncover
            important signals and act instantly
          </p>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-5 overflow-clip">
          {FEATURES.map((f) => (
            <FeatureCard key={f.label} f={f} />
          ))}
        </div>
      </div>
    </section>
  )
}
