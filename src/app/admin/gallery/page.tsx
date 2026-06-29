import { createClient } from '@/lib/supabase-server'
import GalleryAdminClient from './GalleryAdminClient'

export default async function GalleryAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('gallery').select('*').order('sort_order')
  return <GalleryAdminClient initialItems={data ?? []} />
}
