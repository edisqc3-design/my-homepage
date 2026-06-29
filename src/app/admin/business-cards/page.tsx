import { createClient } from '@/lib/supabase-server'
import BusinessCardsClient from './BusinessCardsClient'

export default async function BusinessCardsAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('business_cards').select('*').order('sort_order')
  return <BusinessCardsClient initialCards={data ?? []} />
}
