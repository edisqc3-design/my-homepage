'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  border: '1px solid var(--gray-200)', borderRadius: '8px',
  fontSize: '0.9rem', color: 'var(--gray-900)',
  background: 'var(--white)', outline: 'none',
  transition: 'border-color 0.2s',
}

export default function LoginClient({ searchParams }: { searchParams: Promise<{ next?: string; registered?: string }> }) {
  const params = use(searchParams)
  const next = params.next
  const justRegistered = params.registered === '1'

  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setErrorMsg('이메일과 비밀번호를 입력해 주세요.')
      setStatus('error'); return
    }
    setStatus('loading')
    setErrorMsg('')

    const sb = createClient()
    const { error } = await sb.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setErrorMsg('이메일 또는 비밀번호가 올바르지 않습니다.')
      setStatus('error')
      return
    }

    router.push(next ?? '/')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--navy)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', color: 'var(--gold)' }}>W</div>
            <span style={{ color: 'var(--navy)', fontWeight: 800, fontSize: '1.2rem' }}>우드자재<span style={{ color: 'var(--gold)' }}>닷컴</span></span>
          </Link>
        </div>

        <div style={{ background: 'var(--white)', borderRadius: '16px', padding: '40px 36px', border: '1px solid var(--gray-100)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>로그인</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '28px' }}>계정에 로그인하여 서비스를 이용하세요</p>

          {justRegistered && (
            <div style={{ padding: '12px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', color: '#166534', fontSize: '0.875rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✅</span> 회원가입이 완료되었습니다. 로그인해 주세요.
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>이메일</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@company.co.kr" style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>비밀번호</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {status === 'error' && (
            <div style={{ padding: '12px 14px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '8px', color: '#e63946', fontSize: '0.875rem', marginBottom: '16px' }}>
              {errorMsg}
            </div>
          )}

          <button onClick={handleSubmit} disabled={status === 'loading'} style={{
            width: '100%', padding: '13px', background: 'var(--navy)', color: 'var(--white)',
            border: 'none', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.7 : 1, marginBottom: '16px', transition: 'all 0.2s',
          }}>
            {status === 'loading' ? '로그인 중...' : '로그인'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-100)' }} />
            <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>또는</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-100)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            계정이 없으신가요?{' '}
            <Link href="/auth/register" style={{ color: 'var(--gold)', fontWeight: 700 }}>회원가입</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>← 홈으로 돌아가기</Link>
        </p>
      </div>
    </div>
  )
}
