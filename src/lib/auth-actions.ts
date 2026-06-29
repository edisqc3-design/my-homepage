'use server'

import { createClient } from '@/lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function login(formData: { email: string; password: string; next?: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  redirect(formData.next ?? '/')
}

export async function register(formData: {
  email: string
  password: string
  name: string
}) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: { name: formData.name },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { success: false, error: '이미 가입된 이메일입니다.' }
    }
    return { success: false, error: '회원가입에 실패했습니다. 다시 시도해 주세요.' }
  }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 현재 로그인한 유저가 관리자인지 서버에서 확인 (service_role 사용, anon에게 admin_users 테이블을 열어줄 필요 없음)
export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return false

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { data: adminUser } = await adminSupabase
    .from('admin_users')
    .select('id')
    .eq('email', user.email)
    .single()

  return !!adminUser
}
