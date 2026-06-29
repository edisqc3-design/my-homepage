import { createClient } from '@/lib/supabase-server'
import NoticesAdminClient from './NoticesAdminClient'

export default async function NoticesAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false })
  return <NoticesAdminClient initialNotices={data ?? []} />
}
