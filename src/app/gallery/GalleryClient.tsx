'use client'

import { useEffect, useState } from 'react'
import PageBanner from '@/components/ui/PageBanner'
import Image from 'next/image'
import Link from 'next/link'
import type { GalleryItem } from '@/types'

const CATEGORIES = ['전체', '상업시설', '주거시설', '공공시설']
const CATEGORY_COLORS: Record<string, string> = {
  '상업시설': '#0077b6', '주거시설': '#2d6a4f', '공공시설': '#6a3d9a',
}

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60 * index)
    return () => clearTimeout(t)
  }, [index])

  return (
    <Link href={`/gallery/${item.id}`} style={{ display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: '14px', overflow: 'hidden',
          border: '1px solid var(--gray-100)',
          background: 'var(--white)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out, box-shadow 0.3s, border-color 0.3s',
          boxShadow: hovered ? '0 20px 40px -12px rgba(10,22,40,0.22)' : '0 1px 3px rgba(10,22,40,0.04)',
          borderColor: hovered ? 'rgba(201,168,76,0.4)' : 'var(--gray-100)',
        }}
      >
        {/* 이미지 영역 */}
        <div style={{ width: '100%', height: '220px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--navy-light), var(--navy))' }}>
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
              <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>🪵</span>
            </div>
          )}

          {/* 하단 그라데이션 + 호버 시 진하게 */}
          <div style={{
            position: 'absolute', inset: 0,
            background: hovered
              ? 'linear-gradient(to top, rgba(10,22,40,0.78) 0%, rgba(10,22,40,0.15) 45%, transparent 70%)'
              : 'linear-gradient(to top, rgba(10,22,40,0.35) 0%, transparent 55%)',
            transition: 'background 0.35s',
          }} />

          {/* 카테고리 배지 */}
          {item.category && (
            <span style={{
              position: 'absolute', top: '12px', left: '12px',
              padding: '4px 12px',
              background: CATEGORY_COLORS[item.category] ?? '#555',
              color: 'white', fontSize: '0.7rem', fontWeight: 700,
              borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              letterSpacing: '0.02em',
            }}>
              {item.category}
            </span>
          )}

          {/* 호버 시 "자세히 보기" */}
          <div style={{
            position: 'absolute', bottom: '14px', left: '16px', right: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: 'var(--white)',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.3s, transform 0.3s',
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
              자세히 보기
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
            <span style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'var(--gold)', color: 'var(--navy)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
          </div>
        </div>

        {/* 본문 */}
        <div style={{ padding: '16px 18px 18px' }}>
          <h3 style={{
            fontSize: '0.92rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px',
            lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', transition: 'color 0.25s',
            ...(hovered ? { color: '#b45309' } : {}),
          } as React.CSSProperties}>
            {item.title}
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            {item.project_date ?? item.created_at.slice(0, 10)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function GalleryClient({ items, activeCategory }: { items: GalleryItem[], activeCategory: string }) {
  return (
    <>
      <PageBanner
        title="시공 사례"
        subtitle="전국 다양한 현장의 시공 실적을 확인하세요"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '시공사례' }]}
      />

      <section className="section-gap">
        <div className="container">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat || (!activeCategory && cat === '전체')
              return (
                <Link key={cat}
                  href={cat === '전체' ? '/gallery' : `/gallery?category=${cat}`}
                  style={{
                    padding: '8px 20px', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 600,
                    background: isActive ? 'var(--navy)' : 'var(--white)',
                    color: isActive ? 'var(--white)' : 'var(--gray-700)',
                    border: isActive ? '1px solid var(--navy)' : '1px solid var(--gray-300)',
                    transition: 'all 0.2s',
                  }}>
                  {cat}
                </Link>
              )
            })}
            <span style={{ marginLeft: 'auto', color: 'var(--gray-500)', fontSize: '0.85rem' }}>
              총 {items.length}건
            </span>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏗️</div>
              <p>등록된 시공사례가 없습니다.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '22px' }} className="gallery-grid">
              {items.map((item, i) => (
                <GalleryCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
      `}</style>
    </>
  )
}
