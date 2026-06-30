'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { GalleryItem } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  '상업시설': '#0077b6',
  '주거시설': '#2d6a4f',
  '공공시설': '#6a3d9a',
}

function GalleryCard({ item }: { item: GalleryItem }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/gallery/${item.id}`} style={{ display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: '14px', overflow: 'hidden',
          border: '1px solid var(--gray-100)', background: 'var(--white)',
          transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.3s',
          boxShadow: hovered ? '0 20px 40px -12px rgba(10,22,40,0.22)' : '0 1px 3px rgba(10,22,40,0.04)',
          borderColor: hovered ? 'rgba(201,168,76,0.4)' : 'var(--gray-100)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {/* 이미지 */}
        <div style={{ width: '100%', height: '180px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--navy-light) 0%, var(--navy) 100%)' }}>
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              style={{
                objectFit: 'cover',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>🪵</span>
            </div>
          )}

          <div style={{
            position: 'absolute', inset: 0,
            background: hovered
              ? 'linear-gradient(to top, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.1) 45%, transparent 70%)'
              : 'linear-gradient(to top, rgba(10,22,40,0.3) 0%, transparent 55%)',
            transition: 'background 0.35s',
          }} />

          {item.category && (
            <span style={{
              position: 'absolute', top: '12px', left: '12px',
              padding: '4px 11px',
              background: CATEGORY_COLORS[item.category] ?? '#555',
              color: 'white', fontSize: '0.7rem', fontWeight: 700, borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}>
              {item.category}
            </span>
          )}

          <div style={{
            position: 'absolute', bottom: '12px', left: '14px', right: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--white)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.3s, transform 0.3s',
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              자세히 보기
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </span>
          </div>
        </div>

        {/* 텍스트 */}
        <div style={{ padding: '14px 16px' }}>
          <h4 style={{
            fontSize: '0.9rem', fontWeight: 700, color: hovered ? '#b45309' : 'var(--navy)',
            marginBottom: '8px', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            transition: 'color 0.25s',
          } as React.CSSProperties}>
            {item.title}
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
            {item.project_date ?? item.created_at.slice(0, 10)}
          </p>
        </div>
      </div>
    </Link>
  )
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
          {items.map(item => <GalleryCard key={item.id} item={item} />)}
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
