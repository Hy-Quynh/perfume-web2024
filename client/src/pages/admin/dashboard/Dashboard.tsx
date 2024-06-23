import { Button, DatePicker, TableProps, message, Table } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { checkoutAPI } from '../../../services/checkout';
import { FORMAT_NUMBER } from '../../../constants';
import { ORDER_STATUS } from '../../../enums/order';
import { OrderStatusType } from '../../../types/checkout';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';
import { displayDate } from '../../../utils/datetime';

const { RangePicker } = DatePicker;
interface ProductType {
  totalQuantity: number;
  totalRevenue: number;
  productId: string;
  productName: string;
  statuses: {
    status: OrderStatusType;
    totalQuantity: number;
  }[];
}

function AdminDashboard() {
  const [timeRange, setTimeRage] = useState<any>([
    dayjs(dayjs().subtract(1, 'week').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
    dayjs(dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD'),
  ]);
  const [statisticData, setStatisticData] = useState<any>({});

  const countStatusQuantity = (statusList: any, status: string) => {
    return statusList
      ?.filter((item: any) => item?.status === status)
      ?.reduce((pre: any, curr: any) => pre + curr?.totalQuantity, 0);
  };

  const columns: TableProps<ProductType>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      fixed: 'left',
    },
    {
      title: 'Ngày order',
      dataIndex: 'checkoutDate',
      key: 'checkoutDate',
      render: (_, record: any) => (
        <div>{displayDate(record?.checkoutDate)}</div>
      ),
      fixed: 'left',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (_, record: any) => (
        <div>{FORMAT_NUMBER.format(record?.totalRevenue)}đ</div>
      ),
      align: 'right',
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
      render: (_, record: any) => (
        <div>{FORMAT_NUMBER.format(record?.totalQuantity)}</div>
      ),
      align: 'right',
    },
    {
      title: ORDER_STATUS['PAID'],
      dataIndex: 'totalPaid',
      key: 'totalPaid',
      render: (_, record: any) => (
        <div>
          {FORMAT_NUMBER.format(countStatusQuantity(record?.statuses, 'PAID'))}
        </div>
      ),
      align: 'right',
    },
    {
      title: ORDER_STATUS['DELIVERY'],
      dataIndex: 'totalDelivery',
      key: 'totalDelivery',
      render: (_, record: any) => (
        <div>
          {FORMAT_NUMBER.format(
            countStatusQuantity(record?.statuses, 'DELIVERY')
          )}
        </div>
      ),
      align: 'right',
    },
    {
      title: ORDER_STATUS['ORDERED'],
      dataIndex: 'totalOrdered',
      key: 'totalOrdered',
      render: (_, record: any) => (
        <div>
          {FORMAT_NUMBER.format(
            countStatusQuantity(record?.statuses, 'ORDERED')
          )}
        </div>
      ),
      align: 'right',
    },
    {
      title: ORDER_STATUS['SHIPPED'],
      dataIndex: 'totalShipped',
      key: 'totalShipped',
      render: (_, record: any) => (
        <div>
          {FORMAT_NUMBER.format(
            countStatusQuantity(record?.statuses, 'SHIPPED')
          )}
        </div>
      ),
      align: 'right',
    },
    {
      title: ORDER_STATUS['CANCEL'],
      dataIndex: 'totalCancel',
      key: 'totalCancel',
      render: (_, record: any) => (
        <div>
          {FORMAT_NUMBER.format(
            countStatusQuantity(record?.statuses, 'CANCEL')
          )}
        </div>
      ),
      align: 'right',
    },
  ];

  const searchOrderByDate = async () => {
    try {
      const startDate = timeRange[0]
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
      const endDate = timeRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');

      const order = await checkoutAPI.statisticOrder(startDate, endDate);

      if (order?.data?.payload) {
        setStatisticData(order?.data?.payload);
      }
    } catch (error) {
      message.error('Lấy thông tin thất bại');
    }
  };

  useEffect(() => {
    searchOrderByDate();
  }, []);

  const countQuantity = (status: string) => {
    return statisticData?.orderCountsByStatus
      ?.filter((item: any) => item?.status === status)
      ?.reduce((pre: any, curr: any) => pre + curr?.count, 0);
  };

  return (
    <div>
      <div className='border-b-[2px] border-b-solid border-b-[#FFD334] w-fit pr-[10px] text-2xl font-bold'>
        Thống kê
      </div>

      <div className='mt-[20px] flex'>
        <RangePicker
          value={timeRange}
          onChange={(dateRage) => setTimeRage(dateRage)}
        />
        <Button
          className='bg-mainColor text-white'
          onClick={() => searchOrderByDate()}
        >
          Tìm kiếm
        </Button>
      </div>

      <div className='flex justify-center mt-[30px]'>
        <div className='bg-[#1677FF] py-[30px] px-[50px] rounded-[16px] w-[50%]'>
          <p className='text-xl font-bold text-center text-white'>Doanh thu</p>
          <p className='text-[red] text-lg font-bold text-center'>
            {FORMAT_NUMBER.format(statisticData?.totalRevenue || 0)} VNĐ
          </p>
        </div>
      </div>

      <div className='flex items-center flex-start mt-[50px] flex-wrap gap-[30px]'>
        <div className='bg-mainColor py-[30px] px-[50px] rounded-[16px] w-[30%]'>
          <p className='text-xl font-bold text-center text-white'>
            Tổng đơn hàng
          </p>
          <p className='text-white text-lg font-bold text-center'>
            {statisticData?.totalOrders || 0}
          </p>
        </div>

        <div className='bg-[#37B7C3] py-[30px] px-[50px] rounded-[16px] w-[30%]'>
          <p className='text-xl font-bold text-center'>
            {ORDER_STATUS['PAID']}
          </p>
          <p className='text-[red] text-lg font-bold text-center'>
            {countQuantity('PAID')}
          </p>
        </div>

        <div className='bg-[#FFD334] py-[30px] px-[50px] rounded-[16px] w-[30%]'>
          <p className='text-xl font-bold text-center'>
            {ORDER_STATUS['DELIVERY']}
          </p>
          <p className='text-[red] text-lg font-bold text-center'>
            {countQuantity('DELIVERY')}
          </p>
        </div>

        <div className='bg-[#FEAE6F] py-[30px] px-[50px] rounded-[16px] w-[30%]'>
          <p className='text-xl font-bold text-center'>
            {ORDER_STATUS['ORDERED']}
          </p>
          <p className='text-[red] text-lg font-bold text-center'>
            {countQuantity('ORDERED')}
          </p>
        </div>

        <div className='bg-[#059212] py-[30px] px-[50px] rounded-[16px] w-[30%]'>
          <p className='text-xl font-bold text-center text-white'>
            {ORDER_STATUS['SHIPPED']}
          </p>
          <p className='text-lg font-bold text-center text-white'>
            {countQuantity('SHIPPED')}
          </p>
        </div>

        <div className='bg-[red] py-[30px] px-[50px] rounded-[16px] w-[30%]'>
          <p className='text-xl font-bold text-center text-white'>
            {ORDER_STATUS['CANCEL']}
          </p>
          <p className='text-lg font-bold text-center text-white'>
            {countQuantity('CANCEL')}
          </p>
        </div>
      </div>
      <div className='mt-[50px]'>
        <div className='border-b-[2px] border-b-solid border-b-[#FFD334] w-fit pr-[10px] text-2xl font-bold mb-[20px]'>
          Chi tiết thông tin sản phẩm
        </div>

        <Table
          scroll={{ x: 1500, y: 300 }}
          columns={columns}
          dataSource={statisticData?.products || []}
          rowKey='productId'
          key='productId'
          pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
        />
      </div>
    </div>
  );
}

export default AdminDashboard;
