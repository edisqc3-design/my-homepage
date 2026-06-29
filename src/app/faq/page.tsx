import { getFaqs } from '@/lib/queries'
import FaqClient from './FaqClient'

export const revalidate = 60

export default async function FaqPage() {
  const faqs = await getFaqs()
  return <FaqClient faqs={faqs} />
}
