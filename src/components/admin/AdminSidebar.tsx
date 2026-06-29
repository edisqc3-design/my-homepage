'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const MENU = [
  {
    group: '개요',
    items: [
      { label: '대시보드', href: '/admin', icon: '📊' },
    ],
  },
  {
    group: '홈페이지 관리',
    items: [
      { label: '슬라이더', href: '/admin/hero', icon: '🖼️' },
      { label: '비즈니스 카드', href: '/admin/business-cards', icon: '🃏' },
      { label: '와이드박스', href: '/admin/wide-box', icon: '📐' },
      { label: '파트너', href: '/admin/partners', icon: '🤝' },
    ],
  },
  {
    group: '콘텐츠 관리',
    items: [
      { label: '시공사례', href: '/admin/gallery', icon: '🏗️' },
      { label: '제품', href: '/admin/products', icon: '📦' },
      { label: '공지사항', href: '/admin/notices', icon: '📢' },
      { label: 'FAQ', href: '/admin/faq', icon: '❓' },
      { label: '자료실', href: '/admin/downloads', icon: '📁' },
    ],
  },
  {
    group: '고객 관리',
    items: [
      { label: '회원 관리', href: '/admin/members', icon: '👥' },
      { label: '문의 관리', href: '/admin/inquiries', icon: '💬' },
    ],
  },
  {
    group: '설정',
    items: [
      { label: '사이트 설정', href: '/admin/settings', icon: '⚙️' },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '240px', flexShrink: 0,
      background: '#0a1628',
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', position: 'sticky', top: 0,
    }}>
      {/* 로고 */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#c9a84c',
            borderRadius: '8px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 900, color: '#0a1628', fontSize: '1rem',
          }}>W</div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1 }}>우드자재닷컴</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: '2px' }}>관리자 페이지</p>
          </div>
        </Link>
      </div>

      {/* 메뉴 */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {MENU.map(group => (
          <div key={group.group} style={{ marginBottom: '24px' }}>
            <p style={{
              color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem',
              fontWeight: 700, letterSpacing: '0.1em',
              padding: '0 8px', marginBottom: '6px',
            }}>
              {group.group.toUpperCase()}
            </p>
            {group.items.map(item => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 10px', borderRadius: '8px', marginBottom: '2px',
                  background: isActive ? 'rgba(201,168,76,0.15)' : 'transparent',
                  color: isActive ? '#c9a84c' : 'rgba(255,255,255,0.55)',
                  fontSize: '0.875rem', fontWeight: isActive ? 700 : 400,
                  transition: 'all 0.15s',
                  borderLeft: isActive ? '3px solid #c9a84c' : '3px solid transparent',
                }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                    }
                  }}>
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* 홈 바로가기 */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/" target="_blank" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '9px 10px', borderRadius: '8px',
          color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem',
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
          <span>🌐</span> 홈페이지 보기 ↗
        </Link>
      </div>
    </aside>
  )
}
