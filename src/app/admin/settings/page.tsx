import { createClient } from '@/lib/supabase-server'
import SettingsAdminClient from './SettingsAdminClient'

export default async function SettingsAdminPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('*')

  const settings: Record<string, string> = {}
  for (const row of data ?? []) {
    settings[row.key] = row.value ?? ''
  }

  return <SettingsAdminClient initialSettings={settings} />
}
