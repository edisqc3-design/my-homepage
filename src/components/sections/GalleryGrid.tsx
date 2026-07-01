'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { GalleryItem } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  '상업시설': '#0077b6',
  '주거시설': '#2d6a4f',
  '공공시설': '#6a3d9a',
}

/* ────────────────────────────────────────────
   공통 GalleryCard (카드형 / 매거진형 공용)
──────────────────────────────────────────── */
function GalleryCard({ item, height = 210 }: { item: GalleryItem; height?: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/gallery/${item.id}`} style={{ display: 'block' }} className="gallery-slide-card">
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
        <div style={{ width: '100%', height: `${height}px`, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--navy-light) 0%, var(--navy) 100%)' }}>
          {item.image_url ? (
            <Image src={item.image_url} alt={item.title} fill sizes="(max-width: 480px) 100vw, 300px"
              style={{ objectFit: 'cover', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>🪵</span>
            </div>
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: hovered ? 'linear-gradient(to top, rgba(10,22,40,0.75) 0%, rgba(10,22,40,0.1) 45%, transparent 70%)' : 'linear-gradient(to top, rgba(10,22,40,0.3) 0%, transparent 55%)',
            transition: 'background 0.35s',
          }} />
          {item.category && (
            <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 11px', background: CATEGORY_COLORS[item.category] ?? '#555', color: 'white', fontSize: '0.7rem', fontWeight: 700, borderRadius: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
              {item.category}
            </span>
          )}
          <div style={{
            position: 'absolute', bottom: '12px', left: '14px', right: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--white)',
            opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.3s, transform 0.3s',
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              자세히 보기
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </span>
          </div>
        </div>
        <div style={{ padding: '14px 16px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: hovered ? '#b45309' : 'var(--navy)', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.25s' } as React.CSSProperties}>
            {item.title}
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{item.created_at.slice(0, 10)}</p>
        </div>
      </div>
    </Link>
  )
}

/* ────────────────────────────────────────────
   카드형 (기존 슬라이딩 그리드)
──────────────────────────────────────────── */
function CardMode({ items }: { items: GalleryItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const PAGE_SIZE = 8
  const pages: GalleryItem[][] = []
  for (let i = 0; i < items.length; i += PAGE_SIZE) pages.push(items.slice(i, i + PAGE_SIZE))
  const showArrows = pages.length > 1

  const scrollByPage = (dir: -1 | 1) => {
    const el = scrollerRef.current; if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    if (dir === 1 && el.scrollLeft >= maxScroll - 4) { el.scrollTo({ left: 0, behavior: 'smooth' }); return }
    if (dir === -1 && el.scrollLeft <= 4) { el.scrollTo({ left: maxScroll, behavior: 'smooth' }); return }
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    if (!showArrows || paused) return
    const id = setInterval(() => scrollByPage(1), 4500)
    return () => clearInterval(id)
  }, [showArrows, paused])

  return (
    <div style={{ position: 'relative', padding: '0 52px' }} className="gallery-slide-wrapper"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {showArrows && (
        <button type="button" onClick={() => scrollByPage(-1)} aria-label="이전" className="gallery-slide-arrow" style={arrowStyle('left')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      )}
      <div ref={scrollerRef} style={{ display: 'flex', overflowX: showArrows ? 'auto' : 'hidden', scrollSnapType: showArrows ? 'x mandatory' : undefined, scrollbarWidth: 'none' }} className="gallery-scroller">
        {pages.map((page, pi) => (
          <div key={pi} className="gallery-page" style={{ flex: '0 0 100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', scrollSnapAlign: 'start' }}>
            {page.map(item => <GalleryCard key={item.id} item={item} />)}
          </div>
        ))}
      </div>
      {showArrows && (
        <button type="button" onClick={() => scrollByPage(1)} aria-label="다음" className="gallery-slide-arrow" style={arrowStyle('right')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────
   웹진형 — 고급 에디토리얼 레이아웃
   [Featured 대형] + [우측 2단 오버레이 카드]
   + [하단 2개 수평 카드]
──────────────────────────────────────────── */
function WebzineFeaturedCard({ item }: { item: GalleryItem }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/gallery/${item.id}`} style={{ display: 'block', height: '100%' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', height: '100%', minHeight: '520px',
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: hovered ? '0 32px 64px -12px rgba(10,22,40,0.38)' : '0 16px 48px -12px rgba(10,22,40,0.22)',
          transition: 'box-shadow 0.4s, transform 0.4s',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          cursor: 'pointer',
        }}>
        {item.image_url ? (
          <Image src={item.image_url} alt={item.title} fill sizes="(max-width:900px) 100vw, 58vw"
            style={{ objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
        ) : (
          <div style={{ background: 'linear-gradient(135deg,var(--navy-light),var(--navy))', height: '100%' }} />
        )}
        {/* 그라데이션 오버레이 */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(5,12,30,0.95) 0%, rgba(5,12,30,0.55) 45%, rgba(5,12,30,0.1) 80%, transparent 100%)'
            : 'linear-gradient(to top, rgba(5,12,30,0.88) 0%, rgba(5,12,30,0.4) 50%, rgba(5,12,30,0.05) 100%)',
          transition: 'background 0.4s',
        }} />

        {/* 상단 뱃지 */}
        <div style={{ position: 'absolute', top: '22px', left: '22px', right: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {item.category && (
            <span style={{ padding: '5px 14px', background: CATEGORY_COLORS[item.category] ?? '#555', color: '#fff', fontSize: '0.72rem', fontWeight: 700, borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
              {item.category}
            </span>
          )}
          <span style={{ marginLeft: 'auto', padding: '4px 12px', background: 'var(--gold)', color: 'var(--navy)', fontSize: '0.65rem', fontWeight: 800, borderRadius: '6px', letterSpacing: '0.08em' }}>
            FEATURED
          </span>
        </div>

        {/* 하단 콘텐츠 */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '36px 32px 32px' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontWeight: 600, letterSpacing: '0.04em' }}>
            {item.created_at.slice(0, 10)}
          </p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: '12px', letterSpacing: '-0.01em' }}>
            {item.title}
          </h3>
          {item.description && (
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, marginBottom: '18px',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
              {item.description}
            </p>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700,
            opacity: hovered ? 1 : 0.7, transition: 'opacity 0.3s',
          }}>
            자세히 보기
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

function WebzineSideCard({ item, height }: { item: GalleryItem; height: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/gallery/${item.id}`} style={{ display: 'block', height: `${height}px` }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', height: '100%', borderRadius: '16px', overflow: 'hidden',
          boxShadow: hovered ? '0 16px 40px -8px rgba(10,22,40,0.3)' : '0 4px 16px rgba(10,22,40,0.1)',
          transition: 'box-shadow 0.35s, transform 0.35s',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          cursor: 'pointer',
        }}>
        {item.image_url ? (
          <Image src={item.image_url} alt={item.title} fill sizes="280px"
            style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)', transform: hovered ? 'scale(1.08)' : 'scale(1)' }} />
        ) : (
          <div style={{ background: 'linear-gradient(135deg,var(--navy-light),var(--navy))', height: '100%' }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(5,12,30,0.92) 0%, rgba(5,12,30,0.3) 55%, transparent 100%)'
            : 'linear-gradient(to top, rgba(5,12,30,0.82) 0%, rgba(5,12,30,0.15) 60%, transparent 100%)',
          transition: 'background 0.35s',
        }} />
        {item.category && (
          <span style={{ position: 'absolute', top: '14px', left: '14px', padding: '3px 10px', background: CATEGORY_COLORS[item.category] ?? '#555', color: '#fff', fontSize: '0.65rem', fontWeight: 700, borderRadius: '16px' }}>
            {item.category}
          </span>
        )}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px' }}>
          <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', marginBottom: '6px', fontWeight: 600 }}>{item.created_at.slice(0, 10)}</p>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
            {item.title}
          </h4>
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 700, opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}>
            자세히 보기 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

function WebzineBottomCard({ item }: { item: GalleryItem }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/gallery/${item.id}`} style={{ display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', gap: '0', borderRadius: '14px', overflow: 'hidden',
          border: '1px solid var(--gray-100)', background: 'var(--white)',
          boxShadow: hovered ? '0 12px 32px rgba(10,22,40,0.13)' : '0 2px 8px rgba(10,22,40,0.05)',
          transition: 'box-shadow 0.3s, transform 0.3s, border-color 0.3s',
          transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          borderColor: hovered ? 'rgba(201,168,76,0.35)' : 'var(--gray-100)',
          cursor: 'pointer',
        }}>
        <div style={{ width: '140px', minWidth: '140px', height: '110px', position: 'relative', overflow: 'hidden', background: 'var(--navy)' }}>
          {item.image_url ? (
            <Image src={item.image_url} alt={item.title} fill sizes="140px"
              style={{ objectFit: 'cover', transition: 'transform 0.5s', transform: hovered ? 'scale(1.08)' : 'scale(1)' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '1.5rem', opacity: 0.3 }}>🪵</div>
          )}
          {item.category && (
            <span style={{ position: 'absolute', bottom: '8px', left: '8px', padding: '2px 8px', background: CATEGORY_COLORS[item.category] ?? '#555', color: '#fff', fontSize: '0.6rem', fontWeight: 700, borderRadius: '10px' }}>
              {item.category}
            </span>
          )}
        </div>
        <div style={{ padding: '16px 18px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: '0.68rem', color: 'var(--gray-400)', marginBottom: '6px', fontWeight: 600 }}>{item.created_at.slice(0, 10)}</p>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: hovered ? '#b45309' : 'var(--navy)', lineHeight: 1.4, marginBottom: '8px', transition: 'color 0.25s',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
            {item.title}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700 }}>
            자세히 보기 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

function WebzineMode({ items }: { items: GalleryItem[] }) {
  const [featured, second, third, fourth, fifth] = items

  return (
    <div className="webzine-layout">
      {/* 상단: 피처드(좌) + 사이드 2장(우) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', marginBottom: '16px', height: '520px' }} className="webzine-top">
        {featured && <WebzineFeaturedCard item={featured} />}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          {second && <WebzineSideCard item={second} height={248} />}
          {third && <WebzineSideCard item={third} height={248} />}
        </div>
      </div>

      {/* 하단: 수평 카드 2개 */}
      {(fourth || fifth) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="webzine-bottom">
          {fourth && <WebzineBottomCard item={fourth} />}
          {fifth && <WebzineBottomCard item={fifth} />}
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────
   매거진형 (이미지 위 텍스트 오버레이 - 시네마틱)
──────────────────────────────────────────── */
function MagazineMode({ items }: { items: GalleryItem[] }) {
  const visible = items.slice(0, 8)
  return (
    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '8px', cursor: 'grab' }} className="magazine-scroller">
      {visible.map((item, idx) => (
        <Link key={item.id} href={`/gallery/${item.id}`}
          style={{ display: 'block', flex: idx === 0 ? '0 0 420px' : '0 0 260px' }}>
          <div
            style={{
              position: 'relative', borderRadius: '16px', overflow: 'hidden',
              height: idx === 0 ? '380px' : '280px',
              boxShadow: '0 8px 32px rgba(10,22,40,0.18)', cursor: 'pointer',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(10,22,40,0.28)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,22,40,0.18)' }}
          >
            {/* 배경 이미지 */}
            {item.image_url ? (
              <Image src={item.image_url} alt={item.title} fill sizes={idx === 0 ? '420px' : '260px'} style={{ objectFit: 'cover' }} />
            ) : (
              <div style={{ background: 'var(--navy)', height: '100%' }} />
            )}
            {/* 그라데이션 오버레이 */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(5,12,30,0.92) 0%, rgba(5,12,30,0.4) 50%, rgba(5,12,30,0.05) 100%)',
            }} />
            {/* 카테고리 뱃지 */}
            {item.category && (
              <span style={{
                position: 'absolute', top: '14px', left: '14px',
                padding: '4px 12px', fontSize: '0.68rem', fontWeight: 800,
                background: CATEGORY_COLORS[item.category] ?? '#555',
                color: '#fff', borderRadius: '20px', letterSpacing: '0.03em',
              }}>{item.category}</span>
            )}
            {/* 첫번째 카드에 FEATURE 뱃지 */}
            {idx === 0 && (
              <span style={{
                position: 'absolute', top: '14px', right: '14px',
                padding: '3px 10px', fontSize: '0.62rem', fontWeight: 800,
                background: 'var(--gold)', color: 'var(--navy)', borderRadius: '6px', letterSpacing: '0.08em',
              }}>FEATURE</span>
            )}
            {/* 하단 텍스트 */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: idx === 0 ? '28px 24px' : '20px 16px' }}>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.55)', marginBottom: '6px', fontWeight: 600 }}>
                {item.created_at.slice(0, 10)}
              </p>
              <h4 style={{
                fontSize: idx === 0 ? '1.15rem' : '0.9rem', fontWeight: 800,
                color: '#fff', lineHeight: 1.35,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              } as React.CSSProperties}>
                {item.title}
              </h4>
              {idx === 0 && item.description && (
                <p style={{
                  fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginTop: '8px', lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                } as React.CSSProperties}>
                  {item.description}
                </p>
              )}
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700 }}>
                자세히 보기
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

/* ────────────────────────────────────────────
   메인 GalleryGrid export
──────────────────────────────────────────── */
export default function GalleryGrid({ items, displayMode = 'card' }: { items: GalleryItem[]; displayMode?: string }) {
  if (!items.length) return null

  return (
    <section className="section-gap section-surface-cool">
      <div className="container">
        <div className="center-heading">
          <h2>시공 사례</h2>
          <div className="accent-line" />
          <p>전국 다양한 현장의 시공 실적을 확인하세요</p>
        </div>

        {displayMode === 'webzine' && <WebzineMode items={items} />}
        {displayMode === 'magazine' && <MagazineMode items={items} />}
        {displayMode === 'card' && <CardMode items={items} />}
        {/* 알 수 없는 mode는 card로 fallback */}
        {!['webzine', 'magazine', 'card'].includes(displayMode) && <CardMode items={items} />}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/gallery" className="btn-outline-gold">시공사례 전체보기</Link>
        </div>
      </div>

      <style>{`
        .gallery-scroller::-webkit-scrollbar { display: none; }
        .magazine-scroller::-webkit-scrollbar { display: none; }
        @media (max-width: 900px) {
          .gallery-slide-arrow { display: none !important; }
          .gallery-slide-wrapper { padding: 0 !important; }
          .gallery-scroller { overflow-x: auto !important; }
          .gallery-page { grid-template-columns: repeat(2, 1fr) !important; }
          .webzine-top { grid-template-columns: 1fr !important; height: auto !important; }
          .webzine-top > div:last-child { flex-direction: row !important; height: 200px !important; }
          .webzine-bottom { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .gallery-page { grid-template-columns: 1fr !important; }
          .webzine-top > div:last-child { flex-direction: column !important; height: auto !important; }
        }
      `}</style>
    </section>
  )
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', top: '40%', [side]: '6px', transform: 'translateY(-50%)',
    width: '42px', height: '42px', borderRadius: '50%',
    background: 'var(--white)', color: 'var(--navy)', border: '1px solid var(--gray-200)',
    boxShadow: '0 8px 20px rgba(10,22,40,0.12)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
  }
}
