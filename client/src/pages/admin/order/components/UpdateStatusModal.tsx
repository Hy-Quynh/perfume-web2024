import { Form, Select, message } from 'antd';
import CustomModal from '../../../../components/customModal/CustomModal';
import { ORDER_STATUS } from '../../../../enums/order';
import { checkoutAPI } from '../../../../services/checkout';

type ControlBrandProps = {
  isOpen: boolean;
  handleCancel: () => void;
  reloadData: () => void;
  status: string;
  checkoutId: string;
};

const STATUS_LIST = [
  {
    key: 'PAID',
    label: ORDER_STATUS['PAID'],
  },
  {
    key: 'ORDERED',
    label: ORDER_STATUS['ORDERED'],
  },
  {
    key: 'DELIVERY',
    label: ORDER_STATUS['DELIVERY'],
  },
  {
    key: 'SHIPPED',
    label: ORDER_STATUS['SHIPPED'],
  },
  {
    key: 'CANCEL',
    label: ORDER_STATUS['CANCEL'],
  },
];

const UpdateStatusModal: React.FC<ControlBrandProps> = ({
  isOpen,
  handleCancel,
  reloadData,
  status,
  checkoutId,
}) => {
  const [form] = Form.useForm();

  const submitForm = async () => {
    try {
      const formData = form.getFieldsValue();
      const updateRes = await checkoutAPI.changeOrderStatus(
        checkoutId,
        formData.status
      );

      if (updateRes?.data?.success) {
        reloadData?.();
        handleCancel?.()
        message.success('Cập nhật trạng thái thành công');
      } else {
        throw new Error();
      }
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      handCanel={() => handleCancel()}
      title={'Cập nhật trạng thái'}
      handleSubmit={() => submitForm()}
    >
      <Form
        layout={'vertical'}
        form={form}
        initialValues={{
          status: status,
        }}
      >
        <Form.Item
          label='Trạng thái'
          name='status'
          rules={[{ required: true, message: 'Vui lòng lựa chọn trạng thái' }]}
        >
          <Select>
            {STATUS_LIST?.map((item: any) => {
              return (
                <Select.Option value={item?.key} key={item?.key}>
                  {item?.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </CustomModal>
  );
};

export default UpdateStatusModal;
