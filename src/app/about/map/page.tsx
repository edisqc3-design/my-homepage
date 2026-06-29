'use client'

import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'

const SUB_MENUS = [
  { label: '인사말', href: '/about' },
  { label: '비전 & 가치', href: '/about/vision' },
  { label: '연혁', href: '/about/history' },
  { label: '오시는 길', href: '/about/map' },
]

export default function MapPage() {
  return (
    <>
      <PageBanner
        title="오시는 길"
        subtitle="우드자재닷컴을 방문해 주세요"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '회사소개', href: '/about' }, { label: '오시는 길' }]}
      />

      <nav style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-100)', position: 'sticky', top: '72px', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex' }}>
          {SUB_MENUS.map(menu => (
            <Link key={menu.href} href={menu.href} style={{
              padding: '16px 24px', fontSize: '0.9rem', fontWeight: 600,
              color: menu.href === '/about/map' ? 'var(--navy)' : 'var(--gray-500)',
              borderBottom: menu.href === '/about/map' ? '2px solid var(--gold)' : '2px solid transparent',
            }}>
              {menu.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="section-gap">
        <div className="container">
          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }} className="map-wrap">
            {/* 지도 영역 */}
            <div style={{ flex: '1 1 480px' }}>
              <div style={{
                width: '100%', aspectRatio: '4/3',
                background: 'var(--gray-100)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--gray-200)',
                overflow: 'hidden',
              }}>
                {/* 실제 배포 시 카카오맵 또는 구글맵 iframe으로 교체 */}
                <div style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🗺️</div>
                  <p style={{ fontSize: '0.9rem' }}>지도 영역</p>
                  <p style={{ fontSize: '0.78rem', marginTop: '4px', color: 'var(--gray-400)' }}>
                    카카오맵 / 구글맵 iframe 삽입
                  </p>
                </div>
              </div>
            </div>

            {/* 교통 정보 */}
            <div style={{ flex: '1 1 300px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '32px' }}>
                찾아오시는 방법
              </h2>

              {[
                {
                  icon: '📍',
                  title: '주소',
                  lines: ['경기도 ○○시 ○○구 ○○로 123', '우드자재닷컴 빌딩 3층'],
                },
                {
                  icon: '🚇',
                  title: '지하철',
                  lines: ['○○선 ○○역 1번 출구', '도보 5분 거리'],
                },
                {
                  icon: '🚌',
                  title: '버스',
                  lines: ['○○번, ○○번, ○○번 버스', '○○정류장 하차 후 도보 2분'],
                },
                {
                  icon: '🚗',
                  title: '자가용',
                  lines: ['○○고속도로 ○○IC 진출 후 10분', '건물 내 주차 가능 (2시간 무료)'],
                },
                {
                  icon: '📞',
                  title: '문의',
                  lines: ['02-0000-0000', '평일 09:00 ~ 18:00'],
                },
              ].map((info, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '16px',
                  padding: '16px 0',
                  borderBottom: '1px solid var(--gray-100)',
                }}>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '2px' }}>{info.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem', marginBottom: '4px' }}>{info.title}</p>
                    {info.lines.map((line, j) => (
                      <p key={j} style={{ color: 'var(--gray-700)', fontSize: '0.875rem', lineHeight: 1.6 }}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .map-wrap { flex-direction: column !important; }
        }
      `}</style>
    </>
  )
}
