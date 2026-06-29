'use client'

import Link from 'next/link'
import type { BusinessCard } from '@/types'

export default function BusinessCards({ cards }: { cards: BusinessCard[] }) {
  if (!cards.length) return null

  return (
    <section className="section-gap" style={{ background: 'var(--gray-50)' }}>
      <div className="container">
        <div className="center-heading">
          <h2><strong>사업 안내</strong></h2>
          <div className="accent-line" />
          <p>건축자재 공급의 모든 단계를 책임집니다</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="business-grid">
          {cards.map((card) => (
            <Link key={card.id} href={card.href ?? '#'} style={{ display: 'block' }}>
              <div style={{
                background: 'var(--white)', borderRadius: '10px', padding: '28px 20px',
                border: '1px solid var(--gray-100)', transition: 'all 0.25s', height: '100%',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = '0 8px 24px rgba(10,22,40,0.1)'
                  el.style.borderColor = 'var(--gold)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'none'
                  el.style.boxShadow = 'none'
                  el.style.borderColor = 'var(--gray-100)'
                }}>
                {card.icon && <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{card.icon}</div>}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .business-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .business-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
      `}</style>
    </section>
  )
}
