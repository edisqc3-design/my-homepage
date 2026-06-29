'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { AdminSection, AdminCard, Btn, Input, Textarea, ImageUploader, Toast } from '@/components/admin/AdminUI'
import type { WideBoxSetting, WideBoxItem } from '@/types'

export default function WideBoxClient({ initialData }: { initialData: WideBoxSetting | null }) {
  const [form, setForm] = useState<Partial<WideBoxSetting>>(initialData ?? {
    tag: 'BUSINESS SERVICE',
    title: '전국 건설 현장에\n안정적인 자재 공급을 약속합니다',
    highlight_text: '안정적인 자재 공급',
    image_url: '',
    items: [
      { icon: '📦', title: '대량 납품 전문', desc: '건설사·시공사 대상 대량 공급 가능.' },
      { icon: '🔬', title: '품질 검증 시스템', desc: '납품 전 전수 품질 검사.' },
      { icon: '📞', title: '전담 영업 담당자', desc: '현장별 전담 담당자 배정.' },
    ],
    cta_label: '견적 문의하기', cta_href: '/inquiry',
    cta2_label: '사업안내 보기', cta2_href: '/business',
  })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const sb = createClient()
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const updateItem = (i: number, field: keyof WideBoxItem, value: string) => {
    const items = [...(form.items ?? [])]
    items[i] = { ...items[i], [field]: value }
    setForm(p => ({ ...p, items }))
  }

  const handleSave = async () => {
    setSaving(true)
    if (initialData?.id) {
      const { error } = await sb.from('wide_box_settings').update({ ...form, updated_at: new Date().toISOString() }).eq('id', initialData.id)
      if (error) showToast('저장 실패', 'error')
      else showToast('와이드박스 저장 완료')
    } else {
      const { error } = await sb.from('wide_box_settings').insert([form])
      if (error) showToast('저장 실패', 'error')
      else showToast('와이드박스 생성 완료')
    }
    setSaving(false)
  }

  return (
    <div>
      <AdminSection
        title="와이드박스 관리"
        desc="홈페이지 중간 와이드 섹션의 내용을 수정합니다."
        action={<Btn onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '💾 저장'}</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* 좌측 설정 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AdminCard>
            <p style={{ fontWeight: 700, color: '#374151', marginBottom: '16px', fontSize: '0.9rem' }}>기본 텍스트</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Input label="태그" value={form.tag ?? ''} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} placeholder="BUSINESS SERVICE" />
              <Textarea label="제목 (줄바꿈 가능)" rows={3} value={form.title ?? ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              <Input label="강조 텍스트 (골드색으로 표시)" value={form.highlight_text ?? ''} onChange={e => setForm(p => ({ ...p, highlight_text: e.target.value }))} placeholder="제목 중 강조할 단어" />
            </div>
          </AdminCard>

          <AdminCard>
            <p style={{ fontWeight: 700, color: '#374151', marginBottom: '16px', fontSize: '0.9rem' }}>버튼</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Input label="버튼1 텍스트" value={form.cta_label ?? ''} onChange={e => setForm(p => ({ ...p, cta_label: e.target.value }))} />
              <Input label="버튼1 링크" value={form.cta_href ?? ''} onChange={e => setForm(p => ({ ...p, cta_href: e.target.value }))} />
              <Input label="버튼2 텍스트" value={form.cta2_label ?? ''} onChange={e => setForm(p => ({ ...p, cta2_label: e.target.value }))} />
              <Input label="버튼2 링크" value={form.cta2_href ?? ''} onChange={e => setForm(p => ({ ...p, cta2_href: e.target.value }))} />
            </div>
          </AdminCard>

          <AdminCard>
            <p style={{ fontWeight: 700, color: '#374151', marginBottom: '16px', fontSize: '0.9rem' }}>좌측 이미지</p>
            <ImageUploader value={form.image_url ?? ''} onChange={url => setForm(p => ({ ...p, image_url: url }))} folder="wide-box" />
          </AdminCard>
        </div>

        {/* 우측 - 서비스 항목 3개 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(form.items ?? []).map((item, i) => (
            <AdminCard key={i}>
              <p style={{ fontWeight: 700, color: '#374151', marginBottom: '12px', fontSize: '0.9rem' }}>서비스 항목 {i + 1}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Input label="아이콘 (이모지)" value={item.icon} onChange={e => updateItem(i, 'icon', e.target.value)} />
                <Input label="제목" value={item.title} onChange={e => updateItem(i, 'title', e.target.value)} />
                <Textarea label="설명" rows={2} value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)} />
              </div>
            </AdminCard>
          ))}

          {/* 미리보기 */}
          <AdminCard style={{ background: '#f8fafc' }}>
            <p style={{ fontWeight: 700, color: '#374151', marginBottom: '12px', fontSize: '0.9rem' }}>미리보기</p>
            <div style={{ background: '#0a1628', borderRadius: '8px', padding: '16px' }}>
              {form.tag && <span style={{ fontSize: '0.68rem', color: '#c9a84c', fontWeight: 700 }}>{form.tag}</span>}
              <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700, marginTop: '6px', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                {form.title?.split(form.highlight_text ?? '').map((part, i, arr) => (
                  <span key={i}>{part}{i < arr.length - 1 && <span style={{ color: '#c9a84c' }}>{form.highlight_text}</span>}</span>
                ))}
              </p>
            </div>
          </AdminCard>
        </div>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
