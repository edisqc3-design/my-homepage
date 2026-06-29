import { Metadata } from 'next'
import { getGalleryById, getAllGallery } from '@/lib/queries'
import GalleryDetailClient from './GalleryDetailClient'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const item = await getGalleryById(id)
  if (!item) return { title: '사례 없음' }
  return {
    title: item.title,
    description: item.description ?? `${item.title} - 우드자재닷컴 시공사례`,
    openGraph: {
      title: item.title,
      description: item.description ?? '',
      images: item.image_url ? [{ url: item.image_url }] : [],
    },
  }
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [item, allItems] = await Promise.all([getGalleryById(id), getAllGallery()])
  if (!item) notFound()
  const related = allItems.filter(i => i.id !== id && i.category === item.category).slice(0, 4)
  return <GalleryDetailClient item={item} related={related} />
}
