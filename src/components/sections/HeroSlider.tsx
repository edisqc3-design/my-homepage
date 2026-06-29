'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { HeroSlide } from '@/types'

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % slides.length)
        setAnimating(false)
      }, 400)
    }, 5500)
    return () => clearInterval(timer)
  }, [slides.length])

  if (!slides.length) return null
  const slide = slides[current]

  return (
    <section style={{
      background: slide.bg_value ?? 'var(--navy)',
      minHeight: '580px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      transition: 'background 0.8s ease',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 80% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '480px', height: '480px', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '320px', height: '320px', border: '1px solid rgba(201,168,76,0.07)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{
          maxWidth: '620px',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(12px)' : 'translateY(0)',
          transition: 'opacity 0.4s, transform 0.4s',
        }}>
          {slide.tag && (
            <div style={{
              display: 'inline-block', padding: '5px 14px',
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '20px', color: 'var(--gold)', fontSize: '0.78rem',
              fontWeight: 600, letterSpacing: '0.08em', marginBottom: '20px',
            }}>
              {slide.tag}
            </div>
          )}

          <h1 style={{
            color: 'var(--white)', fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900, lineHeight: 1.25, marginBottom: '20px', whiteSpace: 'pre-line',
          }}>
            {slide.title?.replace(/\\n/g, '\n')}
          </h1>

          {slide.description && (
            <p style={{
              color: 'rgba(255,255,255,0.7)', fontSize: '1rem',
              lineHeight: 1.7, marginBottom: '36px', whiteSpace: 'pre-line',
            }}>
              {slide.description?.replace(/\\n/g, '\n')}
            </p>
          )}

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {slide.cta_label && slide.cta_href && (
              <Link href={slide.cta_href} className="btn-primary">{slide.cta_label}</Link>
            )}
            {slide.cta2_label && slide.cta2_href && (
              <Link href={slide.cta2_href} className="btn-outline">{slide.cta2_label}</Link>
            )}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              width: i === current ? '28px' : '8px', height: '8px', borderRadius: '4px',
              background: i === current ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
            }} aria-label={`슬라이드 ${i + 1}`} />
          ))}
        </div>
      )}
    </section>
  )
}
