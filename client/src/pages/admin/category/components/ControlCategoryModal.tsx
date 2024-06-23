import { Form, Input, message } from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import { categoryAPI } from '../../../../services/category';
import { CategoryType } from '../Category';
import { useEffect, useState } from 'react';
import { customUpload } from '../../../../utils/upload-file';
import { ModalControlType } from '../../../../types/modal';

type ControlCategoryProps = {
  isOpen: boolean;
  handleCancel: () => void;
  reloadData: () => void;
  title: string;
  type: ModalControlType;
  initData?: CategoryType;
};

const ControlCategoryModal: React.FC<ControlCategoryProps> = (props) => {
  const [categoryImage, setCategoryImage] = useState<any>('');
  const [fileUpload, setFileUpload] = useState<any>(null);
  const [form] = Form.useForm();

  const submitForm = async () => {
    try {
      await form.validateFields();
      if (props.type === 'CREATE') {
        await handleAddCategory();
      }

      if (props.type === 'UPDATE') {
        await hanldleUpdateCategoryInfo();
      }
    } catch (error) {
      console.log('submit form error >> ', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const formData = form.getFieldsValue();
      const uploadRes = await customUpload(fileUpload);
      if (!uploadRes) {
        return message.error('Upload file thất bại');
      }

      const categoryData = {
        name: formData?.name,
        image: uploadRes,
      };

      const res = await categoryAPI.addNewCategory(categoryData);
      if (res?.data?.success) {
        message.success('Thêm thông tin danh mục thành công');
        props?.reloadData();
      } else {
        message.error(
          res?.data?.error?.message || 'Thêm thông tin danh mục thất bại'
        );
      }
    } catch (error: any) {
      message.error('Xử lí thông tin thất bại');
    }
  };

  const hanldleUpdateCategoryInfo = async () => {
    try {
      if (props?.initData?._id) {
        const formData = form.getFieldsValue();
        const categoryData = {
          name: formData?.name,
          image: categoryImage || '',
        };

        if (fileUpload) {
          const uploadRes = await customUpload(fileUpload);
          if (!uploadRes) {
            return message.error('Upload file thất bại');
          }

          categoryData.image = uploadRes;
        }

        const res = await categoryAPI.updateCategory(props?.initData?._id, categoryData);

        if (res?.data?.success) {
          message.success('Cập nhật thông tin danh mục thành công');
          props?.reloadData();
        } else {
          message.error(
            res?.data?.error?.message ||
              'Cập nhật thông tin danh mục thất bại'
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

      setCategoryImage(props?.initData?.image);
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
          label='Tên danh mục'
          rules={[{ required: true, message: 'Vui lòng nhập thông tin tên' }]}
          name='name'
        >
          <Input placeholder='Nhập vào tên danh mục' />
        </Form.Item>

        <Form.Item
          label='Hình ảnh'
          rules={[
            {
              validator: (_, value) => {
                if (!value && !categoryImage) {
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
                setCategoryImage(reader.result);
              });
              if (event?.target?.files?.[0]) {
                reader.readAsDataURL(event.target.files[0]);
              }

              setFileUpload(event?.target?.files?.[0]);
            }}
          />
        </Form.Item>

        {categoryImage ? (
          <div className='mt-[20px]'>
            <img
              src={categoryImage}
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

export default ControlCategoryModal;
