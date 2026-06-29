import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // 어드민 페이지 보호
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?next=/admin', request.url))
    }
  }

  // 마이페이지 보호
  if (path.startsWith('/mypage')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?next=/mypage', request.url))
    }
  }

  // 로그인 상태에서 auth 페이지 접근 시 홈으로
  // callback 제외, 그리고 로그아웃 직후를 표시하는 쿼리파라미터(logged_out) 제외
  const isCallback = path === '/auth/callback'
  const isLoggedOut = request.nextUrl.searchParams.get('logged_out') === '1'
  if (path.startsWith('/auth') && !isCallback && !isLoggedOut && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
