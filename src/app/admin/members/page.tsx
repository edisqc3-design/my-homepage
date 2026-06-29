import { createClient } from '@supabase/supabase-js'
import MembersAdminClient from './MembersAdminClient'

export default async function MembersAdminPage() {
  // service_role 키로 auth.users 접근 (서버에서만 사용)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: { users }, error } = await supabase.auth.admin.listUsers()

  // 각 유저의 문의 건수 조회
  const { data: inquiryCounts } = await supabase
    .from('inquiries')
    .select('email')

  const countByEmail: Record<string, number> = {}
  for (const inq of inquiryCounts ?? []) {
    if (inq.email) countByEmail[inq.email] = (countByEmail[inq.email] ?? 0) + 1
  }

  const members = (users ?? []).map(u => ({
    id: u.id,
    email: u.email ?? '',
    name: (u.user_metadata?.name as string) ?? '',
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at ?? null,
    inquiry_count: countByEmail[u.email ?? ''] ?? 0,
    confirmed: !!u.email_confirmed_at,
  }))

  return <MembersAdminClient members={members} />
}
