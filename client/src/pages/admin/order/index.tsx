import React, { useEffect, useState } from 'react';
import { displayDate } from '../../../utils/datetime';
import { FORMAT_NUMBER } from '../../../constants';
import { OrderStatusType } from '../../../types/checkout';
import { ORDER_STATUS, ORDER_STATUS_COLOR } from '../../../enums/order';
import { Breadcrumb, Button, Popconfirm, Space, Table, message } from 'antd';
import { checkoutAPI } from '../../../services/checkout';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';
import OrderDetailDrawer from './components/OrderDetailDrawer';
import UpdateStatusModal from './components/UpdateStatusModal';

function AdminOrder() {
  const [listOrder, setListOrder] = useState([]);
  const [openProductDrawer, setOpenProductDrawer] = useState(false);
  const [productDrawerId, setProductDrawerId] = useState('');
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [statusModalData, setStatusModalData] = useState<any>({});

  const columns: any = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, record: any, index: number) => <div>{index + 1}</div>,
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_: any, record: any) => (
        <div>{displayDate(record?.createdAt)}</div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_: any, record: any) => {
        return <div>{FORMAT_NUMBER.format(record?.totalPrice)}đ</div>;
      },
    },
    {
      title: 'Tình trạng',
      dataIndex: 'deliveryStatus',
      key: 'deliveryStatus',
      render: (_: any, record: { deliveryStatus: OrderStatusType }) => (
        <div
          style={{ background: ORDER_STATUS_COLOR[record?.deliveryStatus] }}
          className='text-center w-fit px-[10px] py-[5px] text-[white] rounded-[8px]'
        >
          {ORDER_STATUS[record?.deliveryStatus]}
        </div>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <Space size='middle'>
            <Button
              type='primary'
              className='bg-primary'
              onClick={() => {
                setOpenProductDrawer(true);
                setProductDrawerId(record?._id);
              }}
            >
              Xem chi tiết
            </Button>
            <Button
              onClick={() => {
                setStatusModalData({
                  _id: record?._id,
                  deliveryStatus: record?.deliveryStatus,
                });
                setOpenStatusModal(true);
              }}
              className='bg-[#87d068] text-[white]'
              disabled={record?.deliveryStatus === 'CANCEL' || record?.deliveryStatus === 'SHIPPED'}
            >
              Cập nhật trạng thái
            </Button>
          </Space>
        );
      },
    },
  ];

  const getAllOrder = async () => {
    try {
      const orders = await checkoutAPI.getAllOrder();
      if (orders?.data?.order) {
        setListOrder(orders?.data?.order);
      }
    } catch (error) {
      console.log('getUserOrder error >> ', error);
    }
  };

  const cancelCheckout = async (
    checkoutId: string,
    status: OrderStatusType
  ) => {
    try {
      const res = await checkoutAPI.changeOrderStatus(checkoutId, status);
      if (res?.data?.success) {
        message.success('Huỷ đơn hàng thành công');
        getAllOrder();
      }
    } catch (error) {
      console.log('cancelCheckout error >>> ', error);
    }
  };

  useEffect(() => {
    getAllOrder();
  }, []);

  return (
    <div>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Quản lí',
            },
            {
              title: 'Đơn hàng',
            },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={listOrder}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openProductDrawer ? (
        <OrderDetailDrawer
          open={openProductDrawer}
          checkoutId={productDrawerId}
          handleClose={() => {
            setOpenProductDrawer(false);
            setProductDrawerId('');
          }}
        />
      ) : (
        <></>
      )}

      {openStatusModal ? (
        <UpdateStatusModal
          isOpen={openStatusModal}
          handleCancel={() => {
            setOpenStatusModal(false);
            setStatusModalData({});
          }}
          reloadData={() => getAllOrder()}
          checkoutId={statusModalData._id}
          status={statusModalData?.deliveryStatus}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

export default AdminOrder;
