'use client'

import { useState } from 'react'
import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'
import { logout } from '@/lib/auth-actions'
import type { Inquiry } from '@/types'

type Props = {
  user: { name: string; email: string }
  inquiries: Inquiry[]
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: '답변 대기', color: '#b45309', bg: '#fef3c7' },
  done:    { label: '답변 완료', color: '#166534', bg: '#dcfce7' },
}

const TABS = ['내 정보', '문의 내역']

export default function MypageClient({ user, inquiries }: Props) {
  const [activeTab, setActiveTab] = useState('내 정보')
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <>
      <PageBanner
        title="마이페이지"
        subtitle="내 계정 정보와 문의 내역을 확인하세요"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '마이페이지' }]}
      />

      <section className="section-gap">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }} className="mypage-wrap">

            {/* 좌측 사이드바 */}
            <div style={{ flex: '0 0 220px' }} className="mypage-sidebar">
              {/* 유저 카드 */}
              <div style={{
                background: 'var(--navy)', borderRadius: '16px',
                padding: '28px 24px', marginBottom: '16px', textAlign: 'center',
              }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: 'var(--gold)', margin: '0 auto 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 900, color: 'var(--navy)',
                }}>
                  {user.name[0]}
                </div>
                <p style={{ color: 'var(--white)', fontWeight: 700, marginBottom: '4px' }}>{user.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{user.email}</p>
              </div>

              {/* 탭 메뉴 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    padding: '11px 16px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600,
                    background: activeTab === tab ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: activeTab === tab ? 'var(--navy)' : 'var(--gray-600)',
                    borderLeft: activeTab === tab ? '3px solid var(--gold)' : '3px solid transparent',
                    transition: 'all 0.15s',
                  }}>
                    {tab === '내 정보' ? '👤 ' : '📋 '}{tab}
                  </button>
                ))}
              </div>

              {/* 로그아웃 */}
              <button onClick={() => logout()} style={{
                width: '100%', padding: '10px', borderRadius: '8px',
                border: '1px solid var(--gray-200)', background: 'transparent',
                color: 'var(--gray-600)', fontSize: '0.875rem', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget.style.background = '#fff5f5')
                  ;(e.currentTarget.style.color = '#e63946')
                  ;(e.currentTarget.style.borderColor = '#fecaca')
                }}
                onMouseLeave={e => {
                  (e.currentTarget.style.background = 'transparent')
                  ;(e.currentTarget.style.color = 'var(--gray-600)')
                  ;(e.currentTarget.style.borderColor = 'var(--gray-200)')
                }}>
                로그아웃
              </button>
            </div>

            {/* 우측 컨텐츠 */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* 내 정보 탭 */}
              {activeTab === '내 정보' && (
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '20px' }}>
                    내 정보
                  </h2>
                  <div style={{ border: '1px solid var(--gray-100)', borderRadius: '12px', overflow: 'hidden' }}>
                    {[
                      { label: '이름', value: user.name },
                      { label: '이메일', value: user.email },
                      { label: '문의 건수', value: `${inquiries.length}건` },
                      { label: '답변 완료', value: `${inquiries.filter(i => i.status === 'done').length}건` },
                    ].map((row, i) => (
                      <div key={row.label} style={{
                        display: 'flex', padding: '16px 20px',
                        borderTop: i > 0 ? '1px solid var(--gray-100)' : 'none',
                        alignItems: 'center',
                      }}>
                        <span style={{ width: '120px', color: 'var(--gray-500)', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0 }}>
                          {row.label}
                        </span>
                        <span style={{ color: 'var(--gray-900)', fontSize: '0.9rem' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 바로가기 */}
                  <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <Link href="/inquiry" className="btn-primary">새 문의하기</Link>
                    <Link href="/products" className="btn-outline-gold">제품 보기</Link>
                  </div>
                </div>
              )}

              {/* 문의 내역 탭 */}
              {activeTab === '문의 내역' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)' }}>
                      문의 내역
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                      총 {inquiries.length}건
                    </span>
                  </div>

                  {inquiries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-500)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
                      <p style={{ marginBottom: '20px' }}>문의 내역이 없습니다.</p>
                      <Link href="/inquiry" className="btn-primary">문의하기</Link>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {inquiries.map(inq => {
                        const isOpen = openId === inq.id
                        const st = STATUS_LABEL[inq.status] ?? STATUS_LABEL.pending
                        return (
                          <div key={inq.id} style={{
                            border: `1px solid ${isOpen ? 'var(--gold)' : 'var(--gray-100)'}`,
                            borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.2s',
                          }}>
                            <button onClick={() => setOpenId(isOpen ? null : inq.id)} style={{
                              width: '100%', display: 'flex', justifyContent: 'space-between',
                              alignItems: 'center', padding: '14px 16px',
                              background: isOpen ? 'rgba(201,168,76,0.04)' : 'var(--white)',
                              border: 'none', cursor: 'pointer', textAlign: 'left', gap: '12px',
                            }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                  <span style={{ padding: '2px 8px', background: 'rgba(10,22,40,0.08)', color: 'var(--navy)', fontSize: '0.72rem', fontWeight: 700, borderRadius: '10px' }}>
                                    {inq.category}
                                  </span>
                                  <span style={{ padding: '2px 8px', background: st.bg, color: st.color, fontSize: '0.72rem', fontWeight: 700, borderRadius: '10px' }}>
                                    {st.label}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {inq.content.slice(0, 40)}{inq.content.length > 40 ? '...' : ''}
                                </p>
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{inq.created_at.slice(0, 10)}</p>
                                <span style={{ color: isOpen ? 'var(--gold)' : 'var(--gray-400)', fontSize: '0.8rem' }}>
                                  {isOpen ? '▲' : '▼'}
                                </span>
                              </div>
                            </button>

                            {isOpen && (
                              <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--gray-100)' }}>
                                {/* 문의 내용 */}
                                <div style={{ paddingTop: '14px', marginBottom: '14px' }}>
                                  <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '6px' }}>문의 내용</p>
                                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-800)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                    {inq.content}
                                  </p>
                                </div>

                                {/* 답변 */}
                                {inq.admin_reply && (
                                  <div style={{ padding: '14px', background: 'var(--gray-50)', borderRadius: '8px', borderLeft: '3px solid var(--gold)' }}>
                                    <p style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '6px' }}>
                                      ✅ 답변 ({inq.replied_at?.slice(0, 10)})
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-800)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                                      {inq.admin_reply}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .mypage-wrap { flex-direction: column !important; }
          .mypage-sidebar { flex: none !important; width: 100% !important; }
        }
      `}</style>
    </>
  )
}
