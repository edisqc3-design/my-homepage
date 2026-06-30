'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'

function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/products/${product.id}`} style={{ display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: '14px', overflow: 'hidden',
          border: '1px solid var(--gray-300)', background: 'var(--white)',
          transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.3s',
          boxShadow: hovered ? '0 20px 40px -12px rgba(10,22,40,0.22)' : '0 2px 10px rgba(10,22,40,0.08)',
          borderColor: hovered ? 'rgba(201,168,76,0.4)' : 'var(--gray-300)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div style={{ width: '100%', height: '210px', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, var(--navy-light) 0%, var(--navy) 100%)' }}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 100vw, 300px"
              style={{
                objectFit: 'cover',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <span style={{ fontSize: '2.5rem', opacity: 0.4 }}>🪵</span>
            </div>
          )}

          {product.category && (
            <span style={{
              position: 'absolute', top: '12px', left: '12px',
              padding: '4px 11px', background: 'var(--gold)', color: 'var(--navy)',
              fontSize: '0.7rem', fontWeight: 700, borderRadius: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              {product.category}
            </span>
          )}
        </div>

        <div style={{ padding: '14px 16px' }}>
          <h4 style={{
            fontSize: '0.9rem', fontWeight: 700, color: hovered ? '#b45309' : 'var(--navy)',
            marginBottom: '8px', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            transition: 'color 0.25s',
          } as React.CSSProperties}>
            {product.name}
          </h4>
          {product.description && (
            <p style={{
              fontSize: '0.78rem', color: 'var(--gray-500)', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            } as React.CSSProperties}>
              {product.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function ProductsGrid({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section className="section-gap">
      <div className="container">
        <div className="center-heading">
          <h2>제품소개</h2>
          <div className="accent-line" />
          <p>엄선된 고품질 건축자재를 만나보세요</p>
        </div>

        {/* 카드 너비를 240~300px 범위로 고정하고, 화면 폭에 맞춰 한 줄에 들어가는 개수가
            자동으로 정해지도록 함(데스크탑 기준 보통 4개). 상품이 적어도 카드가 과도하게
            늘어나지 않고, 많아지면 자연스럽게 다음 줄로 넘어감. */}
        <div className="products-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 300px))',
          gap: '20px',
          justifyContent: 'center',
        }}>
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/products" className="btn-outline-gold">제품 전체보기</Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) { .products-grid { grid-template-columns: minmax(0, 1fr) !important; } }
      `}</style>
    </section>
  )
}
