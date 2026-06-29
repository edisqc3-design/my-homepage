import { createClient } from '@/lib/supabase-server'
import PartnersClient from './PartnersClient'

export default async function PartnersAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('partners').select('*').order('sort_order')
  return <PartnersClient initialPartners={data ?? []} />
}
