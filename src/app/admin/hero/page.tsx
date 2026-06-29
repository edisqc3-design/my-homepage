import { createClient } from '@/lib/supabase-server'
import HeroAdminClient from './HeroAdminClient'

export default async function HeroAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hero_slides')
    .select('*')
    .order('sort_order', { ascending: true })

  return <HeroAdminClient initialSlides={data ?? []} />
}
