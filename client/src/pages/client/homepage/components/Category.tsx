import { useEffect, useState } from "react";
import { categoryAPI } from "../../../../services/category";

export default function HomepageCategory() {
  const [listCategory, setListCategory] = useState<any>([])

  const getCategoryList = async () => {
    try {
      const res = await categoryAPI.getAllCategory(true);

      if (res?.data?.success) {
        setListCategory(res?.data?.payload?.category);
      }
    } catch (error) {
      console.log('get category list error >>> ', error);
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <div className='container-fluid pt-5'>
      <h2 className='section-title position-relative text-uppercase mx-xl-5 mb-4'>
        <span className='bg-secondary pr-3'>Danh mục</span>
      </h2>
      <div className='row px-xl-5 pb-3'>
        {listCategory?.map((item: any, index: number) => {
          return (
            <div
              className='col-lg-3 col-md-4 col-sm-6 pb-1'
              key={`home-page-category-${item?._id}`}
            >
              <a className='text-decoration-none' href={`/product?category=${item?._id}`}>
                <div className='cat-item img-zoom d-flex align-items-center mb-4 hover:bg-mainColor hover:!text-white'>
                  <div
                    className='overflow-hidden flex flex-col justify-center hover:bg-mainColor'
                    style={{ width: 100, height: 100 }}
                  >
                    <img
                      className='img-fluid w-full max-h-full w-[100%] h-[100%]'
                      src={item?.image}
                      alt=''
                    />
                  </div>
                  <div className='flex-fill pl-3 hover:text-white'>
                    <h6 className="hover:!text-white">{item?.name}</h6>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
