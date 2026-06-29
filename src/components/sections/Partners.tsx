'use client'

import Image from 'next/image'
import type { Partner } from '@/types'

export default function Partners({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null

  return (
    <section className="section-gap-sm" style={{ background: 'var(--gray-50)', borderTop: '1px solid var(--gray-100)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em' }}>
            TRUSTED BY LEADING COMPANIES
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', alignItems: 'center' }} className="partners-grid">
          {partners.map(partner => (
            <div key={partner.id} style={{
              background: 'var(--white)', border: '1px solid var(--gray-200)',
              borderRadius: '8px', padding: '16px 12px', textAlign: 'center', transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--gold)'
                el.style.boxShadow = '0 4px 12px rgba(201,168,76,0.15)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'var(--gray-200)'
                el.style.boxShadow = 'none'
              }}>
              {partner.logo_url ? (
                <div style={{ position: 'relative', height: '40px' }}>
                  <Image src={partner.logo_url} alt={partner.name} fill style={{ objectFit: 'contain' }} />
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)' }}>
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .partners-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        @media (max-width: 480px) { .partners-grid { grid-template-columns: repeat(3, 1fr) !important; } }
      `}</style>
    </section>
  )
}
