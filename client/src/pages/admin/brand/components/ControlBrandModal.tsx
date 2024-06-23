import { Form, Input, message } from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import { brandAPI } from '../../../../services/brand';
import { BrandType } from '../Brand';
import { useEffect, useState } from 'react';
import { customUpload } from '../../../../utils/upload-file';
import { ModalControlType } from '../../../../types/modal';

type ControlBrandProps = {
  isOpen: boolean;
  handleCancel: () => void;
  reloadData: () => void;
  title: string;
  type: ModalControlType;
  initData?: BrandType;
};

const ControlBrandModal: React.FC<ControlBrandProps> = (props) => {
  const [brandImage, setBrandImage] = useState<any>('');
  const [fileUpload, setFileUpload] = useState<any>(null);
  const [form] = Form.useForm();

  const submitForm = async () => {
    try {
      await form.validateFields();
      if (props.type === 'CREATE') {
        await handleAddBrand();
      }

      if (props.type === 'UPDATE') {
        await hanldleUpdateBrandInfo();
      }
    } catch (error) {
      console.log('submit form error >> ', error);
    }
  };

  const handleAddBrand = async () => {
    try {
      const formData = form.getFieldsValue();
      const uploadRes = await customUpload(fileUpload);
      if (!uploadRes) {
        return message.error('Upload file thất bại');
      }

      const brandData = {
        name: formData?.name,
        image: uploadRes,
      };

      const res = await brandAPI.addNewBrand(brandData);
      if (res?.data?.success) {
        message.success('Thêm thông tin thương hiệu thành công');
        props?.reloadData();
      } else {
        message.error(
          res?.data?.error?.message || 'Thêm thông tin thương hiệu thất bại'
        );
      }
    } catch (error: any) {
      message.error('Xử lí thông tin thất bại');
    }
  };

  const hanldleUpdateBrandInfo = async () => {
    try {
      if (props?.initData?._id) {
        const formData = form.getFieldsValue();
        const brandData = {
          name: formData?.name,
          image: brandImage || '',
        };

        if (fileUpload) {
          const uploadRes = await customUpload(fileUpload);
          if (!uploadRes) {
            return message.error('Upload file thất bại');
          }

          brandData.image = uploadRes;
        }

        const res = await brandAPI.updateBrand(props?.initData?._id, brandData);

        if (res?.data?.success) {
          message.success('Cập nhật thông tin thương hiệu thành công');
          props?.reloadData();
        } else {
          message.error(
            res?.data?.error?.message ||
              'Cập nhật thông tin thương hiệu thất bại'
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
      console.log('props?.initData?.image >> ', props?.initData?.image);

      setBrandImage(props?.initData?.image);
    }
  }, [props.type]);

  return (
    <CustomModal
      isOpen={props?.isOpen}
      handCanel={() => props?.handleCancel()}
      title={props.title}
      handleSubmit={() => submitForm()}
    >
      <Form
        layout={'vertical'}
        form={form}
        initialValues={{
          name: props?.initData?.name,
        }}
      >
        <Form.Item
          label='Tên thương hiệu'
          rules={[{ required: true, message: 'Vui lòng nhập thông tin tên' }]}
          name='name'
        >
          <Input placeholder='Nhập vào tên thương hiệu' />
        </Form.Item>

        <Form.Item
          label='Hình ảnh'
          rules={[
            {
              validator: (_, value) => {
                if (!value && !brandImage) {
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
                setBrandImage(reader.result);
              });
              if (event?.target?.files?.[0]) {
                reader.readAsDataURL(event.target.files[0]);
              }

              setFileUpload(event?.target?.files?.[0]);
            }}
          />
        </Form.Item>

        {brandImage ? (
          <div className='mt-[20px]'>
            <img
              src={brandImage}
              alt='product'
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

export default ControlBrandModal;
