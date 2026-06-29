import { createClient } from '@/lib/supabase-server'
import WideBoxClient from './WideBoxClient'

export default async function WideBoxAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('wide_box_settings').select('*').limit(1).single()
  return <WideBoxClient initialData={data} />
}
