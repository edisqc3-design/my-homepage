'use client'

import { useState } from 'react'
import PageBanner from '@/components/ui/PageBanner'
import { submitInquiry } from '@/lib/actions'

const CATEGORIES = ['제품문의', '견적문의', '납품문의', '샘플신청', '기타']

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1px solid var(--gray-200)', borderRadius: '8px',
  fontSize: '0.9rem', color: 'var(--gray-900)',
  background: 'var(--white)', outline: 'none',
  transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.875rem',
  fontWeight: 600, color: 'var(--navy)', marginBottom: '6px',
}

export default function InquiryClient() {
  const [form, setForm] = useState({
    name: '', company: '', phone: '', email: '', category: '제품문의', content: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.content.trim()) {
      setErrorMsg('이름, 연락처, 문의내용은 필수 항목입니다.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    const result = await submitInquiry({
      name: form.name, company: form.company, phone: form.phone,
      email: form.email, category: form.category, content: form.content,
    })
    if (result.success) {
      setStatus('success')
      setForm({ name: '', company: '', phone: '', email: '', category: '제품문의', content: '' })
    } else {
      setErrorMsg(result.error ?? '오류가 발생했습니다.')
      setStatus('error')
    }
  }

  return (
    <>
      <PageBanner
        title="1:1 문의"
        subtitle="궁금하신 사항을 남겨주시면 빠르게 답변드립니다"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '1:1 문의' }]}
      />

      <section className="section-gap">
        <div className="container">
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }} className="inquiry-wrap">

            {/* 좌측 안내 */}
            <div style={{ flex: '1 1 260px' }}>
              <div style={{ background: 'var(--navy)', borderRadius: '16px', padding: '32px 28px', marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--white)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>
                  문의 안내
                </h3>
                {[
                  { icon: '📞', title: '전화 상담', desc: '02-0000-0000\n평일 09:00 ~ 18:00' },
                  { icon: '✉', title: '이메일', desc: 'info@woodjajae.co.kr' },
                  { icon: '⏱', title: '답변 시간', desc: '영업일 기준 24시간 이내' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i < 2 ? '20px' : '0' }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <p style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '3px' }}>{item.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 카테고리 안내 */}
              <div style={{ background: 'var(--gray-50)', borderRadius: '12px', padding: '20px 24px', border: '1px solid var(--gray-100)' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>문의 유형</h4>
                {CATEGORIES.map(cat => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-700)' }}>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 우측 폼 */}
            <div style={{ flex: '2 1 400px' }}>
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>✅</div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px' }}>
                    문의가 접수되었습니다
                  </h2>
                  <p style={{ color: 'var(--gray-700)', lineHeight: 1.7, marginBottom: '32px' }}>
                    영업일 기준 24시간 이내에 답변드리겠습니다.<br />
                    입력하신 연락처로 연락드릴 예정입니다.
                  </p>
                  <button onClick={() => setStatus('idle')} className="btn-primary">
                    추가 문의하기
                  </button>
                </div>
              ) : (
                <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: '16px', padding: '36px 32px' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '28px' }}>
                    문의 내용을 입력해 주세요
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="form-grid">
                    <div>
                      <label style={labelStyle}>이름 <span style={{ color: '#e63946' }}>*</span></label>
                      <input name="name" value={form.name} onChange={handleChange}
                        placeholder="홍길동" style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>회사명</label>
                      <input name="company" value={form.company} onChange={handleChange}
                        placeholder="(주)○○건설" style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>연락처 <span style={{ color: '#e63946' }}>*</span></label>
                      <input name="phone" value={form.phone} onChange={handleChange}
                        placeholder="010-0000-0000" style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')} />
                    </div>
                    <div>
                      <label style={labelStyle}>이메일</label>
                      <input name="email" value={form.email} onChange={handleChange}
                        placeholder="example@company.co.kr" style={inputStyle}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={labelStyle}>문의 유형 <span style={{ color: '#e63946' }}>*</span></label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setForm(p => ({ ...p, category: cat }))} style={{
                          padding: '7px 16px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                          background: form.category === cat ? 'var(--navy)' : 'var(--white)',
                          color: form.category === cat ? 'var(--white)' : 'var(--gray-600)',
                          border: form.category === cat ? '1px solid var(--navy)' : '1px solid var(--gray-200)',
                          transition: 'all 0.15s',
                        }}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>문의 내용 <span style={{ color: '#e63946' }}>*</span></label>
                    <textarea name="content" value={form.content} onChange={handleChange}
                      placeholder="문의하실 내용을 자세히 입력해 주세요. (현장 위치, 수량, 원하시는 제품 등)"
                      rows={6} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                      onBlur={e => (e.currentTarget.style.borderColor = 'var(--gray-200)')} />
                  </div>

                  {status === 'error' && (
                    <div style={{ padding: '12px 16px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '16px', color: '#e63946', fontSize: '0.875rem' }}>
                      {errorMsg}
                    </div>
                  )}

                  <button onClick={handleSubmit} disabled={status === 'loading'} className="btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '1rem', opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
                    {status === 'loading' ? '접수 중...' : '문의 접수하기'}
                  </button>

                  <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                    입력하신 정보는 문의 처리 목적으로만 사용됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .inquiry-wrap { flex-direction: column !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
