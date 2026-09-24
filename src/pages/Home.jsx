import Hero from '../components/Hero'
import LogoStrip from '../components/LogoStrip'
import PlatformFeatures from '../components/PlatformFeatures'
import ProductOverview from '../components/ProductOverview'
import Enterprise from '../components/Enterprise'
import Testimonials from '../components/Testimonials'
import IntegrationsFaq from '../components/IntegrationsFaq'
import ClosingCta from '../components/ClosingCta'

/** Route `/` (CLONE_SPEC.md). Same section order and markup as before routing was added. */
export default function Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <PlatformFeatures />
      <ProductOverview />
      <Enterprise />
      <Testimonials />
      <IntegrationsFaq />
      <ClosingCta />
    </>
  )
}
