import { createClient } from '@/lib/supabase-server'
import FaqAdminClient from './FaqAdminClient'

export default async function FaqAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('faqs').select('*').order('sort_order')
  return <FaqAdminClient initialFaqs={data ?? []} />
}
