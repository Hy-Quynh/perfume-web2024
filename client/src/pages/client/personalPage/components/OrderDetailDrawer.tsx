import React, { useEffect, useState } from 'react';
import { checkoutAPI } from '../../../../services/checkout';
import { FORMAT_NUMBER } from '../../../../constants';
import { Drawer, Table } from 'antd';
import { TABLE_ITEM_PER_PAGE } from '../../../../constants/table';

type OrderDetailDrawerType = {
  checkoutId: string;
  open: boolean;
  handleClose: () => void;
};

function OrderDetailDrawer({
  checkoutId,
  open,
  handleClose,
}: OrderDetailDrawerType) {
  const [orderDetail, setOrderDetail] = useState([]);

  const columns: any = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, record: any, index: number) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Giá mua hàng',
      dataIndex: 'orderPrice',
      key: 'orderPrice',
      render: (_: any, record: any) => {
        return <div>{FORMAT_NUMBER.format(record?.orderPrice)}</div>;
      },
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (_: any, record: any) => {
        return (
          <div>
            {FORMAT_NUMBER.format(record?.orderPrice * record.quantity)}
          </div>
        );
      },
    },
  ];

  const getOrderDetail = async () => {
    try {
      const orderDetail = await checkoutAPI.getOrderDetail(checkoutId);

      if (orderDetail?.data?.success) {
        setOrderDetail(orderDetail?.data?.payload?.productInfo || []);
      }
    } catch (error) {
      console.log('getOrderDetail error >>> ', error);
    }
  };

  useEffect(() => {
    getOrderDetail();
  }, []);

  return (
    <Drawer
      title='Danh sách sản phẩm'
      onClose={() => handleClose?.()}
      open={open}
      width={'80vw'}
    >
      <Table
        columns={columns}
        dataSource={orderDetail}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />
    </Drawer>
  );
}

export default OrderDetailDrawer;
