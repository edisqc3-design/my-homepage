'use client'

import PageBanner from '@/components/ui/PageBanner'
import Image from 'next/image'
import Link from 'next/link'
import type { GalleryItem } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  '상업시설': '#0077b6', '주거시설': '#2d6a4f', '공공시설': '#6a3d9a',
}

export default function GalleryDetailClient({ item, related }: { item: GalleryItem, related: GalleryItem[] }) {
  return (
    <>
      <PageBanner
        title={item.title}
        breadcrumb={[
          { label: '홈', href: '/' },
          { label: '시공사례', href: '/gallery' },
          { label: item.category ?? '전체', href: `/gallery?category=${item.category}` },
          { label: item.title },
        ]}
      />

      <section className="section-gap">
        <div className="container">
          <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }} className="detail-wrap">
            <div style={{ flex: '1 1 480px' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative', background: 'linear-gradient(135deg, var(--navy-light), var(--navy))', borderRadius: '16px', overflow: 'hidden' }}>
                {item.image_url
                  ? <Image src={item.image_url} alt={item.title} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><span style={{ fontSize: '5rem', opacity: 0.3 }}>🏗️</span></div>
                }
              </div>
            </div>

            <div style={{ flex: '1 1 300px' }}>
              {item.category && (
                <span style={{ display: 'inline-block', padding: '4px 12px', background: CATEGORY_COLORS[item.category] ?? '#555', color: 'white', fontSize: '0.75rem', fontWeight: 700, borderRadius: '12px', marginBottom: '16px' }}>
                  {item.category}
                </span>
              )}
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '24px', lineHeight: 1.3 }}>
                {item.title}
              </h1>

              <div style={{ borderTop: '1px solid var(--gray-100)', borderBottom: '1px solid var(--gray-100)', padding: '20px 0', marginBottom: '24px' }}>
                {[
                  { label: '시공 분류', value: item.category ?? '-' },
                  { label: '시공 일자', value: item.project_date ?? '-' },
                  { label: '등록일', value: item.created_at.slice(0, 10) },
                ].map(meta => (
                  <div key={meta.label} style={{ display: 'flex', gap: '16px', padding: '8px 0' }}>
                    <span style={{ width: '80px', color: 'var(--gray-500)', fontSize: '0.875rem', flexShrink: 0 }}>{meta.label}</span>
                    <span style={{ color: 'var(--gray-900)', fontSize: '0.875rem', fontWeight: 600 }}>{meta.value}</span>
                  </div>
                ))}
              </div>

              {item.description && (
                <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '32px' }}>
                  {item.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/inquiry" className="btn-primary">견적 문의하기</Link>
                <Link href="/gallery" className="btn-outline-gold">목록으로</Link>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: '80px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '24px' }}>관련 시공사례</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }} className="related-grid">
                {related.map(r => (
                  <Link key={r.id} href={`/gallery/${r.id}`} style={{ display: 'block' }}>
                    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--gray-100)', background: 'var(--white)', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gray-100)' }}>
                      <div style={{ height: '140px', position: 'relative', background: 'linear-gradient(135deg, var(--navy-light), var(--navy))' }}>
                        {r.image_url
                          ? <Image src={r.image_url} alt={r.title} fill style={{ objectFit: 'cover' }} />
                          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><span style={{ fontSize: '1.8rem', opacity: 0.3 }}>🪵</span></div>
                        }
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <p style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.85rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>{r.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .detail-wrap { flex-direction: column !important; gap: 32px !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
