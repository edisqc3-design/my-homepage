import LoginClient from './LoginClient'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  return <LoginClient searchParams={searchParams} />
}
