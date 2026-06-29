'use client'

import { useState } from 'react'
import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'
import type { Faq } from '@/types'

export default function FaqClient({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null)
  const [activeCategory, setActiveCategory] = useState('전체')

  const categories = ['전체', ...Array.from(new Set(faqs.map(f => f.category).filter(Boolean) as string[]))]
  const filtered = activeCategory === '전체' ? faqs : faqs.filter(f => f.category === activeCategory)

  return (
    <>
      <PageBanner
        title="FAQ"
        subtitle="자주 묻는 질문들을 모았습니다"
        breadcrumb={[{ label: '홈', href: '/' }, { label: 'FAQ' }]}
      />

      <section className="section-gap">
        <div className="container" style={{ maxWidth: '800px' }}>

          {/* 카테고리 탭 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setActiveCategory(cat); setOpenId(null) }} style={{
                padding: '7px 18px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                background: activeCategory === cat ? 'var(--navy)' : 'var(--white)',
                color: activeCategory === cat ? 'var(--white)' : 'var(--gray-600)',
                border: activeCategory === cat ? '1px solid var(--navy)' : '1px solid var(--gray-200)',
                transition: 'all 0.15s',
              }}>
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>❓</div>
              <p>등록된 FAQ가 없습니다.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filtered.map((faq, i) => {
                const isOpen = openId === faq.id
                return (
                  <div key={faq.id} style={{
                    border: `1px solid ${isOpen ? 'var(--gold)' : 'var(--gray-100)'}`,
                    borderRadius: '10px', overflow: 'hidden', transition: 'border-color 0.2s',
                  }}>
                    {/* 질문 */}
                    <button onClick={() => setOpenId(isOpen ? null : faq.id)} style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '18px 20px', background: isOpen ? 'rgba(201,168,76,0.04)' : 'var(--white)',
                      border: 'none', cursor: 'pointer', textAlign: 'left', gap: '16px',
                      transition: 'background 0.2s',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <span style={{
                          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                          background: isOpen ? 'var(--gold)' : 'var(--gray-100)',
                          color: isOpen ? 'var(--navy)' : 'var(--gray-500)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.2s',
                        }}>Q</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: isOpen ? 700 : 500, color: isOpen ? 'var(--navy)' : 'var(--gray-800)', lineHeight: 1.4 }}>
                          {faq.question}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '1rem', color: isOpen ? 'var(--gold)' : 'var(--gray-400)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s', flexShrink: 0,
                      }}>▼</span>
                    </button>

                    {/* 답변 */}
                    {isOpen && (
                      <div style={{
                        padding: '0 20px 20px 20px',
                        borderTop: '1px solid var(--gray-100)',
                      }}>
                        <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                          <span style={{
                            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                            background: 'var(--navy)', color: 'var(--gold)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 700,
                          }}>A</span>
                          <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.8, paddingTop: '3px' }}>
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* 하단 추가 문의 유도 */}
          <div style={{
            marginTop: '48px', padding: '32px', textAlign: 'center',
            background: 'var(--gray-50)', borderRadius: '16px',
            border: '1px solid var(--gray-100)',
          }}>
            <p style={{ color: 'var(--gray-700)', marginBottom: '16px', fontSize: '0.95rem' }}>
              원하시는 답변을 찾지 못하셨나요?
            </p>
            <Link href="/inquiry" className="btn-primary">1:1 문의하기</Link>
          </div>
        </div>
      </section>
    </>
  )
}
