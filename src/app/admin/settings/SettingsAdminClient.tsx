'use client'

import { useState } from 'react'
import { updateSiteSettings } from '@/lib/content-actions'
import { AdminSection, AdminCard, Btn, Input, Textarea, Toggle, Toast } from '@/components/admin/AdminUI'

const SETTING_GROUPS = [
  {
    title: '회사 기본 정보',
    icon: '🏢',
    fields: [
      { key: 'company_name', label: '회사명', placeholder: '우드자재닷컴' },
      { key: 'ceo_name', label: '대표자명', placeholder: '홍길동' },
      { key: 'business_number', label: '사업자번호', placeholder: '000-00-00000' },
    ],
  },
  {
    title: '연락처',
    icon: '📞',
    fields: [
      { key: 'phone', label: '전화번호', placeholder: '02-0000-0000' },
      { key: 'email', label: '이메일', placeholder: 'info@company.co.kr' },
      { key: 'fax', label: '팩스', placeholder: '02-0000-0001' },
    ],
  },
  {
    title: '주소',
    icon: '📍',
    fields: [
      { key: 'address', label: '주소', placeholder: '경기도 ○○시 ○○구 ○○로 123', textarea: true },
    ],
  },
  {
    title: '영업시간',
    icon: '🕐',
    fields: [
      { key: 'business_hours', label: '영업시간', placeholder: 'AM 09:00 ~ PM 06:00' },
      { key: 'lunch_hours', label: '점심시간', placeholder: 'PM 12:00 ~ PM 01:00' },
      { key: 'holiday', label: '휴무일', placeholder: '토·일·공휴일' },
    ],
  },
  {
    title: 'SNS / 외부 링크',
    icon: '🌐',
    fields: [
      { key: 'kakao_url', label: '카카오톡 채널', placeholder: 'https://pf.kakao.com/...' },
      { key: 'blog_url', label: '네이버 블로그', placeholder: 'https://blog.naver.com/...' },
      { key: 'youtube_url', label: '유튜브', placeholder: 'https://youtube.com/@...' },
      { key: 'instagram_url', label: '인스타그램', placeholder: 'https://instagram.com/...' },
    ],
  },
  {
    title: 'SEO 설정',
    icon: '🔍',
    fields: [
      { key: 'seo_title', label: '사이트 제목', placeholder: '우드자재닷컴 | 합성목재·건축자재 전문 공급' },
      { key: 'seo_description', label: '사이트 설명', placeholder: '합성목재 데크, 외장재, 내장재 전문 B2B 공급업체...', textarea: true },
      { key: 'seo_keywords', label: '키워드', placeholder: '합성목재, 건축자재, 데크자재, 외장재' },
    ],
  },
]

// 메인 페이지에 실제로 렌더링되는 섹션만 토글 대상으로 노출.
// 키가 'false'일 때만 숨김 처리 (값이 없으면 기본 노출 = 기존 동작 그대로 유지)
const SECTION_TOGGLES = [
  { key: 'section_hero', label: '슬라이더', desc: '메인 상단 히어로 슬라이드' },
  { key: 'section_business_cards', label: '비즈니스 카드', desc: '사업안내 카드 섹션' },
  { key: 'section_wide_box', label: '와이드박스', desc: '와이드 배너 섹션' },
  { key: 'section_gallery', label: '시공사례', desc: '시공사례 갤러리 섹션' },
  { key: 'section_recent_posts', label: '공지사항 / 문의', desc: '최근 공지·문의 목록 섹션' },
  { key: 'section_customer_support', label: '고객지원', desc: '연락처/영업시간 등 고객지원 섹션' },
  { key: 'section_partners', label: '파트너', desc: '하단 파트너/고객사 로고 섹션' },
]

export default function SettingsAdminClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (key: string, value: string) => {
    setSettings(p => ({ ...p, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await updateSiteSettings(settings)
    if (!result.success) showToast('저장 실패. 다시 시도해 주세요.', 'error')
    else showToast('사이트 설정이 저장되었습니다')
    setSaving(false)
  }

  return (
    <div>
      <AdminSection
        title="사이트 설정"
        desc="홈페이지 전반에 표시되는 회사 정보와 설정을 관리합니다."
        action={
          <Btn onClick={handleSave} disabled={saving}>
            {saving ? '저장 중...' : '💾 전체 저장'}
          </Btn>
        }
      />

      {/* 변경사항 안내 */}
      <div style={{
        padding: '12px 16px', background: 'rgba(201,168,76,0.08)',
        border: '1px solid rgba(201,168,76,0.25)', borderRadius: '10px',
        marginBottom: '24px', fontSize: '0.82rem', color: '#b45309',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <span>💡</span>
        저장 후 홈페이지에 즉시 반영됩니다. 상단의 <strong>전체 저장</strong> 버튼을 클릭하세요.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 메인 섹션 노출 관리 */}
        <AdminCard>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a1628', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧩</span> 메인 화면 섹션 노출
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '18px' }}>
            비활성화한 섹션은 메인 홈페이지에서 보이지 않습니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {SECTION_TOGGLES.map((section, i) => {
              const isActive = settings[section.key] !== 'false'
              return (
                <div key={section.key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 4px',
                  borderTop: i === 0 ? 'none' : '1px solid #f1f5f9',
                }}>
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0a1628' }}>{section.label}</p>
                    <p style={{ fontSize: '0.76rem', color: '#9ca3af' }}>{section.desc}</p>
                  </div>
                  <Toggle
                    value={isActive}
                    onChange={v => handleChange(section.key, v ? 'true' : 'false')}
                  />
                </div>
              )
            })}
          </div>
        </AdminCard>

        {SETTING_GROUPS.map(group => (
          <AdminCard key={group.title}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a1628', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{group.icon}</span> {group.title}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: group.fields.length === 1 ? '1fr' : '1fr 1fr', gap: '14px' }}>
              {group.fields.map(field => (
                <div key={field.key} style={{ gridColumn: field.textarea ? '1 / -1' : 'auto' }}>
                  {field.textarea ? (
                    <Textarea
                      label={field.label}
                      rows={3}
                      value={settings[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <Input
                      label={field.label}
                      value={settings[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>

      {/* 하단 저장 버튼 */}
      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <Btn onClick={handleSave} disabled={saving}>
          {saving ? '저장 중...' : '💾 전체 저장'}
        </Btn>
      </div>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
