'use client'

import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'

const SUB_MENUS = [
  { label: '인사말', href: '/about' },
  { label: '비전 & 가치', href: '/about/vision' },
  { label: '연혁', href: '/about/history' },
  { label: '오시는 길', href: '/about/map' },
]

const HISTORY = [
  {
    year: '2024',
    items: ['합성목재 신제품 라인 출시 (UV+ 시리즈)', '전국 대리점 50개소 돌파', '환경부 친환경 인증 취득'],
  },
  {
    year: '2022',
    items: ['B2B 온라인 플랫폼 구축', '납품 현장 3,000건 달성', '협력 제조사 50개사 계약'],
  },
  {
    year: '2020',
    items: ['합성목재 자체 브랜드 론칭', '공공기관 납품 계약 체결', 'ISO 9001 품질경영시스템 인증'],
  },
  {
    year: '2018',
    items: ['외장재·내장재 사업 부문 확장', '수도권 물류센터 확장 이전', '연 매출 50억 달성'],
  },
  {
    year: '2015',
    items: ['KS 인증 제품 라인 확대', '전국 배송 인프라 구축', '기업부설 연구소 설립'],
  },
  {
    year: '2010',
    items: ['합성목재 데크 전문 사업 시작', '첫 대형 건설사 납품 계약', '직원 20명 규모 성장'],
  },
  {
    year: '2004',
    items: ['우드자재닷컴 창립', '경기도 ○○시 사무소 개소', '건축자재 유통업 사업 시작'],
  },
]

export default function HistoryPage() {
  return (
    <>
      <PageBanner
        title="연혁"
        subtitle="20년의 도전과 성장의 역사"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '회사소개', href: '/about' }, { label: '연혁' }]}
      />

      <nav style={{ background: 'var(--white)', borderBottom: '1px solid var(--gray-100)', position: 'sticky', top: '72px', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex' }}>
          {SUB_MENUS.map(menu => (
            <Link key={menu.href} href={menu.href} style={{
              padding: '16px 24px', fontSize: '0.9rem', fontWeight: 600,
              color: menu.href === '/about/history' ? 'var(--navy)' : 'var(--gray-500)',
              borderBottom: menu.href === '/about/history' ? '2px solid var(--gold)' : '2px solid transparent',
            }}>
              {menu.label}
            </Link>
          ))}
        </div>
      </nav>

      <section className="section-gap">
        <div className="container">
          <div style={{ maxWidth: '760px', margin: '0 auto', position: 'relative' }}>
            {/* 세로 라인 */}
            <div style={{
              position: 'absolute', left: '100px', top: 0, bottom: 0,
              width: '2px', background: 'var(--gray-100)',
            }} />

            {HISTORY.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '40px', marginBottom: '48px', position: 'relative' }}>
                {/* 연도 */}
                <div style={{ width: '80px', flexShrink: 0, textAlign: 'right', paddingTop: '4px' }}>
                  <span style={{ color: 'var(--navy)', fontWeight: 900, fontSize: '1.1rem' }}>{item.year}</span>
                </div>

                {/* 도트 */}
                <div style={{
                  position: 'absolute', left: '96px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: i === 0 ? 'var(--gold)' : 'var(--gray-300)',
                  border: i === 0 ? '3px solid var(--gold-light)' : '3px solid var(--gray-100)',
                  top: '6px', zIndex: 1,
                }} />

                {/* 내용 */}
                <div style={{
                  flex: 1, paddingLeft: '20px',
                  background: i === 0 ? 'var(--navy)' : 'var(--gray-50)',
                  borderRadius: '10px', padding: '20px 24px',
                  border: i === 0 ? 'none' : '1px solid var(--gray-100)',
                }}>
                  <ul style={{ listStyle: 'none' }}>
                    {item.items.map((text, j) => (
                      <li key={j} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: j > 0 ? '8px 0 0' : '0',
                        borderTop: j > 0 ? `1px solid ${i === 0 ? 'rgba(255,255,255,0.1)' : 'var(--gray-100)'}` : 'none',
                        marginTop: j > 0 ? '8px' : '0',
                      }}>
                        <span style={{ color: 'var(--gold)', fontSize: '0.8rem', marginTop: '3px', flexShrink: 0 }}>◆</span>
                        <span style={{
                          fontSize: '0.9rem', lineHeight: 1.6,
                          color: i === 0 ? 'rgba(255,255,255,0.9)' : 'var(--gray-700)',
                        }}>
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
