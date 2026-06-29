import { Metadata } from 'next'
import { getPublicInquiryById, getAllPublicInquiries } from '@/lib/queries'
import InquiryBoardDetailClient from './InquiryBoardDetailClient'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const inquiry = await getPublicInquiryById(id)
  if (!inquiry) return { title: '문의 없음' }
  return {
    title: `[${inquiry.category ?? '문의'}] 고객 문의`,
    description: inquiry.content.slice(0, 120),
  }
}

export default async function InquiryBoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [inquiry, all] = await Promise.all([getPublicInquiryById(id), getAllPublicInquiries()])
  if (!inquiry) notFound()
  const currentIndex = all.findIndex(q => q.id === id)
  const prev = currentIndex > 0 ? all[currentIndex - 1] : null
  const next = currentIndex < all.length - 1 ? all[currentIndex + 1] : null
  return <InquiryBoardDetailClient inquiry={inquiry} prev={prev} next={next} />
}
