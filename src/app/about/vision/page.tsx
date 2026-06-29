'use client'

import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'

const SUB_MENUS = [
  { label: '인사말', href: '/about' },
  { label: '비전 & 가치', href: '/about/vision' },
  { label: '연혁', href: '/about/history' },
  { label: '오시는 길', href: '/about/map' },
]

const VALUES = [
  { icon: '🎯', title: '고객 중심', desc: '모든 결정의 기준은 고객입니다. 고객의 현장 환경과 예산에 최적화된 솔루션을 제공합니다.' },
  { icon: '🌿', title: '친환경', desc: '지속 가능한 미래를 위해 환경부 인증 친환경 자재만을 엄선하여 공급합니다.' },
  { icon: '🏆', title: '품질 우선', desc: 'KS 인증 및 자체 품질 검사를 통해 단 한 건의 불량도 납품하지 않겠습니다.' },
  { icon: '🤝', title: '신뢰 경영', desc: '납기 준수, 투명한 가격, 정직한 소통으로 20년간 신뢰를 쌓아왔습니다.' },
  { icon: '💡', title: '혁신', desc: '끊임없는 R&D 투자와 신제품 개발로 건축자재 산업의 트렌드를 선도합니다.' },
  { icon: '👥', title: '상생', desc: '협력사, 시공사, 건설사 모두가 함께 성장하는 상생의 생태계를 만들어갑니다.' },
]

export default function VisionPage() {
  return (
    <>
      <PageBanner
        title="비전 & 가치"
        subtitle="지속 가능한 건축자재 산업의 미래를 만들어갑니다"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '회사소개', href: '/about' }, { label: '비전 & 가치' }]}
      />

      <nav style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-100)', position: 'sticky', top: '72px', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex' }}>
          {SUB_MENUS.map(menu => (
            <Link key={menu.href} href={menu.href} style={{
              padding: '16px 24px', fontSize: '0.9rem', fontWeight: 600,
              color: menu.href === '/about/vision' ? 'var(--navy)' : 'var(--gray-500)',
              borderBottom: menu.href === '/about/vision' ? '2px solid var(--gold)' : '2px solid transparent',
            }}>
              {menu.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="section-gap">
        <div className="container">
          {/* 비전 선언 */}
          <div style={{
            textAlign: 'center', padding: '56px 40px',
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
            borderRadius: '20px', marginBottom: '80px',
          }}>
            <div style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.15em', marginBottom: '16px' }}>
              OUR VISION
            </div>
            <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, lineHeight: 1.4 }}>
              "대한민국 건축자재 산업의 <span style={{ color: 'var(--gold)' }}>새로운 기준</span>을 만드는<br />
              가장 신뢰받는 파트너"
            </h2>
          </div>

          {/* 미션 */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '12px' }}>핵심 가치</h2>
            <div style={{ width: '48px', height: '3px', background: 'var(--gold)', margin: '0 auto 16px', borderRadius: '2px' }} />
            <p style={{ color: 'var(--gray-700)' }}>우드자재닷컴이 지켜온 6가지 핵심 가치입니다</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="values-grid">
            {VALUES.map((v, i) => (
              <div key={i} style={{
                padding: '36px 28px',
                border: '1px solid var(--gray-100)',
                borderRadius: '12px',
                background: 'var(--white)',
                transition: 'all 0.25s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'var(--gold)'
                  el.style.boxShadow = '0 8px 24px rgba(201,168,76,0.1)'
                  el.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'var(--gray-100)'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'none'
                }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{v.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '10px' }}>{v.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .values-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .values-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
