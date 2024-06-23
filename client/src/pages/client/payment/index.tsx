import React, { useEffect, useState } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import {
  FORMAT_NUMBER,
  USER_CART_INFO,
  USER_INFO_KEY,
} from '../../../constants';
import { parseJSON } from '../../../utils/handleData';
import { Button, Spin, message } from 'antd';
import { checkoutAPI } from '../../../services/checkout';
import { isVietnamesePhoneNumber } from '../../../utils/validate';
import _ from 'lodash';
import axios from 'axios';

const PAYMENT_METHOD = [
  { label: 'Thanh toán khi nhận hàng', value: 'CODE' },
  { label: 'Thanh toán thẻ', value: 'CARD' },
];

export const calculateTotalPrice = (lstProduct: any) => {
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

export default function PaymentPage() {
  const [cartProduct, setCartProduct] = useState([]);
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY), {});

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

  const totalPrice = calculateTotalPrice(cartProduct);

  return (
    <>
      <section className='inner_page_head'>
        <div className='container_fuild'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='full'>
                <h3 className='text-3xl text-center'>Thanh toán</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='payment-container'>
        <div className='container'>
          <div className='window'>
            <div className='order-info'>
              <div className='order-info-content'>
                <h2>Danh sách đặt hàng</h2>
                <div className='line' />
                <div
                  style={{ maxHeight: '70%', overflowY: 'auto', height: '70%' }}
                >
                  {cartProduct?.map((item: any, index: number) => {
                    return (
                      <>
                        <table className='order-table'>
                          <tbody>
                            <tr>
                              <td>
                                <img
                                  src={item?.product_image}
                                  className='full-width'
                                  alt='Prodiuct'
                                />
                              </td>
                              <td>
                                <br /> {item?.product_name}
                                <br />{' '}
                                <span className='thin small text-left'>
                                  {' '}
                                  Số lượng: {item?.quantity}
                                  <br />
                                  <br />
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div className='price text-left'>
                                  {FORMAT_NUMBER.format(
                                    Number(item?.quantity) *
                                      (item.product_sale > 0 &&
                                      item.product_sale !== item.product_price
                                        ? Number(item?.product_sale)
                                        : Number(item?.product_price))
                                  )}{' '}
                                  đ
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className='line' />
                      </>
                    );
                  })}
                </div>
                <div className='total'>
                  <span style={{ float: 'left' }}>Tổng</span>
                  <span style={{ float: 'right', textAlign: 'right' }}>
                    {FORMAT_NUMBER.format(totalPrice)} đ
                  </span>
                </div>
              </div>
            </div>
            <CheckoutCart
              cartProduct={cartProduct}
              setCartProduct={() => setCartProduct([])}
            />
          </div>
        </div>
      </div>
    </>
  );
}

