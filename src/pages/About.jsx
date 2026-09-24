import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import RiveCanvas from '../components/RiveCanvas'
import { LineColumn, PrimaryButton } from '../components/ui'
import { HeroBg, PageLines, RIV, UnderlineLabel } from '../components/sub/shared'
import { JOIN_COPY, JOIN_PAD, JoinCta } from '../components/sub/Ctas'
import { PHOTO_EASE, appear, reveal } from '../components/sub/motion'
import useBreakpoint from '../hooks/useBreakpoint'

const IMG = '/assets/images/'

// ---------------------------------------------------------------------------------------------
// 2.1 Hero
// ---------------------------------------------------------------------------------------------

// Final (post-rotation) photo boxes. PAGES_SPEC lists getBoundingClientRect boxes of the rotated
// frames; unrotated squares are 140 (D) / 100 (T) / 80 (P), frame bg 20 / 20 / 8 px larger.
// Positions are relative to the "Images" box: P a fixed 390x511 box centred in the Image_Wrapper,
// T/D the full wrapper (max 1200). On T the right photo is anchored to the right edge.
const PHOTO_BOX = {
  left: 'left-[10px] top-[311px] h-20 w-20 tablet:left-[50px] tablet:top-[200px] tablet:h-[100px] tablet:w-[100px] desktop:left-[140px] desktop:h-[140px] desktop:w-[140px]',
  right: 'left-[300px] top-[311px] h-20 w-20 tablet:left-auto tablet:right-[50px] tablet:top-[200px] tablet:h-[100px] tablet:w-[100px] desktop:left-[920px] desktop:right-auto desktop:h-[140px] desktop:w-[140px]',
}

function Photo({ side, src }) {
  const left = side === 'left'
  return (
    <motion.div
      className={`absolute ${PHOTO_BOX[side]}`}
      initial={{ opacity: 0.001, rotate: left ? 8 : -3, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, rotate: left ? -8 : 3, scale: 1, y: 0 }}
      transition={{ ...PHOTO_EASE, delay: left ? 0.2 : 0.4 }}
    >
      {/* Frame bg extending the border (#2f28521a), radius 8 */}
      <div className="absolute -inset-1 rounded-card bg-[#2f28521a] tablet:-inset-[10px]" />
      <img src={src} alt="" className="relative block h-full w-full rounded-card object-cover" />
      <div
        className={`pointer-events-none absolute inset-0 rounded-card border-solid border-[#2f28521a] ${left ? 'border-[10px]' : 'border-8'}`}
      />
    </motion.div>
  )
}

