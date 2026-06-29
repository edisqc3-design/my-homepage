'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { logout } from '@/lib/auth-actions'
import type { User } from '@supabase/supabase-js'

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()

  // 로그인/회원가입 페이지에서는 user 정보를 표시하지 않음
  // (로그인 처리 중 redirect 전에 TopBar가 먼저 바뀌는 것을 방지)
  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register'

  useEffect(() => {
    const sb = createClient()

    // 인증 페이지에서는 초기 user 조회도 건너뜀
    if (!isAuthPage) {
      sb.auth.getUser().then(({ data }) => setUser(data.user))
    }

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      // 로그인 페이지에서 SIGNED_IN 이벤트 발생 시 무시 (redirect 전 깜빡임 방지)
      if (isAuthPage && event === 'SIGNED_IN') return
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [isAuthPage])

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
              <Link href="/mypage" style={{ color: 'rgba(255,255,255,0.55)', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
                👤 {user.user_metadata?.name ?? '마이페이지'}
              </Link>
              <span style={{ color: 'var(--gray-700)' }}>|</span>
              <button onClick={() => logout()} style={{
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
