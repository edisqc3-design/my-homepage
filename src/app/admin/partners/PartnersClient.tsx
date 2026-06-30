'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { revalidateHome } from '@/lib/actions'
import { AdminSection, AdminCard, Btn, Input, Toggle, ImageUploader, ConfirmModal, Toast } from '@/components/admin/AdminUI'
import type { Partner } from '@/types'

export default function PartnersClient({ initialPartners }: { initialPartners: Partner[] }) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)
  const [editing, setEditing] = useState<Partial<Partner> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set())
  const [savingAll, setSavingAll] = useState(false)

  const sb = createClient()
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    if (!editing?.name) { showToast('회사명을 입력해 주세요.', 'error'); return }
    setSaving(true)
    if (isNew) {
      const { data, error } = await sb.from('partners').insert([{ ...editing, sort_order: partners.length + 1 }]).select().single()
      if (error) showToast('저장 실패', 'error')
      else { setPartners(p => [...p, data]); showToast('파트너 추가 완료'); revalidateHome() }
    } else {
      const { error } = await sb.from('partners').update(editing).eq('id', editing.id!)
      if (error) showToast('저장 실패', 'error')
      else { setPartners(p => p.map(x => x.id === editing.id ? { ...x, ...editing } as Partner : x)); showToast('파트너 수정 완료'); revalidateHome() }
    }
    setSaving(false); setEditing(null); setIsNew(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await sb.from('partners').delete().eq('id', deleteTarget)
    setPartners(p => p.filter(x => x.id !== deleteTarget))
    showToast('삭제 완료'); setDeleteTarget(null); revalidateHome()
  }

  const handleOrder = async (id: string, dir: 'up' | 'down') => {
    const idx = partners.findIndex(p => p.id === id)
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === partners.length - 1)) return
    const si = dir === 'up' ? idx - 1 : idx + 1
    const next = [...partners];
    [next[idx], next[si]] = [next[si], next[idx]]
    setPartners(next)
    await Promise.all([
      sb.from('partners').update({ sort_order: idx + 1 }).eq('id', next[idx].id),
      sb.from('partners').update({ sort_order: si + 1 }).eq('id', next[si].id),
    ])
    revalidateHome()
  }

  const handleSaveAll = async () => {
    if (dirtyIds.size === 0) return
    setSavingAll(true)
    const ids = Array.from(dirtyIds)
    const results = await Promise.all(ids.map(id => {
      const partner = partners.find(x => x.id === id)!
      return sb.from('partners').update({ is_active: partner.is_active }).eq('id', id)
    }))
    const hasError = results.some(r => r.error)
    if (hasError) {
      showToast('일부 항목 저장에 실패했습니다.', 'error')
    } else {
      showToast('변경사항이 저장되었습니다.')
      setDirtyIds(new Set())
      revalidateHome()
    }
    setSavingAll(false)
  }

  return (
    <div>
      <AdminSection
        title="파트너 관리"
        desc="홈페이지 하단 파트너/고객사 로고를 관리합니다."
        action={
          <div style={{ display: 'flex', gap: '8px' }}>
            {dirtyIds.size > 0 && (
              <Btn onClick={handleSaveAll} disabled={savingAll}>
                {savingAll ? '저장 중...' : `변경사항 저장 (${dirtyIds.size})`}
              </Btn>
            )}
            <Btn variant={dirtyIds.size > 0 ? 'secondary' : 'primary'} onClick={() => { setEditing({ name: '', logo_url: '', is_active: true }); setIsNew(true) }}>+ 파트너 추가</Btn>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {partners.map((p, i) => (
          <AdminCard key={p.id} style={{
            outline: dirtyIds.has(p.id) ? '2px solid #c9a84c' : 'none',
            outlineOffset: '2px',
          }}>
            {/* 로고 미리보기 */}
            <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', background: '#f8fafc', borderRadius: '6px' }}>
              {p.logo_url
                ? <img src={p.logo_url} alt={p.name} style={{ maxHeight: '40px', maxWidth: '100%', objectFit: 'contain' }} />
                : <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>{p.name}</span>
              }
            </div>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', textAlign: 'center', marginBottom: '10px' }}>{p.name}</p>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Btn variant="ghost" size="sm" onClick={() => handleOrder(p.id, 'up')} disabled={i === 0}>↑</Btn>
              <Btn variant="ghost" size="sm" onClick={() => handleOrder(p.id, 'down')} disabled={i === partners.length - 1}>↓</Btn>
              <Toggle value={p.is_active} onChange={() => {
                const newValue = !p.is_active
                setPartners(prev => prev.map(x => x.id === p.id ? { ...x, is_active: newValue } : x))
                setDirtyIds(prev => new Set(prev).add(p.id))
              }} />
              <Btn variant="secondary" size="sm" onClick={() => { setEditing({ ...p }); setIsNew(false) }}>수정</Btn>
              <Btn variant="danger" size="sm" onClick={() => setDeleteTarget(p.id)}>삭제</Btn>
            </div>
          </AdminCard>
        ))}

        <div onClick={() => { setEditing({ name: '', logo_url: '', is_active: true }); setIsNew(true) }}
          style={{ border: '2px dashed #d1d5db', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af', gap: '6px', minHeight: '120px', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#b45309' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af' }}>
          <span style={{ fontSize: '1.5rem' }}>+</span>
          <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>파트너 추가</span>
        </div>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628' }}>{isNew ? '파트너 추가' : '파트너 수정'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9ca3af' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="회사명" required value={editing.name ?? ''} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))} />
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>로고 이미지</label>
                <ImageUploader value={editing.logo_url ?? ''} onChange={url => setEditing(p => ({ ...p!, logo_url: url }))} folder="partners" />
              </div>
              <Toggle value={editing.is_active ?? true} onChange={v => setEditing(p => ({ ...p!, is_active: v }))} label="활성화" />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <Btn variant="secondary" onClick={() => setEditing(null)}>취소</Btn>
              <Btn onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Btn>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="파트너를 삭제할까요?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
