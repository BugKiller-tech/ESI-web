import { auth } from '@/lib/auth';
import { fakeProducts, Product } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';
import * as APIs from '@/apis';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  const session = await auth();

  let product = null;
  let isForUpdate = false;
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    const response = await APIs.getProduct(productId, session?.user?.accessToken)
    product = response.data.product as Product;
    if (!product) {
      notFound();
    }
    pageTitle = `Edit Product`;
    isForUpdate = true;
  }

  return <ProductForm initialData={product}
    pageTitle={pageTitle}
    isForUpdate={isForUpdate} />;
}
