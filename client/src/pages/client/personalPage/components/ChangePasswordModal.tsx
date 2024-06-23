import CustomModal from '../../../../components/customModal/CustomModal';
import { Form, Input, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { userAPI } from '../../../../services/user';
import { parseJSON } from '../../../../utils/handleData';
import { USER_INFO_KEY } from '../../../../constants';

type ControlBrandProps = {
  isOpen: boolean;
  handleCancel: () => void;
  title: string;
};

function ChangePasswordModal(props: ControlBrandProps) {
  const [form] = Form.useForm();
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY));

  const submitForm = async () => {
    if (!userData?._id) {
      return;
    }

    try {
      await form.validateFields();
      const formValue = form.getFieldsValue();
      const submitBody = {
        currentPassword: formValue?.currentPassword,
        newPassword: formValue?.newPassword,
      };
      const res = await userAPI.updateUserPassword(userData?._id, submitBody);
      if (res?.data?.success) {
        message.success('Cập nhật mật khẩu thành công');
      } else {
        message.error(
          res?.data?.error?.message || 'Cập nhật mật khẩu thất bại'
        );
      }
    } catch (error) {
      console.log('submit form error >> ', error);
    }
  };

  return (
    <CustomModal
      isOpen={props?.isOpen}
      handCanel={() => props?.handleCancel()}
      title={props.title}
      handleSubmit={() => submitForm()}
    >
      <Form layout={'vertical'} form={form}>
        <Form.Item
          name='currentPassword'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu hiện tại',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type='password'
            placeholder='Nhập vào mật khẩu hiện tại'
          />
        </Form.Item>
        <Form.Item
          name='newPassword'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu mới',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type='password'
            placeholder='Nhập vào mật khẩu mới'
          />
        </Form.Item>
        <Form.Item
          name='confirmPassword'
          rules={[
            {
              validator: (_, value) => {
                const password = form.getFieldValue('newPassword');
                if (password !== value) {
                  return Promise.reject('Mật khẩu nhập lại không chính xác');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type='password'
            placeholder='Nhập lại mật khẩu'
          />
        </Form.Item>
      </Form>
    </CustomModal>
  );
}

export default ChangePasswordModal;
