'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
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

  // 서버에서 내려온 최신 initialIsAdmin을 ref로 추적
  // props가 바뀔 때(router.refresh 후 서버 재렌더) 클라이언트 상태도 동기화
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
      setUser(nextUser)

      if (!nextUser) {
        setIsAdmin(false)
        return
      }

      // SIGNED_IN: router.refresh()로 서버가 initialIsAdmin을 갱신해서 내려줌
      // → props 변경 useEffect가 처리하므로 여기서 중복 checkIsAdmin() 호출 불필요
      if (event === 'SIGNED_IN') return

      // TOKEN_REFRESHED 등 다른 이벤트에서만 재확인
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
          {user ? (
            <>
              {isAdmin ? (
                <Link href="/admin" style={{ color: 'var(--gold)', fontWeight: 700, transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  🔧 관리자 페이지
                </Link>
              ) : (
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
