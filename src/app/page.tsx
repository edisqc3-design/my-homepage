import React from 'react'

import {
  getHeroSlides,
  getBusinessCards,
  getWideBoxSetting,
  getGalleryItems,
  getNotices,
  getPartners,
  getSiteSettings,
  getPublicInquiries,
  getProducts,
} from '@/lib/queries'

import HeroSlider from '@/components/sections/HeroSlider'
import BusinessCards from '@/components/sections/BusinessCards'
import WideBox from '@/components/sections/WideBox'
import ProductsGrid from '@/components/sections/ProductsGrid'
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

// 관리자페이지 '사이트 설정 > 메인 화면 섹션 노출'에서 지정한 순서대로 렌더링.
// section_order가 비어있거나 일부 키가 빠져 있어도 항상 8개 전체가 채워지도록 보정한다.
const DEFAULT_SECTION_ORDER = [
  'section_hero',
  'section_business_cards',
  'section_wide_box',
  'section_products',
  'section_gallery',
  'section_recent_posts',
  'section_customer_support',
  'section_partners',
]

function resolveSectionOrder(settings: Record<string, string>): string[] {
  const saved = (settings.section_order ?? '').split(',').map(s => s.trim()).filter(Boolean)
  const valid = saved.filter(key => DEFAULT_SECTION_ORDER.includes(key))
  const missing = DEFAULT_SECTION_ORDER.filter(key => !valid.includes(key))
  return [...valid, ...missing]
}

export default async function HomePage() {
  const [slides, cards, wideBox, products, gallery, notices, partners, settings, inquiries] = await Promise.all([
    getHeroSlides(),
    getBusinessCards(),
    getWideBoxSetting(),
    getProducts(),
    getGalleryItems(12),
    getNotices(5),
    getPartners(),
    getSiteSettings(),
    getPublicInquiries(5),
  ])

  // 섹션 키 -> 실제 렌더링할 엘리먼트 매핑.
  const sectionElements: Record<string, React.ReactNode> = {
    section_hero: <HeroSlider slides={slides} />,
    section_business_cards: <BusinessCards cards={cards} />,
    section_wide_box: <WideBox data={wideBox} />,
    section_products: <ProductsGrid products={products.slice(0, 8)} />,
    section_gallery: <GalleryGrid items={gallery} displayMode={settings.gallery_display_mode ?? 'card'} />,
    section_recent_posts: <RecentPosts notices={notices} inquiries={inquiries} />,
    section_customer_support: <CustomerSupport settings={settings} />,
    section_partners: <Partners partners={partners} />,
  }

  const order = resolveSectionOrder(settings)

  return (
    <>
      {order.map(key => (
        <React.Fragment key={key}>
          {isSectionVisible(settings, key) && sectionElements[key]}
          {/* CtaBanner는 토글/순서 변경 대상이 아니라 시공사례 섹션 자리 바로 뒤에 항상 고정 노출(기존 동작 유지) */}
          {key === 'section_gallery' && <CtaBanner />}
        </React.Fragment>
      ))}
    </>
  )
}
