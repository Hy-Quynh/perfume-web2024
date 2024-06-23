import { Button, DatePicker, message } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { checkoutAPI } from '../../../services/checkout';
import { FORMAT_NUMBER } from '../../../constants';
import { ORDER_STATUS } from '../../../enums/order';

const { RangePicker } = DatePicker;

function AdminDashboard() {
  const [timeRange, setTimeRage] = useState<any>([
    dayjs(dayjs().subtract(1, 'week').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
    dayjs(dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD'),
  ]);
  const [statisticData, setStatisticData] = useState<any>({});

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
    </div>
  );
}

export default AdminDashboard;
