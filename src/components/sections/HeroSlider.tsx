'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { HeroSlide } from '@/types'

const SLIDE_DURATION = 6000

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle')
  const [progress, setProgress] = useState(0)
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  const goTo = useCallback((index: number, dir: 'next' | 'prev' = 'next') => {
    if (phase !== 'idle') return
    setDirection(dir)
    setPrev(current)
    setPhase('exit')
    setProgress(0)
    startTimeRef.current = Date.now()

    setTimeout(() => {
      setCurrent(index)
      setPhase('enter')
      setTimeout(() => {
        setPrev(null)
        setPhase('idle')
      }, 700)
    }, 500)
  }, [phase, current])

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length, 'next')
  }, [current, slides.length, goTo])

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, 'prev')
  }, [current, slides.length, goTo])

  // 자동 슬라이드 + 프로그레스
  useEffect(() => {
    if (slides.length <= 1 || hovered) {
      if (progressRef.current) clearInterval(progressRef.current)
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    startTimeRef.current = Date.now()

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100))
    }, 50)

    timerRef.current = setTimeout(() => {
      goNext()
    }, SLIDE_DURATION)

    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, hovered, slides.length, goNext])

  if (!slides.length) return null

  const slide = slides[current]
  const prevSlide = prev !== null ? slides[prev] : null

  const getBg = (s: HeroSlide) => {
    if (s.bg_type === 'image' && s.bg_value) {
      return { backgroundImage: `url(${s.bg_value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    }
    return { background: s.bg_value ?? 'var(--navy)' }
  }

  const padNum = (n: number) => String(n + 1).padStart(2, '0')

  return (
    <section
      style={{ position: 'relative', overflow: 'hidden', height: 'clamp(520px, 85vh, 760px)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── 이전 슬라이드 (exit 애니메이션) ── */}
      {prevSlide && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          ...getBg(prevSlide),
          opacity: phase === 'exit' ? 0 : 1,
          transform: phase === 'exit'
            ? `translateX(${direction === 'next' ? '-6%' : '6%'}) scale(1.04)`
            : 'translateX(0) scale(1)',
          transition: 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)',
        }} />
      )}

      {/* ── 현재 슬라이드 배경 ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        ...getBg(slide),
        opacity: phase === 'exit' ? 0 : 1,
        transform: phase === 'enter' ? 'scale(1)' : phase === 'exit' ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)',
      }} />

      {/* ── 오버레이: 네이비 그라디언트 ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        background: 'linear-gradient(110deg, rgba(10,22,40,0.88) 0%, rgba(10,22,40,0.65) 55%, rgba(10,22,40,0.30) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── 앰비언트: 골드 원형 + 회전 ── */}
      <div style={{
        position: 'absolute', right: '-100px', top: '-100px', zIndex: 4,
        width: '560px', height: '560px',
        border: '1px solid rgba(201,168,76,0.12)', borderRadius: '50%',
        animation: 'heroCircleSpin 28s linear infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: '-30px', top: '-30px', zIndex: 4,
        width: '360px', height: '360px',
        border: '1px solid rgba(201,168,76,0.07)', borderRadius: '50%',
        animation: 'heroCircleSpin 18s linear infinite reverse',
        pointerEvents: 'none',
      }} />
      {/* 대각선 골드 라인 */}
      <div style={{
        position: 'absolute', right: 'clamp(200px, 30%, 420px)', top: 0, zIndex: 4,
        width: '1px', height: '100%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.18) 40%, rgba(201,168,76,0.10) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── 고스트 넘버 (우측) ── */}
      <div style={{
        position: 'absolute', right: 'clamp(24px, 8vw, 120px)', bottom: '-20px', zIndex: 5,
        fontWeight: 900, letterSpacing: '-0.05em',
        fontSize: 'clamp(160px, 22vw, 300px)',
        lineHeight: 1,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(201,168,76,0.13)',
        userSelect: 'none', pointerEvents: 'none',
        transition: 'opacity 0.5s, transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        opacity: phase === 'exit' ? 0 : 0.85,
        transform: phase === 'exit'
          ? `translateX(${direction === 'next' ? '-40px' : '40px'})`
          : 'translateX(0)',
      }}>
        {padNum(current)}
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div className="container" style={{
        position: 'relative', zIndex: 6,
        height: '100%', display: 'flex', alignItems: 'center',
        padding: '80px 24px',
      }}>
        <div style={{ maxWidth: '600px' }}>

          {/* 태그 */}
          {slide.tag && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.35)',
              borderRadius: '2px',
              color: 'var(--gold)', fontSize: '0.72rem',
              fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              opacity: phase === 'exit' ? 0 : 1,
              transform: phase === 'exit' ? 'translateY(-8px)' : phase === 'enter' ? 'translateY(0)' : 'translateY(0)',
              transition: 'opacity 0.4s 0.05s, transform 0.4s 0.05s cubic-bezier(0.4,0,0.2,1)',
            }}>
              <span style={{ width: '18px', height: '1px', background: 'var(--gold)', display: 'inline-block' }} />
              {slide.tag}
            </div>
          )}

          {/* 제목 */}
          <h1 style={{
            color: 'var(--white)',
            fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)',
            fontWeight: 900, lineHeight: 1.18,
            marginBottom: '20px',
            whiteSpace: 'pre-line',
            opacity: phase === 'exit' ? 0 : 1,
            transform: phase === 'exit'
              ? 'translateY(-16px)'
              : phase === 'enter' ? 'translateY(0)' : 'translateY(0)',
            transition: 'opacity 0.45s 0.10s, transform 0.45s 0.10s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {slide.title?.replace(/\\n/g, '\n')}
          </h1>

          {/* 골드 구분선 */}
          <div style={{
            width: phase === 'exit' ? '0px' : '48px',
            height: '2px',
            background: 'var(--gold)',
            marginBottom: '20px',
            transition: 'width 0.5s 0.15s cubic-bezier(0.4,0,0.2,1)',
            borderRadius: '1px',
          }} />

          {/* 설명 */}
          {slide.description && (
            <p style={{
              color: 'rgba(255,255,255,0.72)',
              fontSize: 'clamp(0.9rem, 1.5vw, 1rem)',
              lineHeight: 1.75, marginBottom: '36px',
              whiteSpace: 'pre-line',
              opacity: phase === 'exit' ? 0 : 1,
              transform: phase === 'exit'
                ? 'translateY(-8px)'
                : 'translateY(0)',
              transition: 'opacity 0.4s 0.18s, transform 0.4s 0.18s cubic-bezier(0.4,0,0.2,1)',
            }}>
              {slide.description?.replace(/\\n/g, '\n')}
            </p>
          )}

          {/* CTA 버튼 */}
          <div style={{
            display: 'flex', gap: '14px', flexWrap: 'wrap',
            opacity: phase === 'exit' ? 0 : 1,
            transform: phase === 'exit' ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'opacity 0.4s 0.24s, transform 0.4s 0.24s',
          }}>
            {slide.cta_label && slide.cta_href && (
              <Link href={slide.cta_href} className="btn-primary">{slide.cta_label}</Link>
            )}
            {slide.cta2_label && slide.cta2_href && (
              <Link href={slide.cta2_href} className="btn-outline">{slide.cta2_label}</Link>
            )}
          </div>
        </div>
      </div>

      {/* ── 하단 UI: 프로그레스 + 슬라이드 인덱스 + 네비 ── */}
      {slides.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 7,
          padding: '0 clamp(24px, 6vw, 80px) 32px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          gap: '20px',
        }}>
          {/* 슬라이드 인덱스 표시 + 프로그레스 */}
          <div style={{ flex: 1, maxWidth: '360px' }}>
            {/* 슬라이드 탭 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 'next' : 'prev')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '0', display: 'flex', flexDirection: 'column', gap: '4px',
                    opacity: i === current ? 1 : 0.45,
                    transition: 'opacity 0.3s',
                  }}
                  aria-label={`슬라이드 ${i + 1}`}
                >
                  <span style={{
                    display: 'block',
                    width: i === current ? '32px' : '20px',
                    height: '2px',
                    background: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                    borderRadius: '1px',
                    transition: 'width 0.4s, background 0.3s',
                  }} />
                </button>
              ))}
            </div>
            {/* 프로그레스 바 */}
            <div style={{
              height: '1px',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, rgba(201,168,76,0.5), var(--gold))',
                transition: 'width 0.05s linear',
                borderRadius: '1px',
              }} />
            </div>
          </div>

          {/* 슬라이드 번호 + 화살표 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em',
              userSelect: 'none',
            }}>
              <span style={{ color: 'var(--gold)' }}>{padNum(current)}</span>
              {' / '}
              {padNum(slides.length - 1)}
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[{fn: goPrev, label: '이전', path: 'M15 19l-7-7 7-7'}, {fn: goNext, label: '다음', path: 'M9 5l7 7-7 7'}].map(({fn, label, path}) => (
                <button
                  key={label}
                  onClick={fn}
                  style={{
                    width: '36px', height: '36px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                    backdropFilter: 'blur(4px)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.6)'
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.12)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
                  }}
                  aria-label={label}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points={path} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CSS 애니메이션 ── */}
      <style>{`
        @keyframes heroCircleSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="heroCircleSpin"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
