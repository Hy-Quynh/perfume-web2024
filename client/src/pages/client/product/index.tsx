import React, { useEffect, useState } from 'react';
import { productAPI } from '../../../services/product';
import { categoryAPI } from '../../../services/category';
import { brandAPI } from '../../../services/brand';
import ProductItem from '../../../components/productItem';
import CustomPagination from '../../../components/customPagination';

const PRICE_FILTER = [
  {
    value: 'ALL_PRICE',
    label: 'Tất cả giá',
  },
  {
    value: 'BELOW_1MILION',
    label: 'Dưới 1 triệu',
  },
  {
    value: 'FROM_1_3MILION',
    label: '1-3 triệu',
  },
  {
    value: 'FROM_3_5MILION',
    label: '3-5 triệu',
  },
  {
    value: 'FROM_5_10MILION',
    label: '5-10 triệu',
  },
  {
    value: 'ABOVE_10MILION',
    label: 'Trên 10 triệu',
  },
];

const PRICE_VALUE: any = {
  ALL_PRICE: [-1, -1],
  BELOW_1MILION: [0, 1 * 1000000 - 1],
  FROM_1_3MILION: [1 * 1000000, 3 * 1000000],
  FROM_3_5MILION: [3 * 1000000 + 1, 5 * 1000000],
  FROM_5_10MILION: [5 * 1000000 + 1, 10 * 1000000],
  ABOVE_10MILION: [10 * 1000000 + 1, -1],
};

const ITEM_PER_PAGE = 12;

