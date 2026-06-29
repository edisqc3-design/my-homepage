import { Metadata } from 'next'
import { getNoticeById, getAllNotices } from '@/lib/queries'
import NoticeDetailClient from './NoticeDetailClient'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const notice = await getNoticeById(id)
  if (!notice) return { title: '공지 없음' }
  return {
    title: notice.title,
    description: notice.content?.slice(0, 120) ?? notice.title,
  }
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [notice, allNotices] = await Promise.all([getNoticeById(id), getAllNotices()])
  if (!notice) notFound()
  const currentIndex = allNotices.findIndex(n => n.id === id)
  const prevNotice = currentIndex > 0 ? allNotices[currentIndex - 1] : null
  const nextNotice = currentIndex < allNotices.length - 1 ? allNotices[currentIndex + 1] : null
  return <NoticeDetailClient notice={notice} prevNotice={prevNotice} nextNotice={nextNotice} />
}
