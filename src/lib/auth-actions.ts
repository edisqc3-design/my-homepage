'use server'

import { createClient } from '@/lib/supabase-server'
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
