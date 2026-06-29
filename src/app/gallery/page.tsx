import { Metadata } from 'next'
import { getAllGallery } from '@/lib/queries'
import GalleryClient from './GalleryClient'

export const metadata: Metadata = {
  title: '시공사례',
  description: '전국 3,000여 현장의 시공사례를 확인하세요. 상업시설, 주거시설, 공공시설별 합성목재 데크 및 외장재 시공 사례.',
}

export const revalidate = 60

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const allItems = await getAllGallery()
  const items = category && category !== '전체'
    ? allItems.filter(i => i.category === category)
    : allItems
  return <GalleryClient items={items} activeCategory={category ?? '전체'} />
}
