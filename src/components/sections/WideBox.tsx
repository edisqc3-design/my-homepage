'use client'

import Link from 'next/link'
import type { WideBoxSetting } from '@/types'

export default function WideBox({ data }: { data: WideBoxSetting | null }) {
  if (!data) return null

  return (
    <section style={{ background: 'var(--white)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: '480px' }} className="wide-box-wrap">
        {/* 좌측 이미지 */}
        <div style={{
          flex: '1 1 50%',
          background: data.image_url
            ? `url(${data.image_url}) center/cover no-repeat`
            : 'linear-gradient(160deg, var(--navy-light) 0%, var(--navy) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '360px', position: 'relative', overflow: 'hidden',
        }}>
          {!data.image_url && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🪵</div>
              <div style={{ fontSize: '0.9rem' }}>제품 이미지 영역</div>
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: '32px', left: '32px',
            padding: '12px 20px',
            background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '8px',
          }}>
            <div style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 900 }}>3,000+</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>납품 현장 수</div>
          </div>
        </div>

        {/* 우측 텍스트 */}
        <div style={{ flex: '1 1 50%', background: 'var(--gray-50)', padding: '64px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="wide-box-text">
          {data.tag && (
            <div style={{
              display: 'inline-block', padding: '4px 12px',
              background: 'rgba(201,168,76,0.1)', borderRadius: '20px',
              color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.1em', marginBottom: '16px',
            }}>
              {data.tag}
            </div>
          )}

          {data.title && (
            <h2 style={{ color: 'var(--navy)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '32px', whiteSpace: 'pre-line' }}>
              {data.highlight_text
                ? data.title.split(data.highlight_text).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && <span style={{ color: 'var(--gold)' }}>{data.highlight_text}</span>}
                    </span>
                  ))
                : data.title
              }
            </h2>
          )}

          {(data.items ?? []).map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: i < (data.items.length - 1) ? '24px' : '0' }}>
              <div style={{
                width: '44px', height: '44px', flexShrink: 0,
                background: 'var(--white)', border: '1px solid var(--gray-300)',
                borderRadius: '10px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.2rem',
              }}>
                {item.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {data.cta_label && data.cta_href && (
              <Link href={data.cta_href} className="btn-primary">{data.cta_label}</Link>
            )}
            {data.cta2_label && data.cta2_href && (
              <Link href={data.cta2_href} className="btn-outline-gold">{data.cta2_label}</Link>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .wide-box-wrap { flex-direction: column !important; }
          .wide-box-text { padding: 40px 24px !important; }
        }
      `}</style>
    </section>
  )
}
