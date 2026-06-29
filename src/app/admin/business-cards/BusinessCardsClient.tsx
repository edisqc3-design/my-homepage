'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AdminSection, AdminCard, Btn, Input, Textarea, Toggle, ConfirmModal, Toast } from '@/components/admin/AdminUI'
import type { BusinessCard } from '@/types'

const ICONS = ['🏢','🌿','📋','🛠️','🚚','📐','🏆','💬','📞','🔬','🌐','⭐','🎯','💡','🤝','🔑']

const EMPTY: Partial<BusinessCard> = { icon: '🏢', title: '', description: '', href: '/', is_active: true }

export default function BusinessCardsClient({ initialCards }: { initialCards: BusinessCard[] }) {
  const [cards, setCards] = useState<BusinessCard[]>(initialCards)
  const [editing, setEditing] = useState<Partial<BusinessCard> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)

  const sb = createClient()
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    if (!editing?.title) { showToast('제목을 입력해 주세요.', 'error'); return }
    setSaving(true)
    if (isNew) {
      const { data, error } = await sb.from('business_cards').insert([{ ...editing, sort_order: cards.length + 1 }]).select().single()
      if (error) showToast('저장 실패', 'error')
      else { setCards(p => [...p, data]); showToast('카드 추가 완료') }
    } else {
      const { error } = await sb.from('business_cards').update(editing).eq('id', editing.id!)
      if (error) showToast('저장 실패', 'error')
      else { setCards(p => p.map(c => c.id === editing.id ? { ...c, ...editing } as BusinessCard : c)); showToast('카드 수정 완료') }
    }
    setSaving(false); setEditing(null); setIsNew(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const { error } = await sb.from('business_cards').delete().eq('id', deleteTarget)
    if (error) showToast('삭제 실패', 'error')
    else { setCards(p => p.filter(c => c.id !== deleteTarget)); showToast('삭제 완료') }
    setDeleteTarget(null)
  }

  const handleOrder = async (id: string, dir: 'up' | 'down') => {
    const idx = cards.findIndex(c => c.id === id)
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === cards.length - 1)) return
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    const next = [...cards];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    setCards(next)
    await Promise.all([
      sb.from('business_cards').update({ sort_order: idx + 1 }).eq('id', next[idx].id),
      sb.from('business_cards').update({ sort_order: swapIdx + 1 }).eq('id', next[swapIdx].id),
    ])
  }

  return (
    <div>
      <AdminSection
        title="비즈니스 카드 관리"
        desc="홈페이지 사업안내 섹션의 카드를 관리합니다."
        action={<Btn onClick={() => { setEditing({ ...EMPTY }); setIsNew(true) }}>+ 카드 추가</Btn>}
      />

      {/* 그리드 목록 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {cards.map((card, i) => (
          <AdminCard key={card.id} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '4px' }}>
              <Toggle value={card.is_active} onChange={async () => {
                await sb.from('business_cards').update({ is_active: !card.is_active }).eq('id', card.id)
                setCards(p => p.map(c => c.id === card.id ? { ...c, is_active: !c.is_active } : c))
              }} />
            </div>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{card.icon}</div>
            <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem', marginBottom: '6px' }}>{card.title}</p>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '12px' }}>{card.description}</p>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <Btn variant="ghost" size="sm" onClick={() => handleOrder(card.id, 'up')} disabled={i === 0}>↑</Btn>
              <Btn variant="ghost" size="sm" onClick={() => handleOrder(card.id, 'down')} disabled={i === cards.length - 1}>↓</Btn>
              <Btn variant="secondary" size="sm" onClick={() => { setEditing({ ...card }); setIsNew(false) }}>수정</Btn>
              <Btn variant="danger" size="sm" onClick={() => setDeleteTarget(card.id)}>삭제</Btn>
            </div>
          </AdminCard>
        ))}

        {/* 추가 버튼 */}
        <div onClick={() => { setEditing({ ...EMPTY }); setIsNew(true) }} style={{
          border: '2px dashed #d1d5db', borderRadius: '12px', padding: '24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#9ca3af', gap: '8px', minHeight: '160px', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#b45309' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af' }}>
          <span style={{ fontSize: '1.5rem' }}>+</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>카드 추가</span>
        </div>
      </div>

      {/* 편집 모달 */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628' }}>{isNew ? '카드 추가' : '카드 수정'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9ca3af' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 아이콘 선택 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>아이콘</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {ICONS.map(icon => (
                    <button key={icon} type="button" onClick={() => setEditing(p => ({ ...p!, icon }))} style={{
                      width: '40px', height: '40px', borderRadius: '8px', fontSize: '1.2rem',
                      border: editing.icon === icon ? '2px solid #c9a84c' : '1px solid #e5e7eb',
                      background: editing.icon === icon ? '#fffbf0' : '#fff',
                      cursor: 'pointer',
                    }}>{icon}</button>
                  ))}
                </div>
                <Input style={{ marginTop: '8px' }} placeholder="직접 입력 (이모지)" value={editing.icon ?? ''} onChange={e => setEditing(p => ({ ...p!, icon: e.target.value }))} />
              </div>
              <Input label="제목" required value={editing.title ?? ''} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} />
              <Textarea label="설명" rows={3} value={editing.description ?? ''} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))} />
              <Input label="링크 URL" value={editing.href ?? ''} onChange={e => setEditing(p => ({ ...p!, href: e.target.value }))} />
              <Toggle value={editing.is_active ?? true} onChange={v => setEditing(p => ({ ...p!, is_active: v }))} label="활성화" />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <Btn variant="secondary" onClick={() => setEditing(null)}>취소</Btn>
              <Btn onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Btn>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="카드를 삭제할까요?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
