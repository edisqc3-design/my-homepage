# 우드자재닷컴

건축자재 B2B 전문 공급 홈페이지

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **배포**: Vercel
- **버전관리**: GitHub

## 시작하기

### 1. 환경변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일에 Supabase 정보 입력:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2. 개발 서버 실행

```bash
npm install
npm run dev
```

### 3. GitHub 연동

```bash
git init
git add .
git commit -m "feat: 초기 프로젝트 세팅"
git remote add origin https://github.com/YOUR_USERNAME/wood-business.git
git push -u origin main
```

### 4. Vercel 배포

1. [vercel.com](https://vercel.com) 접속
2. GitHub 저장소 연결
3. 환경변수 설정 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. Deploy

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx      # 루트 레이아웃 (TopBar + Header + Footer)
│   ├── page.tsx        # 홈페이지 (섹션 조립)
│   └── globals.css     # 디자인 시스템 CSS 변수
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx       # 상단 바 (연락처 + 로그인)
│   │   ├── Header.tsx       # 네비게이션 (sticky + dropdown)
│   │   └── Footer.tsx       # 푸터
│   ├── sections/
│   │   ├── HeroSlider.tsx   # 메인 슬라이더
│   │   ├── BusinessCards.tsx # 사업안내 카드 그리드
│   │   ├── WideBox.tsx      # 와이드 이미지+텍스트
│   │   ├── GalleryGrid.tsx  # 시공사례 그리드
│   │   ├── CtaBanner.tsx    # CTA 배너 (통계 포함)
│   │   ├── RecentPosts.tsx  # 공지사항 + 문의 최근글
│   │   ├── CustomerSupport.tsx # 고객센터
│   │   └── Partners.tsx     # 파트너 로고
│   └── ui/
│       └── ScrollToTop.tsx  # 맨 위로 버튼
└── lib/
    └── supabase.ts     # Supabase 클라이언트
```
