'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { checkIsAdmin } from '@/lib/auth-actions'
import type { User } from '@supabase/supabase-js'

interface TopBarProps {
  initialUser: User | null
  initialIsAdmin: boolean
}

export default function TopBar({ initialUser, initialIsAdmin }: TopBarProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin)
  const router = useRouter()
  const pathname = usePathname()

  // 관리자 페이지에서는 TopBar 숨김
  if (pathname?.startsWith('/admin')) return null

  const initialIsAdminRef = useRef(initialIsAdmin)
  useEffect(() => {
    if (initialIsAdminRef.current !== initialIsAdmin) {
      initialIsAdminRef.current = initialIsAdmin
      setIsAdmin(initialIsAdmin)
    }
    if (initialUser?.id !== user?.id) {
      setUser(initialUser)
    }
  }, [initialIsAdmin, initialUser])

  useEffect(() => {
    const sb = createClient()
    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') return
      const nextUser = session?.user ?? null
      if (!nextUser) {
        setUser(null)
        setIsAdmin(false)
        return
      }
      if (event === 'SIGNED_IN') return
      setUser(nextUser)
      checkIsAdmin().then(setIsAdmin)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const sb = createClient()
    await sb.auth.signOut()
    setUser(null)
    setIsAdmin(false)
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{
      background: 'var(--navy)',
      borderBottom: '1px solid var(--navy-light)',
      padding: '8px 0',
      fontSize: '0.78rem',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* 좌측: 연락처 */}
        <div style={{ color: 'var(--gray-500)', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>📞 02-0000-0000</span>
          <span style={{ color: 'var(--gray-700)' }}>|</span>
          <span>✉ info@woodjajae.co.kr</span>
        </div>

        {/* 우측: 메뉴 */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

          {/* 비로그인: 로그인 + 회원가입 */}
          {!user && (
            <>
              <Link href="/auth/login" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                로그인
              </Link>
              <Link href="/auth/register" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                회원가입
              </Link>
              <span style={{ color: 'var(--gray-700)' }}>|</span>
            </>
          )}

          {/* 일반회원: 마이페이지 + 로그아웃 */}
          {user && !isAdmin && (
            <>
              <Link href="/mypage" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                👤 {user.user_metadata?.name ?? '마이페이지'}
              </Link>
              <button onClick={handleLogout} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', padding: 0, transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                로그아웃
              </button>
              <span style={{ color: 'var(--gray-700)' }}>|</span>
            </>
          )}

          {/* 관리자: 관리자 링크 + 로그아웃 */}
          {user && isAdmin && (
            <>
              <Link href="/admin" style={{ color: 'var(--gold)', fontWeight: 700, transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                🔧 관리자
              </Link>
              <button onClick={handleLogout} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', padding: 0, transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                로그아웃
              </button>
              <span style={{ color: 'var(--gray-700)' }}>|</span>
            </>
          )}

          <Link href="/faq" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
            FAQ
          </Link>
          <Link href="/inquiry" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
            1:1문의
          </Link>
        </div>
      </div>
    </div>
  )
}
