'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import type { User } from '@supabase/supabase-js'

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const isAuthPage = pathname === '/auth/login' || pathname === '/auth/register'

  const checkAdmin = async (email: string) => {
    const sb = createClient()
    const { data } = await sb
      .from('admin_users')
      .select('role')
      .eq('email', email)
      .single()
    setIsAdmin(!!data)
  }

  useEffect(() => {
    const sb = createClient()

    if (!isAuthPage) {
      sb.auth.getUser().then(({ data }) => {
        setUser(data.user)
        if (data.user?.email) checkAdmin(data.user.email)
      })
    }

    const { data: { subscription } } = sb.auth.onAuthStateChange((event, session) => {
      if (isAuthPage && event === 'SIGNED_IN') return
      setUser(session?.user ?? null)
      if (session?.user?.email) {
        checkAdmin(session.user.email)
      } else {
        setIsAdmin(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [isAuthPage])

  const handleLogout = async () => {
    const sb = createClient()
    await sb.auth.signOut()
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
