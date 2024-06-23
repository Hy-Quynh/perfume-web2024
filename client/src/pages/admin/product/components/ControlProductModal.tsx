import { Form, Input, Select, message } from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import { ModalControlType } from '../../../../types/modal';
import { productAPI } from '../../../../services/product';
import { ProductType } from '../Product';
import { useEffect, useState } from 'react';
import { customUpload } from '../../../../utils/upload-file';
import CustomQuillEditor from '../../../../components/customQuillEditor';
import { brandAPI } from '../../../../services/brand';
import { categoryAPI } from '../../../../services/category';

type ControlProductProps = {
  isOpen: boolean;
  handleCancel: () => void;
  reloadData: () => void;
  title: string;
  type: ModalControlType;
  initData?: ProductType;
};

const ControlProductModal: React.FC<ControlProductProps> = (props) => {
  const [listBrand, setListBrand] = useState<any>([]);
  const [listCategory, setListCategory] = useState<any>([]);
  const [productImage, setProductImage] = useState<any>('');
  const [fileUpload, setFileUpload] = useState<any>(null);
  const [form] = Form.useForm();

  const getBrandList = async () => {
    try {
      const res = await brandAPI.getAllBrand(true);

      if (res?.data?.success) {
        setListBrand(res?.data?.payload?.brand);
      }
    } catch (error) {
      console.log('get brand list error >>> ', error);
    }
  };

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
    getBrandList();
    getCategoryList();
  }, []);

  const submitForm = async () => {
    try {
      await form.validateFields();
      if (props.type === 'CREATE') {
        await handleAddProduct();
      }

      if (props.type === 'UPDATE') {
        await hanldleUpdateProductInfo();
      }
    } catch (error) {
      console.log('submit form error >> ', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const formData = form.getFieldsValue();
      const uploadRes = await customUpload(fileUpload);
      if (!uploadRes) {
        return message.error('Upload file thất bại');
      }

      const productData = {
        name: formData?.name,
        image: uploadRes,
        brandId: formData?.brandId,
        categoryId: formData?.categoryId,
        description: formData?.description,
        price: formData?.price,
        salePrice: formData?.salePrice || 0,
        initQuantity: formData?.initQuantity,
      };

      const res = await productAPI.addNewProduct(productData);
      if (res?.data?.success) {
        message.success('Thêm thông tin sản phẩm thành công');
        props?.reloadData();
      } else {
        message.error(
          res?.data?.error?.message || 'Thêm thông tin sản phẩm thất bại'
        );
      }
    } catch (error: any) {
      message.error('Xử lí thông tin thất bại');
    }
  };

  const hanldleUpdateProductInfo = async () => {
    try {
      if (props?.initData?._id) {
        const formData = form.getFieldsValue();
        const productData = {
          name: formData?.name,
          image: productImage || '',
          brandId: formData?.brandId,
          categoryId: formData?.categoryId,
          description: formData?.description,
          price: formData?.price,
          salePrice: formData?.salePrice || 0,
          initQuantity: formData?.initQuantity,
        };

        if (fileUpload) {
          const uploadRes = await customUpload(fileUpload);
          if (!uploadRes) {
            return message.error('Upload file thất bại');
          }

          productData.image = uploadRes;
        }

        const res = await productAPI.updateProduct(
          props?.initData?._id,
          productData
        );

        if (res?.data?.success) {
          message.success('Cập nhật thông tin sản phẩm thành công');
          props?.reloadData();
        } else {
          message.error(
            res?.data?.error?.message || 'Cập nhật thông tin sản phẩm thất bại'
          );
        }
      }
    } catch (error: any) {
      message.error('Xử lí thông tin thất bại');
    }
  };

  useEffect(() => {
    if (
      (props.type === 'UPDATE' || props.type === 'VIEW') &&
      props?.initData?.image
    ) {
      setProductImage(props.initData.image);
    }
  }, [props.type]);

  return (
    <CustomModal
      isOpen={props?.isOpen}
      handCanel={() => props?.handleCancel()}
      title={props.title}
      handleSubmit={() => submitForm()}
      width='90vw'
      className='admin-product-modal'
    >
      <Form
        layout={'vertical'}
        form={form}
        initialValues={{
          name: props?.initData?.name,
          brandId: props?.initData?.brandId,
          categoryId: props?.initData?.categoryId,
          price: props?.initData?.price,
          salePrice: props?.initData?.salePrice,
          initQuantity: props?.initData?.initQuantity,
        }}
      >
        <Form.Item
          label='Tên sản phẩm'
          rules={[{ required: true, message: 'Vui lòng nhập thông tin tên' }]}
          name='name'
        >
          <Input placeholder='Nhập vào tên sản phẩm' />
        </Form.Item>

        <Form.Item
          label='Danh mục'
          name='categoryId'
          rules={[{ required: true, message: 'Vui lòng lựa chọn danh mục' }]}
        >
          <Select>
            {listCategory?.map((item: any) => {
              return (
                <Select.Option value={item?._id} key={item?._id}>
                  {item?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label='Thương hiệu'
          name='brandId'
          rules={[{ required: true, message: 'Vui lòng lựa chọn thương hiệu' }]}
        >
          <Select>
            {listBrand?.map((item: any) => {
              return (
                <Select.Option value={item?._id} key={item?._id}>
                  {item?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label='Giá gốc'
          rules={[
            { required: true, message: 'Vui lòng nhập giá gốc' },
            {
              validator: async (_, price) => {
                if (price <= 0) {
                  return Promise.reject('Giá cần lớn hơn 0');
                }
                return Promise.resolve();
              },
            },
          ]}
          name='price'
        >
          <Input type='number' placeholder='Nhập vào giá gốc sản phẩm' />
        </Form.Item>

        <Form.Item
          label='Giá khuyến mãi'
          rules={[
            {
              validator: async (_, salePrice) => {
                if (salePrice && salePrice <= 0) {
                  return Promise.reject('Giá cần lớn hơn 0');
                }
                return Promise.resolve();
              },
            },
          ]}
          name='salePrice'
        >
          <Input type='number' placeholder='Nhập vào giá khuyến mãi sản phẩm' />
        </Form.Item>

        <Form.Item
          label='Số lượng'
          rules={[
            { required: true, message: 'Vui lòng nhập vào số lượng' },
            {
              validator: async (_, initQuantity) => {
                if (initQuantity <= 0) {
                  return Promise.reject('Số lượng cần lớn hơn 0');
                }
                return Promise.resolve();
              },
            },
          ]}
          name='initQuantity'
        >
          <Input type='number' placeholder='Nhập vào số lượng sản phẩm' />
        </Form.Item>

        <Form.Item
          label='Mô tả sản phẩm'
          name={'description'}
          className='product-form-description-item'
        >
          <CustomQuillEditor
            initValue={props?.initData?.description || ''}
            handleChange={(value) => {
              form.setFieldValue('description', value);
            }}
          />
        </Form.Item>

        <Form.Item
          label='Hình ảnh'
          rules={[
            {
              validator: (_, value) => {
                if (!value && !productImage) {
                  return Promise.reject('Vui lòng chọn hình ảnh');
                }
                return Promise.resolve();
              },
            },
          ]}
          name='image'
        >
          <Input
            type='file'
            placeholder='Chọn hình ảnh'
            onChange={(event) => {
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                setProductImage(reader.result);
              });
              if (event?.target?.files?.[0]) {
                reader.readAsDataURL(event.target.files[0]);
              }

              setFileUpload(event?.target?.files?.[0]);
            }}
          />
        </Form.Item>

        {productImage ? (
          <div className='mt-[20px]'>
            <img
              src={productImage}
              alt='product img'
              style={{ border: '0.5px solid gray' }}
              className='w-[200px] h-auto'
            />
          </div>
        ) : (
          ''
        )}
      </Form>
    </CustomModal>
  );
};

export default ControlProductModal;
