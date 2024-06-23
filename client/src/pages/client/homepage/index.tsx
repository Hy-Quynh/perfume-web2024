import HomepageBrand from './components/Brand';
import HomepageCategory from './components/Category';
import NewProduct from './components/NewProduct';
import SellingProduct from './components/SellingProduct';

export default function HomePage() {
  return (
    <div>
      <div className='container-fluid mb-3'>
        <div className='row px-xl-5'>
          <div className='col-lg-8'>
            <div
              id='header-carousel'
              className='carousel slide carousel-fade mb-30 mb-lg-0'
              data-ride='carousel'
            >
              <ol className='carousel-indicators'>
                <li
                  data-target='#header-carousel'
                  data-slide-to={0}
                  className='active'
                />
                <li data-target='#header-carousel' data-slide-to={1} />
                <li data-target='#header-carousel' data-slide-to={2} />
              </ol>
              <div className='carousel-inner'>
                <div
                  className='carousel-item position-relative active'
                  style={{ height: 430 }}
                >
                  <img
                    className='position-absolute w-100 h-100'
                    src='https://t4.ftcdn.net/jpg/05/56/90/13/360_F_556901330_u2u48dyBnK16UozWBrlMuNmkbR3HnubL.jpg'
                    style={{ objectFit: 'cover' }}
                    alt='banner'
                  />
                  <div className='carousel-caption d-flex flex-column align-items-center justify-content-center'>
                    <div className='p-3' style={{ maxWidth: 700 }}>
                      <h1 className='display-4 text-white mb-3 animate__animated animate__fadeInDown'>
                        Sản phẩm mới
                      </h1>
                      <p className='mx-md-5 px-5 animate__animated animate__bounceIn'>
                        Với hơn 100 sản phẩm với công nghệ hiện đại, sẽ đem lại
                        trải nghiệm tuyệt vời dành cho bạn
                      </p>
                      <a
                        className='btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp'
                        href='product'
                      >
                        Mua ngay
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className='carousel-item position-relative'
                  style={{ height: 430 }}
                >
                  <img
                    className='position-absolute w-100 h-100'
                    src='https://t3.ftcdn.net/jpg/05/67/49/10/360_F_567491096_NAwRcgSINQs0ghpwlMGKWoiX639OIaW0.jpg'
                    style={{ objectFit: 'cover' }}
                    alt='banner'
                  />
                  <div className='carousel-caption d-flex flex-column align-items-center justify-content-center'>
                    <div className='p-3' style={{ maxWidth: 700 }}>
                      <h1 className='display-4 text-white mb-3 animate__animated animate__fadeInDown'>
                        Nước hoa CoCo
                      </h1>
                      <p className='mx-md-5 px-5 animate__animated animate__bounceIn'>
                        Với hơn 100 sản phẩm với công nghệ hiện đại, sẽ đem lại
                        trải nghiệm tuyệt vời dành cho bạn
                      </p>
                      <a
                        className='btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp'
                        href='/product'
                      >
                        Mua ngay
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className='carousel-item position-relative'
                  style={{ height: 430 }}
                >
                  <img
                    className='position-absolute w-100 h-100'
                    src='https://t4.ftcdn.net/jpg/05/67/49/11/360_F_567491180_BshCt5tkGVVkRLeKfSHs4xHe0Iy42vWv.jpg'
                    style={{ objectFit: 'cover' }}
                    alt='banner'
                  />
                  <div className='carousel-caption d-flex flex-column align-items-center justify-content-center'>
                    <div className='p-3' style={{ maxWidth: 700 }}>
                      <h1 className='display-4 text-white mb-3 animate__animated animate__fadeInDown'>
                        Nước hoa CoCo
                      </h1>
                      <p className='mx-md-5 px-5 animate__animated animate__bounceIn'>
                        Với hơn 100 sản phẩm với công nghệ hiện đại, sẽ đem lại
                        trải nghiệm tuyệt vời dành cho bạn
                      </p>
                      <a
                        className='btn btn-outline-light py-2 px-4 mt-3 animate__animated animate__fadeInUp'
                        href='/product'
                      >
                        Mua ngay
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-4'>
            <div className='product-offer mb-30' style={{ height: 200 }}>
              <img
                className='img-fluid'
                src='https://t3.ftcdn.net/jpg/06/33/49/22/360_F_633492212_U5QX0ceS9tNVJFjcysqmA0wuIEoA9Gq9.jpg'
                alt=''
              />
              <div className='offer-text'>
                <h6 className='text-white text-uppercase'>Mua 1 tặng 1</h6>
                <h3 className='text-white mb-3'>Khuyến mãi sốc</h3>
                <a href='/product' className='btn bg-mainColor text-white'>
                  Mua ngay
                </a>
              </div>
            </div>
            <div className='product-offer mb-30' style={{ height: 200 }}>
              <img
                className='img-fluid'
                src='https://img.freepik.com/premium-photo/elegant-perfume-photo_551707-11880.jpg'
                alt=''
              />
              <div className='offer-text'>
                <h6 className='text-white text-uppercase'>Giảm 20%</h6>
                <h3 className='text-white mb-3'>Khuyến mãi</h3>
                <a href='/product' className='btn bg-mainColor text-white'>
                  Mua ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Carousel End */}
      {/* Featured Start */}
      <div className='container-fluid pt-5'>
        <div className='row px-xl-5 pb-3'>
          <div className='col-lg-3 col-md-6 col-sm-12 pb-1'>
            <div
              className='d-flex align-items-center bg-light mb-4'
              style={{ padding: 30 }}
            >
              <h1 className='fa fa-check text-mainColor m-0 mr-3' />
              <h5 className='font-weight-semi-bold m-0'>Chất lượng sản phẩm</h5>
            </div>
          </div>
          <div className='col-lg-3 col-md-6 col-sm-12 pb-1'>
            <div
              className='d-flex align-items-center bg-light mb-4'
              style={{ padding: 30 }}
            >
              <h1 className='fa fa-shipping-fast text-mainColor m-0 mr-2' />
              <h5 className='font-weight-semi-bold m-0'>Miễn phí vận chuyển</h5>
            </div>
          </div>
          <div className='col-lg-3 col-md-6 col-sm-12 pb-1'>
            <div
              className='d-flex align-items-center bg-light mb-4'
              style={{ padding: 30 }}
            >
              <h1 className='fas fa-exchange-alt text-mainColor m-0 mr-3' />
              <h5 className='font-weight-semi-bold m-0'>Đổi mới 14 ngày</h5>
            </div>
          </div>
          <div className='col-lg-3 col-md-6 col-sm-12 pb-1'>
            <div
              className='d-flex align-items-center bg-light mb-4'
              style={{ padding: 30 }}
            >
              <h1 className='fa fa-phone-volume text-mainColor m-0 mr-3' />
              <h5 className='font-weight-semi-bold m-0'>Hỗ trợ 24/7</h5>
            </div>
          </div>
        </div>
      </div>
      {/* Featured End */}
      {/* Categories Start */}
      <HomepageCategory />
      {/* Categories End */}

      {/* Categories Start */}
      <HomepageBrand />
      {/* Categories End */}

      {/* Products Start */}
      <NewProduct />

      {/* Products End */}
      {/* Offer Start */}
      <div className='container-fluid pt-5 pb-3'>
        <div className='row px-xl-5'>
          <div className='col-md-6'>
            <div className='product-offer mb-30' style={{ height: 300 }}>
              <img
                className='img-fluid'
                src='https://t3.ftcdn.net/jpg/06/21/33/10/360_F_621331024_9iCtLhEZ4j88giCrZIIXTJXRDiXAAERy.jpg'
                alt=''
              />
              <div className='offer-text'>
                <h6 className='text-white text-uppercase'>Giảm 20%</h6>
                <h3 className='text-white mb-3'>Khuyến mãi sốc</h3>
                <a href='/product' className='btn bg-mainColor text-white'>
                  Mua ngay
                </a>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='product-offer mb-30' style={{ height: 300 }}>
              <img
                className='img-fluid'
                src='https://static.vecteezy.com/system/resources/previews/026/842/736/large_2x/summer-vanilla-perfume-background-with-copy-space-bright-pink-vanilla-perfume-banner-for-summer-ai-generative-free-photo.jpg'
                alt=''
              />
              <div className='offer-text'>
                <h6 className='text-white text-uppercase'>Mua 1 tặng 1</h6>
                <h3 className='text-white mb-3'>Khuyến mãi đặc biệt</h3>
                <a href='/product' className='btn bg-mainColor text-white'>
                  Mua ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Offer End */}
      <SellingProduct />
      {/* Vendor Start */}
      <div className='container-fluid py-5'>
        <div className='row px-xl-5'>
          <div className='col'>
            <div className='owl-carousel vendor-carousel'>
              <div className='bg-light p-4'>
                <img src='img/vendor-1.jpg' alt='' />
              </div>
              <div className='bg-light p-4'>
                <img src='img/vendor-2.jpg' alt='' />
              </div>
              <div className='bg-light p-4'>
                <img src='img/vendor-3.jpg' alt='' />
              </div>
              <div className='bg-light p-4'>
                <img src='img/vendor-4.jpg' alt='' />
              </div>
              <div className='bg-light p-4'>
                <img src='img/vendor-5.jpg' alt='' />
              </div>
              <div className='bg-light p-4'>
                <img src='img/vendor-6.jpg' alt='' />
              </div>
              <div className='bg-light p-4'>
                <img src='img/vendor-7.jpg' alt='' />
              </div>
              <div className='bg-light p-4'>
                <img src='img/vendor-8.jpg' alt='' />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Vendor End */}
    </div>
  );
}
