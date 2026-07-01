'use client'

import { useState, useEffect, useRef } from 'react'
import PageBanner from '@/components/ui/PageBanner'
import Image from 'next/image'
import Link from 'next/link'
import type { GalleryItem } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  '상업시설': '#0077b6', '주거시설': '#2d6a4f', '공공시설': '#6a3d9a',
}

function ImageSlider({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (images.length <= 1 || paused || lightbox) return
    timerRef.current = setInterval(() => {
      setActive(i => (i + 1) % images.length)
    }, 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [images.length, paused, lightbox])

  if (!images.length) {
    return (
      <div style={{ width: '100%', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--navy-light), var(--navy))', borderRadius: '16px' }}>
        <span style={{ fontSize: '5rem', opacity: 0.3 }}>🏗️</span>
      </div>
    )
  }

  const goNext = () => setActive(i => (i + 1) % images.length)
  const goPrev = () => setActive(i => (i - 1 + images.length) % images.length)

  return (
    <>
      <div>
        {/* 메인 이미지 */}
        <div
          onClick={() => setLightbox(true)}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            width: '100%', aspectRatio: '4/3', position: 'relative',
            borderRadius: '16px', overflow: 'hidden', cursor: 'zoom-in',
            background: 'linear-gradient(135deg, var(--navy-light), var(--navy))',
          }}>
          <Image src={images[active]} alt={`${title} ${active + 1}`} fill style={{ objectFit: 'contain' }} />

          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); goPrev() }} style={navBtnStyle('left')} aria-label="이전 사진">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button onClick={e => { e.stopPropagation(); goNext() }} style={navBtnStyle('right')} aria-label="다음 사진">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
              <span style={{
                position: 'absolute', bottom: '12px', right: '12px',
                padding: '3px 10px', borderRadius: '12px',
                background: 'rgba(10,22,40,0.6)', color: '#fff', fontSize: '0.74rem', fontWeight: 600,
              }}>
                {active + 1} / {images.length}
              </span>
              <div style={{
                position: 'absolute', bottom: '12px', left: '12px',
                display: 'flex', gap: '4px',
              }}>
                {images.map((_, i) => (
                  <span key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: i === active ? '#c9a84c' : 'rgba(255,255,255,0.5)',
                    transition: 'background 0.2s',
                  }} />
                ))}
              </div>
            </>
          )}

          <span style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'rgba(10,22,40,0.55)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
          </span>
        </div>

        {/* 썸네일 스트립 */}
        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {images.map((url, i) => (
              <button key={url + i} onClick={() => setActive(i)} style={{
                flexShrink: 0, width: '74px', height: '56px', borderRadius: '8px', overflow: 'hidden',
                border: i === active ? '2px solid var(--gold)' : '2px solid transparent',
                opacity: i === active ? 1 : 0.6, cursor: 'pointer', padding: 0,
                position: 'relative', transition: 'opacity 0.2s, border-color 0.2s',
              }}>
                <Image src={url} alt={`썸네일 ${i + 1}`} fill style={{ objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 라이트박스 */}
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(5,10,20,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '40px',
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', aspectRatio: '4/3' }} onClick={e => e.stopPropagation()}>
            <Image src={images[active]} alt={`${title} ${active + 1}`} fill style={{ objectFit: 'contain' }} />
            {images.length > 1 && (
              <>
                <button onClick={goPrev} style={navBtnStyle('left')} aria-label="이전 사진">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button onClick={goNext} style={navBtnStyle('right')} aria-label="다음 사진">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </>
            )}
          </div>
          <button onClick={() => setLightbox(false)} style={{
            position: 'absolute', top: '24px', right: '24px',
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none',
            fontSize: '1.1rem', cursor: 'pointer',
          }}>✕</button>
        </div>
      )}
    </>
  )
}

function navBtnStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', top: '50%', [side]: '10px', transform: 'translateY(-50%)',
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'rgba(10,22,40,0.55)', color: '#fff', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  }
}

export default function GalleryDetailClient({ item, related }: { item: GalleryItem, related: GalleryItem[] }) {
  const images = item.image_urls?.length ? item.image_urls : (item.image_url ? [item.image_url] : [])

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
              <ImageSlider images={images} title={item.title} />
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
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '24px' }}>
                이런 시공사례는 어떠세요?
              </h2>
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
