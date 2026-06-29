'use client'

import Link from 'next/link'

const SUPPORT_ITEMS = [
  { icon: '📞', label: '전화 상담', href: 'tel:02-0000-0000' },
  { icon: '🖼️', label: '시공 사례', href: '/gallery' },
  { icon: '✏️', label: '1:1 문의', href: '/inquiry' },
  { icon: '❓', label: 'FAQ', href: '/faq' },
]

export default function CustomerSupport({ settings }: { settings: Record<string, string> }) {
  const phone = settings.phone ?? '02-0000-0000'
  const hours = settings.business_hours ?? 'AM 09:00 ~ PM 06:00'
  const lunch = settings.lunch_hours ?? 'PM 12:00 ~ PM 01:00'

  return (
    <section className="section-gap-sm">
      <div className="container">
        <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch', flexWrap: 'wrap' }} className="support-wrap">
          <div style={{
            flex: '1 1 300px', background: 'var(--navy)', borderRadius: '12px',
            padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <h2 style={{ color: 'var(--white)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>
              고객센터 이용안내
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '0.9rem' }}>
              영업시간 : {hours}<br />
              점심시간 : {lunch}<br />
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>토 · 일 · 공휴일 휴무</span>
            </p>
            <div style={{ marginTop: '20px' }}>
              <a href={`tel:${phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontWeight: 700, fontSize: '1.2rem' }}>
                📞 {phone}
              </a>
            </div>
          </div>

          <div style={{ flex: '2 1 500px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="support-icons">
            {SUPPORT_ITEMS.map(item => (
              <Link key={item.label} href={item.href} style={{ display: 'block' }}>
                <div style={{
                  border: '1px solid var(--gray-200)', borderRadius: '10px',
                  padding: '28px 16px', textAlign: 'center', transition: 'all 0.2s', background: 'var(--white)',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.background = 'var(--navy)'
                    el.style.borderColor = 'var(--navy)'
                    el.style.transform = 'translateY(-3px)'
                    el.style.boxShadow = '0 6px 20px rgba(10,22,40,0.15)'
                    const label = el.querySelector('.s-label') as HTMLElement
                    if (label) label.style.color = 'var(--white)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.background = 'var(--white)'
                    el.style.borderColor = 'var(--gray-200)'
                    el.style.transform = 'none'
                    el.style.boxShadow = 'none'
                    const label = el.querySelector('.s-label') as HTMLElement
                    if (label) label.style.color = 'var(--gray-700)'
                  }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{item.icon}</div>
                  <div className="s-label" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gray-700)', transition: 'color 0.2s' }}>
                    {item.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 600px) { .support-icons { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  )
}
