import type { Metadata } from 'next'
import './globals.css'
import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/ui/ScrollToTop'
import { getSiteSettings } from '@/lib/queries'
import { getUser, checkIsAdmin } from '@/lib/auth-actions'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings.seo_title || '우드자재닷컴 | 합성목재·건축자재 전문 공급'
  const description = settings.seo_description || '합성목재 데크, 외장재, 내장재 전문 B2B 공급업체. 전국 납품 가능. 무료 견적 문의 환영.'
  const keywords = settings.seo_keywords || '합성목재, 건축자재, 데크자재, 외장재, 내장재, B2B, 합성목재데크'

  return {
    title: { default: title, template: `%s | 우드자재닷컴` },
    description,
    keywords,
    authors: [{ name: settings.company_name || '우드자재닷컴' }],
    metadataBase: new URL('https://woodjajae.co.kr'),
    openGraph: {
      title,
      description,
      siteName: '우드자재닷컴',
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    verification: {
      google: '', // Google Search Console 인증 코드 입력
      other: { 'naver-site-verification': '' }, // 네이버 서치어드바이저
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, user] = await Promise.all([getSiteSettings(), getUser()])
  const isAdmin = user ? await checkIsAdmin() : false

  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar initialUser={user} initialIsAdmin={isAdmin} />
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer settings={settings} />
        <ScrollToTop />
      </body>
    </html>
  )
}