export default function ProductPage() {
  const [categorySelected, setCategorySelected] = useState('');
  const [brandSelected, setBrandSelected] = useState('');
  const [priceSelected, setPriceSelected] = useState('ALL_PRICE');
  const [categoryOption, setCategoryOption] = useState([]);
  const [brandOption, setBrandOption] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  const getNewProductByFilter = async (
    categoryId: string,
    brandId: string,
    page: number,
    search: string,
    min: number,
    max: number
  ) => {
    const productRes = await productAPI.getAllProduct(
      ITEM_PER_PAGE,
      (page - 1) * ITEM_PER_PAGE,
      search,
      brandId,
      categoryId,
      min,
      max,
      true
    );

    if (productRes?.data?.success) {
      setListProduct(productRes?.data?.payload?.product);
      const totalItem = productRes?.data?.payload?.total;
      const totalPage = Math.ceil(Number(totalItem) / ITEM_PER_PAGE);
      setTotalPage(totalPage);
    }
  };

  useEffect(() => {
    const params: any = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop: any) => searchParams.get(prop),
    });
    const categoryId = params?.category;
    const brandId = params?.brand;
    const search = params?.search;
    const price = params?.price;

    if (categoryId) setCategorySelected(categoryId);
    if (brandId) setBrandSelected(brandId);
    if (search) setSearchText(search || '');
    if (price) setPriceSelected(price || '');

    getNewProductByFilter(
      categoryId || '',
      brandId || '',
      1,
      search || '',
      PRICE_VALUE[price] ? PRICE_VALUE[price][0] : -1,
      PRICE_VALUE[price] ? PRICE_VALUE[price][1] : -1
    );
  }, []);

  const getlistCategory = async () => {
    try {
      const categoryRes = await categoryAPI.getAllCategory();
      if (categoryRes?.data?.success) {
        const payload = categoryRes?.data?.payload?.category;
        const option = payload?.map((item: any) => {
          return {
            label: item?.name,
            value: item?._id,
          };
        });
        option.unshift({
          label: 'Tất cả',
          value: '',
        });
        setCategoryOption(option);
      }
    } catch (error) {
      console.log('get list brand error >>> ', error);
    }
  };

  const getListBranch = async () => {
    try {
      const branchRes = await brandAPI.getAllBrand();

      if (branchRes?.data?.success) {
        const payload = branchRes?.data?.payload?.brand;
        const option = payload?.map((item: any) => {
          return {
            label: item?.name,
            value: item?._id,
          };
        });
        option.unshift({
          label: 'Tất cả',
          value: '',
        });
        setBrandOption(option);
      }
    } catch (error) {
      console.log('get list brand error >>> ', error);
    }
  };

  useEffect(() => {
    getlistCategory();
    getListBranch();
  }, []);

  return (
    <>
      {/* Breadcrumb Start */}
      <div className='container-fluid'>
        <div className='row px-xl-5'>
          <div className='col-12'>
            <nav className='breadcrumb bg-light mb-30'>
              <a className='breadcrumb-item text-dark' href='#'>
                Trang chủ
              </a>
              <span className='breadcrumb-item active'>Sản phẩm</span>
            </nav>
          </div>
        </div>
      </div>
      {/* Breadcrumb End */}
      {/* Shop Start */}
      <div className='container-fluid'>
        <div className='row px-xl-5'>
          {/* Shop Sidebar Start */}
          <div className='col-lg-3 col-md-4'>
            {/* Price Start */}
            <h5 className='section-title position-relative text-uppercase mb-3'>
              <span className='bg-secondary pr-3'>Tìm kiếm theo giá</span>
            </h5>
            <div className='bg-light p-4 mb-30'>
              <form>
                {PRICE_FILTER?.map((item, index) => {
                  return (
                    <div
                      key={`price-filter-${item.value}`}
                      className='flex items-center mb-[10px]'
                    >
                      <input
                        type='radio'
                        id={item?.value}
                        name='product_price'
                        value={item?.value}
                        checked={priceSelected === item?.value}
                        onChange={(event) => {
                          setPriceSelected(event.target.value);
                          const urlParams = new URLSearchParams(
                            window.location.search
                          );
                          if (Number(event.target.value) !== -1) {
                            urlParams.set('price', event.target.value);
                          } else {
                            urlParams.delete('price');
                          }
                          setTimeout(() => {
                            window.location.search = urlParams as any;
                          }, 500);
                        }}
                      />
                       {' '}
                      <label htmlFor={item?.value} className='mb-0'>
                        {item?.label}
                      </label>
                    </div>
                  );
                })}
              </form>
            </div>
            {/* Price End */}
            {/* Color Start */}
            <h5 className='section-title position-relative text-uppercase mb-3'>
              <span className='bg-secondary pr-3'>Tìm kiếm theo danh mục</span>
            </h5>
            <div className='bg-light p-4 mb-30'>
              <form>
                {categoryOption?.map((item: any) => {
                  return (
                    <div
                      key={`category-filter-${item?.value}`}
                      className='flex items-center mb-[10px]'
                    >
                      <input
                        type='radio'
                        id={'product_category' + item?.value}
                        name='product_category'
                        value={item?.value}
                        checked={categorySelected === item?.value}
                        onChange={(event: any) => {
                          setCategorySelected(event.target.value);
                          const urlParams = new URLSearchParams(
                            window.location.search
                          );
                          if (event.target.value) {
                            urlParams.set('category', event.target.value);
                          } else {
                            urlParams.delete('category');
                          }
                          setTimeout(() => {
                            window.location.search = urlParams as any;
                          }, 500);
                        }}
                      />
                       {' '}
                      <label
                        htmlFor={'product_category' + item?.value}
                        className='mb-0'
                      >
                        {item?.label}
                      </label>
                    </div>
                  );
                })}
              </form>
            </div>
            {/* Color End */}
            {/* Size Start */}
            <h5 className='section-title position-relative text-uppercase mb-3'>
              <span className='bg-secondary pr-3'>
                Tìm kiếm theo thương hiệu
              </span>
            </h5>
            <div className='bg-light p-4 mb-30'>
              <form>
                {brandOption?.map((item: any) => {
                  return (
                    <div
                      key={`brand-filter-${item?.value}`}
                      className='flex items-center mb-[10px]'
                    >
                      <input
                        type='radio'
                        id={'product_brand' + item?.value}
                        name='product_brand'
                        value={item?.value}
                        checked={brandSelected === item?.value}
                        onChange={(event: any) => {
                          setBrandSelected(event.target.value);
                          const urlParams = new URLSearchParams(
                            window.location.search
                          );
                          if (event.target.value) {
                            urlParams.set('brand', event.target.value);
                          } else {
                            urlParams.delete('brand');
                          }
                          setTimeout(() => {
                            window.location.search = urlParams as any;
                          }, 500);
                        }}
                      />
                      <label
                        htmlFor={'product_brand' + item?.value}
                        style={{ marginLeft: '10px' }}
                        className='mb-0'
                      >
                        {item?.label}
                      </label>
                      <br />
                    </div>
                  );
                })}
              </form>
            </div>
            {/* Size End */}
          </div>
          {/* Shop Sidebar End */}
          {/* Shop Product Start */}
          <div className='col-lg-9 col-md-8'>
            <div className='row pb-3' style={{ marginTop: '40px' }}>
              {searchText?.length ? (
                <div
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    marginTop: '-45px',
                    marginBottom: '15px',
                    fontSize: '20px',
                  }}
                >
                  Kết quả kìm kiếm cho{' '}
                  <span style={{ fontWeight: 600 }}>" {searchText} "</span>
                </div>
              ) : null}

              {listProduct?.length ? (
                listProduct?.map((item: any) => {
                  return (
                    <ProductItem
                      customClassName='col-lg-4 col-md-6 col-sm-6 pb-1'
                      productId={item?._id}
                      productImage={item?.image}
                      productName={item?.name}
                      productPrice={item?.price}
                      salePrice={item?.salePrice}
                      productQuantity={item?.currentQuantity}
                      key={`product-item-${item?._id}`}
                    />
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  Không có sản phẩm phù hợp
                </div>
              )}
            </div>
            {totalPage > 1 ? (
              <div className='mt-[20px]'>
                <CustomPagination
                  totalPage={totalPage}
                  handlePageChange={(page) => {
                    getNewProductByFilter(
                      categorySelected,
                      brandSelected,
                      page,
                      searchText,
                      PRICE_VALUE[priceSelected]
                        ? PRICE_VALUE[priceSelected][0]
                        : -1,
                      PRICE_VALUE[priceSelected]
                        ? PRICE_VALUE[priceSelected][1]
                        : -1
                    );
                  }}
                />
              </div>
            ) : null}
          </div>
          {/* Shop Product End */}
        </div>
      </div>
      {/* Shop End */}
    </>
  );
}
