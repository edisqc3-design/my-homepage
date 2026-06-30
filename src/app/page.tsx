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

// site_settings에 키가 없으면 기존 동작 그대로 노출(true)로 처리.
// 명시적으로 'false'로 저장된 경우에만 숨김.
function isSectionVisible(settings: Record<string, string>, key: string) {
  return settings[key] !== 'false'
}

export default async function HomePage() {
  const [slides, cards, wideBox, gallery, notices, partners, settings, inquiries] = await Promise.all([
    getHeroSlides(),
    getBusinessCards(),
    getWideBoxSetting(),
    getGalleryItems(12),
    getNotices(5),
    getPartners(),
    getSiteSettings(),
    getPublicInquiries(5),
  ])

  return (
    <>
      {isSectionVisible(settings, 'section_hero') && <HeroSlider slides={slides} />}
      {isSectionVisible(settings, 'section_business_cards') && <BusinessCards cards={cards} />}
      {isSectionVisible(settings, 'section_wide_box') && <WideBox data={wideBox} />}
      {isSectionVisible(settings, 'section_gallery') && <GalleryGrid items={gallery} />}
      <CtaBanner />
      {isSectionVisible(settings, 'section_recent_posts') && <RecentPosts notices={notices} inquiries={inquiries} />}
      {isSectionVisible(settings, 'section_customer_support') && <CustomerSupport settings={settings} />}
      {isSectionVisible(settings, 'section_partners') && <Partners partners={partners} />}
    </>
  )
}
