import { Metadata } from 'next'
import { getProductById, getProducts } from '@/lib/queries'
import ProductDetailClient from './ProductDetailClient'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) return { title: '제품 없음' }
  return {
    title: product.name,
    description: product.description ?? `${product.name} - 우드자재닷컴의 고품질 ${product.category}`,
    openGraph: {
      title: product.name,
      description: product.description ?? '',
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, allProducts] = await Promise.all([getProductById(id), getProducts()])
  if (!product) notFound()
  const related = allProducts.filter(p => p.id !== id && p.category === product.category).slice(0, 3)
  return <ProductDetailClient product={product} related={related} />
}
