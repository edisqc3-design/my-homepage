'use client'

import PageBanner from '@/components/ui/PageBanner'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'

const CATEGORIES = ['전체', '데크자재', '외장재', '내장재']

export default function ProductsClient({
  products,
  activeCategory,
}: {
  products: Product[]
  activeCategory: string
}) {
  return (
    <>
      <PageBanner
        title="제품소개"
        subtitle="엄선된 고품질 건축자재를 만나보세요"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '제품소개' }]}
      />

      <section className="section-gap">
        <div className="container">
          {/* 카테고리 필터 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat || (!activeCategory && cat === '전체')
              return (
                <Link key={cat}
                  href={cat === '전체' ? '/products' : `/products?category=${cat}`}
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
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
              <p>등록된 제품이 없습니다.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="products-grid">
              {products.map(product => (
                <Link key={product.id} href={`/products/${product.id}`} style={{ display: 'block' }}>
                  <div style={{
                    borderRadius: '12px', overflow: 'hidden',
                    border: '1px solid var(--gray-100)', transition: 'all 0.25s', background: 'var(--white)',
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = 'translateY(-4px)'
                      el.style.boxShadow = '0 12px 32px rgba(10,22,40,0.12)'
                      el.style.borderColor = 'var(--gold)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = 'none'
                      el.style.boxShadow = 'none'
                      el.style.borderColor = 'var(--gray-100)'
                    }}>
                    <div style={{ width: '100%', height: '220px', position: 'relative', background: 'linear-gradient(135deg, var(--navy-light), var(--navy))' }}>
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          <span style={{ fontSize: '3rem', opacity: 0.3 }}>🪵</span>
                        </div>
                      )}
                      {product.category && (
                        <span style={{
                          position: 'absolute', top: '12px', left: '12px',
                          padding: '4px 12px', background: 'var(--gold)', color: 'var(--navy)',
                          fontSize: '0.72rem', fontWeight: 700, borderRadius: '12px',
                        }}>
                          {product.category}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
                        {product.name}
                      </h3>
                      {product.description && (
                        <p style={{
                          fontSize: '0.85rem', color: 'var(--gray-700)', lineHeight: 1.6,
                          display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        } as React.CSSProperties}>
                          {product.description}
                        </p>
                      )}
                      <div style={{ marginTop: '16px', color: 'var(--gold)', fontSize: '0.82rem', fontWeight: 700 }}>
                        자세히 보기 →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) { .products-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .products-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}
