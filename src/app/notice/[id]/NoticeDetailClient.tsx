'use client'

import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'
import type { Notice } from '@/types'

export default function NoticeDetailClient({
  notice, prevNotice, nextNotice,
}: {
  notice: Notice
  prevNotice: Notice | null
  nextNotice: Notice | null
}) {
  return (
    <>
      <PageBanner
        title="공지사항"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '공지사항', href: '/notice' }, { label: notice.title }]}
      />

      <section className="section-gap">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div style={{ padding: '28px 32px', background: 'var(--navy)', borderRadius: '12px 12px 0 0' }}>
            {notice.is_pinned && (
              <span style={{ display: 'inline-block', padding: '3px 10px', background: 'var(--gold)', color: 'var(--navy)', fontSize: '0.72rem', fontWeight: 700, borderRadius: '10px', marginBottom: '10px' }}>공지</span>
            )}
            <h1 style={{ color: 'var(--white)', fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.4, marginBottom: '12px' }}>
              {notice.title}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
              등록일 : {notice.created_at.slice(0, 10)}
            </p>
          </div>

          <div style={{ padding: '40px 32px', minHeight: '320px', border: '1px solid var(--gray-100)', borderTop: 'none', fontSize: '0.95rem', lineHeight: 1.9, color: 'var(--gray-800)', whiteSpace: 'pre-wrap' }}>
            {notice.content ?? '내용이 없습니다.'}
          </div>

          <div style={{ border: '1px solid var(--gray-100)', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
            {nextNotice && (
              <div style={{ display: 'flex', gap: '16px', padding: '14px 24px', borderBottom: '1px solid var(--gray-100)', alignItems: 'center' }}>
                <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem', fontWeight: 600, width: '40px', flexShrink: 0 }}>다음</span>
                <Link href={`/notice/${nextNotice.id}`} style={{ fontSize: '0.9rem', color: 'var(--gray-800)', flex: 1, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-800)')}>
                  {nextNotice.title}
                </Link>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem', flexShrink: 0 }}>{nextNotice.created_at.slice(0, 10)}</span>
              </div>
            )}
            {prevNotice && (
              <div style={{ display: 'flex', gap: '16px', padding: '14px 24px', alignItems: 'center' }}>
                <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem', fontWeight: 600, width: '40px', flexShrink: 0 }}>이전</span>
                <Link href={`/notice/${prevNotice.id}`} style={{ fontSize: '0.9rem', color: 'var(--gray-800)', flex: 1, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-800)')}>
                  {prevNotice.title}
                </Link>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.8rem', flexShrink: 0 }}>{prevNotice.created_at.slice(0, 10)}</span>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href="/notice" className="btn-outline-gold">목록으로</Link>
          </div>
        </div>
      </section>
    </>
  )
}
