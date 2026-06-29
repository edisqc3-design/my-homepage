'use client'

import Link from 'next/link'

export default function CtaBanner() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 50%, var(--navy) 100%)',
      padding: '80px 24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 배경 장식 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 50%),
                          radial-gradient(circle at 80% 50%, rgba(201,168,76,0.06) 0%, transparent 50%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-block',
          padding: '5px 16px',
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '20px',
          color: 'var(--gold)',
          fontSize: '0.78rem', fontWeight: 700,
          letterSpacing: '0.1em',
          marginBottom: '20px',
        }}>
          ONLINE INQUIRY
        </div>

        <h2 style={{
          color: 'var(--white)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
          fontWeight: 900, marginBottom: '16px', lineHeight: 1.3,
        }}>
          지금 바로 <span style={{ color: 'var(--gold)' }}>무료 견적</span>을 받아보세요
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: '1rem', lineHeight: 1.7,
          marginBottom: '36px',
        }}>
          현장 조건에 맞는 자재 추천부터 견적까지 — 영업일 기준 24시간 내 답변드립니다.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/inquiry" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
            온라인 문의하기
          </Link>
          <Link href="/download" className="btn-outline" style={{ fontSize: '1rem', padding: '13px 32px' }}>
            카탈로그 다운로드
          </Link>
        </div>

        {/* 하단 통계 */}
        <div style={{
          display: 'flex', gap: '48px', justifyContent: 'center',
          marginTop: '56px', flexWrap: 'wrap',
        }}>
          {[
            { num: '20년', label: '업력' },
            { num: '3,000+', label: '납품 현장' },
            { num: '50+', label: '협력 제조사' },
            { num: '24h', label: '견적 응답 시간' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--gold)', fontSize: '1.8rem', fontWeight: 900 }}>{stat.num}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
