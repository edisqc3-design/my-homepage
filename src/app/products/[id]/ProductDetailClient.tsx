'use client'

import PageBanner from '@/components/ui/PageBanner'
import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types'

export default function ProductDetailClient({ product, related }: { product: Product, related: Product[] }) {
  return (
    <>
      <PageBanner
        title={product.name}
        breadcrumb={[
          { label: '홈', href: '/' },
          { label: '제품소개', href: '/products' },
          { label: product.category ?? '제품', href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <section className="section-gap">
        <div className="container">
          <div style={{ display: 'flex', gap: '56px', flexWrap: 'wrap' }} className="detail-wrap">
            <div style={{ flex: '1 1 400px' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative', background: 'linear-gradient(135deg, var(--navy-light), var(--navy))', borderRadius: '16px', overflow: 'hidden' }}>
                {product.image_url
                  ? <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><span style={{ fontSize: '5rem', opacity: 0.3 }}>🪵</span></div>
                }
              </div>
            </div>

            <div style={{ flex: '1 1 360px' }}>
              {product.category && (
                <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--gold)', color: 'var(--navy)', fontSize: '0.75rem', fontWeight: 700, borderRadius: '12px', marginBottom: '16px' }}>
                  {product.category}
                </span>
              )}
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--navy)', marginBottom: '16px' }}>
                {product.name}
              </h1>
              {product.description && (
                <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, marginBottom: '32px', fontSize: '0.95rem' }}>
                  {product.description}
                </p>
              )}

              {product.spec && Object.keys(product.spec).length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>제품 규격</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <tbody>
                      {Object.entries(product.spec).map(([key, val]) => (
                        <tr key={key} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                          <td style={{ padding: '10px 16px', background: 'var(--gray-50)', color: 'var(--gray-700)', fontWeight: 600, width: '40%' }}>{key}</td>
                          <td style={{ padding: '10px 16px', color: 'var(--gray-900)' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/inquiry" className="btn-primary">견적 문의하기</Link>
                <Link href="/products" className="btn-outline-gold">목록으로</Link>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div style={{ marginTop: '80px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '24px' }}>관련 제품</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="related-grid">
                {related.map(item => (
                  <Link key={item.id} href={`/products/${item.id}`} style={{ display: 'block' }}>
                    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--gray-100)', background: 'var(--white)', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gray-100)' }}>
                      <div style={{ height: '160px', position: 'relative', background: 'linear-gradient(135deg, var(--navy-light), var(--navy))' }}>
                        {item.image_url
                          ? <Image src={item.image_url} alt={item.name} fill style={{ objectFit: 'cover' }} />
                          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><span style={{ fontSize: '2rem', opacity: 0.3 }}>🪵</span></div>
                        }
                      </div>
                      <div style={{ padding: '14px 16px' }}>
                        <p style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.9rem' }}>{item.name}</p>
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
