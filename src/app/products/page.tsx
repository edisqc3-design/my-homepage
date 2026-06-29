import { Metadata } from 'next'
import { getProducts } from '@/lib/queries'
import ProductsClient from './ProductsClient'

export const metadata: Metadata = {
  title: '제품소개',
  description: '합성목재 데크, 외장재, 내장재 등 고품질 건축자재를 소개합니다. 카테고리별 제품 확인 및 견적 문의.',
}

export const revalidate = 60

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const products = await getProducts(category && category !== '전체' ? category : undefined)
  return <ProductsClient products={products} activeCategory={category ?? '전체'} />
}
