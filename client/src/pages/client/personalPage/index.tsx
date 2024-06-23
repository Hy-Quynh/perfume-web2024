import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseJSON } from '../../../utils/handleData';
import { USER_INFO_KEY } from '../../../constants';
import { Tabs, TabsProps } from 'antd';
import PersonalInfo from './components/PersonalInfo';
import OrderHistory from './components/OrderHistory';

const items: TabsProps['items'] = [
  {
    key: 'personal-info',
    label: 'Thông tin cá nhân',
    children: <PersonalInfo />,
  },
  {
    key: 'order-info',
    label: 'Lịch sử mua hàng',
    children: <OrderHistory />,
  },
];

function PersonalPage() {
  const [currentTab, setCurrentTab] = useState('personal-info');
  const navigate = useNavigate();
  const userData = parseJSON(localStorage.getItem(USER_INFO_KEY));

  useEffect(() => {
    if (!userData?._id) {
      navigate('/login');
    }
  }, []);

  return (
    <div className='lg:px-[100px] md:px-[50px] px-[10px] py-[50px]'>
      <h1 className='text-left text-3xl font-bold'>Trang cá nhân</h1>

      <Tabs
        activeKey={currentTab}
        items={items}
        onChange={(key) => setCurrentTab(key)}
        className='mt-[50px]'
      />
    </div>
  );
}

export default PersonalPage;
