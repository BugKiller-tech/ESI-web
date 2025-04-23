import { auth } from '@/lib/auth';
import { Product } from 'types';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import * as APIs from '@/apis';

type ProductListingPageProps = {};

export default async function ProductListingPage({}: ProductListingPageProps) {

  const session = await auth();

  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');
  const categories = searchParamsCache.get('categories');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const response = await APIs.getProducts(filters, session?.user?.accessToken);
 
  
  // const totalProducts = 0;
  // const products: Product[] = [];

  const totalProducts = response.data.totalCount;
  const products: Product[] = response.data.products;

  // return (
  //   <div>
  //   <div>{ JSON.stringify(filters) }</div>
  //   <ProductTable
  //     columns={columns}
  //     data={products}
  //     totalItems={totalProducts}
  //   />
  //   </div>
  // );
  return (
    <ProductTable
      columns={columns}
      data={products}
      totalItems={totalProducts}
    />
  );
}
