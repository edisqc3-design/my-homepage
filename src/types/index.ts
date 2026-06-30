export type HeroSlide = {
  id: string
  sort_order: number
  tag: string | null
  title: string
  description: string | null
  cta_label: string | null
  cta_href: string | null
  cta2_label: string | null
  cta2_href: string | null
  bg_type: 'color' | 'image'
  bg_value: string | null
  is_active: boolean
  created_at: string
}
export type BusinessCard = {
  id: string
  sort_order: number
  icon: string | null
  title: string
  description: string | null
  href: string | null
  is_active: boolean
  created_at: string
}
export type WideBoxItem = {
  icon: string
  title: string
  desc: string
}
export type WideBoxSetting = {
  id: string
  tag: string | null
  title: string | null
  highlight_text: string | null
  image_url: string | null
  items: WideBoxItem[]
  cta_label: string | null
  cta_href: string | null
  cta2_label: string | null
  cta2_href: string | null
  updated_at: string
}
export type GalleryItem = {
  id: string
  sort_order: number
  title: string
  category: string | null
  image_url: string | null
  image_urls: string[] | null
  description: string | null
  project_date: string | null
  is_active: boolean
  created_at: string
}
export type Product = {
  id: string
  sort_order: number
  name: string
  category: string | null
  description: string | null
  image_url: string | null
  spec: Record<string, string> | null
  is_active: boolean
  created_at: string
}
export type Notice = {
  id: string
  title: string
  content: string | null
  is_pinned: boolean
  is_active: boolean
  created_at: string
}
export type Inquiry = {
  id: string
  name: string
  company: string | null
  phone: string | null
  email: string | null
  category: string | null
  content: string
  status: 'pending' | 'done'
  admin_reply: string | null
  replied_at: string | null
  created_at: string
}
export type PublicInquiry = {
  id: string
  category: string | null
  content: string
  status: 'pending' | 'done'
  admin_reply: string | null
  created_at: string
}
export type Faq = {
  id: string
  sort_order: number
  category: string | null
  question: string
  answer: string
  is_active: boolean
  created_at: string
}
export type Download = {
  id: string
  sort_order: number
  title: string
  category: string | null
  file_url: string
  file_name: string | null
  file_size: number | null
  download_count: number
  is_active: boolean
  created_at: string
}
export type Partner = {
  id: string
  sort_order: number
  name: string
  logo_url: string | null
  is_active: boolean
  created_at: string
}
export type SiteSetting = {
  key: string
  value: string | null
  updated_at: string
}
