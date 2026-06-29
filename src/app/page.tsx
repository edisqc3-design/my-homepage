import {
  getHeroSlides,
  getBusinessCards,
  getWideBoxSetting,
  getGalleryItems,
  getNotices,
  getPartners,
  getSiteSettings,
  getPublicInquiries,
} from '@/lib/queries'

import HeroSlider from '@/components/sections/HeroSlider'
import BusinessCards from '@/components/sections/BusinessCards'
import WideBox from '@/components/sections/WideBox'
import GalleryGrid from '@/components/sections/GalleryGrid'
import CtaBanner from '@/components/sections/CtaBanner'
import RecentPosts from '@/components/sections/RecentPosts'
import CustomerSupport from '@/components/sections/CustomerSupport'
import Partners from '@/components/sections/Partners'

// 서버 컴포넌트 — 빌드 시 또는 요청 시 Supabase에서 fetch
export const revalidate = 60 // 60초마다 ISR 재생성

export default async function HomePage() {
  const [slides, cards, wideBox, gallery, notices, partners, settings, inquiries] = await Promise.all([
    getHeroSlides(),
    getBusinessCards(),
    getWideBoxSetting(),
    getGalleryItems(8),
    getNotices(5),
    getPartners(),
    getSiteSettings(),
    getPublicInquiries(5),
  ])

  return (
    <>
      <HeroSlider slides={slides} />
      <BusinessCards cards={cards} />
      <WideBox data={wideBox} />
      <GalleryGrid items={gallery} />
      <CtaBanner />
      <RecentPosts notices={notices} inquiries={inquiries} />
      <CustomerSupport settings={settings} />
      <Partners partners={partners} />
    </>
  )
}
