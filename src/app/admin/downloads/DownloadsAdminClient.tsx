'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AdminSection, AdminCard, Btn, Input, Select, Toggle, ConfirmModal, Toast, Badge } from '@/components/admin/AdminUI'
import type { Download } from '@/types'

const CATEGORIES = [
  { value: '카탈로그', label: '카탈로그' },
  { value: '시방서', label: '시방서' },
  { value: '인증서', label: '인증서' },
  { value: '기타', label: '기타' },
]

function formatSize(bytes: number | null) {
  if (!bytes) return '-'
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

const EMPTY: Partial<Download> = { title: '', category: '카탈로그', file_url: '', file_name: '', is_active: true }

export default function DownloadsAdminClient({ initialDownloads }: { initialDownloads: Download[] }) {
  const [downloads, setDownloads] = useState<Download[]>(initialDownloads)
  const [editing, setEditing] = useState<Partial<Download> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const sb = createClient()
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = `downloads/${Date.now()}_${file.name}`
    const { error } = await sb.storage.from('files').upload(fileName, file, { upsert: true })
    if (error) { showToast('파일 업로드 실패', 'error'); setUploading(false); return }
    const { data } = sb.storage.from('files').getPublicUrl(fileName)
    setEditing(p => ({ ...p!, file_url: data.publicUrl, file_name: file.name, file_size: file.size }))
    setUploading(false)
    showToast('파일 업로드 완료')
  }

  const handleSave = async () => {
    if (!editing?.title) { showToast('제목을 입력해 주세요.', 'error'); return }
    if (!editing?.file_url) { showToast('파일을 업로드해 주세요.', 'error'); return }
    setSaving(true)
    if (isNew) {
      const { data, error } = await sb.from('downloads').insert([{ ...editing, sort_order: downloads.length + 1, download_count: 0 }]).select().single()
      if (error) showToast('저장 실패', 'error')
      else { setDownloads(p => [...p, data]); showToast('자료 등록 완료') }
    } else {
      const { error } = await sb.from('downloads').update(editing).eq('id', editing.id!)
      if (error) showToast('저장 실패', 'error')
      else { setDownloads(p => p.map(x => x.id === editing.id ? { ...x, ...editing } as Download : x)); showToast('수정 완료') }
    }
    setSaving(false); setEditing(null); setIsNew(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await sb.from('downloads').delete().eq('id', deleteTarget)
    setDownloads(p => p.filter(x => x.id !== deleteTarget))
    showToast('삭제 완료'); setDeleteTarget(null)
  }

  return (
    <div>
      <AdminSection
        title="자료실 관리"
        desc={`총 ${downloads.length}개 자료가 등록되어 있습니다.`}
        action={<Btn onClick={() => { setEditing({ ...EMPTY }); setIsNew(true) }}>+ 자료 등록</Btn>}
      />

      <AdminCard style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 100px 140px', padding: '12px 20px', background: '#f8fafc', borderBottom: '1px solid #e5e7eb', fontSize: '0.78rem', fontWeight: 700, color: '#6b7280' }}>
          <span>제목 / 파일명</span>
          <span style={{ textAlign: 'center' }}>분류</span>
          <span style={{ textAlign: 'center' }}>크기</span>
          <span style={{ textAlign: 'center' }}>다운로드</span>
          <span style={{ textAlign: 'center' }}>상태</span>
          <span style={{ textAlign: 'center' }}>관리</span>
        </div>

        {downloads.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>등록된 자료가 없습니다.</div>
        )}

        {downloads.map((dl, i) => (
          <div key={dl.id} style={{
            display: 'grid', gridTemplateColumns: '1fr 100px 80px 80px 100px 140px',
            padding: '13px 20px', alignItems: 'center',
            borderBottom: i < downloads.length - 1 ? '1px solid #f3f4f6' : 'none',
          }}>
            <div>
              <p style={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem', marginBottom: '2px' }}>{dl.title}</p>
              {dl.file_name && <p style={{ fontSize: '0.72rem', color: '#9ca3af' }}>📄 {dl.file_name}</p>}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Badge label={dl.category ?? '-'} color="gray" />
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#6b7280' }}>{formatSize(dl.file_size)}</div>
            <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#6b7280' }}>{dl.download_count}회</div>
            <div style={{ textAlign: 'center' }}>
              <Toggle value={dl.is_active} onChange={async () => {
                await sb.from('downloads').update({ is_active: !dl.is_active }).eq('id', dl.id)
                setDownloads(p => p.map(x => x.id === dl.id ? { ...x, is_active: !x.is_active } : x))
              }} />
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
              <Btn variant="secondary" size="sm" onClick={() => { setEditing({ ...dl }); setIsNew(false) }}>수정</Btn>
              <Btn variant="danger" size="sm" onClick={() => setDeleteTarget(dl.id)}>삭제</Btn>
            </div>
          </div>
        ))}
      </AdminCard>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628' }}>{isNew ? '자료 등록' : '자료 수정'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9ca3af' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="제목" required value={editing.title ?? ''} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} />
              <Select label="분류" options={CATEGORIES} value={editing.category ?? '카탈로그'} onChange={e => setEditing(p => ({ ...p!, category: e.target.value }))} />

              {/* 파일 업로드 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  파일 업로드 <span style={{ color: '#e63946' }}>*</span>
                </label>
                {editing.file_name && (
                  <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#166534' }}>📄 {editing.file_name}</span>
                    <button onClick={() => setEditing(p => ({ ...p!, file_url: '', file_name: '', file_size: undefined }))}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>✕</button>
                  </div>
                )}
                <div onClick={() => fileRef.current?.click()} style={{
                  border: '2px dashed #d1d5db', borderRadius: '10px', padding: '20px',
                  textAlign: 'center', cursor: 'pointer', background: '#fafafa', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.background = '#fffbf0' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{uploading ? '⏳' : '📁'}</div>
                  <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>{uploading ? '업로드 중...' : '클릭하여 파일 선택'}</p>
                  <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px' }}>PDF, DOCX, XLSX, ZIP 등 / 최대 50MB</p>
                </div>
                <input ref={fileRef} type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
              </div>

              <Toggle value={editing.is_active ?? true} onChange={v => setEditing(p => ({ ...p!, is_active: v }))} label="공개" />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <Btn variant="secondary" onClick={() => setEditing(null)}>취소</Btn>
              <Btn onClick={handleSave} disabled={saving || uploading}>{saving ? '저장 중...' : '저장'}</Btn>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="자료를 삭제할까요?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
