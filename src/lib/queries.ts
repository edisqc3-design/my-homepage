import { createClient } from '@supabase/supabase-js'
import type {
  HeroSlide, BusinessCard, WideBoxSetting,
  GalleryItem, Notice, Partner, SiteSetting, Faq, Product, Download
} from '@/types'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('hero_slides').select('*').eq('is_active', true).order('sort_order')
  if (error) { console.error('getHeroSlides:', error); return [] }
  return data ?? []
}

export async function getBusinessCards(): Promise<BusinessCard[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('business_cards').select('*').eq('is_active', true).order('sort_order')
  if (error) { console.error('getBusinessCards:', error); return [] }
  return data ?? []
}

export async function getWideBoxSetting(): Promise<WideBoxSetting | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('wide_box_settings').select('*').limit(1).single()
  if (error) { console.error('getWideBoxSetting:', error); return null }
  return data
}

export async function getGalleryItems(limit = 8): Promise<GalleryItem[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('gallery').select('*').eq('is_active', true).order('sort_order').limit(limit)
  if (error) { console.error('getGalleryItems:', error); return [] }
  return data ?? []
}

export async function getNotices(limit = 5): Promise<Notice[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('notices').select('*').eq('is_active', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) { console.error('getNotices:', error); return [] }
  return data ?? []
}

export async function getPartners(): Promise<Partner[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('partners').select('*').eq('is_active', true).order('sort_order')
  if (error) { console.error('getPartners:', error); return [] }
  return data ?? []
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const sb = getSupabase()
  if (!sb) return {}
  const { data, error } = await sb.from('site_settings').select('*')
  if (error) { console.error('getSiteSettings:', error); return {} }
  return (data ?? []).reduce((acc: Record<string, string>, row: SiteSetting) => {
    acc[row.key] = row.value ?? ''
    return acc
  }, {})
}

export async function getFaqs(): Promise<Faq[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('faqs').select('*').eq('is_active', true).order('sort_order')
  if (error) { console.error('getFaqs:', error); return [] }
  return data ?? []
}

export async function getProducts(category?: string): Promise<Product[]> {
  const sb = getSupabase()
  if (!sb) return []
  let query = sb.from('products').select('*').eq('is_active', true).order('sort_order')
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) { console.error('getProducts:', error); return [] }
  return data ?? []
}

export async function getProductById(id: string): Promise<Product | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('products').select('*').eq('id', id).single()
  if (error) { console.error('getProductById:', error); return null }
  return data
}

export async function getGalleryById(id: string): Promise<GalleryItem | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('gallery').select('*').eq('id', id).single()
  if (error) { console.error('getGalleryById:', error); return null }
  return data
}

export async function getAllGallery(): Promise<GalleryItem[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('gallery').select('*').eq('is_active', true).order('sort_order')
  if (error) { console.error('getAllGallery:', error); return [] }
  return data ?? []
}

export async function getNoticeById(id: string): Promise<Notice | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from('notices').select('*').eq('id', id).single()
  if (error) { console.error('getNoticeById:', error); return null }
  return data
}

export async function getAllNotices(): Promise<Notice[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('notices').select('*').eq('is_active', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
  if (error) { console.error('getAllNotices:', error); return [] }
  return data ?? []
}

export async function getDownloads(): Promise<Download[]> {
  const sb = getSupabase()
  if (!sb) return []
  const { data, error } = await sb.from('downloads').select('*').eq('is_active', true).order('sort_order')
  if (error) { console.error('getDownloads:', error); return [] }
  return data ?? []
}
