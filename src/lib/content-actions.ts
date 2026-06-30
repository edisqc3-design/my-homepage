'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { BusinessCard, Partner } from '@/types'

// auth-actions.ts의 admin_users 패턴과 동일: 서비스 롤 키로 RLS를 우회하는
// 신뢰된 서버 전용 클라이언트. 절대 클라이언트 컴포넌트에서 직접 호출하지 말 것.
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

type ActionResult<T = undefined> = { success: true; data: T } | { success: false; error: string }

// ──────────────────────────── Business Cards ────────────────────────────

export async function createBusinessCard(
  payload: Partial<BusinessCard>
): Promise<ActionResult<BusinessCard>> {
  const sb = getAdminClient()
  const { data, error } = await sb.from('business_cards').insert([payload]).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true, data }
}

export async function updateBusinessCard(
  id: string,
  payload: Partial<BusinessCard>
): Promise<ActionResult> {
  const sb = getAdminClient()
  const { error } = await sb.from('business_cards').update(payload).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true, data: undefined }
}

export async function deleteBusinessCard(id: string): Promise<ActionResult> {
  const sb = getAdminClient()
  const { error } = await sb.from('business_cards').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true, data: undefined }
}

export async function updateBusinessCardOrder(
  updates: { id: string; sort_order: number }[]
): Promise<ActionResult> {
  const sb = getAdminClient()
  const results = await Promise.all(
    updates.map(u => sb.from('business_cards').update({ sort_order: u.sort_order }).eq('id', u.id))
  )
  const failed = results.find(r => r.error)
  if (failed?.error) return { success: false, error: failed.error.message }
  revalidatePath('/')
  return { success: true, data: undefined }
}

export async function updateBusinessCardsActive(
  updates: { id: string; is_active: boolean }[]
): Promise<ActionResult> {
  const sb = getAdminClient()
  const results = await Promise.all(
    updates.map(u => sb.from('business_cards').update({ is_active: u.is_active }).eq('id', u.id))
  )
  const failed = results.find(r => r.error)
  if (failed?.error) return { success: false, error: failed.error.message }
  revalidatePath('/')
  return { success: true, data: undefined }
}

// ──────────────────────────── Partners ────────────────────────────

export async function createPartner(payload: Partial<Partner>): Promise<ActionResult<Partner>> {
  const sb = getAdminClient()
  const { data, error } = await sb.from('partners').insert([payload]).select().single()
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true, data }
}

export async function updatePartner(id: string, payload: Partial<Partner>): Promise<ActionResult> {
  const sb = getAdminClient()
  const { error } = await sb.from('partners').update(payload).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true, data: undefined }
}

export async function deletePartner(id: string): Promise<ActionResult> {
  const sb = getAdminClient()
  const { error } = await sb.from('partners').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true, data: undefined }
}

export async function updatePartnerOrder(
  updates: { id: string; sort_order: number }[]
): Promise<ActionResult> {
  const sb = getAdminClient()
  const results = await Promise.all(
    updates.map(u => sb.from('partners').update({ sort_order: u.sort_order }).eq('id', u.id))
  )
  const failed = results.find(r => r.error)
  if (failed?.error) return { success: false, error: failed.error.message }
  revalidatePath('/')
  return { success: true, data: undefined }
}

// ──────────────────────────── Site Settings ────────────────────────────

export async function updateSiteSettings(
  settings: Record<string, string>
): Promise<ActionResult> {
  const sb = getAdminClient()
  const upserts = Object.entries(settings).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }))
  const { error } = await sb.from('site_settings').upsert(upserts, { onConflict: 'key' })
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true, data: undefined }
}

export async function updatePartnersActive(
  updates: { id: string; is_active: boolean }[]
): Promise<ActionResult> {
  const sb = getAdminClient()
  const results = await Promise.all(
    updates.map(u => sb.from('partners').update({ is_active: u.is_active }).eq('id', u.id))
  )
  const failed = results.find(r => r.error)
  if (failed?.error) return { success: false, error: failed.error.message }
  revalidatePath('/')
  return { success: true, data: undefined }
}
