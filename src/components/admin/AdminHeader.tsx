'use client'

import { usePathname } from 'next/navigation'

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
    </header>
  )
}
