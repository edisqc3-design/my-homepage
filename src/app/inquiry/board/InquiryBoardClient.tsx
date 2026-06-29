'use client'

import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'
import type { PublicInquiry } from '@/types'

export default function InquiryBoardClient({ inquiries }: { inquiries: PublicInquiry[] }) {
  return (
    <>
      <PageBanner
        title="고객 문의"
        subtitle="고객님들이 남겨주신 문의와 답변을 확인하실 수 있습니다"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '고객 문의' }]}
      />

      <section className="section-gap">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ textAlign: 'right', marginBottom: '16px' }}>
            <Link href="/inquiry" className="btn-primary" style={{ display: 'inline-block', padding: '10px 20px', fontSize: '0.85rem' }}>
              1:1 문의 작성하기
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
              <p>등록된 문의가 없습니다.</p>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--gray-100)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 100px 1fr 100px 120px', padding: '12px 24px', background: 'var(--navy)', fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }} className="board-head">
                <span style={{ textAlign: 'center' }}>번호</span>
                <span style={{ textAlign: 'center' }}>유형</span>
                <span>내용</span>
                <span style={{ textAlign: 'center' }}>답변상태</span>
                <span style={{ textAlign: 'center' }}>작성일</span>
              </div>

              {inquiries.map((inq, i) => (
                <Link key={inq.id} href={`/inquiry/board/${inq.id}`} style={{
                  display: 'grid', gridTemplateColumns: '60px 100px 1fr 100px 120px',
                  padding: '16px 24px', alignItems: 'center',
                  borderTop: i === 0 ? 'none' : '1px solid var(--gray-100)',
                  transition: 'background 0.15s', color: 'var(--gray-900)',
                }} className="board-row"
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-50)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--white)')}>
                  <span style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                    {inquiries.length - i}
                  </span>
                  <span style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                    {inq.category ?? '기타'}
                  </span>
                  <span style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inq.content}
                  </span>
                  <span style={{ textAlign: 'center' }}>
                    {inq.status === 'done' ? (
                      <span style={{ padding: '3px 10px', background: 'rgba(34,197,94,0.1)', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, borderRadius: '10px' }}>답변완료</span>
                    ) : (
                      <span style={{ padding: '3px 10px', background: 'rgba(234,179,8,0.12)', color: '#a16207', fontSize: '0.72rem', fontWeight: 700, borderRadius: '10px' }}>대기중</span>
                    )}
                  </span>
                  <span style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                    {inq.created_at.slice(0, 10)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .board-head { display: none !important; }
          .board-row { grid-template-columns: 1fr !important; gap: 6px; }
        }
      `}</style>
    </>
  )
}
