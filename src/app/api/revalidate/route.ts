import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    revalidatePath('/', 'layout')   // 레이아웃 전체 갱신 (더 강력)
    revalidatePath('/')             // 메인 페이지도 명시적으로
    return NextResponse.json({ revalidated: true, timestamp: Date.now() })
  } catch (e) {
    return NextResponse.json({ revalidated: false, error: String(e) }, { status: 500 })
  }
}
