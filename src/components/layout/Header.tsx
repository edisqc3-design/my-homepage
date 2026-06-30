'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/auth-actions'

const NAV_ITEMS = [
  {
    label: '회사소개',
    href: '/about',
    children: [
      { label: '인사말', href: '/about' },
      { label: '비전 & 가치', href: '/about/vision' },
      { label: '연혁', href: '/about/history' },
      { label: '오시는 길', href: '/about/map' },
      { label: '조직도', href: '/about/org' },
    ],
  },
  {
    label: '사업안내',
    href: '/business',
    children: [
      { label: '사업 영역', href: '/business' },
      { label: '시공 실적', href: '/business/projects' },
      { label: '인증 & 특허', href: '/business/cert' },
    ],
  },
  {
    label: '제품소개',
    href: '/products',
    children: [
      { label: '전체 제품', href: '/products' },
      { label: '데크 자재', href: '/products/deck' },
      { label: '외장 자재', href: '/products/exterior' },
      { label: '내장 자재', href: '/products/interior' },
    ],
  },
  {
    label: '시공사례',
    href: '/gallery',
    children: [
      { label: '전체 사례', href: '/gallery' },
      { label: '상업 시설', href: '/gallery/commercial' },
      { label: '공공 시설', href: '/gallery/public' },
      { label: '주거 시설', href: '/gallery/residential' },
    ],
  },
  {
    label: '고객지원',
    href: '/support',
    children: [
      { label: '공지사항', href: '/notice' },
      { label: 'FAQ', href: '/faq' },
      { label: '1:1 문의', href: '/inquiry' },
      { label: '자료실', href: '/download' },
    ],
  },
]

import type { User } from '@supabase/supabase-js'

export default function Header({ user, isAdmin }: { user?: User | null, isAdmin?: boolean }) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: isScrolled ? 'rgba(10,22,40,0.97)' : 'var(--navy)',
      backdropFilter: 'blur(8px)',
      boxShadow: isScrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'var(--gold)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '1.1rem', color: 'var(--navy)',
          }}>W</div>
          <span style={{ color: 'var(--white)', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em' }}>
            우드자재<span style={{ color: 'var(--gold)' }}>닷컴</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '4px' }} className="hidden-mobile">
          {NAV_ITEMS.map(item => (
            <div key={item.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => setOpenMenu(item.label)}
              onMouseLeave={() => setOpenMenu(null)}>
              <Link href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '8px 16px',
                color: openMenu === item.label ? 'var(--gold)' : 'var(--gray-300)',
                fontWeight: 600, fontSize: '0.9rem',
                borderRadius: '6px',
                transition: 'color 0.2s',
              }}>
                {item.label}
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>▾</span>
              </Link>

              {/* Dropdown */}
              {item.children && openMenu === item.label && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--white)',
                  borderRadius: '8px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  minWidth: '160px',
                  padding: '8px 0',
                  border: '1px solid var(--gray-100)',
                }}>
                  {item.children.map(child => (
                    <Link key={child.label} href={child.href} style={{
                      display: 'block',
                      padding: '9px 20px',
                      color: 'var(--gray-700)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.15s',
                      borderLeft: '3px solid transparent',
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'var(--gray-50)'
                        e.currentTarget.style.color = 'var(--navy)'
                        e.currentTarget.style.borderLeftColor = 'var(--gold)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--gray-700)'
                        e.currentTarget.style.borderLeftColor = 'transparent'
                      }}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/inquiry" className="btn-primary" style={{ fontSize: '0.82rem', padding: '9px 20px' }}>
            견적 문의
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--white)', fontSize: '1.4rem', padding: '4px',
            }}
            className="mobile-only"
            aria-label="메뉴 열기">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* 관리자 정보 (관리자 페이지에서만, 맨 우측 고정) */}
        {user && isAdmin && isAdminPage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }} className="hidden-mobile">
            <Link href="/admin" style={{
              padding: '3px 10px',
              background: 'rgba(201,168,76,0.15)',
              color: '#c9a84c',
              fontSize: '0.72rem', fontWeight: 700, borderRadius: '10px',
              textDecoration: 'none',
            }}>
              👑 최고관리자
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'var(--gold)', color: 'var(--navy)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.85rem',
              }}>
                {(user.user_metadata?.name ?? user.email ?? 'A')[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--white)', lineHeight: 1.2 }}>
                  {user.user_metadata?.name ?? 'admin'}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)' }}>{user.email}</p>
              </div>
            </div>
            <button onClick={() => logout()} style={{
              padding: '5px 12px', borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
              color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(230,57,70,0.15)'
                e.currentTarget.style.color = '#e63946'
                e.currentTarget.style.borderColor = 'rgba(230,57,70,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              }}>
              로그아웃
            </button>
          </div>
        )}
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div style={{
          background: 'var(--navy-mid)',
          borderTop: '1px solid var(--navy-light)',
          padding: '16px 0',
        }}>
          {NAV_ITEMS.map(item => (
            <div key={item.label}>
              <Link href={item.href} style={{
                display: 'block', padding: '12px 24px',
                color: 'var(--gray-300)', fontWeight: 600, fontSize: '0.95rem',
              }} onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
              {item.children?.map(child => (
                <Link key={child.label} href={child.href} style={{
                  display: 'block', padding: '9px 24px 9px 40px',
                  color: 'var(--gray-500)', fontSize: '0.875rem',
                }} onClick={() => setMobileOpen(false)}>
                  └ {child.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: block !important; }
        }
        @media (min-width: 901px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </header>
  )
}
