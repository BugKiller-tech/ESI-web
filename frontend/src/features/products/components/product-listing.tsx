import { Product } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { DataTable as ProductTable } from '@/components/ui/table/data-table';
import { columns } from './product-tables/columns';
import * as APIs from '@/apis';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
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

  const response = await APIs.getProducts(filters);
  console.log('HHHHHHHHHHHHHHHH', response.data);

  // useEffect(() => {
  //   const fetchData = async() => {
  //     const data = await APIs.getProducts(filters);
  //     console.log('this is for testing purpose', data);
  //     // const totalProducts = data.total_products;
  //     // const products: Product[] = data.products;
  //   }
  //   fetchData();
  // }, [])

  
  
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
