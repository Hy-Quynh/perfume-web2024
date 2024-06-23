export default function Footer() {
  return (
    <div>
      {/* Footer Start */}
      <div className='container-fluid bg-dark text-secondary mt-5 pt-5'>
        <div className='row px-xl-5 pt-5'>
          <div className='col-lg-8 col-md-12 mb-5 pr-3 pr-xl-5'>
            <h5 className='text-secondary text-uppercase mb-4'>
              PERFUME STORE
            </h5>
            <p className='mb-4'>
              Perfume là website chuyên cung cấp các loại nước hoa cao cấp từ những
              thương hiệu nổi tiếng trên thế giới. Chúng tôi cam kết mang đến
              cho khách hàng những sản phẩm chính hãng, chất lượng tốt nhất với
              giá cả cạnh tranh. Với giao diện thân thiện, dễ sử dụng, khách
              hàng có thể dễ dàng tìm kiếm và chọn lựa các loại nước hoa phù hợp
              với phong cách và sở thích của mình.
            </p>
            <p className='mb-2'>
              <i className='fa fa-map-marker-alt text-white mr-3' />
              123 Street, New York, USA
            </p>
            <p className='mb-2'>
              <i className='fa fa-envelope text-white mr-3' />
              info@example.com
            </p>
            <p className='mb-0'>
              <i className='fa fa-phone-alt text-white mr-3' />
              +012 345 67890
            </p>
          </div>
          <div className='col-lg-4 col-md-12'>
            <div className='row'>
              <div className='col-12 mb-5'>
                <h5 className='text-secondary text-uppercase mb-4'>
                  Quick Shop
                </h5>
                <div className='d-flex flex-column justify-content-start'>
                  <a className='text-secondary mb-2' href='/'>
                    <i className='fa fa-angle-right mr-2' />
                    Trang chủ
                  </a>
                  <a className='text-secondary mb-2' href='/product'>
                    <i className='fa fa-angle-right mr-2' />
                    Sản phẩm
                  </a>
                  <a className='text-secondary mb-2' href='/post'>
                    <i className='fa fa-angle-right mr-2' />
                    Bài viết
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
      {/* Back to Top */}
      <a href='#' className='btn btn-primary back-to-top'>
        <i className='fa fa-angle-double-up' />
      </a>
    </div>
  );
}
