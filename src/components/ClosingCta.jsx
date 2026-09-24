import RiveCanvas from './RiveCanvas'
import { CALENDLY, PrimaryButton } from './ui'
import useBreakpoint from '../hooks/useBreakpoint'

export default function ClosingCta() {
  const bp = useBreakpoint()

  return (
    <section className="relative flex w-full items-center justify-center gap-4 overflow-clip bg-ink">
      <div className="relative flex w-px flex-1 flex-col items-center justify-center gap-20 overflow-clip bg-ink px-5 pb-[100px] pt-10 tablet:px-20 tablet:pb-20 desktop:px-40 desktop:pb-[120px]">
        {/* Rive layer */}
        <div className="absolute bottom-0 left-0 top-0 w-full max-w-[200%] overflow-clip">
          {bp === 'tablet' ? (
            <div className="absolute inset-0 bottom-[-289px]">
              <RiveCanvas
                src="/assets/riv/gEUIM1UnyqYvqol29hVZR6OA50Q.riv"
                artboard="Landing Foot"
                fit="cover"
                alignment="topLeft"
              />
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 right-[-85px] h-[145px] desktop:bottom-auto desktop:right-0 desktop:top-1/2 desktop:h-auto desktop:aspect-[3.44828] desktop:-translate-y-1/2">
              <RiveCanvas
                src="/assets/riv/M560tT3PFFd0T3ciANv2oN0uU.riv"
                artboard="Landing Foot"
                fit="cover"
                alignment="topRight"
              />
            </div>
          )}
        </div>

        <div className="relative z-[3] flex w-full max-w-container flex-col items-start justify-start gap-[30px] overflow-clip rounded-card tablet:gap-[50px] tablet:pb-10">
          <div className="flex w-full max-w-[480px] flex-col items-start justify-start gap-3 tablet:gap-6 tablet:bg-ink">
            <h3 className="text-balance text-h3-p text-white tablet:text-h3-t desktop:text-h3">
              The only customer platform you will ever need
            </h3>
            <div className="flex w-full items-center justify-start gap-3 overflow-clip">
              <PrimaryButton variant="light" href={CALENDLY} target="_blank">
                Schedule Demo
              </PrimaryButton>
              <PrimaryButton variant="noicon" href="/contact">
                Contact Us
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
