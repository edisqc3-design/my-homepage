'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'

/* ─── 섹션 헤더 ─── */
export function AdminSection({
  title, desc, action,
}: {
  title: string
  desc?: string
  action?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0a1628', marginBottom: '4px' }}>{title}</h2>
        {desc && <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>{desc}</p>}
      </div>
      {action}
    </div>
  )
}

/* ─── 버튼 ─── */
export function Btn({
  children, onClick, variant = 'primary', size = 'md', disabled = false, type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary:   { background: '#0a1628', color: '#fff', border: '1px solid #0a1628' },
    secondary: { background: '#fff', color: '#374151', border: '1px solid #d1d5db' },
    danger:    { background: '#fff', color: '#e63946', border: '1px solid #fecaca' },
    ghost:     { background: 'transparent', color: '#6b7280', border: '1px solid transparent' },
  }
  const pad = size === 'sm' ? '6px 12px' : '9px 18px'
  const fs  = size === 'sm' ? '0.78rem' : '0.875rem'

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      ...styles[variant],
      padding: pad, fontSize: fs, fontWeight: 600,
      borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
      display: 'inline-flex', alignItems: 'center', gap: '6px',
    }}>
      {children}
    </button>
  )
}

/* ─── 입력 ─── */
export function Input({
  label, required, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; required?: boolean }) {
  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
          {label}{required && <span style={{ color: '#e63946', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <input {...props} style={{
        width: '100%', padding: '9px 12px',
        border: '1px solid #d1d5db', borderRadius: '7px',
        fontSize: '0.875rem', color: '#111827', outline: 'none',
        transition: 'border-color 0.15s', background: '#fff',
        ...props.style,
      }}
        onFocus={e => (e.currentTarget.style.borderColor = '#c9a84c')}
        onBlur={e => (e.currentTarget.style.borderColor = '#d1d5db')}
      />
    </div>
  )
}

/* ─── 텍스트에어리어 ─── */
export function Textarea({
  label, required, rows = 4, ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; required?: boolean; rows?: number }) {
  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
          {label}{required && <span style={{ color: '#e63946', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <textarea {...props} rows={rows} style={{
        width: '100%', padding: '9px 12px',
        border: '1px solid #d1d5db', borderRadius: '7px',
        fontSize: '0.875rem', color: '#111827', outline: 'none',
        transition: 'border-color 0.15s', background: '#fff',
        resize: 'vertical', lineHeight: 1.6,
        ...props.style,
      }}
        onFocus={e => (e.currentTarget.style.borderColor = '#c9a84c')}
        onBlur={e => (e.currentTarget.style.borderColor = '#d1d5db')}
      />
    </div>
  )
}

/* ─── 셀렉트 ─── */
export function Select({
  label, required, options, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string; required?: boolean
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
          {label}{required && <span style={{ color: '#e63946', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <select {...props} style={{
        width: '100%', padding: '9px 12px',
        border: '1px solid #d1d5db', borderRadius: '7px',
        fontSize: '0.875rem', color: '#111827', outline: 'none',
        background: '#fff', cursor: 'pointer',
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

/* ─── 토글 스위치 ─── */
export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button type="button" onClick={() => onChange(!value)} style={{
        width: '44px', height: '24px', borderRadius: '12px', border: 'none',
        background: value ? '#0a1628' : '#d1d5db',
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
      }}>
        <span style={{
          position: 'absolute', top: '3px',
          left: value ? '23px' : '3px',
          width: '18px', height: '18px',
          background: value ? '#c9a84c' : '#fff',
          borderRadius: '50%', transition: 'all 0.2s',
        }} />
      </button>
      {label && <span style={{ fontSize: '0.875rem', color: '#374151' }}>{label}</span>}
    </div>
  )
}

/* ─── 삭제 확인 모달 ─── */
export function ConfirmModal({
  open, title, desc, onConfirm, onCancel,
}: {
  open: boolean; title: string; desc?: string
  onConfirm: () => void; onCancel: () => void
}) {
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }} onClick={onCancel}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '32px 28px',
        maxWidth: '400px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗑️</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a1628', marginBottom: '8px' }}>{title}</h3>
          {desc && <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6 }}>{desc}</p>}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: '8px',
            border: '1px solid #d1d5db', background: '#fff',
            color: '#374151', fontWeight: 600, cursor: 'pointer',
          }}>취소</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '11px', borderRadius: '8px',
            border: 'none', background: '#e63946',
            color: '#fff', fontWeight: 700, cursor: 'pointer',
          }}>삭제</button>
        </div>
      </div>
    </div>
  )
}

