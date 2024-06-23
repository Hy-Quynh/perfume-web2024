import { useEffect, useState } from 'react';
import ProductItem from '../../../../components/productItem';
import { productAPI } from '../../../../services/product';

export default function NewProduct() {
  const [productList, setProductList] = useState<any>([]);

  const getProductList = async () => {
    try {
      const res = await productAPI.getAllProduct(16, 0, undefined, undefined, undefined, undefined, undefined, true);

      if (res?.data?.success) {
        setProductList(res?.data?.payload?.product);
      }
    } catch (error) {
      console.log('get product list error >>> ', error);
    }
  };

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <div className='container-fluid pt-5 pb-3'>
      <h2 className='section-title position-relative text-uppercase mx-xl-5 mb-4'>
        <span className='bg-secondary pr-3'>Sản phẩm mới</span>
      </h2>
      <div className='row px-xl-5'>
        {productList?.map((item: any, index: number) => {
          return (
            <ProductItem
              productId={item?._id}
              productImage={item?.image}
              productName={item?.name}
              productPrice={item?.price}
              salePrice={item?.salePrice}
              productQuantity={item?.currentQuantity}
              key={`product-item-${item?._id}`}
            />
          );
        })}
      </div>
    </div>
  );
}
