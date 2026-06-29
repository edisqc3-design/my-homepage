'use client'

import { useState } from 'react'
import Link from 'next/link'
import { register } from '@/lib/auth-actions'
import { useRouter } from 'next/navigation'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  border: '1px solid var(--gray-200)', borderRadius: '8px',
  fontSize: '0.9rem', color: 'var(--gray-900)',
  background: 'var(--white)', outline: 'none',
  transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.875rem',
  fontWeight: 600, color: 'var(--navy)', marginBottom: '6px',
}

export default function RegisterClient() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordConfirm: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setErrorMsg('모든 필수 항목을 입력해 주세요.')
      setStatus('error'); return
    }
    if (form.password.length < 6) {
      setErrorMsg('비밀번호는 6자 이상이어야 합니다.')
      setStatus('error'); return
    }
    if (form.password !== form.passwordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.')
      setStatus('error'); return
    }
    setStatus('loading')
    setErrorMsg('')
    const result = await register({ name: form.name, email: form.email, password: form.password })
    if (result.success) {
      // 이메일 인증 없이 바로 로그인 페이지로
      router.push('/auth/login?registered=1')
    } else {
      setErrorMsg(result.error ?? '회원가입에 실패했습니다.')
      setStatus('error')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--gray-50)', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--navy)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', color: 'var(--gold)' }}>W</div>
            <span style={{ color: 'var(--navy)', fontWeight: 800, fontSize: '1.2rem' }}>우드자재<span style={{ color: 'var(--gold)' }}>닷컴</span></span>
          </Link>
        </div>

        <div style={{ background: 'var(--white)', borderRadius: '16px', padding: '40px 36px', border: '1px solid var(--gray-100)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '6px' }}>회원가입</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '28px' }}>
            가입 후 바로 로그인할 수 있습니다
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={labelStyle}>이름 <span style={{ color: '#e63946' }}>*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="홍길동" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')} />
            </div>
            <div>
              <label style={labelStyle}>이메일 <span style={{ color: '#e63946' }}>*</span></label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@company.co.kr" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')} />
            </div>
            <div>
              <label style={labelStyle}>비밀번호 <span style={{ color: '#e63946' }}>*</span></label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="6자 이상 입력" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')} />
              {form.password && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '3px' }}>
                    {[1,2,3].map(lv => (
                      <div key={lv} style={{ flex: 1, height: '3px', borderRadius: '2px', transition: 'background 0.2s',
                        background: form.password.length >= lv * 4 ? (lv === 1 ? '#e63946' : lv === 2 ? '#f59e0b' : '#22c55e') : 'var(--gray-100)' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>
                    {form.password.length < 4 ? '약함' : form.password.length < 8 ? '보통' : '강함'}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle}>비밀번호 확인 <span style={{ color: '#e63946' }}>*</span></label>
              <input name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={handleChange} placeholder="비밀번호 재입력" style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              {form.passwordConfirm && (
                <p style={{ fontSize: '0.72rem', marginTop: '4px', color: form.password === form.passwordConfirm ? '#22c55e' : '#e63946' }}>
                  {form.password === form.passwordConfirm ? '✓ 일치합니다' : '✗ 비밀번호가 다릅니다'}
                </p>
              )}
            </div>
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
            opacity: status === 'loading' ? 0.7 : 1, marginBottom: '16px',
          }}>
            {status === 'loading' ? '처리 중...' : '회원가입'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-100)' }} />
            <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem' }}>또는</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray-100)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" style={{ color: 'var(--gold)', fontWeight: 700 }}>로그인</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>← 홈으로 돌아가기</Link>
        </p>
      </div>
    </div>
  )
}
