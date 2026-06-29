'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
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
  const pathname = usePathname()
  const router = useRouter()

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register'

  useEffect(() => {
    const sb = createClient()

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      // 로그인 페이지에서 SIGNED_IN 이벤트는 무시 (리다이렉트 루프 방지)
      if (isAuthPage && event === 'SIGNED_IN') return

      const nextUser = session?.user ?? null
      setUser(nextUser)

      if (nextUser) {
        // INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED 모두 admin 재확인
        checkIsAdmin().then(setIsAdmin)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [isAuthPage])

  const handleLogout = async () => {
    const sb = createClient()
    await sb.auth.signOut()
    // 상태 먼저 초기화
    setUser(null)
    setIsAdmin(false)
    // router.push로 홈 이동 (refresh는 push 후 자동 처리됨)
    router.push('/')
    router.refresh()
  }

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // 로그아웃 직후 미들웨어가 세션을 아직 볼 수 있으므로
    // logged_out=1 파라미터로 미들웨어 리다이렉트를 우회
    if (!user) {
      e.preventDefault()
      router.push('/auth/login?logged_out=1')
    }
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
          {user ? (
            <>
              {isAdmin ? (
                // 관리자: 관리자 페이지 링크
                <Link href="/admin" style={{ color: 'var(--gold)', fontWeight: 700, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  🔧 관리자 페이지
                </Link>
              ) : (
                // 일반 유저: 마이페이지 링크
                <Link href="/mypage" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                  👤 {user.user_metadata?.name ?? '마이페이지'}
                </Link>
              )}
              <span style={{ color: 'var(--gray-700)' }}>|</span>
              <button onClick={handleLogout} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', padding: 0, transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login?logged_out=1" onClick={handleLoginClick} style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                로그인
              </Link>
              <Link href="/auth/register" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                회원가입
              </Link>
            </>
          )}
          <span style={{ color: 'var(--gray-700)' }}>|</span>
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
