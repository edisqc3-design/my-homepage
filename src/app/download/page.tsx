import { getDownloads } from '@/lib/queries'
import DownloadClient from './DownloadClient'

export const revalidate = 60

export default async function DownloadPage() {
  const downloads = await getDownloads()
  return <DownloadClient downloads={downloads} />
}
