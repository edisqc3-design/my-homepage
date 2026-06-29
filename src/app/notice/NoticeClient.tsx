'use client'

import PageBanner from '@/components/ui/PageBanner'
import Link from 'next/link'
import type { Notice } from '@/types'

export default function NoticeClient({ notices }: { notices: Notice[] }) {
  return (
    <>
      <PageBanner
        title="공지사항"
        subtitle="우드자재닷컴의 새로운 소식을 전해드립니다"
        breadcrumb={[{ label: '홈', href: '/' }, { label: '공지사항' }]}
      />

      <section className="section-gap">
        <div className="container" style={{ maxWidth: '860px' }}>
          {notices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📢</div>
              <p>등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--gray-100)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px', padding: '12px 24px', background: 'var(--navy)', fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ textAlign: 'center' }}>번호</span>
                <span>제목</span>
                <span style={{ textAlign: 'center' }}>작성일</span>
              </div>

              {notices.map((notice, i) => (
                <div key={notice.id} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr 120px',
                  padding: '16px 24px', alignItems: 'center',
                  borderTop: i === 0 ? 'none' : '1px solid var(--gray-100)',
                  background: notice.is_pinned ? 'rgba(201,168,76,0.04)' : 'var(--white)',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => {
                    if (!notice.is_pinned) (e.currentTarget as HTMLDivElement).style.background = 'var(--gray-50)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = notice.is_pinned ? 'rgba(201,168,76,0.04)' : 'var(--white)'
                  }}>
                  <div style={{ textAlign: 'center' }}>
                    {notice.is_pinned ? (
                      <span style={{ padding: '2px 8px', background: 'var(--gold)', color: 'var(--navy)', fontSize: '0.68rem', fontWeight: 700, borderRadius: '10px' }}>공지</span>
                    ) : (
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{notices.length - i}</span>
                    )}
                  </div>
                  <div>
                    <Link href={`/notice/${notice.id}`} style={{ fontSize: '0.925rem', color: 'var(--gray-900)', fontWeight: notice.is_pinned ? 700 : 400, transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-900)')}>
                      {notice.is_pinned && <span style={{ color: 'var(--gold)', marginRight: '6px' }}>📌</span>}
                      {notice.title}
                    </Link>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                    {notice.created_at.slice(0, 10)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
