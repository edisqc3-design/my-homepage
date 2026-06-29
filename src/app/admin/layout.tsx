import { createClient } from '@/lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/admin')

  // admin_users 테이블은 RLS를 우회하기 위해 service_role key 사용
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: adminUser } = await adminSupabase
    .from('admin_users')
    .select('*')
    .eq('email', user.email ?? '')
    .single()

  if (!adminUser) redirect('/?error=권한이 없습니다')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader user={{ name: adminUser.name ?? user.email ?? '', email: user.email ?? '', role: adminUser.role }} />
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
