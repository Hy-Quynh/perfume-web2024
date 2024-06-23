import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJSON } from '../../../utils/handleData';
import {
  FORMAT_NUMBER,
  USER_CART_INFO,
  USER_INFO_KEY,
} from '../../../constants';
import { message } from 'antd';
import { productAPI } from '../../../services/product';
import { DeleteFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons';

const calculateTotalPrice = (lstProduct: any) => {
  const total = lstProduct?.reduce((previous: any, next: any) => {
    if (
      Number(next.product_sale) > 0 &&
      Number(next.product_sale) !== Number(next.product_price)
    ) {
      return previous + Number(next.quantity) * Number(next.product_sale);
    } else {
      return previous + Number(next.quantity) * Number(next.product_price);
    }
  }, 0);
  return total || 0;
};

export default function CartPage() {
  const [cartProduct, setCartProduct] = useState([]);
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY), {});
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData?._id) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    (async () => {
      const currCart = localStorage.getItem(
        USER_CART_INFO + `_${userData?._id || ''}`
      )
        ? parseJSON(
            localStorage.getItem(USER_CART_INFO + `_${userData?._id || ''}`)
          )
        : [];
      setCartProduct(currCart);
    })();
  }, []);

  const changeProductQuantity = async (
    qlt: number,
    productId: string,
    type = 'add'
  ) => {
    if (type !== 'remove') {
      const currQuantity = await productAPI.getProductById(productId);
      if (qlt > Number(currQuantity?.data?.payload?.currentQuantity)) {
        return message.error('Số lượng vượt quá số lượng hiện có');
      }
    }
    const currCart: any = [...cartProduct];
    const findIndex = currCart?.findIndex(
      (item: any) => item?.product_id === productId
    );
    if (findIndex >= 0) {
      currCart[findIndex].quantity = qlt;
      setCartProduct(currCart);
      localStorage.setItem(
        USER_CART_INFO + `_${userData?._id || ''}`,
        JSON.stringify(currCart)
      );
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <>
      <section className='inner_page_head'>
        <div className='container_fuild'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='full'>
                <h3 style={{ textAlign: 'center' }}>Giỏ hàng</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='container' style={{ marginTop: '50px' }}>
        <table id='cart' className='table table-hover table-condensed'>
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Sản phẩm</th>
              <th style={{ width: '10%' }}>Giá</th>
              <th style={{ width: '10%' }}>Giá giảm</th>
              <th style={{ width: '8%' }}>Số lượng</th>
              <th style={{ width: '20%' }} className='text-center'>
                Tổng
              </th>
              <th style={{ width: '10%' }} />
            </tr>
          </thead>
          <tbody>
            {cartProduct?.map((cartItem: any, cartIndex) => {
              return (
                <tr key={`cart-item-${cartIndex}`}>
                  <td data-th='Product'>
                    <div className='row'>
                      <div className='col-sm-2 hidden-xs'>
                        <img
                          src={cartItem?.product_image}
                          alt='...'
                          className='img-responsive'
                          width={50}
                          height={50}
                        />
                      </div>
                      <div className='col-sm-10'>
                        <h5
                          className='nomargin'
                          style={{
                            cursor: 'pointer',
                            color: 'black',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          onClick={() =>
                            navigate(`/product/${cartItem?.product_id}`)
                          }
                        >
                          {cartItem?.product_name}
                        </h5>
                      </div>
                    </div>
                  </td>
                  <td data-th='Price'>
                    {FORMAT_NUMBER.format(Number(cartItem.product_price))} đ
                  </td>
                  <td data-th='Price'>
                    {cartItem.product_sale > 0 &&
                    cartItem.product_sale !== cartItem.product_price
                      ? FORMAT_NUMBER.format(Number(cartItem.product_sale)) +
                        'đ'
                      : ''}
                  </td>
                  <td data-th='Quantity'>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          padding: '5px',
                          background: '#DC3545',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          if (cartItem?.quantity - 1 > 0) {
                            changeProductQuantity(
                              Number(cartItem?.quantity) - 1,
                              cartItem?.product_id,
                              'remove'
                            );
                          }
                        }}
                      >
                        <MinusOutlined className='text-[white]' />
                      </div>
                      <input
                        type='text'
                        className='form-control bg-secondary border-0 text-center'
                        value={cartItem?.quantity}
                        style={{ width: '60px' }}
                        onChange={(event) => {
                          if (
                            Number(event.target.value) < 0 ||
                            !event.target.value
                          ) {
                            changeProductQuantity(0, cartItem?.product_id);
                            return message.error(
                              'Số lượng không thể nhỏ hơn 0'
                            );
                          }

                          changeProductQuantity(
                            Number(event.target.value),
                            cartItem?.product_id
                          );
                        }}
                      />

                      <div
                        style={{
                          padding: '5px',
                          background: '#3CB914',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          changeProductQuantity(
                            Number(cartItem?.quantity) + 1,
                            cartItem?.product_id
                          );
                        }}
                      >
                        <PlusOutlined className='text-[white]' />
                      </div>
                    </div>
                  </td>
                  <td data-th='Subtotal' className='text-center'>
                    {FORMAT_NUMBER.format(
                      Number(cartItem?.quantity) *
                        (cartItem.product_sale > 0 &&
                        cartItem.product_sale !== cartItem.product_price
                          ? Number(cartItem?.product_sale)
                          : Number(cartItem?.product_price))
                    )}{' '}
                    đ
                  </td>
                  <td className='actions' data-th>
                    <button
                      className='btn btn-danger btn-sm'
                      onClick={() => {
                        const currCart = [...cartProduct]?.filter(
                          (item: any) =>
                            item?.product_id !== cartItem?.product_id
                        );
                        localStorage.setItem(
                          USER_CART_INFO + `_${userData?._id || ''}`,
                          JSON.stringify(currCart)
                        );
                        window.dispatchEvent(new Event('storage'));
                        setCartProduct(currCart);
                      }}
                    >
                      <DeleteFilled />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className='visible-xs'>
              <td className='text-center'>
                <strong>
                  Tổng: {FORMAT_NUMBER.format(calculateTotalPrice(cartProduct))}{' '}
                  đ
                </strong>
              </td>
            </tr>
            <tr>
              <td>
                <a href='/' className='btn' style={{ color: 'black' }}>
                  <i className='fa fa-angle-left' /> Tiếp tục mua sắm
                </a>
              </td>
              <td colSpan={2} className='hidden-xs' />
              <td className='hidden-xs text-center'>
                <strong style={{ whiteSpace: 'nowrap' }}>
                  Tổng: {FORMAT_NUMBER.format(calculateTotalPrice(cartProduct))}{' '}
                  đ
                </strong>
              </td>
              <td colSpan={1} className='hidden-xs' />
              <td style={{ textAlign: 'right' }}>
                <div
                  className='btn btn-success btn-block bg-mainColor'
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    width: 'fit-content',
                    color: 'white',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                  onClick={() => {
                    if (!cartProduct?.length) {
                      return message.error('Không có sản phẩm trong giỏ hàng');
                    } else {
                      navigate('/payment');
                    }
                  }}
                >
                  <span>Thanh toán </span>
                  <span style={{ marginLeft: '20px' }}>
                    <i className='fa fa-angle-right' />
                  </span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
