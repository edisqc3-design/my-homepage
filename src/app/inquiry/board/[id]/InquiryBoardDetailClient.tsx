'use client'

import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'
import type { PublicInquiry } from '@/types'

export default function InquiryBoardDetailClient({
  inquiry, prev, next,
}: {
  inquiry: PublicInquiry
  prev: PublicInquiry | null
  next: PublicInquiry | null
}) {
  return (
    <>
      <PageBanner
        title="고객 문의"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '고객 문의', href: '/inquiry/board' }, { label: '상세보기' }]}
      />

      <section className="section-gap">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ padding: '28px 32px', background: 'var(--navy)', borderRadius: '12px 12px 0 0' }}>
            <span style={{ display: 'inline-block', padding: '3px 10px', background: 'var(--gold)', color: 'var(--navy)', fontSize: '0.72rem', fontWeight: 700, borderRadius: '10px', marginBottom: '10px' }}>
              {inquiry.category ?? '기타'}
            </span>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', lineHeight: 1.6, marginTop: '8px' }}>
              {inquiry.content}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '14px' }}>
              등록일 : {inquiry.created_at.slice(0, 10)}
            </p>
          </div>

          <div style={{ padding: '40px 32px', minHeight: '160px', border: '1px solid var(--gray-100)', borderTop: 'none', fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-800)' }}>
            {inquiry.status === 'done' && inquiry.admin_reply ? (
              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '10px', padding: '20px 24px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '10px' }}>✅ 답변</p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{inquiry.admin_reply}</p>
              </div>
            ) : (
              <p style={{ color: 'var(--gray-500)', textAlign: 'center' }}>아직 답변이 등록되지 않았습니다. 영업일 기준 24시간 이내에 답변드리겠습니다.</p>
            )}
          </div>

          <div style={{ border: '1px solid var(--gray-100)', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
            {next && (
              <div style={{ display: 'flex', gap: '16px', padding: '14px 24px', borderBottom: '1px solid var(--gray-100)', alignItems: 'center' }}>
                <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem', fontWeight: 600, width: '40px', flexShrink: 0 }}>다음</span>
                <Link href={`/inquiry/board/${next.id}`} style={{ fontSize: '0.9rem', color: 'var(--gray-800)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  [{next.category ?? '기타'}] {next.content}
                </Link>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem', flexShrink: 0 }}>{next.created_at.slice(0, 10)}</span>
              </div>
            )}
            {prev && (
              <div style={{ display: 'flex', gap: '16px', padding: '14px 24px', alignItems: 'center' }}>
                <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem', fontWeight: 600, width: '40px', flexShrink: 0 }}>이전</span>
                <Link href={`/inquiry/board/${prev.id}`} style={{ fontSize: '0.9rem', color: 'var(--gray-800)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  [{prev.category ?? '기타'}] {prev.content}
                </Link>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem', flexShrink: 0 }}>{prev.created_at.slice(0, 10)}</span>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/inquiry/board" className="btn-outline-gold">목록으로</Link>
          </div>
        </div>
      </section>
    </>
  )
}