/* ─── 이미지 업로더 ─── */
export function ImageUploader({
  value, onChange, bucket = 'images', folder = 'uploads',
}: {
  value: string; onChange: (url: string) => void
  bucket?: string; folder?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    setUploading(true)
    setError('')

    const sb = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}.${ext}`

    const { error: uploadError } = await sb.storage
      .from(bucket)
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      setError('업로드에 실패했습니다.')
      setUploading(false)
      return
    }

    const { data } = sb.storage.from(bucket).getPublicUrl(fileName)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      {/* 미리보기 */}
      {value && (
        <div style={{ marginBottom: '10px', position: 'relative', display: 'inline-block' }}>
          <img src={value} alt="preview" style={{
            width: '160px', height: '100px', objectFit: 'cover',
            borderRadius: '8px', border: '1px solid #e5e7eb',
          }} />
          <button type="button" onClick={() => onChange('')} style={{
            position: 'absolute', top: '-8px', right: '-8px',
            width: '22px', height: '22px', borderRadius: '50%',
            background: '#e63946', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>
      )}

      {/* 업로드 버튼 */}
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed #d1d5db', borderRadius: '10px',
          padding: '20px', textAlign: 'center', cursor: 'pointer',
          background: '#fafafa', transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#c9a84c'
          e.currentTarget.style.background = '#fffbf0'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#d1d5db'
          e.currentTarget.style.background = '#fafafa'
        }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
          {uploading ? '⏳' : '📷'}
        </div>
        <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
          {uploading ? '업로드 중...' : '클릭하여 이미지 업로드'}
        </p>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px' }}>PNG, JPG, WEBP / 최대 5MB</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
      {error && <p style={{ color: '#e63946', fontSize: '0.78rem', marginTop: '6px' }}>{error}</p>}
    </div>
  )
}

/* ─── 다중 이미지 업로더 (여러 장 업로드 + 순서변경 + 삭제) ─── */
export function MultiImageUploader({
  value, onChange, bucket = 'images', folder = 'uploads', max = 10,
}: {
  value: string[]; onChange: (urls: string[]) => void
  bucket?: string; folder?: string; max?: number
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    if (value.length + files.length > max) {
      setError(`이미지는 최대 ${max}장까지 업로드할 수 있습니다.`)
      return
    }

    setUploading(true)
    setError('')
    const sb = createClient()
    const uploaded: string[] = []

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}"의 크기가 5MB를 초과해 건너뛰었습니다.`)
        continue
      }
      const ext = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`
      const { error: uploadError } = await sb.storage.from(bucket).upload(fileName, file, { upsert: true })
      if (uploadError) { setError('일부 이미지 업로드에 실패했습니다.'); continue }
      const { data } = sb.storage.from(bucket).getPublicUrl(fileName)
      uploaded.push(data.publicUrl)
    }

    onChange([...value, ...uploaded])
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const removeAt = (idx: number) => onChange(value.filter((_, i) => i !== idx))
  const moveAt = (idx: number, dir: -1 | 1) => {
    const next = [...value]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next)
  }

  return (
    <div>
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
          {value.map((url, i) => (
            <div key={url + i} style={{ position: 'relative', width: '110px' }}>
              <img src={url} alt={`이미지 ${i + 1}`} style={{
                width: '110px', height: '80px', objectFit: 'cover',
                borderRadius: '8px', border: i === 0 ? '2px solid #c9a84c' : '1px solid #e5e7eb',
              }} />
              {i === 0 && (
                <span style={{
                  position: 'absolute', bottom: '4px', left: '4px',
                  padding: '1px 6px', background: 'rgba(201,168,76,0.9)', color: '#1a1a1a',
                  fontSize: '0.62rem', fontWeight: 700, borderRadius: '6px',
                }}>대표</span>
              )}
              <button type="button" onClick={() => removeAt(i)} style={{
                position: 'absolute', top: '-7px', right: '-7px',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#e63946', color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
              <div style={{ position: 'absolute', bottom: '4px', right: '4px', display: 'flex', gap: '2px' }}>
                {i > 0 && (
                  <button type="button" onClick={() => moveAt(i, -1)} style={{
                    width: '18px', height: '18px', borderRadius: '4px', border: 'none',
                    background: 'rgba(10,22,40,0.7)', color: '#fff', fontSize: '0.6rem', cursor: 'pointer',
                  }}>◀</button>
                )}
                {i < value.length - 1 && (
                  <button type="button" onClick={() => moveAt(i, 1)} style={{
                    width: '18px', height: '18px', borderRadius: '4px', border: 'none',
                    background: 'rgba(10,22,40,0.7)', color: '#fff', fontSize: '0.6rem', cursor: 'pointer',
                  }}>▶</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: '2px dashed #d1d5db', borderRadius: '10px',
          padding: '20px', textAlign: 'center', cursor: 'pointer',
          background: '#fafafa', transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#c9a84c'
          e.currentTarget.style.background = '#fffbf0'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#d1d5db'
          e.currentTarget.style.background = '#fafafa'
        }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
          {uploading ? '⏳' : '📷'}
        </div>
        <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
          {uploading ? '업로드 중...' : '클릭하여 이미지 업로드 (여러 장 선택 가능)'}
        </p>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '2px' }}>
          PNG, JPG, WEBP / 장당 최대 5MB / 최대 {max}장 · 첫 번째 사진이 대표 이미지로 사용됩니다
        </p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
      {error && <p style={{ color: '#e63946', fontSize: '0.78rem', marginTop: '6px' }}>{error}</p>}
    </div>
  )
}

/* ─── 카드 래퍼 ─── */
export function AdminCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '12px',
      border: '1px solid #e5e7eb', padding: '24px',
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ─── 상태 배지 ─── */
export function Badge({ label, color }: { label: string; color: 'green' | 'yellow' | 'red' | 'gray' }) {
  const styles = {
    green:  { bg: '#dcfce7', text: '#166534' },
    yellow: { bg: '#fef3c7', text: '#b45309' },
    red:    { bg: '#fee2e2', text: '#991b1b' },
    gray:   { bg: '#f3f4f6', text: '#374151' },
  }
  const s = styles[color]
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '10px',
      background: s.bg, color: s.text,
      fontSize: '0.72rem', fontWeight: 700,
    }}>
      {label}
    </span>
  )
}

/* ─── 알림 토스트 ─── */
export function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      padding: '14px 20px', borderRadius: '10px',
      background: type === 'success' ? '#0a1628' : '#e63946',
      color: '#fff', fontWeight: 600, fontSize: '0.875rem',
      display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      animation: 'slideUp 0.2s ease',
    }}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>✕</button>
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  )
}
