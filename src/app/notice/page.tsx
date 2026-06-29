import { getAllNotices } from '@/lib/queries'
import NoticeClient from './NoticeClient'

export const revalidate = 60

export default async function NoticePage() {
  const notices = await getAllNotices()
  return <NoticeClient notices={notices} />
}
