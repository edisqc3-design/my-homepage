'use client'

import { useState } from 'react'
import { AdminSection, AdminCard, Badge } from '@/components/admin/AdminUI'

type Member = {
  id: string
  email: string
  name: string
  created_at: string
  last_sign_in_at: string | null
  inquiry_count: number
  confirmed: boolean
}

export default function MembersAdminClient({ members }: { members: Member[] }) {
  const [search, setSearch] = useState('')

  const filtered = members.filter(m =>
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <AdminSection
        title="회원 관리"
        desc={`가입된 회원 ${members.length}명`}
      />

      {/* 통계 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: '전체 회원', value: members.length, icon: '👥', color: '#0a1628' },
          { label: '이번 달 가입', value: members.filter(m => new Date(m.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length, icon: '🆕', color: '#166534' },
          { label: '문의 회원', value: members.filter(m => m.inquiry_count > 0).length, icon: '💬', color: '#1d4ed8' },
        ].map(stat => (
          <AdminCard key={stat.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '6px' }}>{stat.label}</p>
                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: stat.color }}>{stat.value}</p>
              </div>
              <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* 검색 */}
      <div style={{ marginBottom: '16px' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="이름 또는 이메일로 검색..."
          style={{
            width: '100%', maxWidth: '360px', padding: '9px 14px',
            border: '1px solid #d1d5db', borderRadius: '8px',
            fontSize: '0.875rem', outline: 'none',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#c9a84c')}
          onBlur={e => (e.currentTarget.style.borderColor = '#d1d5db')}
        />
      </div>

      {/* 테이블 */}
      <AdminCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 120px 100px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280' }}>
          <span>이름 / 이메일</span>
          <span style={{ textAlign: 'center' }}>가입일</span>
          <span style={{ textAlign: 'center' }}>문의 수</span>
          <span style={{ textAlign: 'center' }}>마지막 로그인</span>
          <span style={{ textAlign: 'center' }}>상태</span>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            {search ? '검색 결과가 없습니다.' : '가입된 회원이 없습니다.'}
          </div>
        )}

        {filtered.map((member, i) => (
          <div key={member.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 120px 100px 120px 100px',
            padding: '14px 20px', alignItems: 'center',
            borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
            transition: 'background 0.1s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            {/* 이름/이메일 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#0a1628', color: '#c9a84c',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '0.9rem', flexShrink: 0,
              }}>
                {(member.name || member.email)[0].toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.875rem', marginBottom: '2px' }}>
                  {member.name || '이름 없음'}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af' }}>{member.email}</p>
              </div>
            </div>

            {/* 가입일 */}
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#6b7280' }}>
              {member.created_at.slice(0, 10)}
            </div>

            {/* 문의 수 */}
            <div style={{ textAlign: 'center' }}>
              {member.inquiry_count > 0 ? (
                <span style={{ padding: '3px 10px', background: '#dbeafe', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, borderRadius: '10px' }}>
                  {member.inquiry_count}건
                </span>
              ) : (
                <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>-</span>
              )}
            </div>

            {/* 마지막 로그인 */}
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af' }}>
              {member.last_sign_in_at
                ? new Date(member.last_sign_in_at).toLocaleDateString('ko-KR')
                : '없음'}
            </div>

            {/* 상태 */}
            <div style={{ textAlign: 'center' }}>
              <Badge label={member.confirmed ? '인증완료' : '미인증'} color={member.confirmed ? 'green' : 'gray'} />
            </div>
          </div>
        ))}
      </AdminCard>
    </div>
  )
}
