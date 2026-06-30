'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AdminSection, AdminCard, Btn, Input, Textarea, Select, Toggle, MultiImageUploader, ConfirmModal, Toast } from '@/components/admin/AdminUI'
import type { GalleryItem } from '@/types'

const CATEGORIES = [
  { value: '상업시설', label: '상업시설' },
  { value: '주거시설', label: '주거시설' },
  { value: '공공시설', label: '공공시설' },
]

const DISPLAY_MODES = [
  { value: 'card',     label: '카드형',    desc: '그리드 카드 + 자동 슬라이드',  icon: '⊞' },
  { value: 'webzine',  label: '웹진형',    desc: '큰 피처드 + 우측 미니 리스트', icon: '▤' },
  { value: 'magazine', label: '매거진형',  desc: '가로 스크롤 대형 카드',        icon: '▭' },
]

const EMPTY: Partial<GalleryItem> = { title: '', category: '상업시설', image_url: '', image_urls: [], description: '', project_date: '', is_active: true }

export default function GalleryAdminClient({ initialItems }: { initialItems: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems)
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)

  // 표시 방식
  const [displayMode, setDisplayMode] = useState<string>('card')   // 현재 저장된 값
  const [pendingMode, setPendingMode] = useState<string>('card')   // 선택 중인 값
  const [modeSaving, setModeSaving] = useState(false)

  const sb = useMemo(() => createClient(), [])
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  // 저장된 표시방식 불러오기
  useEffect(() => {
    sb.from('site_settings').select('value').eq('key', 'gallery_display_mode').single()
      .then(({ data }) => {
        if (data?.value) { setDisplayMode(data.value); setPendingMode(data.value) }
      })
  }, [sb])

  const saveDisplayMode = async () => {
    setModeSaving(true)
    const { data: existing } = await sb.from('site_settings').select('key').eq('key', 'gallery_display_mode').single()
    if (existing) {
      await sb.from('site_settings').update({ value: pendingMode }).eq('key', 'gallery_display_mode')
    } else {
      await sb.from('site_settings').insert({ key: 'gallery_display_mode', value: pendingMode })
    }
    // 메인페이지 ISR 캐시 즉시 갱신
    await fetch('/api/revalidate', { method: 'POST' })
    setDisplayMode(pendingMode)
    setModeSaving(false)
    showToast(`"${DISPLAY_MODES.find(m => m.value === pendingMode)?.label}" 방식으로 저장되었습니다. 메인화면에 즉시 반영됩니다.`)
  }

  const handleSave = async () => {
    if (!editing?.title) { showToast('제목을 입력해 주세요.', 'error'); return }
    setSaving(true)
    const payload = { ...editing, image_url: editing.image_urls?.[0] ?? null }
    if (isNew) {
      const { data, error } = await sb.from('gallery').insert([{ ...payload, sort_order: items.length + 1 }]).select().single()
      if (error) showToast('저장 실패', 'error')
      else { setItems(p => [...p, data]); showToast('시공사례 추가 완료') }
    } else {
      const { error } = await sb.from('gallery').update(payload).eq('id', editing.id!)
      if (error) showToast('저장 실패', 'error')
      else { setItems(p => p.map(x => x.id === editing.id ? { ...x, ...payload } as GalleryItem : x)); showToast('수정 완료') }
    }
    setSaving(false); setEditing(null); setIsNew(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await sb.from('gallery').delete().eq('id', deleteTarget)
    setItems(p => p.filter(x => x.id !== deleteTarget))
    showToast('삭제 완료'); setDeleteTarget(null)
  }

  return (
    <div>
      {/* ── 표시방식 선택 ── */}
      <div style={{ marginBottom: '32px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a1628', marginBottom: '4px' }}>메인화면 표시방식</h3>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>방식 선택 후 저장 버튼을 누르면 메인화면에 즉시 반영됩니다.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {DISPLAY_MODES.map(m => (
            <button
              key={m.value}
              onClick={() => setPendingMode(m.value)}
              style={{
                flex: '1', minWidth: '140px', padding: '14px 16px',
                border: pendingMode === m.value ? '2px solid #c9a84c' : '2px solid #e5e7eb',
                borderRadius: '12px', background: pendingMode === m.value ? '#fffbf0' : '#f9fafb',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{m.icon}</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: pendingMode === m.value ? '#b45309' : '#374151', marginBottom: '3px' }}>{m.label}</div>
              <div style={{ fontSize: '0.73rem', color: '#9ca3af' }}>{m.desc}</div>
              {displayMode === m.value && (
                <div style={{ marginTop: '8px', fontSize: '0.7rem', fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ✓ 현재 적용 중
                </div>
              )}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Btn onClick={saveDisplayMode} disabled={modeSaving || pendingMode === displayMode}>
            {modeSaving ? '저장 중...' : '저장하고 메인화면에 반영'}
          </Btn>
          {pendingMode !== displayMode && (
            <span style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600 }}>
              ⚠ 아직 저장되지 않았습니다
            </span>
          )}
        </div>
      </div>

      <AdminSection
        title="시공사례 관리"
        desc={`총 ${items.length}개의 시공사례가 등록되어 있습니다.`}
        action={<Btn onClick={() => { setEditing({ ...EMPTY }); setIsNew(true) }}>+ 사례 추가</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {items.map(item => (
          <AdminCard key={item.id} style={{ padding: '0', overflow: 'hidden' }}>
            <div
              onClick={() => window.open(`/gallery/${item.id}`, '_blank')}
              title="메인 사이트에서 보기"
              style={{ height: '140px', background: 'linear-gradient(135deg, #1e3a5f, #0a1628)', position: 'relative', cursor: 'pointer' }}>
              {item.image_url
                ? <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem', opacity: 0.3 }}>🏗️</div>
              }
              <span style={{
                position: 'absolute', bottom: '8px', right: '8px',
                width: '24px', height: '24px', borderRadius: '6px',
                background: 'rgba(10,22,40,0.6)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
              </span>
              <span style={{
                position: 'absolute', top: '8px', left: '8px',
                padding: '2px 8px', background: 'rgba(0,0,0,0.6)', color: '#fff',
                fontSize: '0.68rem', fontWeight: 700, borderRadius: '8px',
              }}>{item.category}</span>
              <span style={{
                position: 'absolute', top: '8px', right: '8px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: item.is_active ? '#22c55e' : '#9ca3af',
              }} />
            </div>
            <div style={{ padding: '12px' }}>
              <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.85rem', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
              <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '10px' }}>{item.project_date ?? item.created_at.slice(0, 10)}</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Toggle value={item.is_active} onChange={async () => {
                  await sb.from('gallery').update({ is_active: !item.is_active }).eq('id', item.id)
                  setItems(p => p.map(x => x.id === item.id ? { ...x, is_active: !x.is_active } : x))
                }} />
                <Btn variant="secondary" size="sm" onClick={() => {
                  const urls = item.image_urls?.length ? item.image_urls : (item.image_url ? [item.image_url] : [])
                  setEditing({ ...item, image_urls: urls }); setIsNew(false)
                }}>수정</Btn>
                <Btn variant="danger" size="sm" onClick={() => setDeleteTarget(item.id)}>삭제</Btn>
              </div>
            </div>
          </AdminCard>
        ))}

        <div onClick={() => { setEditing({ ...EMPTY }); setIsNew(true) }}
          style={{ border: '2px dashed #d1d5db', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af', gap: '8px', minHeight: '240px', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#b45309' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af' }}>
          <span style={{ fontSize: '2rem' }}>+</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>사례 추가</span>
        </div>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628' }}>{isNew ? '시공사례 추가' : '시공사례 수정'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9ca3af' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="제목" required value={editing.title ?? ''} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} />
              <Select label="카테고리" options={CATEGORIES} value={editing.category ?? '상업시설'} onChange={e => setEditing(p => ({ ...p!, category: e.target.value }))} />
              <Input label="시공 날짜" type="date" value={editing.project_date ?? ''} onChange={e => setEditing(p => ({ ...p!, project_date: e.target.value }))} />
              <Textarea label="설명" rows={3} value={editing.description ?? ''} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))} />
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>이미지 (여러 장 등록 가능)</label>
                <MultiImageUploader value={editing.image_urls ?? []} onChange={urls => setEditing(p => ({ ...p!, image_urls: urls }))} folder="gallery" />
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

      <ConfirmModal open={!!deleteTarget} title="시공사례를 삭제할까요?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
