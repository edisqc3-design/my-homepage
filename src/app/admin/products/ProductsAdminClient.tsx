'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AdminSection, AdminCard, Btn, Input, Textarea, Select, Toggle, ImageUploader, ConfirmModal, Toast } from '@/components/admin/AdminUI'
import type { Product } from '@/types'

const CATEGORIES = [
  { value: '데크자재', label: '데크자재' },
  { value: '외장재', label: '외장재' },
  { value: '내장재', label: '내장재' },
]
const EMPTY: Partial<Product> = { name: '', category: '데크자재', description: '', image_url: '', spec: {}, is_active: true }

export default function ProductsAdminClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editing, setEditing] = useState<Partial<Product> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [specRows, setSpecRows] = useState<{ key: string; val: string }[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)

  const sb = createClient()
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const openEdit = (product?: Product) => {
    if (product) {
      setEditing({ ...product })
      setSpecRows(Object.entries(product.spec ?? {}).map(([key, val]) => ({ key, val: String(val) })))
      setIsNew(false)
    } else {
      setEditing({ ...EMPTY })
      setSpecRows([{ key: '', val: '' }])
      setIsNew(true)
    }
  }

  const handleSave = async () => {
    if (!editing?.name) { showToast('제품명을 입력해 주세요.', 'error'); return }
    const spec = Object.fromEntries(specRows.filter(r => r.key.trim()).map(r => [r.key, r.val]))
    setSaving(true)
    const payload = { ...editing, spec }
    if (isNew) {
      const { data, error } = await sb.from('products').insert([{ ...payload, sort_order: products.length + 1 }]).select().single()
      if (error) showToast('저장 실패', 'error')
      else { setProducts(p => [...p, data]); showToast('제품 추가 완료') }
    } else {
      const { error } = await sb.from('products').update(payload).eq('id', editing.id!)
      if (error) showToast('저장 실패', 'error')
      else { setProducts(p => p.map(x => x.id === editing.id ? { ...x, ...payload } as Product : x)); showToast('수정 완료') }
    }
    setSaving(false); setEditing(null); setIsNew(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await sb.from('products').delete().eq('id', deleteTarget)
    setProducts(p => p.filter(x => x.id !== deleteTarget))
    showToast('삭제 완료'); setDeleteTarget(null)
  }

  return (
    <div>
      <AdminSection
        title="제품 관리"
        desc={`총 ${products.length}개 제품이 등록되어 있습니다.`}
        action={<Btn onClick={() => openEdit()}>+ 제품 추가</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {products.map(product => (
          <AdminCard key={product.id} style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '140px', background: 'linear-gradient(135deg, #1e3a5f, #0a1628)', position: 'relative' }}>
              {product.image_url
                ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2rem', opacity: 0.3 }}>📦</div>
              }
              <span style={{ position: 'absolute', top: '8px', left: '8px', padding: '2px 8px', background: '#c9a84c', color: '#0a1628', fontSize: '0.68rem', fontWeight: 700, borderRadius: '8px' }}>
                {product.category}
              </span>
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: product.is_active ? '#22c55e' : '#9ca3af' }} />
            </div>
            <div style={{ padding: '12px' }}>
              <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.85rem', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Toggle value={product.is_active} onChange={async () => {
                  await sb.from('products').update({ is_active: !product.is_active }).eq('id', product.id)
                  setProducts(p => p.map(x => x.id === product.id ? { ...x, is_active: !x.is_active } : x))
                }} />
                <Btn variant="secondary" size="sm" onClick={() => openEdit(product)}>수정</Btn>
                <Btn variant="danger" size="sm" onClick={() => setDeleteTarget(product.id)}>삭제</Btn>
              </div>
            </div>
          </AdminCard>
        ))}

        <div onClick={() => openEdit()}
          style={{ border: '2px dashed #d1d5db', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af', gap: '8px', minHeight: '240px', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.color = '#b45309' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.color = '#9ca3af' }}>
          <span style={{ fontSize: '2rem' }}>+</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>제품 추가</span>
        </div>
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => setEditing(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '32px' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628' }}>{isNew ? '제품 추가' : '제품 수정'}</h2>
              <button onClick={() => setEditing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9ca3af' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input label="제품명" required value={editing.name ?? ''} onChange={e => setEditing(p => ({ ...p!, name: e.target.value }))} />
              <Select label="카테고리" options={CATEGORIES} value={editing.category ?? '데크자재'} onChange={e => setEditing(p => ({ ...p!, category: e.target.value }))} />
              <Textarea label="제품 설명" rows={3} value={editing.description ?? ''} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))} />
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>이미지</label>
                <ImageUploader value={editing.image_url ?? ''} onChange={url => setEditing(p => ({ ...p!, image_url: url }))} folder="products" />
              </div>

              {/* 스펙 테이블 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>제품 규격</label>
                  <Btn variant="ghost" size="sm" onClick={() => setSpecRows(p => [...p, { key: '', val: '' }])}>+ 항목 추가</Btn>
                </div>
                {specRows.map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <input value={row.key} onChange={e => setSpecRows(p => p.map((r, j) => j === i ? { ...r, key: e.target.value } : r))}
                      placeholder="항목명 (예: 길이)" style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem' }} />
                    <input value={row.val} onChange={e => setSpecRows(p => p.map((r, j) => j === i ? { ...r, val: e.target.value } : r))}
                      placeholder="값 (예: 4000mm)" style={{ padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.82rem' }} />
                    <button onClick={() => setSpecRows(p => p.filter((_, j) => j !== i))}
                      style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff', color: '#e63946', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
                  </div>
                ))}
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

      <ConfirmModal open={!!deleteTarget} title="제품을 삭제할까요?" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
