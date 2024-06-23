import { Form, Input } from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import { UserData } from '../ListUser';
import { ModalControlType } from '../../../../types/modal';

type ControlAdminUserProps = {
  isOpen: boolean;
  handleCancel: () => void;
  reloadData: ()=>void;
  title: string;
  type: ModalControlType;
  initData?: UserData;
};

const ControlAdminUser: React.FC<ControlAdminUserProps> = (props) => {
  const [form] = Form.useForm();



  return (
    <CustomModal
      isOpen={props?.isOpen}
      handCanel={() => props?.handleCancel()}
      title={props.title}
      hiddenOkBtn={true}
    >
      <Form
        layout={'vertical'}
        form={form}
        initialValues={{
          name: props?.initData?.name,
          email: props?.initData?.email,
          phone: props?.initData?.phone,
          address: props?.initData?.address
        }}
      >
        <Form.Item
          label='Tên'
          name='name'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Email'
          name='email'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Số điện thoại'
          name='phone'
        >
          <Input />
        </Form.Item>
        <Form.Item
          label='Địa chỉ'
          name='address'
        >
          <Input />
        </Form.Item>
      </Form>
    </CustomModal>
  );
};

export default ControlAdminUser;
