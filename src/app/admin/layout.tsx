import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/admin')

  // admin_users 테이블에 등록된 유저인지 확인
  const { data: adminUser } = await supabase
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
