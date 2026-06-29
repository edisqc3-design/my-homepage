import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://woodjajae.co.kr'
  const now = new Date()

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about/vision`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about/history`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about/map`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/notice`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/inquiry`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/download`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ]

  const sb = getSupabase()
  if (!sb) return staticPages

  // 동적 페이지 - 제품
  const { data: products } = await sb.from('products').select('id, created_at').eq('is_active', true)
  const productPages: MetadataRoute.Sitemap = (products ?? []).map(p => ({
    url: `${baseUrl}/products/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 동적 페이지 - 갤러리
  const { data: gallery } = await sb.from('gallery').select('id, created_at').eq('is_active', true)
  const galleryPages: MetadataRoute.Sitemap = (gallery ?? []).map(g => ({
    url: `${baseUrl}/gallery/${g.id}`,
    lastModified: new Date(g.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 동적 페이지 - 공지사항
  const { data: notices } = await sb.from('notices').select('id, created_at').eq('is_active', true)
  const noticePages: MetadataRoute.Sitemap = (notices ?? []).map(n => ({
    url: `${baseUrl}/notice/${n.id}`,
    lastModified: new Date(n.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...galleryPages, ...noticePages]
}
