import { createClient } from '@/lib/supabase-server'
import InquiriesAdminClient from './InquiriesAdminClient'

export default async function InquiriesAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
  return <InquiriesAdminClient initialInquiries={data ?? []} />
}
