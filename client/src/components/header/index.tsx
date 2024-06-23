import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logOut, parseJSON } from '../../utils/handleData';
import { USER_CART_INFO, USER_INFO_KEY } from '../../constants';
import { categoryAPI } from '../../services/category';
import WebLogo from '../../assets/images/logo.png';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categoryOption, setCategoryOption] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [searchText, setSearchText] = useState('');
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY));

  const getlistCategory = async () => {
    try {
      const categoryRes = await categoryAPI.getAllCategory();
      if (categoryRes?.data?.success) {
        const payload = categoryRes?.data?.payload?.category;

        const option = payload?.map((item: any, index: number) => {
          return {
            label: item?.name,
            value: item?._id,
          };
        });
        setCategoryOption(option);
      }
    } catch (error) {
      console.log('get list brand error >>> ', error);
    }
  };

  useEffect(() => {
    getlistCategory();
  }, []);

  useEffect(() => {
    const changeQuantityInCart = () => {
      const cartData =
        parseJSON(
          localStorage.getItem(USER_CART_INFO + `_${userData?._id || ''}`)
        ) || [];
      setCartQuantity(cartData?.length);
    };
    changeQuantityInCart();
    window.addEventListener('storage', changeQuantityInCart);
    return () => {
      window.removeEventListener('storage', changeQuantityInCart);
    };
  }, []);

  useEffect(() => {
    const params: any = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop: any) => searchParams.get(prop),
    });
    const search = params?.search || '';
    setSearchText(search);
  }, []);

  return (
    <div>
      {/* Topbar Start */}
      <div className='container-fluid'>
        <div className='row bg-secondary py-1 px-xl-5'>
          <div className='col-lg-6 d-none d-lg-block'>
            <div className='d-inline-flex align-items-center h-100'></div>
          </div>
          <div className='col-lg-6 text-center text-lg-right'>
            <div className='d-inline-flex align-items-center'>
              <div className='btn-group'>
                <button
                  type='button'
                  className='btn btn-sm btn-light dropdown-toggle'
                  data-toggle='dropdown'
                >
                  {userData?._id ? 'Trang cá nhân' : 'Tài khoản'}
                </button>
                {userData?._id ? (
                  <div className='dropdown-menu dropdown-menu-right'>
                    <button
                      className='dropdown-item active:!bg-mainColor'
                      type='button'
                      onClick={() => navigate('/personal')}
                    >
                      Trang cá nhân
                    </button>
                    <button
                      className='dropdown-item active:!bg-mainColor'
                      type='button'
                      onClick={() => {
                        logOut();
                        navigate('/');
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className='dropdown-menu dropdown-menu-right'>
                    <button
                      className='dropdown-item active:bg-mainColor'
                      type='button'
                      onClick={() => navigate('/login')}
                    >
                      Đăng nhập
                    </button>
                    <button
                      className='dropdown-item active:bg-mainColor'
                      type='button'
                      onClick={() => navigate('/register')}
                    >
                      Đăng ký
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className='d-inline-flex align-items-center d-block '>
              <a href='/cart' className='btn px-0 ml-2'>
                <i className='fas fa-shopping-cart text-dark' />
                <span
                  className='badge text-dark border border-dark rounded-circle'
                  style={{ paddingBottom: 2 }}
                >
                  {userData?._id ? cartQuantity || 0 : 0}
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className='row align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex'>
          <div className='col-lg-4'>
            <div className='logo flex justify-center items-center gap-[10px]'>
              <img src={WebLogo} className='w-[50px] h-[50px]' alt='logo'></img>
              <p className='font-bold text-mainColor text-3xl'>PERFUMES</p>
            </div>
          </div>
          <div className='col-lg-4 col-6 text-left'>
            <form action=''>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control hover:!border-mainColor active:!border-mainColor focus:!border-mainColor'
                  placeholder='Nhập vào tên sản phẩm'
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                />
                <div
                  className='input-group-append'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (location?.pathname?.indexOf('product') >= 0) {
                      const urlParams = new URLSearchParams(
                        window.location.search
                      );
                      urlParams.set('search', searchText);
                      setTimeout(() => {
                        window.location.search = urlParams as any;
                      }, 500);
                    } else {
                      navigate(`/product?search=${searchText}`);
                    }
                  }}
                >
                  <span className='input-group-text bg-transparent text-primary'>
                    <i className='fa fa-search text-mainColor' />
                  </span>
                </div>
              </div>
            </form>
          </div>
          <div className='col-lg-4 col-6 text-right'>
            <p className='m-0'>Chăm sóc khách hàng</p>
            <h5 className='m-0'>+012 345 6789</h5>
          </div>
        </div>
      </div>
      {/* Topbar End */}
      {/* Navbar Start */}
      <div className='container-fluid bg-dark mb-30'>
        <div className='row px-xl-5'>
          <div className='flex justify-start items-center w-full p-[20px] flex-wrap md:gap-x-[50px] gap-x-[20px] gap-y-[10px]'>
            <a
              href='/'
              className='cursor-pointer text-white hover:no-underline md:text-xl text-sm'
            >
              Trang chủ
            </a>

            <a
              href='/product'
              className='cursor-pointer text-white hover:no-underline  md:text-xl text-sm'
            >
              Sản phẩm
            </a>
          </div>
        </div>
      </div>
      {/* Navbar End */}
    </div>
  );
}
