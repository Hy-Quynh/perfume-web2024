import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Markup } from 'interweave';
import { addProductToCart, parseJSON } from '../../../utils/handleData';
import { FORMAT_NUMBER, USER_INFO_KEY } from '../../../constants';
import { productAPI } from '../../../services/product';
import { message } from 'antd';
import ProductItem from '../../../components/productItem';
import './style.scss';

export default function ProductDetail() {
  const [productDetail, setProductDetail] = useState<any>({});
  const [relativeProduct, setRelativeProduct] = useState([]);
  const [productQuanlity, setProductQuanlity] = useState(1);
  const { productId } = useParams();
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY));

  const getProductDetail = async () => {
    try {
      if (!productId) {
        return message.error('Mã sản phẩm không chính xác');
      }

      const detailRes = await productAPI.getProductById(productId);
      if (detailRes?.data?.success) {
        setProductDetail(detailRes?.data?.payload);
      }
    } catch (error) {
      console.log('get product detail error: ', error);
    }
  };

  const getRelativeProduct = async () => {
    try {
      const productRes = await productAPI.getAllProduct(
        8,
        0,
        undefined,
        undefined,
        productDetail?.categoryId,
        undefined,
        undefined,
        true
      );

      if (productRes?.data?.success) {
        const newProduct = productRes?.data?.payload?.product?.filter(
          (item: any) => {
            return item?._id !== productId;
          }
        );
        setRelativeProduct(newProduct);
      }
    } catch (error) {
      console.log('get relative product error: ', error);
    }
  };

  useEffect(() => {
    getProductDetail();
  }, []);

  useEffect(() => {
    getRelativeProduct();
  }, [productDetail]);

  return (
    <>
      {/* Breadcrumb Start */}
      <div className='container-fluid'>
        <div className='row px-xl-5'>
          <div className='col-12'>
            <nav className='breadcrumb bg-light mb-30'>
              <a className='breadcrumb-item text-dark' href='/'>
                Trang chủ
              </a>
              <a className='breadcrumb-item text-dark' href='product'>
                Sản phẩm
              </a>
              <span className='breadcrumb-item active'>
                {productDetail?.name}
              </span>
            </nav>
          </div>
        </div>
      </div>
      {/* Breadcrumb End */}
      {/* Shop Detail Start */}
      <div className='container-fluid pb-5'>
        <div className='row px-xl-5'>
          <div className='col-lg-5 mb-30'>
            <img className='w-100' src={productDetail?.image} alt='product' />
          </div>
          <div className='col-lg-7 h-auto mb-30'>
            <div className='h-100 bg-light p-30'>
              <h3 className='text-2xl mb-[30px]'>{productDetail?.name}</h3>

              <div
                className='col-lg-12 pl-0 pr-0'
                style={
                  productDetail?.salePrice !== productDetail?.price &&
                  productDetail?.salePrice > 0
                    ? {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }
                    : {}
                }
              >
                {productDetail?.salePrice !== productDetail?.price &&
                  productDetail?.salePrice > 0 && (
                    <h6
                      style={{
                        textAlign: 'center',
                        color: 'red',
                        fontSize: '20px',
                      }}
                    >
                      {FORMAT_NUMBER.format(productDetail?.salePrice)} VNĐ
                    </h6>
                  )}
                <h6
                  style={{
                    textAlign:
                      productDetail?.salePrice !== productDetail?.price &&
                      productDetail?.salePrice > 0
                        ? 'center'
                        : 'left',
                    fontSize: '20px',
                    textDecoration:
                      productDetail?.salePrice !== productDetail?.price &&
                      productDetail?.salePrice > 0
                        ? 'line-through'
                        : 'unset',
                  }}
                >
                  {FORMAT_NUMBER.format(productDetail?.price)} VNĐ
                </h6>
              </div>
              <p className='mt-4 mb-4 text-left'>
                <span style={{ color: '#222870' }}>Thương hiệu: </span>{' '}
                <span>{productDetail?.brandName}</span>
              </p>

              <p className='mb-4 text-left'>
                <span style={{ color: '#222870' }}>Loại sản phẩm: </span>{' '}
                <span>{productDetail?.categoryName}</span>
              </p>

              <p className='mb-4 text-left'>
                <span style={{ color: '#222870' }}>Số lượng trong kho: </span>{' '}
                <span>{productDetail?.currentQuantity}</span>
              </p>

              <div className='d-flex align-items-center mb-4 pt-2'>
                <div
                  className='input-group quantity mr-3'
                  style={{ width: 130 }}
                >
                  <div className='input-group-btn'>
                    <button
                      className='btn btn-minus bg-mainColor text-white'
                      onClick={() => {
                        if (Number(productQuanlity) <= 1) {
                          return message.error('Số lượng không thể nhỏ hơn 0');
                        }

                        setProductQuanlity(productQuanlity - 1);
                      }}
                    >
                      <i className='fa fa-minus' />
                    </button>
                  </div>
                  <input
                    type='text'
                    className='form-control bg-secondary border-0 text-center'
                    value={productQuanlity}
                    onChange={(event) => {
                      if (Number(event.target.value) < 0) {
                        setProductQuanlity(0);
                        return message.error('Số lượng không thể nhỏ hơn 0');
                      }

                      if (
                        Number(event.target.value) >
                        Number(productDetail?.currentQuantity)
                      ) {
                        return message.error(
                          'Số lượng không được lớn hơn số lượng hiện có'
                        );
                      }

                      setProductQuanlity(Number(event.target.value));
                    }}
                  />
                  <div className='input-group-btn'>
                    <button
                      className='btn btn-plus bg-mainColor text-white'
                      onClick={() => {
                        if (
                          Number(productQuanlity) >=
                          Number(productDetail?.currentQuantity)
                        ) {
                          return message.error(
                            'Số lượng không được lớn hơn số lượng hiện có'
                          );
                        }

                        setProductQuanlity(productQuanlity + 1);
                      }}
                    >
                      <i className='fa fa-plus' />
                    </button>
                  </div>
                </div>
                <button
                  className='btn px-3 bg-mainColor text-white'
                  onClick={() => {
                    if (!userData?._id) {
                      return message.error(
                        'Bạn cần đăng nhập để thực hiện chức năng này'
                      );
                    }

                    if (
                      Number(productQuanlity) >
                      Number(productDetail?.currentQuantity)
                    ) {
                      return message.error(
                        'Số lượng lớn hơn số lượng sản phẩm hiện có'
                      );
                    }

                    addProductToCart({
                      product_id: productId,
                      product_name: productDetail?.name,
                      product_price: productDetail?.price,
                      product_sale: productDetail?.salePrice,
                      product_image: productDetail?.image,
                      quantity: productQuanlity,
                    });

                    message.success('Thêm sản phẩm vào giỏ hàng thành công');
                  }}
                >
                  <i className='fa fa-shopping-cart mr-1' /> Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='row px-xl-5'>
          <div className='col'>
            <div className='bg-light p-30'>
              <div className='nav nav-tabs mb-4'>
                <a
                  className='nav-item nav-link text-dark active'
                  data-toggle='tab'
                  href='#tab-pane-1'
                >
                  Thông tin chi tiết
                </a>
              </div>
              <div className='tab-content'>
                <div className='tab-pane fade show active' id='tab-pane-1'>
                  <h4 className='mb-3 text-3xl font-bold'>Chi tiết sản phẩm</h4>
                  <div className='product-detail-description'>
                    <Markup content={productDetail?.description || ''} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Shop Detail End */}

      {/* Products Start */}
      <div className='container-fluid py-5'>
        <h2 className='section-title position-relative text-uppercase mx-xl-5 mb-4'>
          <span className='bg-secondary pr-3'>Bạn cũng có thể thích</span>
        </h2>
        <div className='row px-xl-5'>
          {relativeProduct?.map((item: any, index) => {
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
      {/* Products End */}
    </>
  );
}
