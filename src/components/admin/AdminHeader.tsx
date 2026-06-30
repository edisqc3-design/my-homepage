'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/lib/auth-actions'

const PAGE_TITLES: Record<string, string> = {
  '/admin': '대시보드',
  '/admin/hero': '슬라이더 관리',
  '/admin/business-cards': '비즈니스 카드 관리',
  '/admin/wide-box': '와이드박스 관리',
  '/admin/partners': '파트너 관리',
  '/admin/gallery': '시공사례 관리',
  '/admin/products': '제품 관리',
  '/admin/notices': '공지사항 관리',
  '/admin/faq': 'FAQ 관리',
  '/admin/downloads': '자료실 관리',
  '/admin/members': '회원 관리',
  '/admin/inquiries': '문의 관리',
  '/admin/settings': '사이트 설정',
}

type Props = {
  user: { name: string; email: string; role: string }
}

export default function AdminHeader({ user }: Props) {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? '관리자'

  return (
    <header style={{
      background: '#fff', borderBottom: '1px solid #e5e7eb',
      padding: '0 32px', height: '64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628' }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/admin" style={{
          padding: '3px 10px', background: 'rgba(201,168,76,0.15)', color: '#b45309',
          fontSize: '0.72rem', fontWeight: 700, borderRadius: '10px', textDecoration: 'none',
        }}>
          👑 최고관리자
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: '#c9a84c', color: '#0a1628',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '0.85rem',
          }}>
            {(user.name || user.email || 'A')[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0a1628', lineHeight: 1.2 }}>
              {user.name || 'admin'}
            </p>
            <p style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{user.email}</p>
          </div>
        </div>
        <button onClick={() => logout()} style={{
          padding: '5px 12px', borderRadius: '6px',
          border: '1px solid #e5e7eb', background: 'transparent',
          color: '#6b7280', fontSize: '0.78rem', cursor: 'pointer',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(230,57,70,0.08)'
            e.currentTarget.style.color = '#e63946'
            e.currentTarget.style.borderColor = 'rgba(230,57,70,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#6b7280'
            e.currentTarget.style.borderColor = '#e5e7eb'
          }}>
          로그아웃
        </button>
      </div>
    </header>
  )
}
