'use client'

import PageBanner from '@/components/ui/PageBanner'
import Image from 'next/image'
import Link from 'next/link'
import type { GalleryItem } from '@/types'

const CATEGORIES = ['전체', '상업시설', '주거시설', '공공시설']
const CATEGORY_COLORS: Record<string, string> = {
  '상업시설': '#0077b6', '주거시설': '#2d6a4f', '공공시설': '#6a3d9a',
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="gallery-grid">
              {items.map(item => (
                <Link key={item.id} href={`/gallery/${item.id}`} style={{ display: 'block' }}>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--gray-100)', transition: 'all 0.25s', background: 'var(--white)' }}
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
                    <div style={{ width: '100%', height: '200px', position: 'relative', background: 'linear-gradient(135deg, var(--navy-light), var(--navy))' }}>
                      {item.image_url
                        ? <Image src={item.image_url} alt={item.title} fill style={{ objectFit: 'cover' }} />
                        : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><span style={{ fontSize: '2.5rem', opacity: 0.3 }}>🪵</span></div>
                      }
                      {item.category && (
                        <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '3px 10px', background: CATEGORY_COLORS[item.category] ?? '#555', color: 'white', fontSize: '0.7rem', fontWeight: 700, borderRadius: '12px' }}>
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {item.project_date ?? item.created_at.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                </Link>
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
