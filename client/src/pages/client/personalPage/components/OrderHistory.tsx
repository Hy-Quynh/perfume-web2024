import React, { useEffect, useState } from 'react';
import { parseJSON } from '../../../../utils/handleData';
import { FORMAT_NUMBER, USER_INFO_KEY } from '../../../../constants';
import { checkoutAPI } from '../../../../services/checkout';
import { displayDate } from '../../../../utils/datetime';
import { ORDER_STATUS, ORDER_STATUS_COLOR } from '../../../../enums/order';
import { Button, Space, Table, message } from 'antd';
import { TABLE_ITEM_PER_PAGE } from '../../../../constants/table';
import OrderDetailDrawer from './OrderDetailDrawer';
import { OrderStatusType } from '../../../../types/checkout';

function OrderHistory() {
  const [listOrder, setListOrder] = useState([]);
  const [openProductDrawer, setOpenProductDrawer] = useState(false);
  const [productDrawerId, setProductDrawerId] = useState('');
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY));

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
          </Space>
        );
      },
    },
  ];

  const getUserOrder = async () => {
    try {
      if (!userData?._id) {
        return;
      }
      const orders = await checkoutAPI.getUserOrder(userData._id);

      if (orders?.data?.order) {
        setListOrder(orders?.data?.order);
      }
    } catch (error) {
      console.log('getUserOrder error >> ', error);
    }
  };

  useEffect(() => {
    getUserOrder();
  }, []);

  return (
    <div>
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
    </div>
  );
}

export default OrderHistory;
