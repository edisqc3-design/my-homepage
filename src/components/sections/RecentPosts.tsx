'use client'

import Link from 'next/link'
import type { Notice, PublicInquiry } from '@/types'

type PostItem = {
  id: string
  title: string
  created_at: string
  is_pinned?: boolean
}

function PostList({ title, items, href }: { title: string, items: PostItem[], href: string }) {
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px', background: 'var(--navy)', borderRadius: '8px 8px 0 0',
      }}>
        <strong style={{ color: 'var(--white)', fontSize: '0.95rem', fontWeight: 700 }}>{title}</strong>
        <Link href={href} style={{ color: 'var(--gold)', fontSize: '0.78rem' }}>더보기 +</Link>
      </div>

      <ul style={{ border: '1px solid var(--gray-100)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden', listStyle: 'none' }}>
        {items.length === 0 ? (
          <li style={{ padding: '20px 16px', color: 'var(--gray-500)', fontSize: '0.875rem', textAlign: 'center' }}>
            등록된 글이 없습니다.
          </li>
        ) : items.map((item, i) => (
          <li key={item.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '11px 16px', borderTop: i > 0 ? '1px solid var(--gray-100)' : 'none', transition: 'background 0.15s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--gray-50)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
              {item.is_pinned && (
                <span style={{ padding: '1px 6px', background: '#e63946', color: 'white', fontSize: '0.65rem', fontWeight: 700, borderRadius: '3px', flexShrink: 0 }}>공지</span>
              )}
              <Link href={`${href}/${item.id}`} style={{
                fontSize: '0.875rem', color: 'var(--gray-900)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-900)')}>
                {item.title}
              </Link>
            </div>
            <span style={{ color: 'var(--gray-500)', fontSize: '0.78rem', flexShrink: 0, marginLeft: '12px' }}>
              {item.created_at.slice(5, 10)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function RecentPosts({ notices, inquiries }: { notices: Notice[], inquiries: PublicInquiry[] }) {
  const noticeItems: PostItem[] = notices.map(n => ({
    id: n.id, title: n.title, created_at: n.created_at, is_pinned: n.is_pinned,
  }))

  const inquiryItems: PostItem[] = inquiries.map(q => ({
    id: q.id,
    title: `[${q.category ?? '기타'}] ${q.content}`,
    created_at: q.created_at,
  }))

  return (
    <section className="section-gap-sm" style={{ background: 'var(--gray-50)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="posts-grid">
          <PostList title="공지사항" items={noticeItems} href="/notice" />
          <PostList title="고객 문의" items={inquiryItems} href="/inquiry/board" />
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .posts-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}
