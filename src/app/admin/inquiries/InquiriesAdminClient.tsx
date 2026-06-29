'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AdminSection, AdminCard, Btn, Textarea, Badge, Toast } from '@/components/admin/AdminUI'
import type { Inquiry } from '@/types'

const STATUS_MAP = {
  pending: { label: '대기', color: 'yellow' as const },
  done:    { label: '완료', color: 'green' as const },
}

export default function InquiriesAdminClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [reply, setReply] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)

  const sb = createClient()
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter)
  const pendingCount = inquiries.filter(i => i.status === 'pending').length

  const handleReply = async () => {
    if (!selected || !reply.trim()) { showToast('답변 내용을 입력해 주세요.', 'error'); return }
    setSaving(true)
    const now = new Date().toISOString()
    const { error } = await sb.from('inquiries').update({
      admin_reply: reply, status: 'done', replied_at: now,
    }).eq('id', selected.id)

    if (error) { showToast('답변 저장 실패', 'error') }
    else {
      const updated = { ...selected, admin_reply: reply, status: 'done' as const, replied_at: now }
      setInquiries(p => p.map(x => x.id === selected.id ? updated : x))
      setSelected(updated)
      showToast('답변이 등록되었습니다')
    }
    setSaving(false)
  }

  const handleStatusChange = async (id: string, status: 'pending' | 'done') => {
    await sb.from('inquiries').update({ status }).eq('id', id)
    setInquiries(p => p.map(x => x.id === id ? { ...x, status } : x))
    if (selected?.id === id) setSelected(p => p ? { ...p, status } : null)
  }

  return (
    <div>
      <AdminSection
        title="문의 관리"
        desc={`전체 ${inquiries.length}건 / 답변 대기 ${pendingCount}건`}
      />

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 180px)' }}>
        {/* 좌측 목록 */}
        <div style={{ width: '360px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 필터 */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'pending', 'done'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 600,
                background: filter === f ? '#0a1628' : '#f3f4f6',
                color: filter === f ? '#fff' : '#6b7280',
                transition: 'all 0.15s',
              }}>
                {f === 'all' ? `전체 (${inquiries.length})` : f === 'pending' ? `대기 (${pendingCount})` : `완료 (${inquiries.length - pendingCount})`}
              </button>
            ))}
          </div>

          {/* 목록 */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af', fontSize: '0.875rem' }}>문의가 없습니다</div>
            )}
            {filtered.map(inq => (
              <div key={inq.id} onClick={() => { setSelected(inq); setReply(inq.admin_reply ?? '') }} style={{
                padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                border: `1px solid ${selected?.id === inq.id ? '#c9a84c' : '#e5e7eb'}`,
                background: selected?.id === inq.id ? '#fffbf0' : '#fff',
                transition: 'all 0.15s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{inq.name}</span>
                    {inq.company && <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{inq.company}</span>}
                  </div>
                  <Badge label={STATUS_MAP[inq.status]?.label ?? '대기'} color={STATUS_MAP[inq.status]?.color ?? 'yellow'} />
                </div>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  [{inq.category}] {inq.content}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{inq.created_at.slice(0, 10)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 우측 상세 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selected ? (
            <AdminCard style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: '#9ca3af' }}>
              <span style={{ fontSize: '3rem' }}>💬</span>
              <p>문의를 선택하면 상세 내용이 표시됩니다</p>
            </AdminCard>
          ) : (
            <AdminCard style={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 문의자 정보 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontWeight: 800, color: '#0a1628', marginBottom: '4px' }}>{selected.name}</h3>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: '#6b7280' }}>
                    {selected.company && <span>🏢 {selected.company}</span>}
                    <span>📞 {selected.phone}</span>
                    {selected.email && <span>✉ {selected.email}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Badge label={STATUS_MAP[selected.status]?.label ?? '대기'} color={STATUS_MAP[selected.status]?.color ?? 'yellow'} />
                  {selected.status === 'done' && (
                    <Btn variant="secondary" size="sm" onClick={() => handleStatusChange(selected.id, 'pending')}>대기로 변경</Btn>
                  )}
                </div>
              </div>

              {/* 문의 내용 */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px 20px' }}>
                <p style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: 700, marginBottom: '8px' }}>
                  [{selected.category}] · {selected.created_at.slice(0, 10)}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.content}</p>
              </div>

              {/* 기존 답변 */}
              {selected.admin_reply && (
                <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '10px', padding: '16px 20px' }}>
                  <p style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 700, marginBottom: '8px' }}>
                    ✅ 등록된 답변 ({selected.replied_at?.slice(0, 10)})
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.admin_reply}</p>
                </div>
              )}

              {/* 답변 입력 */}
              <div style={{ marginTop: 'auto' }}>
                <Textarea
                  label={selected.admin_reply ? '답변 수정' : '답변 작성'}
                  rows={5}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="고객에게 전달될 답변을 입력하세요..."
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'flex-end' }}>
                  <Btn variant="secondary" onClick={() => setReply('')}>비우기</Btn>
                  {selected.admin_reply && (
                    <Btn variant="secondary" onClick={() => setReply(selected.admin_reply ?? '')}>저장된 답변으로</Btn>
                  )}
                  <Btn onClick={handleReply} disabled={saving || !reply.trim()}>
                    {saving ? '저장 중...' : selected.admin_reply ? '답변 수정' : '답변 등록'}
                  </Btn>
                </div>
              </div>
            </AdminCard>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
