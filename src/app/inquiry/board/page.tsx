import { getAllPublicInquiries } from '@/lib/queries'
import InquiryBoardClient from './InquiryBoardClient'

export const revalidate = 60

export default async function InquiryBoardPage() {
  const inquiries = await getAllPublicInquiries()
  return <InquiryBoardClient inquiries={inquiries} />
}
