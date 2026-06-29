import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import MypageClient from './MypageClient'

export default async function MypagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?next=/mypage')

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .eq('email', user.email ?? '')
    .order('created_at', { ascending: false })

  return (
    <MypageClient
      user={{ name: user.user_metadata?.name ?? '회원', email: user.email ?? '' }}
      inquiries={inquiries ?? []}
    />
  )
}
