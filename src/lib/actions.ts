'use server'

import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function submitInquiry(formData: {
  name: string
  company?: string
  phone: string
  email?: string
  category: string
  content: string
}) {
  const sb = getSupabase()
  if (!sb) return { success: false, error: 'DB 연결 실패' }

  const { error } = await sb.from('inquiries').insert([formData])
  if (error) {
    console.error('submitInquiry:', error)
    return { success: false, error: '문의 접수에 실패했습니다. 다시 시도해 주세요.' }
  }
  return { success: true }
}

export async function incrementDownload(id: string) {
  const sb = getSupabase()
  if (!sb) return

  const { data } = await sb.from('downloads').select('download_count').eq('id', id).single()
  if (data) {
    await sb.from('downloads')
      .update({ download_count: (data.download_count ?? 0) + 1 })
      .eq('id', id)
  }
}

import { revalidatePath } from 'next/cache'

export async function revalidateHome() {
  revalidatePath('/')
}
