'use client'

import { useState } from 'react'
import PageBanner from '@/components/ui/PageBanner'
import { incrementDownload } from '@/lib/actions'
import type { Download } from '@/types'

function formatFileSize(bytes: number | null) {
  if (!bytes) return '-'
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export default function DownloadClient({ downloads }: { downloads: Download[] }) {
  const [activeCategory, setActiveCategory] = useState('전체')
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(downloads.map(d => [d.id, d.download_count]))
  )

  const categories = ['전체', ...Array.from(new Set(downloads.map(d => d.category).filter(Boolean) as string[]))]
  const filtered = activeCategory === '전체' ? downloads : downloads.filter(d => d.category === activeCategory)

  const handleDownload = async (d: Download) => {
    await incrementDownload(d.id)
    setCounts(prev => ({ ...prev, [d.id]: (prev[d.id] ?? 0) + 1 }))
    window.open(d.file_url, '_blank')
  }

  return (
    <>
      <PageBanner
        title="자료실"
        subtitle="카탈로그, 시방서, 인증서 등 자료를 다운로드하세요"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '자료실' }]}
      />

      <section className="section-gap">
        <div className="container" style={{ maxWidth: '900px' }}>

          {/* 카테고리 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '7px 18px', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                background: activeCategory === cat ? 'var(--navy)' : 'var(--white)',
                color: activeCategory === cat ? 'var(--white)' : 'var(--gray-600)',
                border: activeCategory === cat ? '1px solid var(--navy)' : '1px solid var(--gray-200)',
                transition: 'all 0.15s',
              }}>
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📁</div>
              <p>등록된 자료가 없습니다.</p>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--gray-100)', borderRadius: '12px', overflow: 'hidden' }}>
              {/* 헤더 */}
              <div style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 120px',
                padding: '12px 20px', background: 'var(--navy)',
                fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)',
              }} className="dl-header">
                <span style={{ textAlign: 'center' }}>번호</span>
                <span>파일명</span>
                <span style={{ textAlign: 'center' }}>분류</span>
                <span style={{ textAlign: 'center' }}>크기</span>
                <span style={{ textAlign: 'center' }}>다운로드</span>
              </div>

              {filtered.map((item, i) => (
                <div key={item.id} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 100px 80px 120px',
                  padding: '14px 20px', alignItems: 'center',
                  borderTop: i === 0 ? 'none' : '1px solid var(--gray-100)',
                  background: 'var(--white)', transition: 'background 0.15s',
                }}
                  className="dl-row"
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-50)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--white)')}>
                  <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                    {filtered.length - i}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>📄</span>
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '2px' }}>
                          {item.title}
                        </p>
                        {item.file_name && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{item.file_name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {item.category && (
                      <span style={{
                        padding: '3px 10px', background: 'rgba(201,168,76,0.1)',
                        color: 'var(--gold)', fontSize: '0.72rem', fontWeight: 700, borderRadius: '10px',
                      }}>
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                    {formatFileSize(item.file_size)}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button onClick={() => handleDownload(item)} style={{
                      padding: '7px 14px', background: 'var(--navy)', color: 'var(--white)',
                      border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'background 0.15s', display: 'inline-flex',
                      alignItems: 'center', gap: '5px',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-light)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy)')}>
                      ↓ 다운로드
                    </button>
                    <p style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: '4px' }}>
                      {counts[item.id] ?? 0}회
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .dl-header { grid-template-columns: 1fr 80px !important; }
          .dl-header span:nth-child(1),
          .dl-header span:nth-child(3),
          .dl-header span:nth-child(4) { display: none; }
          .dl-row { grid-template-columns: 1fr 80px !important; }
          .dl-row > div:nth-child(1),
          .dl-row > div:nth-child(3),
          .dl-row > div:nth-child(4) { display: none; }
        }
      `}</style>
    </>
  )
}
