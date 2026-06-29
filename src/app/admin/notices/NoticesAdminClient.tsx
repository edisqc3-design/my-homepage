'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AdminSection, AdminCard, Btn, Input, Textarea, Toggle, ConfirmModal, Toast, Badge } from '@/components/admin/AdminUI'
import type { Notice } from '@/types'

const EMPTY: Partial<Notice> = { title: '', content: '', is_pinned: false, is_active: true }

export default function NoticesAdminClient({ initialNotices }: { initialNotices: Notice[] }) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices)
  const [editing, setEditing] = useState<Partial<Notice> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)

  const sb = createClient()
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    if (!editing?.title) { showToast('제목을 입력해 주세요.', 'error'); return }
    setSaving(true)
    if (isNew) {
      const { data, error } = await sb.from('notices').insert([editing]).select().single()
      if (error) showToast('저장 실패', 'error')
      else { setNotices(p => [data, ...p]); showToast('공지사항 등록 완료') }
    } else {
      const { error } = await sb.from('notices').update(editing).eq('id', editing.id!)
      if (error) showToast('저장 실패', 'error')
      else { setNotices(p => p.map(x => x.id === editing.id ? { ...x, ...editing } as Notice : x)); showToast('수정 완료') }
    }
    setSaving(false); setEditing(null); setIsNew(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await sb.from('notices').delete().eq('id', deleteTarget)
    setNotices(p => p.filter(x => x.id !== deleteTarget))
    showToast('삭제 완료'); setDeleteTarget(null)
  }

  return (
    <div>
      <AdminSection
        title="공지사항 관리"
        desc={`총 ${notices.length}개의 공지사항이 있습니다.`}
        action={<Btn onClick={() => { setEditing({ ...EMPTY }); setIsNew(true) }}>+ 공지 작성</Btn>}
      />

      <AdminCard style={{ padding: '0', overflow: 'hidden' }}>
        {/* 테이블 헤더 */}
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 140px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280' }}>
          <span style={{ textAlign: 'center' }}>고정</span>
          <span>제목</span>
          <span style={{ textAlign: 'center' }}>상태</span>
          <span style={{ textAlign: 'center' }}>날짜</span>
          <span style={{ textAlign: 'center' }}>관리</span>
        </div>

        {notices.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>등록된 공지사항이 없습니다.</div>
        )}

        {notices.map((notice, i) => (
          <div key={notice.id} style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 80px 80px 140px',
            padding: '13px 20px', alignItems: 'center',
            borderBottom: i < notices.length - 1 ? '1px solid #f3f4f6' : 'none',
            background: notice.is_pinned ? 'rgba(201,168,76,0.04)' : '#fff',
          }}>
            <div style={{ textAlign: 'center' }}>
              <Toggle value={notice.is_pinned} onChange={async () => {
                await sb.from('notices').update({ is_pinned: !notice.is_pinned }).eq('id', notice.id)
                setNotices(p => p.map(x => x.id === notice.id ? { ...x, is_pinned: !x.is_pinned } : x))
              }} />
            </div>
            <div>
              <p style={{ fontWeight: notice.is_pinned ? 700 : 400, color: '#111827', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {notice.is_pinned && <span style={{ marginRight: '6px' }}>📌</span>}{notice.title}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Badge label={notice.is_active ? '공개' : '비공개'} color={notice.is_active ? 'green' : 'gray'} />
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#9ca3af' }}>
              {notice.created_at.slice(0, 10)}
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
              <Toggle value={notice.is_active} onChange={async () => {
                await sb.from('notices').update({ is_active: !notice.is_active }).eq('id', notice.id)
                setNotices(p => p.map(x => x.id === notice.id ? { ...x, is_active: !x.is_active } : x))
              }} />
              <Btn variant="secondary" size="sm" onClick={() => { setEditing({ ...notice }); setIsNew(false) }}>수정</Btn>
              <Btn variant="danger" size="sm" onClick={() => setDeleteTarget(notice.id)}>삭제</Btn>
            </div>
          </div>
        ))}
      </AdminCard>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628' }}>{isNew ? '공지 작성' : '공지 수정'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9ca3af' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="제목" required value={editing.title ?? ''} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} />
              <Textarea label="내용" rows={10} value={editing.content ?? ''} onChange={e => setEditing(p => ({ ...p!, content: e.target.value }))} />
              <div style={{ display: 'flex', gap: '24px' }}>
                <Toggle value={editing.is_pinned ?? false} onChange={v => setEditing(p => ({ ...p!, is_pinned: v }))} label="상단 고정 (📌)" />
                <Toggle value={editing.is_active ?? true} onChange={v => setEditing(p => ({ ...p!, is_active: v }))} label="공개" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <Btn variant="secondary" onClick={() => setEditing(null)}>취소</Btn>
              <Btn onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Btn>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="공지사항을 삭제할까요?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
