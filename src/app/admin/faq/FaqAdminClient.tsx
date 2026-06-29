'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AdminSection, AdminCard, Btn, Input, Textarea, Toggle, ConfirmModal, Toast } from '@/components/admin/AdminUI'
import type { Faq } from '@/types'

const EMPTY: Partial<Faq> = { category: '제품', question: '', answer: '', is_active: true }

export default function FaqAdminClient({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs)
  const [editing, setEditing] = useState<Partial<Faq> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)

  const sb = createClient()
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    if (!editing?.question || !editing?.answer) { showToast('질문과 답변을 모두 입력해 주세요.', 'error'); return }
    setSaving(true)
    if (isNew) {
      const { data, error } = await sb.from('faqs').insert([{ ...editing, sort_order: faqs.length + 1 }]).select().single()
      if (error) showToast('저장 실패', 'error')
      else { setFaqs(p => [...p, data]); showToast('FAQ 추가 완료') }
    } else {
      const { error } = await sb.from('faqs').update(editing).eq('id', editing.id!)
      if (error) showToast('저장 실패', 'error')
      else { setFaqs(p => p.map(x => x.id === editing.id ? { ...x, ...editing } as Faq : x)); showToast('수정 완료') }
    }
    setSaving(false); setEditing(null); setIsNew(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await sb.from('faqs').delete().eq('id', deleteTarget)
    setFaqs(p => p.filter(x => x.id !== deleteTarget))
    showToast('삭제 완료'); setDeleteTarget(null)
  }

  const handleOrder = async (id: string, dir: 'up' | 'down') => {
    const idx = faqs.findIndex(f => f.id === id)
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === faqs.length - 1)) return
    const si = dir === 'up' ? idx - 1 : idx + 1
    const next = [...faqs];
    [next[idx], next[si]] = [next[si], next[idx]]
    setFaqs(next)
    await Promise.all([
      sb.from('faqs').update({ sort_order: idx + 1 }).eq('id', next[idx].id),
      sb.from('faqs').update({ sort_order: si + 1 }).eq('id', next[si].id),
    ])
  }

  return (
    <div>
      <AdminSection
        title="FAQ 관리"
        desc="자주 묻는 질문을 관리합니다."
        action={<Btn onClick={() => { setEditing({ ...EMPTY }); setIsNew(true) }}>+ FAQ 추가</Btn>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {faqs.length === 0 && (
          <AdminCard><p style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0' }}>등록된 FAQ가 없습니다.</p></AdminCard>
        )}
        {faqs.map((faq, i) => (
          <AdminCard key={faq.id}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ padding: '2px 8px', background: 'rgba(10,22,40,0.07)', color: '#374151', fontSize: '0.72rem', fontWeight: 700, borderRadius: '8px' }}>
                    {faq.category}
                  </span>
                  <span style={{ padding: '2px 8px', background: faq.is_active ? '#dcfce7' : '#f3f4f6', color: faq.is_active ? '#166534' : '#6b7280', fontSize: '0.72rem', fontWeight: 700, borderRadius: '8px' }}>
                    {faq.is_active ? '공개' : '비공개'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>순서 {i + 1}</span>
                </div>
                <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.9rem', marginBottom: '4px' }}>Q. {faq.question}</p>
                <p style={{ color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>A. {faq.answer}</p>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
                <Btn variant="ghost" size="sm" onClick={() => handleOrder(faq.id, 'up')} disabled={i === 0}>↑</Btn>
                <Btn variant="ghost" size="sm" onClick={() => handleOrder(faq.id, 'down')} disabled={i === faqs.length - 1}>↓</Btn>
                <Toggle value={faq.is_active} onChange={async () => {
                  await sb.from('faqs').update({ is_active: !faq.is_active }).eq('id', faq.id)
                  setFaqs(p => p.map(x => x.id === faq.id ? { ...x, is_active: !x.is_active } : x))
                }} />
                <Btn variant="secondary" size="sm" onClick={() => { setEditing({ ...faq }); setIsNew(false) }}>수정</Btn>
                <Btn variant="danger" size="sm" onClick={() => setDeleteTarget(faq.id)}>삭제</Btn>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628' }}>{isNew ? 'FAQ 추가' : 'FAQ 수정'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9ca3af' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="카테고리" value={editing.category ?? ''} onChange={e => setEditing(p => ({ ...p!, category: e.target.value }))} placeholder="제품, 납품, 기타..." />
              <Textarea label="질문" required rows={2} value={editing.question ?? ''} onChange={e => setEditing(p => ({ ...p!, question: e.target.value }))} />
              <Textarea label="답변" required rows={5} value={editing.answer ?? ''} onChange={e => setEditing(p => ({ ...p!, answer: e.target.value }))} />
              <Toggle value={editing.is_active ?? true} onChange={v => setEditing(p => ({ ...p!, is_active: v }))} label="공개" />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
              <Btn variant="secondary" onClick={() => setEditing(null)}>취소</Btn>
              <Btn onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</Btn>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!deleteTarget} title="FAQ를 삭제할까요?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