const CheckoutCart = ({ cartProduct, setCartProduct }: any) => {
  const [userInfo, setUserInfo] = useState<any>({});
  const [paymentOption, setPaymentOption] = useState<'CODE' | 'CARD'>('CODE');
  const [loading, setLoading] = useState(false);
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY), {});
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData?._id) {
      message.error('Bạn cần đăng nhập để thực hiện chức năng này');
      navigate('/login');
    } else {
      setUserInfo(userData);
    }
  }, []);

  const checkoutPayload = () => {
    return {
      cartData: cartProduct?.map((item: any) => {
        return {
          productId: item?.product_id,
          productName: item?.product_name,
          price: item?.product_price,
          salePrice: item?.product_sale,
          orderPrice:
            item?.product_sale > 0 ? item?.product_sale : item?.product_price,
          quantity: item?.quantity,
        };
      }),
      paymentMethod: paymentOption,
      totalQuantity: cartProduct?.reduce(
        (curr: any, next: any) => curr + next.quantity,
        0
      ),
      userInfo: {
        userAddress: userInfo?.address,
        userEmail: userInfo?.email,
        userId: userInfo?._id,
        userName: userInfo?.name,
      },
    };
  };

  const handleCheckout = async () => {
    try {
      const totalPrice = calculateTotalPrice(cartProduct);

      const checkoutResponse = await checkoutAPI.checkoutCart({
        ...checkoutPayload(),
        totalPrice,
      });

      if (checkoutResponse?.data?.success) {
        localStorage.removeItem(USER_CART_INFO + `_${userData?._id || ''}`);
        setCartProduct([]);
        window.dispatchEvent(new Event('storage'));
        message.success('Thanh toán thành công');
        navigate('/cart');
      } else {
        message.error(checkoutResponse?.data?.error?.message);
      }
    } catch (error) {
      message.error('Thanh toán thất bại');
    } finally {
      setLoading(false);
    }
  };

  const checkoutCart = async () => {
    const { name, address, phone } = userInfo;

    const checkNull = _.compact([name, address, phone]);
    if (checkNull.length < 3) {
      return message.error('Thông tin không được để trống');
    }

    if (!isVietnamesePhoneNumber(phone)) {
      return message.error('Số điện thoại sai định dạng');
    }
    setLoading(true);
    return handleCheckout();
  };

  const checkoutPaypal = async () => {
    try {
      const { name, address, phone } = userInfo;

      const checkNull = _.compact([name, address, phone]);
      if (checkNull.length < 3) {
        return message.error('Thông tin không được để trống');
      }

      setLoading(true);
      const totalPrice = calculateTotalPrice(cartProduct);
      await axios
        .post('http://localhost:5005/paypal/pay', {
          ...checkoutPayload(),
          totalPrice,
        })
        .then((response) => {
          window.location.href = response?.data?.redirectLink;
        })
        .catch((error) => {
          console.error('There was an error with the PayPal payment!', error);
        });
    } catch (error: any) {
      message.error(error?.message || 'Thanh toán thất bại');
      console.log('checkoutPaypal error >> ', error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='credit-info !bg-mainColor' style={{ overflowY: 'auto' }}>
      <div
        style={{
          height: '80%',
          overflowY: 'auto',
          paddingLeft: '25px',
          paddingRight: '25px',
        }}
      >
        <div className='credit-info-content'>
          <h5 className='text-2xl font-bold text-center text-white'>
            Thông tin khách hàng
          </h5>
          <p style={{ color: '#3D464D' }} className='text-left text-white'>
            Tên
          </p>
          <input
            className='input-field'
            value={userInfo?.name}
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                name: event.target.value,
              })
            }
          />
          <p style={{ color: '#3D464D' }} className='text-left text-white'>
            Số điện thoại
          </p>
          <input
            className='input-field bg-[white]'
            value={userInfo?.phone}
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                phone: event.target.value,
              })
            }
          />
          <p style={{ color: '#3D464D' }} className='text-left text-white'>
            Địa chỉ
          </p>
          <input
            className='input-field'
            value={userInfo?.address}
            onChange={(event) =>
              setUserInfo({
                ...userInfo,
                address: event.target.value,
              })
            }
          />
        </div>
        <div className='credit-info-content'>
          <h5 className='text-white'>Thông tin thanh toán</h5>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'stretch',
              marginTop: '20px',
            }}
          >
            {PAYMENT_METHOD?.map((item, index) => {
              return (
                <div
                  key={`payment-item-${index}`}
                  onClick={() => {
                    setPaymentOption(item?.value as 'CODE' | 'CARD');
                  }}
                  style={{
                    padding: '5px',
                    border: '2px solid white',
                    background:
                      paymentOption === item?.value ? '#3D464D' : 'white',
                    width: '48%',
                    cursor: 'pointer',
                    color:
                      paymentOption === item?.value ? '#FFD334' : '#3D464D',
                    fontWeight: paymentOption === item?.value ? 700 : 500,
                    fontSize: paymentOption === item?.value ? '16px' : '14px',
                  }}
                >
                  {item?.label}
                </div>
              );
            })}
          </div>

          {paymentOption === 'CARD' ? (
            <button
              className='pay-btn bg-mainColor'
              onClick={() => checkoutPaypal()}
              disabled={loading}
            >
              {loading ? (
                <Spin className='text-white bg-[white]' />
              ) : (
                'Thanh toán PayPal'
              )}
            </button>
          ) : (
            <button
              className='pay-btn bg-mainColor'
              onClick={() => checkoutCart()}
              disabled={loading}
            >
              {loading ? (
                <Spin className='text-white bg-[white]' />
              ) : (
                'Thanh toán'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
