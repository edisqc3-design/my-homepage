'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AdminSection, AdminCard, Btn, Input, Textarea, Toggle, ConfirmModal, Toast } from '@/components/admin/AdminUI'
import type { HeroSlide } from '@/types'

const EMPTY: Partial<HeroSlide> = {
  tag: '', title: '', description: '', cta_label: '자세히 보기', cta_href: '/',
  cta2_label: '문의하기', cta2_href: '/inquiry',
  bg_type: 'color', bg_value: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #0a1628 100%)',
  is_active: true,
}

export default function HeroAdminClient({ initialSlides }: { initialSlides: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides)
  const [editing, setEditing] = useState<Partial<HeroSlide> | null>(null)
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
      const { data, error } = await sb.from('hero_slides').insert([{
        ...editing, sort_order: slides.length + 1,
      }]).select().single()
      if (error) { showToast('저장 실패', 'error') }
      else { setSlides(prev => [...prev, data]); showToast('슬라이드 추가 완료') }
    } else {
      const { error } = await sb.from('hero_slides').update(editing).eq('id', editing.id!)
      if (error) { showToast('저장 실패', 'error') }
      else {
        setSlides(prev => prev.map(s => s.id === editing.id ? { ...s, ...editing } as HeroSlide : s))
        showToast('슬라이드 수정 완료')
      }
    }

    setSaving(false)
    setEditing(null)
    setIsNew(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const { error } = await sb.from('hero_slides').delete().eq('id', deleteTarget)
    if (error) { showToast('삭제 실패', 'error') }
    else { setSlides(prev => prev.filter(s => s.id !== deleteTarget)); showToast('삭제 완료') }
    setDeleteTarget(null)
  }

  const handleToggleActive = async (slide: HeroSlide) => {
    const { error } = await sb.from('hero_slides').update({ is_active: !slide.is_active }).eq('id', slide.id)
    if (!error) setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, is_active: !s.is_active } : s))
  }

  const handleOrder = async (id: string, dir: 'up' | 'down') => {
    const idx = slides.findIndex(s => s.id === id)
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === slides.length - 1)) return
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    const newSlides = [...slides]
    ;[newSlides[idx], newSlides[swapIdx]] = [newSlides[swapIdx], newSlides[idx]]
    setSlides(newSlides)
    await Promise.all([
      sb.from('hero_slides').update({ sort_order: idx + 1 }).eq('id', newSlides[idx].id),
      sb.from('hero_slides').update({ sort_order: swapIdx + 1 }).eq('id', newSlides[swapIdx].id),
    ])
  }

  return (
    <div>
      <AdminSection
        title="슬라이더 관리"
        desc="홈페이지 메인 슬라이더를 관리합니다. 순서를 변경하거나 내용을 수정하세요."
        action={
          <Btn onClick={() => { setEditing({ ...EMPTY }); setIsNew(true) }}>
            + 슬라이드 추가
          </Btn>
        }
      />

      {/* 슬라이드 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {slides.length === 0 && (
          <AdminCard>
            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 0' }}>등록된 슬라이드가 없습니다.</p>
          </AdminCard>
        )}
        {slides.map((slide, i) => (
          <AdminCard key={slide.id}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {/* 배경 미리보기 */}
              <div style={{
                width: '120px', height: '72px', borderRadius: '8px', flexShrink: 0,
                background: slide.bg_value ?? '#0a1628',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', padding: '4px',
                textAlign: 'center',
              }}>
                {slide.bg_type === 'image' && slide.bg_value
                  ? <img src={slide.bg_value} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                  : '배경 미리보기'
                }
              </div>

              {/* 내용 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                  {slide.tag && <span style={{ padding: '2px 8px', background: 'rgba(201,168,76,0.12)', color: '#b45309', fontSize: '0.72rem', fontWeight: 700, borderRadius: '8px' }}>{slide.tag}</span>}
                  <span style={{ padding: '2px 8px', background: slide.is_active ? '#dcfce7' : '#f3f4f6', color: slide.is_active ? '#166534' : '#6b7280', fontSize: '0.72rem', fontWeight: 700, borderRadius: '8px' }}>
                    {slide.is_active ? '활성' : '비활성'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>순서 {i + 1}</span>
                </div>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: '4px', fontSize: '0.9rem', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{slide.title}</p>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slide.description}</p>
              </div>

              {/* 액션 */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Btn variant="ghost" size="sm" onClick={() => handleOrder(slide.id, 'up')} disabled={i === 0}>↑</Btn>
                <Btn variant="ghost" size="sm" onClick={() => handleOrder(slide.id, 'down')} disabled={i === slides.length - 1}>↓</Btn>
                <Toggle value={slide.is_active} onChange={() => handleToggleActive(slide)} />
                <Btn variant="secondary" size="sm" onClick={() => { setEditing({ ...slide }); setIsNew(false) }}>수정</Btn>
                <Btn variant="danger" size="sm" onClick={() => setDeleteTarget(slide.id)}>삭제</Btn>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* 편집 패널 */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628' }}>
                {isNew ? '슬라이드 추가' : '슬라이드 수정'}
              </h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9ca3af' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="태그 (선택)" value={editing.tag ?? ''} onChange={e => setEditing(p => ({ ...p!, tag: e.target.value }))} placeholder="프리미엄 건축자재" />
              <Textarea label="제목" required rows={2} value={editing.title ?? ''} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} placeholder="줄바꿈은 Enter로 입력" />
              <Textarea label="설명" rows={3} value={editing.description ?? ''} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input label="버튼1 텍스트" value={editing.cta_label ?? ''} onChange={e => setEditing(p => ({ ...p!, cta_label: e.target.value }))} />
                <Input label="버튼1 링크" value={editing.cta_href ?? ''} onChange={e => setEditing(p => ({ ...p!, cta_href: e.target.value }))} />
                <Input label="버튼2 텍스트" value={editing.cta2_label ?? ''} onChange={e => setEditing(p => ({ ...p!, cta2_label: e.target.value }))} />
                <Input label="버튼2 링크" value={editing.cta2_href ?? ''} onChange={e => setEditing(p => ({ ...p!, cta2_href: e.target.value }))} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>배경</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  {['color', 'image'].map(t => (
                    <button key={t} type="button" onClick={() => setEditing(p => ({ ...p!, bg_type: t as 'color' | 'image' }))} style={{
                      padding: '6px 16px', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                      background: editing.bg_type === t ? '#0a1628' : '#f3f4f6',
                      color: editing.bg_type === t ? '#fff' : '#374151',
                      border: 'none',
                    }}>
                      {t === 'color' ? '🎨 그라디언트' : '🖼️ 이미지'}
                    </button>
                  ))}
                </div>
                <Input
                  value={editing.bg_value ?? ''}
                  onChange={e => setEditing(p => ({ ...p!, bg_value: e.target.value }))}
                  placeholder={editing.bg_type === 'color' ? 'linear-gradient(135deg, #0a1628, #1e3a5f)' : 'https://...image.jpg'}
                />
                {editing.bg_value && (
                  <div style={{ marginTop: '8px', height: '40px', borderRadius: '6px', background: editing.bg_value }} />
                )}
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

      <ConfirmModal open={!!deleteTarget} title="슬라이드를 삭제할까요?" desc="삭제된 슬라이드는 복구할 수 없습니다." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
