import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalInquiries },
    { count: pendingInquiries },
    { count: totalGallery },
    { count: totalProducts },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('gallery').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: '전체 문의', value: totalInquiries ?? 0, icon: '💬', color: '#0a1628', href: '/admin/inquiries' },
    { label: '답변 대기', value: pendingInquiries ?? 0, icon: '⏳', color: '#b45309', href: '/admin/inquiries' },
    { label: '시공사례', value: totalGallery ?? 0, icon: '🏗️', color: '#166534', href: '/admin/gallery' },
    { label: '등록 제품', value: totalProducts ?? 0, icon: '📦', color: '#1d4ed8', href: '/admin/products' },
  ]

  const quickMenus = [
    { label: '슬라이더 수정', href: '/admin/hero', icon: '🖼️', desc: '메인 슬라이드 관리' },
    { label: '공지사항 작성', href: '/admin/notices', icon: '📢', desc: '공지 등록/수정' },
    { label: '시공사례 추가', href: '/admin/gallery', icon: '🏗️', desc: '사례 이미지 업로드' },
    { label: '제품 등록', href: '/admin/products', icon: '📦', desc: '새 제품 추가' },
    { label: '문의 답변', href: '/admin/inquiries', icon: '💬', desc: '대기 문의 처리' },
    { label: '사이트 설정', href: '/admin/settings', icon: '⚙️', desc: '연락처·영업시간 수정' },
  ]

  return (
    <div>
      {/* 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {stats.map(stat => (
          <Link key={stat.label} href={stat.href} style={{ display: 'block' }}>
            <div style={{
              background: '#fff', borderRadius: '12px', padding: '20px 24px',
              border: '1px solid #e5e7eb', transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = 'none'
                el.style.transform = 'none'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '8px' }}>{stat.label}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                    {stat.value}
                  </p>
                </div>
                <span style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: `${stat.color}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem',
                }}>{stat.icon}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* 빠른 메뉴 */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a1628', marginBottom: '16px' }}>
            빠른 메뉴
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {quickMenus.map(menu => (
              <Link key={menu.href} href={menu.href} style={{ display: 'block' }}>
                <div style={{
                  padding: '14px', borderRadius: '10px',
                  border: '1px solid #f3f4f6', background: '#fafafa',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = '#c9a84c'
                    el.style.background = '#fffbf0'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.borderColor = '#f3f4f6'
                    el.style.background = '#fafafa'
                  }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '6px' }}>{menu.icon}</div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>{menu.label}</p>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{menu.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 최근 문의 */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a1628' }}>최근 문의</h2>
            <Link href="/admin/inquiries" style={{ fontSize: '0.78rem', color: '#c9a84c', fontWeight: 600 }}>
              전체보기 →
            </Link>
          </div>

          {!recentInquiries?.length ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: '0.875rem' }}>
              문의가 없습니다
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentInquiries.map((inq: { id: string; name: string; category: string; status: string; created_at: string; content: string }) => (
                <Link key={inq.id} href="/admin/inquiries" style={{ display: 'block' }}>
                  <div style={{
                    padding: '12px 14px', borderRadius: '8px',
                    border: '1px solid #f3f4f6', transition: 'border-color 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#c9a84c')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#f3f4f6')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#111827' }}>{inq.name}</span>
                        <span style={{
                          padding: '1px 7px', borderRadius: '8px', fontSize: '0.68rem', fontWeight: 700,
                          background: inq.status === 'pending' ? '#fef3c7' : '#dcfce7',
                          color: inq.status === 'pending' ? '#b45309' : '#166534',
                        }}>
                          {inq.status === 'pending' ? '대기' : '완료'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{inq.created_at.slice(0, 10)}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      [{inq.category}] {inq.content}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
