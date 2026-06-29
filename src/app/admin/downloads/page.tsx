import { createClient } from '@/lib/supabase-server'
import DownloadsAdminClient from './DownloadsAdminClient'

export default async function DownloadsAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('downloads').select('*').order('sort_order')
  return <DownloadsAdminClient initialDownloads={data ?? []} />
}
