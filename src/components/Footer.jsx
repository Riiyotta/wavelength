import { Link } from 'react-router-dom'
import { Wordmark } from './ui'

const COL_1 = [
  { label: 'Case Studies', href: '/' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'About us', href: '/about' },
  { label: 'Blogs', href: '/blogs' },
]
const COL_2 = [
  { label: 'Privacy Policy', href: '/legals/privacy-policy' },
  { label: 'Terms & Conditions', href: '/legals/terms-conditions' },
]

const SMALL_LINK = 'whitespace-pre text-link text-white opacity-60 transition-opacity duration-300 ease-framer hover:opacity-100'

function ColumnLink({ label, href }) {
  return (
    // target="_blank" as on the source (CLONE_SPEC 10); Link leaves new-tab navigation to the browser.
    <Link
      to={href}
      target="_blank"
      rel="noopener"
      className="w-fit whitespace-pre text-button text-white opacity-60 transition-opacity duration-300 ease-framer hover:opacity-100"
    >
      {label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-center gap-4 bg-ink px-5 py-8 tablet:px-20 tablet:pb-[30px] tablet:pt-[54px] desktop:py-[54px] desktop:px-40">
      <div className="flex w-full max-w-container flex-col items-start justify-start gap-16 tablet:gap-4">
        {/* Top */}
        <div className="flex w-full flex-col items-start justify-start gap-16 tablet:flex-row tablet:justify-between tablet:gap-0">
          <div className="flex w-min flex-col items-start justify-start gap-[18px]">
            <Wordmark className="h-6 w-[144px] bg-white tablet:h-7 tablet:w-[168px]" />
            <div className="flex w-[164px] items-center justify-start gap-[6.4px]">
              <p className="whitespace-pre text-caption text-caption-white">Backed by</p>
              <img
                src="/assets/images/whqflScpEWGapBxaNgrWqIymKmU.png"
                alt="Y Combinator"
                className="block h-[22px] w-[22px] shrink-0"
              />
              <p className="whitespace-pre text-caption text-caption-white">Combinator</p>
            </div>
          </div>
          <div className="flex w-full items-start justify-start gap-10 tablet:w-1/2 desktop:w-[40%]">
            <div className="flex w-px flex-1 flex-col items-start justify-center gap-4">
              {COL_1.map((l) => (
                <ColumnLink key={l.label} {...l} />
              ))}
            </div>
            <div className="flex w-px flex-1 flex-col items-start justify-start gap-4">
              {COL_2.map((l) => (
                <ColumnLink key={l.label} {...l} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex w-full flex-col items-start justify-start gap-8 tablet:flex-row tablet:items-end tablet:justify-between tablet:gap-0">
          <div className="order-1 w-full whitespace-pre-wrap break-words text-link text-white opacity-60 tablet:order-none tablet:w-px tablet:flex-1">
            <p>Copyright Assembly Works Inc. </p>
            <p>2024 Built in San Francisco, CA</p>
          </div>
          <div className="order-none flex w-min items-center justify-start gap-5 tablet:gap-[26px]">
            <a className={`cursor-pointer ${SMALL_LINK}`}>
              Linkedin
            </a>
            {/* No href on the source */}
            <a className={`cursor-pointer ${SMALL_LINK}`}>Email</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
