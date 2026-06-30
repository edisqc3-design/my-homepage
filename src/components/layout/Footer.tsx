'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const FOOTER_LINKS = [
  {
    title: '회사소개',
    items: [
      { label: '인사말', href: '/about' },
      { label: '비전 & 가치', href: '/about/vision' },
      { label: '연혁', href: '/about/history' },
      { label: '오시는 길', href: '/about/map' },
    ],
  },
  {
    title: '제품소개',
    items: [
      { label: '전체 제품', href: '/products' },
      { label: '데크 자재', href: '/products/deck' },
      { label: '외장 자재', href: '/products/exterior' },
      { label: '내장 자재', href: '/products/interior' },
    ],
  },
  {
    title: '고객지원',
    items: [
      { label: '공지사항', href: '/notice' },
      { label: 'FAQ', href: '/faq' },
      { label: '1:1 문의', href: '/inquiry' },
      { label: '자료실', href: '/download' },
    ],
  },
]

type Props = { settings?: Record<string, string> }

export default function Footer({ settings = {} }: Props) {
  const pathname = usePathname()
  // 관리자 페이지는 자체 레이아웃을 사용하므로 공개 사이트 푸터는 숨김
  if (pathname?.startsWith('/admin')) return null

  const companyName = settings.company_name ?? '우드자재닷컴'
  const ceoName     = settings.ceo_name ?? '홍길동'
  const bizNumber   = settings.business_number ?? '000-00-00000'
  const phone       = settings.phone ?? '02-0000-0000'
  const email       = settings.email ?? 'info@woodjajae.co.kr'
  const address     = settings.address ?? '경기도 ○○시 ○○로 123'

  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>
      <div className="container" style={{ padding: '56px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px' }} className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--gold)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1rem', color: 'var(--navy)' }}>W</div>
              <span style={{ color: 'var(--white)', fontWeight: 800, fontSize: '1.05rem' }}>
                {companyName.replace('닷컴', '')}<span style={{ color: 'var(--gold)' }}>닷컴</span>
              </span>
            </div>
            <p style={{ lineHeight: 1.9, marginBottom: '20px' }}>
              대한민국 건축자재 전문 공급기업<br />
              합성목재 데크 · 외장재 · 내장재<br />
              전국 납품 가능
            </p>
            <p style={{ lineHeight: 1.9 }}>
              📍 {address}<br />
              📞 {phone}<br />
              ✉ {email}
            </p>
          </div>

          {FOOTER_LINKS.map(group => (
            <div key={group.title}>
              <h4 style={{ color: 'var(--white)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {group.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {group.items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} style={{ color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
            © 2024 {companyName}. All rights reserved. | 사업자번호 : {bizNumber} | 대표 : {ceoName}
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[{ label: '개인정보처리방침', href: '/privacy' }, { label: '서비스이용약관', href: '/terms' }].map(link => (
              <Link key={link.label} href={link.href} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  )
}
