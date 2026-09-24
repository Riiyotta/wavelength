import RiveCanvas from './RiveCanvas'
import { IconTile, LineColumn, LoopVideo } from './ui'
import useBreakpoint from '../hooks/useBreakpoint'

function CardText({ icon, accent, title, body, className = '', bodyClass = '' }) {
  return (
    <div className={`relative flex w-[80%] max-w-[280px] flex-col items-start gap-3 tablet:w-full ${className}`}>
      <div className="relative z-[1]">
        <IconTile icon={icon} accent={accent} />
      </div>
      <h6 className="relative z-[1] w-full whitespace-pre-wrap break-words text-h6-p text-ink tablet:text-h6">{title}</h6>
      <p className={`relative z-[1] w-full text-body-s text-ink opacity-60 ${bodyClass}`}>{body}</p>
    </div>
  )
}

const CARD = 'relative flex h-[325px] w-full flex-col items-start justify-start gap-5 overflow-clip rounded-card tablet:h-[400px] tablet:gap-[30px] desktop:h-[360px] desktop:self-start'

export default function ProductOverview() {
  const bp = useBreakpoint()

  return (
    <section className="relative flex w-full items-center justify-center gap-4 overflow-clip bg-white px-5 py-[60px] tablet:px-20 tablet:py-[120px] desktop:px-40">
      <LineColumn className="bottom-[-20px] left-0 top-0" />
      <LineColumn className="bottom-[-20px] right-0 top-0" />

      <div className="relative flex w-px max-w-container flex-1 flex-col items-center justify-center gap-[30px] overflow-clip tablet:gap-[50px]">
        <div className="flex w-full flex-col items-center justify-start gap-3 tablet:gap-5">
          <h3 className="text-balance text-h3-p text-ink tablet:text-h3-t desktop:text-h3">Product Overview</h3>
          <p className="w-full max-w-[240px] whitespace-pre-wrap break-words text-center text-body-s text-ink desktop:text-body-l">
            All your revenue data. One intelligent system. Instant action.
            <br />
            <strong>
              <br />
            </strong>
            <br />
          </p>
        </div>

        <div className="relative flex w-full flex-col content-center items-center justify-center gap-5 overflow-clip desktop:grid desktop:grid-cols-[repeat(5,minmax(50px,1fr))] desktop:grid-rows-[repeat(2,minmax(0,1fr))] desktop:items-stretch">
          {/* Card A */}
          <div className={`${CARD} bg-mist p-5 desktop:col-span-3`}>
            <CardText
              icon="/assets/svg/icon-single-pane.svg"
              accent="bg-pink"
              title="Single Pane of Glass"
              body="Unify all of your conversational, usage, and CRM data under one roof"
              className="z-[1] h-[111px] tablet:h-auto"
            />
            <div className="relative z-[1] flex w-full flex-col items-end justify-end gap-4 overflow-clip">
              <div className="relative aspect-[2.00384] w-full overflow-clip rounded-media tablet:w-[80%]">
                <div className="absolute bottom-0 left-0 h-full w-full">
                  <LoopVideo src="/assets/videos/1.mp4" poster="/assets/images/P1Lgom5PNWwYYoJOBmgCCrVBSWs.png" className="h-full w-full" />
                </div>
              </div>
            </div>
            <div className="absolute left-[-0.142854%] top-[-0.169492%] z-0 h-full w-[118%] min-w-[118%] tablet:left-0 tablet:top-0 tablet:w-full tablet:min-w-0">
              <RiveCanvas
                src="/assets/riv/9IL1aPqz438g9ksxNz6HohQnUCI.riv"
                artboard="Product Overview #A 2"
                fit="cover"
                alignment="centerRight"
              />
            </div>
          </div>

          {/* Card B */}
          <div className={`${CARD} bg-mist p-[14px] desktop:col-span-2`}>
            <CardText
              icon="/assets/svg/icon-account-insights.svg"
              accent="bg-orange"
              title="Account Insights"
              body="Get instant highlights on every account in your book of business"
              className="z-[1]"
              bodyClass="text-balance"
            />
            <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-0 overflow-clip tablet:h-[338px] tablet:items-end tablet:gap-4 tablet:p-[5px] desktop:h-auto desktop:items-center desktop:p-0">
              <div className="relative aspect-[1.17573] w-full max-w-full overflow-clip rounded-media tablet:absolute tablet:right-0 tablet:top-0 tablet:z-[1] tablet:flex tablet:aspect-auto tablet:min-h-[423px] tablet:w-[80%] tablet:max-w-[80%] tablet:items-center tablet:justify-center tablet:gap-[10px] desktop:relative desktop:right-auto desktop:top-auto desktop:z-auto desktop:block desktop:aspect-[1.17573] desktop:min-h-0 desktop:w-[90%] desktop:max-w-full">
                <div className="absolute left-1/2 top-0 w-full -translate-x-1/2 tablet:z-[1]">
                  <LoopVideo src="/assets/videos/2.mp4" poster="/assets/images/3v3uUZgCC5luUh6PZJK9tASrU.png" className="block h-auto w-full" />
                </div>
              </div>
            </div>
            <div className="absolute left-0 top-[calc(50%-198.5px)] z-0 h-[397px] w-full tablet:top-0 tablet:h-full">
              <RiveCanvas src="/assets/riv/wsNvE8lyfM4sOjrtMza0ZB4iyXo.riv" artboard="Feature D" fit="cover" alignment="topRight" />
            </div>
          </div>

          {/* Card C */}
          <div className={`${CARD} bg-mist p-[14px] desktop:col-span-2`}>
            <CardText
              icon="/assets/svg/icon-inbox-manager.svg"
              accent="bg-yellow"
              title="Customer Inbox Manager"
              body="Never miss a beat on your customer interactions"
              className="z-[2]"
            />
            <div className="relative z-[2] flex w-full flex-col items-center justify-center gap-4 overflow-clip tablet:items-end desktop:items-center">
              <div className="relative aspect-[1.25413] w-full overflow-clip tablet:h-[496px] tablet:aspect-auto tablet:rounded-media desktop:h-auto desktop:aspect-[1.25413] desktop:rounded-none">
                <div className="absolute left-1/2 top-0 w-[90%] -translate-x-1/2 tablet:left-auto tablet:right-0 tablet:w-[80%] tablet:translate-x-0 desktop:w-full">
                  <LoopVideo src="/assets/videos/3.mp4" poster="/assets/images/R7MDWJvw5MMwZeG5xRiBRswIes.png" className="block h-auto w-full" />
                </div>
              </div>
            </div>
            <div className="absolute left-0 top-0 z-0 h-full w-full">
              <RiveCanvas
                src="/assets/riv/eHE1DQsgIElPCsQD72t5L5k3R5Q.riv"
                artboard="Product Overview #B 5"
                fit="cover"
                alignment="topRight"
              />
            </div>
          </div>

          {/* Card D */}
          <div className={`${CARD} bg-mist p-[14px] desktop:col-span-3`}>
            <CardText
              icon="/assets/svg/icon-no-touch-onboarding.svg"
              accent="bg-mint"
              title="No Touch Onboarding"
              body="Track your customer’s journey in one integrated system"
              className="z-[2]"
            />
            <div className="relative z-[2] flex w-full flex-col items-end justify-end gap-4 overflow-clip">
              <div className="relative aspect-[1.4333] w-full overflow-clip rounded-media tablet:w-[80%]">
                <div className="absolute left-1/2 top-0 w-[90%] -translate-x-1/2 tablet:left-auto tablet:right-0 tablet:w-full tablet:translate-x-0">
                  <LoopVideo
                    src="/assets/videos/4.mp4"
                    poster="/assets/images/oTLxEBPu4QQC7JSF8hmJhxTPok.png"
                    className="block h-auto w-full rounded-media"
                  />
                </div>
              </div>
            </div>
            <div className="absolute left-0 top-0 z-[1] h-full w-full tablet:bottom-[-57px] tablet:left-[-8.69231%] tablet:top-[-20px] tablet:h-auto tablet:w-[117%] desktop:bottom-auto desktop:left-0 desktop:top-0 desktop:h-full desktop:w-full">
              <RiveCanvas
                src="/assets/riv/ixPC1d8kmFhN7mgZJzS21DVjs.riv"
                artboard="Porduct Overview #C"
                fit={bp === 'tablet' ? 'fill' : 'cover'}
                alignment={bp === 'tablet' ? 'topRight' : 'center'}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
