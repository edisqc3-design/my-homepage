'use client'

import Link from 'next/link'
import type { Notice, PublicInquiry } from '@/types'

export default function RecentPosts({ notices, inquiries }: { notices: Notice[], inquiries: PublicInquiry[] }) {
  return (
    <section style={{ background: 'linear-gradient(180deg, #f8f9fa 0%, #fff 100%)', padding: '72px 0' }}>
      <div className="container">

        {/* 섹션 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '10px' }}>
            NOTICE &amp; INQUIRY
          </p>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '12px' }}>
            공지사항 &amp; 고객 문의
          </h2>
          <div style={{ width: '40px', height: '3px', background: 'var(--gold)', margin: '0 auto', borderRadius: '2px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="posts-grid">

          {/* ── 공지사항 ── */}
          <div style={{ background: 'var(--white)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(10,22,40,0.07)', border: '1px solid rgba(10,22,40,0.06)' }}>
            {/* 카드 헤더 */}
            <div style={{ padding: '22px 28px', background: 'var(--navy)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(201,168,76,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📢</span>
                <strong style={{ color: 'var(--white)', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em' }}>공지사항</strong>
              </div>
              <Link href="/notice" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 600, opacity: 0.85, transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}>
                더보기 <span style={{ fontSize: '0.7rem' }}>›</span>
              </Link>
            </div>

            {/* 목록 */}
            <div style={{ padding: '8px 0' }}>
              {notices.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem' }}>등록된 공지사항이 없습니다.</div>
              ) : notices.map((n, i) => (
                <Link key={n.id} href={`/notice/${n.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 28px', borderBottom: i < notices.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8f9fa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                    {n.is_pinned ? (
                      <span style={{ padding: '2px 7px', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', fontSize: '0.62rem', fontWeight: 800, borderRadius: '4px', flexShrink: 0, letterSpacing: '0.05em' }}>공지</span>
                    ) : (
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, opacity: 0.5 }} />
                    )}
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-900)', fontWeight: n.is_pinned ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', flexShrink: 0, marginLeft: '16px' }}>
                    {n.created_at.slice(5, 10)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── 고객 문의 ── */}
          <div style={{ background: 'var(--white)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(10,22,40,0.07)', border: '1px solid rgba(10,22,40,0.06)' }}>
            {/* 카드 헤더 */}
            <div style={{ padding: '22px 28px', background: 'linear-gradient(135deg, #112240 0%, #1e3a5f 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(201,168,76,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>💬</span>
                <strong style={{ color: 'var(--white)', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em' }}>고객 문의</strong>
              </div>
              <Link href="/inquiry/board" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 600, opacity: 0.85, transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}>
                더보기 <span style={{ fontSize: '0.7rem' }}>›</span>
              </Link>
            </div>

            {/* 목록 */}
            <div style={{ padding: '8px 0' }}>
              {inquiries.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem' }}>등록된 문의가 없습니다.</div>
              ) : inquiries.map((q, i) => (
                <Link key={q.id} href={`/inquiry/board/${q.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 28px', borderBottom: i < inquiries.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8f9fa')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                    {/* 카테고리 뱃지 */}
                    <span style={{ padding: '2px 8px', background: 'rgba(10,22,40,0.07)', color: 'var(--navy)', fontSize: '0.65rem', fontWeight: 700, borderRadius: '4px', flexShrink: 0, letterSpacing: '0.03em' }}>
                      {q.category ?? '기타'}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {q.content}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                    {/* 답변 상태 */}
                    {q.status === 'done' ? (
                      <span style={{ padding: '2px 8px', background: 'rgba(34,197,94,0.1)', color: '#15803d', fontSize: '0.62rem', fontWeight: 800, borderRadius: '4px', letterSpacing: '0.03em' }}>답변완료</span>
                    ) : (
                      <span style={{ padding: '2px 8px', background: 'rgba(234,179,8,0.1)', color: '#a16207', fontSize: '0.62rem', fontWeight: 800, borderRadius: '4px', letterSpacing: '0.03em' }}>대기중</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      {q.created_at.slice(5, 10)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* 문의 작성 링크 */}
            <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(0,0,0,0.05)', background: 'rgba(10,22,40,0.02)' }}>
              <Link href="/inquiry" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '8px', border: '1px dashed rgba(201,168,76,0.4)', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.15s', letterSpacing: '0.02em' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; e.currentTarget.style.borderColor = 'var(--gold)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)' }}>
                ✏️ 1:1 문의 남기기
              </Link>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .posts-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
