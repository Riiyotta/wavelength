import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar, { AnnouncementBar } from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import { FIXED_LINE_ROUTES, PageLines, ScrollToTop } from './components/sub/shared'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Integrations from './pages/Integrations'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'
import CaseStudy from './pages/CaseStudy'
import Legal from './pages/Legal'

export default function App() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen w-full flex-col items-center overflow-clip bg-white">
      <ScrollToTop />
      <AnnouncementBar />
      {/* key: a fresh nav per route, so the phone menu is closed after navigating (as on a full page load) */}
      <Navbar key={pathname} />
      {FIXED_LINE_ROUTES(pathname) && <PageLines />}
      <main className="flex w-full flex-col items-center overflow-clip">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/case-study/:slug" element={<CaseStudy />} />
          <Route path="/legals/terms-conditions" element={<Legal kind="terms" />} />
          <Route path="/legals/privacy-policy" element={<Legal kind="privacy" />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}
