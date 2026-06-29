'use client'

import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'

const SUB_MENUS = [
  { label: '인사말', href: '/about' },
  { label: '비전 & 가치', href: '/about/vision' },
  { label: '연혁', href: '/about/history' },
  { label: '오시는 길', href: '/about/map' },
]

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="회사소개"
        subtitle="20년의 경험과 신뢰로 대한민국 건축자재를 이끌어갑니다"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '회사소개' }]}
      />

      <nav style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-100)', position: 'sticky', top: '72px', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex' }}>
          {SUB_MENUS.map(menu => (
            <Link key={menu.href} href={menu.href} style={{
              padding: '16px 24px', fontSize: '0.9rem', fontWeight: 600,
              color: menu.href === '/about' ? 'var(--navy)' : 'var(--gray-500)',
              borderBottom: menu.href === '/about' ? '2px solid var(--gold)' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>{menu.label}</Link>
          ))}
        </div>
      </nav>

      <section className="section-gap">
        <div className="container">
          <div style={{ display: 'flex', gap: '64px', alignItems: 'center', flexWrap: 'wrap' }} className="about-wrap">
            <div style={{ flex: '1 1 360px' }}>
              <div style={{
                width: '100%', aspectRatio: '4/3',
                background: 'linear-gradient(135deg, var(--navy-light), var(--navy))',
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <span style={{ fontSize: '5rem', opacity: 0.3 }}>🏢</span>
                <div style={{
                  position: 'absolute', bottom: '24px', left: '24px', right: '24px',
                  padding: '16px 20px', background: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.3)', borderRadius: '8px',
                }}>
                  <div style={{ color: 'var(--gold)', fontWeight: 800, fontSize: '1.1rem' }}>우드자재닷컴</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '4px' }}>건축자재 전문기업 Since 2004</div>
                </div>
              </div>
            </div>

            <div style={{ flex: '1 1 360px' }}>
              <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(201,168,76,0.1)', borderRadius: '20px', color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '16px' }}>
                GREETING
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '24px', lineHeight: 1.3 }}>
                고객과 함께 성장하는<br /><span style={{ color: 'var(--gold)' }}>건축자재 전문기업</span>
              </h2>
              <div style={{ color: 'var(--gray-700)', lineHeight: 1.9, fontSize: '0.95rem' }}>
                <p style={{ marginBottom: '16px' }}>안녕하십니까. 우드자재닷컴 대표이사 홍길동입니다.</p>
                <p style={{ marginBottom: '16px' }}>저희 우드자재닷컴은 2004년 창사 이래 합성목재 데크, 외장재, 내장재 등 고품질 건축자재를 전국 건설 현장에 공급해 왔습니다. 20년의 경험과 노하우를 바탕으로 고객 여러분의 현장에 최적화된 자재를 추천해 드립니다.</p>
                <p style={{ marginBottom: '16px' }}>품질과 신뢰를 최우선으로, 납기 준수와 철저한 품질관리를 통해 대한민국 건축자재 산업의 발전에 기여하겠습니다.</p>
                <p>앞으로도 지속적인 R&D 투자와 고객 중심 서비스로 여러분의 기대에 부응하는 기업이 되도록 최선을 다하겠습니다.</p>
              </div>
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--gray-100)' }}>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '4px' }}>우드자재닷컴 대표이사</p>
                <p style={{ color: 'var(--navy)', fontSize: '1.4rem', fontWeight: 900, fontStyle: 'italic' }}>홍길동</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '80px', padding: '48px', background: 'var(--navy)', borderRadius: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }} className="stats-grid">
            {[
              { num: '2004', label: '설립연도' },
              { num: '3,000+', label: '납품 현장' },
              { num: '50+', label: '협력 제조사' },
              { num: '20년', label: '업력' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ color: 'var(--gold)', fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>{stat.num}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .about-wrap { flex-direction: column !important; gap: 32px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