function AboutHero() {
  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-[240px] pt-[150px] tablet:px-20 tablet:pb-[220px] tablet:pt-[160px] desktop:px-40 desktop:pb-[300px]">
      <HeroBg color="bg-yellow" desktop={RIV.aboutD} tablet={RIV.aboutT} className="top-20 tablet:top-0" />
      <PageLines absolute />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-20 z-0 flex items-center justify-center overflow-clip">
        <div className="relative h-[511px] w-[390px] shrink-0 tablet:h-full tablet:w-full tablet:max-w-container">
          {/* Track art: P 468 wide, T 110% of the box, D 120% (1440); height from the aspect */}
          <img
            src={`${IMG}mCdezME6QB37hVMUxrnfofYkG4A.png`}
            alt=""
            className="absolute left-1/2 top-[431.64px] block aspect-[6937/2629] h-auto w-[468px] max-w-none -translate-x-1/2 object-contain tablet:top-[340px] tablet:w-[110%] desktop:top-[400px] desktop:w-[120%]"
          />
          <Photo side="left" src={`${IMG}4cg2NEy3YbZwGJxueiAbzbVwLVs.jpg`} />
          <Photo side="right" src={`${IMG}tMQC2muSScoj9CE2n0ytLbe7GAs.jpg`} />
        </div>
      </div>

      <div className="relative z-[3] flex w-full max-w-container flex-col items-center gap-[30px] px-[10px] tablet:gap-[50px] tablet:px-5">
        <div className="flex w-full flex-col items-center gap-3 tablet:gap-5">
          <motion.h1 {...appear(0)} className="w-full max-w-[600px] text-center text-balance text-title-p text-ink tablet:text-title-t desktop:text-title">
            Building for the revenue teams of tomorrow
          </motion.h1>
          <motion.p {...appear(0.05)} className="w-full max-w-[440px] text-center text-body-s text-ink text-balance desktop:text-body-l">
            We’re reimagining the way GTM teams interact with data, starting with post-sales. We think that every revenue
            team should be able to interact, understand, and act on customer signals to create a truly magical customer
            experience.
          </motion.p>
          <motion.div {...appear(0.1)}>
            <PrimaryButton variant="black" href="/about#career">
              Explore Careers
            </PrimaryButton>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// 2.2 Our mission
// ---------------------------------------------------------------------------------------------

const STICKER = `${IMG}umhQGx0rXCUSSr8zH3WCQoqTiNY.png`
// Unrotated sticker 134x179.5 (P 96x128.5); spec sizes are the rotated bounding boxes.
const STICKER_BOX = {
  tr: 'right-[-27px] top-[-71px] h-[128.5px] w-24 tablet:left-[376.05px] tablet:right-auto tablet:top-[-101.05px] tablet:h-[179.5px] tablet:w-[134px]',
  bl: 'bottom-[-98px] left-[-7px] h-[128.5px] w-24 tablet:bottom-[-138.95px] tablet:left-[-17.95px] tablet:h-[179.5px] tablet:w-[134px]',
}

function Mission() {
  const ref = useRef(null)
  // Measured on the original: fires once when the card's top crosses the viewport centre (top <=
  // 0.5 x innerHeight at vh 700 and 900, D and P), i.e. an IO with a -50% bottom root margin.
  const inView = useInView(ref, { margin: '0px 0px -50% 0px', once: true })
  const sticker = (pos, delay) => (
    <motion.img
      src={STICKER}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute z-[1] object-cover ${STICKER_BOX[pos]}`}
      // Start state is SSR `transform: scale(0.95)` with no rotation (not -7deg); ends at rotate(7deg).
      initial={{ rotate: 0, scale: 0.95 }}
      animate={inView ? { rotate: 7, scale: 1 } : { rotate: 0, scale: 0.95 }}
      transition={{ ...PHOTO_EASE, delay }}
    />
  )

  return (
    <section
      id="our-mission"
      className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-20 pt-[60px] tablet:px-20 tablet:pt-[120px] desktop:px-40"
    >
      {/* Tracks crossing behind the card */}
      {/* P: a box from top 49 at 86% of the section height, the Rive 42% of it, centred (281 tall at
          390, 239 at 809). T/D: fixed offsets. */}
      <div className="absolute inset-x-0 top-[49px] h-[86%] tablet:inset-0 tablet:h-auto">
        <div className="absolute left-[-0.51%] top-1/2 h-[42%] w-[101.02%] -translate-y-1/2 tablet:left-[-0.5%] tablet:top-[219px] tablet:h-[313.8px] tablet:w-[101%] tablet:translate-y-0 desktop:top-[255.7px] desktop:h-[366.3px]">
          <RiveCanvas src="/assets/riv/y3w7BY0rkzhHAExCainCnWrcHsw.riv" artboard="Card" fit="cover" alignment="center" />
        </div>
      </div>

      <div ref={ref} className="relative flex w-full max-w-[1400px] flex-col items-center gap-[30px] overflow-clip tablet:gap-x-5 tablet:gap-y-12">
        <div className="relative w-full max-w-[480px]">
          <div className="relative flex w-full flex-col items-center gap-6 overflow-hidden rounded-card bg-stone px-5 py-12 tablet:px-10 tablet:py-[60px]">
            {/* Mission strips keep pointer events live on the source (canvas is the hit target) */}
            <div className="absolute left-[-300px] right-[-264px] top-[11px] h-[37px]">
              <RiveCanvas src="/assets/riv/DCOySC2BuXWymEhmnOZXHmu72XI.riv" artboard="Our Mission" fit="contain" alignment="center" artboardViewModel={false} />
            </div>
            <div className="absolute left-[-320px] right-[-244px] top-[calc(100%-29px)] h-[37px]">
              <RiveCanvas src="/assets/riv/1asyi1d9j29xN9d8sE6Hlgg67Q.riv" artboard="Our Mission 2" fit="contain" alignment="center" artboardViewModel={false} />
            </div>
            <h4 className="relative text-center text-h4-p text-ink tablet:text-h4-t desktop:text-h4">Our mission</h4>
            <div className="relative w-full text-center text-body-s text-ink desktop:text-body-l">
              <p>
                Customer relationships used to feel simple. Signals were clear, context was shared, and teams had a real
                sense of how their customers were doing. Over time, basic context that teams stored in spreadsheets and
                email was replaced by complex systems, manual processes, and a focus on data entry.
              </p>
              <p>
                <br />
              </p>
              <p>
                We set out to change this outdated model. We don’t believe customer teams need another tool. They need a
                better way to work with their customers. We called it <strong>Wavelength</strong>—because great customer
                relationships aren’t linear, they are circular.
              </p>
              <p>
                <br />
              </p>
              <p>
                What began as a way to search through revenue data has evolved into an AI-native platform for managing and
                understanding customer relationships end-to-end.
              </p>
              <p>
                <br />
              </p>
              <p>
                From fast-growing startups to global enterprises, modern GTM teams use Wavelength to stay close to their
                customers. Wavelength helps them focus on what matters most: making customer work feel intuitive again.
              </p>
            </div>
            {/* Stickers are children of the card on the source, so the card's overflow/radius clips them */}
            {sticker('tr', 0)}
            {sticker('bl', 0.2)}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// 2.3 Our Values
// ---------------------------------------------------------------------------------------------

const VALUES = [
  ['about-empathy.svg', 'Empathy', 'We should know what our customer\'s needs are, and build from that'],
  ['about-beautiful-design.svg', 'Beautiful Design', 'Software should be beautiful, it’s in the details'],
  ['about-accountability.svg', 'Accountability', 'Taking things end-to-end, own mistakes, trust each other'],
  ['about-less-is-more.svg', 'Less is More', 'Quality over quantity, anyday'],
  ['about-question-everything.svg', 'Question Everything', 'Assume nothing, disagree, be open minded.'],
  ['about-relentless-purpose.svg', 'Relentless Purpose', 'Don’t do busy work'],
  ['about-it-will-be-ugly.svg', 'It will be ugly', 'It won’t be easy - doing great things never are'],
  ['about-no-finish-line.svg', 'No Finish Line', 'We’re changing the way people work - forever'],
]
// Measured per-card reveal delays (card 6 also runs 0.7s)
const VALUE_DELAYS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.45]

function Values() {
  const bp = useBreakpoint()
  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-20 pt-[60px] tablet:p-20 desktop:px-40">
      <div className="absolute inset-0 overflow-clip bg-mist">
        {bp === 'desktop' && (
          // pointer-events: none on the source (canvas and wrappers), unlike the hero Rive
          <div className="pointer-events-none absolute inset-0">
            <RiveCanvas src={RIV.aboutD} artboard="About" fit="layout" alignment="center" />
          </div>
        )}
      </div>
      <div className="relative z-[1] flex w-full max-w-container flex-col gap-[50px]">
        <div className="flex w-full flex-col gap-[30px] tablet:gap-10 desktop:gap-[30px]">
          <div className="flex w-full flex-col items-center gap-[21px]">
            <h4 className="text-center text-h4-p text-ink tablet:text-h4-t desktop:text-h4">Our Values</h4>
          </div>
          <div className="grid w-full grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-4">
            {VALUES.map(([icon, title, body], i) => (
              <motion.div
                key={title}
                {...reveal({ delay: VALUE_DELAYS[i], duration: i === 5 ? 0.7 : 0.5 })}
                className="flex w-full flex-col items-start gap-5 overflow-hidden rounded-card bg-paper-80 p-5 tablet:h-[190px] tablet:gap-[30px] desktop:h-[220px]"
              >
                <img src={`/assets/svg/${icon}`} alt="" className="block h-8 w-8 shrink-0" />
                <div className="flex w-full flex-col gap-3">
                  <h6 className="text-h6-p text-ink tablet:text-h6">{title}</h6>
                  <p className="text-body-s text-ink opacity-80">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// 2.4 The Team
// ---------------------------------------------------------------------------------------------

const TEAM = [
  ['Y Combinator', '1eVahYVFxvy4F0rN19A3EhOqjLc.png'],
  ['Village Global', 'YSOCLc10Pm5giKy92FKDm3N98.png'],
  ['Apple', 'aARJ5drAj0mHZPvWzaEjVqZjdLI.png'],
  ['Intuit', '3IEZBrREHwPvhMW0nkAp2jvHEo.png'],
  ['Convoy', '40V2YTi7ouK9RIAqsmTiMKppQcs.png'],
  ['Berkeley', 'qF3RCB3tZef2Qb5l9UUaDfG8w.jpeg'],
]

function Team() {
  return (
    <section className="relative flex w-full items-start justify-center gap-4 overflow-clip bg-white px-5 pb-20 pt-[60px] tablet:p-20 desktop:px-40">
      <div className="relative flex w-full max-w-container flex-col gap-[30px] overflow-clip tablet:gap-x-5 tablet:gap-y-12">
        <div className="flex w-full flex-col items-start gap-2">
          <h4 className="text-h4-p text-ink tablet:text-h4-t desktop:text-h4">The Team</h4>
          <p className="w-full max-w-[480px] text-body-s text-ink desktop:text-body-l">
            We&apos;ve worked at some of the largest companies in the world, shipped products to billions, and have been
            backed by Y Combinator, Village, and so many more.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-5 tablet:grid-cols-3 desktop:grid-cols-4">
          {TEAM.map(([name, logo], i) => (
            <motion.div
              key={name}
              {...reveal({ delay: i * 0.05 })}
              className="flex w-full flex-col items-start gap-3 overflow-hidden rounded-card bg-mist p-3 tablet:gap-5"
            >
              <img src={`${IMG}${logo}`} alt="" className="block h-8 w-8 rounded-[4px] object-contain tablet:h-10 tablet:w-10" />
              <div className="flex w-full flex-col gap-3">
                <h6 className="text-h6-p text-ink tablet:text-h6">{name}</h6>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------------------------
// 2.5 Open roles
// ---------------------------------------------------------------------------------------------

const ROLES = [
  {
    title: 'Founding Engineer',
    body: 'Build systems end-to-end for the fastest growing companies',
    chips: ['San Francsisco', 'Full-time'],
    icon: 'about-role-icon-blue.svg',
  },
  {
    title: 'Founding Engineer (Remote)',
    body: 'Build scalable systems from scratch',
    chips: ['India', 'Contract'],
    icon: 'about-role-icon-pink.svg',
  },
]

function OpenRoles() {
  return (
    <section
      id="career"
      className="relative flex w-full items-start justify-center overflow-clip bg-white px-5 pb-20 pt-[60px] tablet:p-20 desktop:px-40"
    >
      <div className="absolute inset-0 overflow-clip rounded-card bg-mist tablet:inset-5">
        {/* Decorative "Line" columns (CLONE_SPEC 0.7) at the section edges, clipped by the inset
            panel. Not in PAGES_SPEC; seen in the D/T reference screenshots (none on phone). */}
        <LineColumn className="-left-5 top-0 hidden h-full tablet:block" />
        <LineColumn className="-right-5 top-0 hidden h-full tablet:block" />
      </div>
      <div className="relative flex w-full max-w-container flex-col gap-[50px] overflow-clip">
        <div className="flex w-full flex-col gap-[30px] tablet:gap-10">
          <div className="flex w-full flex-col items-start gap-2">
            <h4 className="text-h4-p text-ink tablet:text-h4-t desktop:text-h4">Open roles</h4>
            <p className="text-body-s text-ink desktop:text-body-l">Join us and be part of something extraordinary!</p>
          </div>
          <div className="grid w-full grid-cols-1 items-start gap-5 tablet:grid-cols-2">
            {ROLES.map((r, i) => (
              <motion.a
                key={r.title}
                {...reveal({ delay: i * 0.05 })}
                className="relative flex w-full flex-col items-start gap-5 overflow-clip rounded-card p-5 text-ink desktop:flex-row"
              >
                <div className="absolute inset-0 z-0 overflow-clip rounded-card bg-paper-80" />
                <img src={`/assets/svg/${r.icon}`} alt="" className="relative block h-8 w-8 shrink-0" />
                <div className="relative flex w-full flex-col items-start gap-3 desktop:w-px desktop:flex-1">
                  <h6 className="text-h6-p tablet:text-h6">{r.title}</h6>
                  <p className="text-body-s opacity-80 tablet:h-10 desktop:h-auto">{r.body}</p>
                  <div className="flex items-center gap-3">
                    {r.chips.map((c) => (
                      <div key={c} className="flex items-center justify-center gap-[10px] rounded-card bg-stone p-2">
                        <p className="whitespace-pre text-body-s opacity-80">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <span className="relative shrink-0">
                  <UnderlineLabel>Learn More</UnderlineLabel>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Section 2: /about */
export default function About() {
  return (
    <>
      <AboutHero />
      <Mission />
      <Values />
      <Team />
      <OpenRoles />
      <JoinCta {...JOIN_COPY.about} pad={JOIN_PAD.about} />
    </>
  )
}
