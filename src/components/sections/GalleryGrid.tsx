'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { GalleryItem } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  '상업시설': '#0077b6',
  '주거시설': '#2d6a4f',
  '공공시설': '#6a3d9a',
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  if (!items.length) return null

  return (
    <section className="section-gap">
      <div className="container">
        <div className="center-heading">
          <h2>시공 사례</h2>
          <div className="accent-line" />
          <p>전국 다양한 현장의 시공 실적을 확인하세요</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="gallery-grid">
          {items.map(item => (
            <Link key={item.id} href={`/gallery/${item.id}`} style={{ display: 'block' }}>
              <div style={{
                borderRadius: '10px', overflow: 'hidden',
                border: '1px solid var(--gray-100)', transition: 'all 0.25s', background: 'var(--white)',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = '0 8px 24px rgba(10,22,40,0.12)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'none'
                  el.style.boxShadow = 'none'
                }}>
                {/* 이미지 */}
                <div style={{ width: '100%', height: '180px', position: 'relative', background: 'linear-gradient(135deg, var(--navy-light) 0%, var(--navy) 100%)' }}>
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>🪵</span>
                    </div>
                  )}
                  {item.category && (
                    <span style={{
                      position: 'absolute', top: '12px', left: '12px',
                      padding: '3px 10px',
                      background: CATEGORY_COLORS[item.category] ?? '#555',
                      color: 'white', fontSize: '0.7rem', fontWeight: 700, borderRadius: '12px',
                    }}>
                      {item.category}
                    </span>
                  )}
                </div>

                {/* 텍스트 */}
                <div style={{ padding: '14px 16px' }}>
                  <h4 style={{
                    fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)',
                    marginBottom: '8px', lineHeight: 1.4,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  } as React.CSSProperties}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                    {item.project_date ?? item.created_at.slice(0, 10)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/gallery" className="btn-outline-gold">시공사례 전체보기</Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
      `}</style>
    </section>
  )
}
